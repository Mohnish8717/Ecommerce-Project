const { body, validationResult } = require('express-validator');
const { paymentConfig, validatePaymentAmount } = require('../config/payment');

// Validation rules for creating payment intent
const validatePaymentIntent = [
  body('amount')
    .isFloat({ min: paymentConfig.limits.minAmount, max: paymentConfig.limits.maxAmount })
    .withMessage(`Amount must be between $${paymentConfig.limits.minAmount} and $${paymentConfig.limits.maxAmount}`)
    .custom((value) => {
      const validation = validatePaymentAmount(value);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      return true;
    }),
  
  body('currency')
    .optional()
    .isIn(paymentConfig.supportedCurrencies)
    .withMessage(`Currency must be one of: ${paymentConfig.supportedCurrencies.join(', ')}`),
  
  body('paymentMethodTypes')
    .optional()
    .isArray()
    .withMessage('Payment method types must be an array')
    .custom((value) => {
      const validTypes = paymentConfig.paymentMethodTypes;
      const invalidTypes = value.filter(type => !validTypes.includes(type));
      if (invalidTypes.length > 0) {
        throw new Error(`Invalid payment method types: ${invalidTypes.join(', ')}`);
      }
      return true;
    }),
  
  body('orderId')
    .optional()
    .isMongoId()
    .withMessage('Order ID must be a valid MongoDB ObjectId')
];

// Validation rules for confirming payment
const validatePaymentConfirmation = [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('Payment intent ID is required')
    .matches(/^pi_[a-zA-Z0-9_]+$/)
    .withMessage('Invalid payment intent ID format'),
  
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Order ID must be a valid MongoDB ObjectId')
];

// Validation rules for saving payment method
const validateSavePaymentMethod = [
  body('paymentMethodId')
    .notEmpty()
    .withMessage('Payment method ID is required')
    .matches(/^pm_[a-zA-Z0-9_]+$/)
    .withMessage('Invalid payment method ID format')
];

// Validation rules for shipping address
const validateShippingAddress = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),
  
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
    .isLength({ min: 2, max: 2 })
    .withMessage('State must be a 2-character code'),
  
  body('zipCode')
    .trim()
    .notEmpty()
    .withMessage('ZIP code is required')
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('ZIP code must be in format 12345 or 12345-6789'),
  
  body('country')
    .optional()
    .isIn(['US', 'CA', 'MX'])
    .withMessage('Country must be US, CA, or MX')
];

// Validation rules for coupon code
const validateCouponCode = [
  body('couponCode')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Coupon code must be between 3 and 20 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Coupon code must contain only uppercase letters and numbers')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Rate limiting for payment operations
const paymentRateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const key = `${req.ip}-${req.user?.id || 'anonymous'}`;
    const now = Date.now();
    
    // Clean up old entries
    for (const [k, v] of attempts.entries()) {
      if (now - v.firstAttempt > windowMs) {
        attempts.delete(k);
      }
    }
    
    const userAttempts = attempts.get(key);
    
    if (!userAttempts) {
      attempts.set(key, { count: 1, firstAttempt: now });
      return next();
    }
    
    if (userAttempts.count >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many payment attempts. Please try again later.',
        retryAfter: Math.ceil((windowMs - (now - userAttempts.firstAttempt)) / 1000)
      });
    }
    
    userAttempts.count++;
    next();
  };
};

// Validate webhook signature
const validateWebhookSignature = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  
  if (!signature) {
    return res.status(400).json({
      success: false,
      message: 'Missing Stripe signature header'
    });
  }
  
  // The actual signature validation is done in the webhook handler
  // This middleware just ensures the header is present
  next();
};

// Sanitize payment data
const sanitizePaymentData = (req, res, next) => {
  // Remove any potentially dangerous fields
  const dangerousFields = ['__proto__', 'constructor', 'prototype'];
  
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    for (const field of dangerousFields) {
      delete obj[field];
    }
    
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        obj[key] = sanitizeObject(obj[key]);
      }
    }
    
    return obj;
  };
  
  req.body = sanitizeObject(req.body);
  next();
};

// Validate payment method ownership
const validatePaymentMethodOwnership = async (req, res, next) => {
  try {
    const { paymentMethodId } = req.body;
    const userId = req.user.id;
    
    // This would typically involve checking if the payment method belongs to the user
    // For now, we'll just pass through - implement actual ownership check as needed
    
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Payment method access denied'
    });
  }
};

module.exports = {
  validatePaymentIntent,
  validatePaymentConfirmation,
  validateSavePaymentMethod,
  validateShippingAddress,
  validateCouponCode,
  handleValidationErrors,
  paymentRateLimit,
  validateWebhookSignature,
  sanitizePaymentData,
  validatePaymentMethodOwnership
};
