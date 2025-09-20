const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const PaymentService = require('../services/paymentService');
const UPIService = require('../services/upiService');
const { initializeStripe, paymentConfig } = require('../config/payment');
const {
  validatePaymentIntent,
  validatePaymentConfirmation,
  validateSavePaymentMethod,
  handleValidationErrors,
  paymentRateLimit,
  validateWebhookSignature,
  sanitizePaymentData
} = require('../middleware/paymentValidation');
const paymentSecurity = require('../utils/paymentSecurity');

// Initialize Stripe
const stripe = initializeStripe();

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
router.post('/create-payment-intent',
  protect,
  paymentRateLimit(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
  sanitizePaymentData,
  validatePaymentIntent,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
  const { amount, currency = 'usd', orderId, paymentMethodTypes = ['card'] } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Valid amount is required'
    });
  }

  try {
    // Get user details for the payment intent
    const user = await User.findById(req.user.id);

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: paymentMethodTypes,
      metadata: {
        userId: req.user.id.toString(),
        orderId: orderId || '',
        userEmail: user.email
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
}));

// @desc    Handle Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  validateWebhookSignature,
  asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handlePaymentFailure(failedPayment);
      break;

    case 'payment_intent.canceled':
      const canceledPayment = event.data.object;
      await handlePaymentCancellation(canceledPayment);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}));

// @desc    Confirm payment and update order
// @route   POST /api/payments/confirm
// @access  Private
router.post('/confirm',
  protect,
  sanitizePaymentData,
  validatePaymentConfirmation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
  const { paymentIntentId, orderId } = req.body;

  if (!paymentIntentId || !orderId) {
    return res.status(400).json({
      success: false,
      message: 'Payment intent ID and order ID are required'
    });
  }

  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment has not been completed'
      });
    }

    // Update order with payment information
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    // Update order with payment details
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date(),
      email_address: paymentIntent.metadata.userEmail
    };
    order.isPaid = true;
    order.paidAt = new Date();
    order.orderStatus = 'processing';

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      order
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment',
      error: error.message
    });
  }
}));

// Helper function to handle successful payments
const handlePaymentSuccess = async (paymentIntent) => {
  try {
    const { userId, orderId } = paymentIntent.metadata;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date(),
          email_address: paymentIntent.metadata.userEmail
        };
        order.isPaid = true;
        order.paidAt = new Date();
        order.orderStatus = 'processing';
        await order.save();

        console.log(`Payment successful for order ${orderId}`);
      }
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
};

// Helper function to handle failed payments
const handlePaymentFailure = async (paymentIntent) => {
  try {
    const { orderId } = paymentIntent.metadata;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date(),
          error_message: paymentIntent.last_payment_error?.message || 'Payment failed'
        };
        order.orderStatus = 'payment_failed';
        await order.save();

        console.log(`Payment failed for order ${orderId}`);
      }
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
};

// Helper function to handle canceled payments
const handlePaymentCancellation = async (paymentIntent) => {
  try {
    const { orderId } = paymentIntent.metadata;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date()
        };
        order.orderStatus = 'cancelled';
        await order.save();

        console.log(`Payment canceled for order ${orderId}`);
      }
    }
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
};

// @desc    Get payment methods for user
// @route   GET /api/payments/methods
// @access  Private
router.get('/methods', protect, asyncHandler(async (req, res) => {
  try {
    // Get user's saved payment methods from Stripe
    const user = await User.findById(req.user.id);

    if (!user.stripeCustomerId) {
      return res.status(200).json({
        success: true,
        paymentMethods: []
      });
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    res.status(200).json({
      success: true,
      paymentMethods: paymentMethods.data
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods',
      error: error.message
    });
  }
}));

// @desc    Create or get Stripe customer
// @route   POST /api/payments/customer
// @access  Private
router.post('/customer', protect, asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString()
        }
      });

      customerId = customer.id;

      // Save customer ID to user
      user.stripeCustomerId = customerId;
      await user.save();
    }

    res.status(200).json({
      success: true,
      customerId
    });
  } catch (error) {
    console.error('Error creating/getting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error.message
    });
  }
}));

// @desc    Save payment method
// @route   POST /api/payments/save-method
// @access  Private
router.post('/save-method', protect, asyncHandler(async (req, res) => {
  const { paymentMethodId } = req.body;

  if (!paymentMethodId) {
    return res.status(400).json({
      success: false,
      message: 'Payment method ID is required'
    });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user.stripeCustomerId) {
      return res.status(400).json({
        success: false,
        message: 'Customer not found. Please create customer first.'
      });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: user.stripeCustomerId,
    });

    res.status(200).json({
      success: true,
      message: 'Payment method saved successfully'
    });
  } catch (error) {
    console.error('Error saving payment method:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save payment method',
      error: error.message
    });
  }
}));

// @desc    Delete payment method
// @route   DELETE /api/payments/methods/:id
// @access  Private
router.delete('/methods/:id', protect, asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    await stripe.paymentMethods.detach(id);

    res.status(200).json({
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment method',
      error: error.message
    });
  }
}));

// @desc    Get payment intent status
// @route   GET /api/payments/intent/:id
// @access  Private
router.get('/intent/:id', protect, asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(id);

    res.status(200).json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        created: paymentIntent.created,
        metadata: paymentIntent.metadata
      }
    });
  } catch (error) {
    console.error('Error fetching payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment intent',
      error: error.message
    });
  }
}));

// @desc    Create UPI payment intent
// @route   POST /api/payments/upi/create-intent
// @access  Private
router.post('/upi/create-intent',
  protect,
  sanitizePaymentData,
  asyncHandler(async (req, res) => {
    const { amount, orderId, description, customerUpiId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    try {
      const user = await User.findById(req.user.id);

      const result = await UPIService.createUpiPaymentIntent({
        amount,
        orderId,
        description: description || `Payment for Order ${orderId}`,
        customerUpiId,
        customerName: user.name,
        customerEmail: user.email
      });

      if (result.success) {
        res.status(200).json({
          success: true,
          paymentIntent: result.paymentIntent
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.error
        });
      }
    } catch (error) {
      console.error('UPI payment intent creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create UPI payment intent',
        error: error.message
      });
    }
  })
);

// @desc    Verify UPI payment
// @route   POST /api/payments/upi/verify
// @access  Private
router.post('/upi/verify',
  protect,
  sanitizePaymentData,
  asyncHandler(async (req, res) => {
    const { transactionId, upiTransactionId } = req.body;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID is required'
      });
    }

    try {
      const result = await UPIService.verifyUpiPayment(transactionId, upiTransactionId);

      if (result.success) {
        res.status(200).json({
          success: true,
          verification: result
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.error
        });
      }
    } catch (error) {
      console.error('UPI payment verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify UPI payment',
        error: error.message
      });
    }
  })
);

// @desc    Get UPI payment status
// @route   GET /api/payments/upi/status/:transactionId
// @access  Private
router.get('/upi/status/:transactionId',
  protect,
  asyncHandler(async (req, res) => {
    const { transactionId } = req.params;

    try {
      const result = await UPIService.getPaymentStatus(transactionId);

      if (result.success) {
        res.status(200).json({
          success: true,
          status: result
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.error
        });
      }
    } catch (error) {
      console.error('UPI payment status check error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get UPI payment status',
        error: error.message
      });
    }
  })
);

// @desc    Get supported UPI apps
// @route   GET /api/payments/upi/apps
// @access  Public
router.get('/upi/apps', (req, res) => {
  try {
    const apps = UPIService.getSupportedUpiApps();
    res.status(200).json({
      success: true,
      apps
    });
  } catch (error) {
    console.error('Error fetching UPI apps:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch UPI apps',
      error: error.message
    });
  }
});

// @desc    Generate UPI deep link
// @route   POST /api/payments/upi/deep-link
// @access  Private
router.post('/upi/deep-link',
  protect,
  sanitizePaymentData,
  asyncHandler(async (req, res) => {
    const { appName, amount, orderId, description } = req.body;

    if (!appName || !amount) {
      return res.status(400).json({
        success: false,
        message: 'App name and amount are required'
      });
    }

    try {
      const deepLink = UPIService.generateAppDeepLink(appName, amount, orderId, description);

      res.status(200).json({
        success: true,
        deepLink,
        appName
      });
    } catch (error) {
      console.error('UPI deep link generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate UPI deep link',
        error: error.message
      });
    }
  })
);

module.exports = router;
