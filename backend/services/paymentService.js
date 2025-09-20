const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const User = require('../models/User');

class PaymentService {
  /**
   * Create a payment intent with Stripe
   */
  static async createPaymentIntent(amount, currency, userId, orderId, options = {}) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const paymentIntentData = {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency || 'usd',
        payment_method_types: options.paymentMethodTypes || ['card'],
        metadata: {
          userId: userId.toString(),
          orderId: orderId || '',
          userEmail: user.email
        },
        automatic_payment_methods: {
          enabled: true,
        },
        ...options.stripeOptions
      };

      // If user has a Stripe customer ID, use it
      if (user.stripeCustomerId) {
        paymentIntentData.customer = user.stripeCustomerId;
      }

      const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Payment intent creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create or retrieve Stripe customer
   */
  static async createOrGetCustomer(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.stripeCustomerId) {
        // Verify customer exists in Stripe
        try {
          const customer = await stripe.customers.retrieve(user.stripeCustomerId);
          return { success: true, customerId: customer.id };
        } catch (error) {
          // Customer doesn't exist in Stripe, create new one
          console.log('Stripe customer not found, creating new one');
        }
      }

      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id.toString()
        }
      });

      // Save customer ID to user
      user.stripeCustomerId = customer.id;
      await user.save();

      return { success: true, customerId: customer.id };
    } catch (error) {
      console.error('Error creating/getting customer:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get payment methods for a user
   */
  static async getPaymentMethods(userId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.stripeCustomerId) {
        return { success: true, paymentMethods: [] };
      }

      const paymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card',
      });

      return { success: true, paymentMethods: paymentMethods.data };
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Save payment method to customer
   */
  static async savePaymentMethod(userId, paymentMethodId) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.stripeCustomerId) {
        throw new Error('Customer not found');
      }

      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId,
      });

      return { success: true };
    } catch (error) {
      console.error('Error saving payment method:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete payment method
   */
  static async deletePaymentMethod(paymentMethodId) {
    try {
      await stripe.paymentMethods.detach(paymentMethodId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting payment method:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Retrieve payment intent
   */
  static async getPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return {
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          created: paymentIntent.created,
          metadata: paymentIntent.metadata
        }
      };
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process successful payment
   */
  static async processSuccessfulPayment(paymentIntent) {
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
          return { success: true, order };
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error processing successful payment:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process failed payment
   */
  static async processFailedPayment(paymentIntent) {
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
          return { success: true, order };
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error processing failed payment:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process canceled payment
   */
  static async processCanceledPayment(paymentIntent) {
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
          return { success: true, order };
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error processing canceled payment:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate order totals including tax and shipping
   */
  static calculateOrderTotals(items, shippingAddress, couponCode = null) {
    const itemsPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate tax (example: 8.5% tax rate)
    const taxRate = 0.085;
    const taxPrice = itemsPrice * taxRate;
    
    // Calculate shipping (example: free shipping over $50, otherwise $5.99)
    const shippingPrice = itemsPrice >= 50 ? 0 : 5.99;
    
    // Apply discount if coupon code is provided
    let discountAmount = 0;
    if (couponCode) {
      // Example: 10% discount for 'SAVE10' coupon
      if (couponCode === 'SAVE10') {
        discountAmount = itemsPrice * 0.1;
      }
    }
    
    const totalPrice = itemsPrice + taxPrice + shippingPrice - discountAmount;
    
    return {
      itemsPrice: Math.round(itemsPrice * 100) / 100,
      taxPrice: Math.round(taxPrice * 100) / 100,
      shippingPrice: Math.round(shippingPrice * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      totalPrice: Math.round(totalPrice * 100) / 100
    };
  }
}

module.exports = PaymentService;
