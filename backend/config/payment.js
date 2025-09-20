const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Payment configuration
const paymentConfig = {
  // Stripe configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    apiVersion: '2023-10-16', // Latest Stripe API version
  },

  // Supported currencies
  supportedCurrencies: ['usd', 'eur', 'gbp', 'cad', 'aud'],

  // Default currency
  defaultCurrency: 'usd',

  // Payment method types
  paymentMethodTypes: ['card', 'upi', 'apple_pay', 'google_pay'],

  // Tax configuration
  tax: {
    defaultRate: 0.085, // 8.5% default tax rate
    ratesByState: {
      'CA': 0.0975, // California
      'NY': 0.08,   // New York
      'TX': 0.0625, // Texas
      'FL': 0.06,   // Florida
      'WA': 0.065,  // Washington
      // Add more states as needed
    }
  },

  // Shipping configuration
  shipping: {
    freeShippingThreshold: 50.00,
    rates: {
      standard: {
        name: 'Standard Shipping',
        price: 5.99,
        estimatedDays: '5-7'
      },
      express: {
        name: 'Express Shipping',
        price: 9.99,
        estimatedDays: '2-3'
      },
      overnight: {
        name: 'Overnight Shipping',
        price: 19.99,
        estimatedDays: '1'
      }
    }
  },

  // Coupon codes
  coupons: {
    'SAVE10': {
      type: 'percentage',
      value: 10,
      minAmount: 25.00,
      maxDiscount: 50.00,
      description: '10% off orders over $25'
    },
    'WELCOME20': {
      type: 'percentage',
      value: 20,
      minAmount: 50.00,
      maxDiscount: 100.00,
      description: '20% off orders over $50'
    },
    'FREESHIP': {
      type: 'free_shipping',
      value: 0,
      minAmount: 25.00,
      description: 'Free shipping on orders over $25'
    }
  },

  // Payment limits
  limits: {
    minAmount: 0.50,    // Minimum payment amount
    maxAmount: 999999.99, // Maximum payment amount
    dailyLimit: 10000.00, // Daily payment limit per user
    monthlyLimit: 50000.00 // Monthly payment limit per user
  },

  // Webhook events to handle
  webhookEvents: [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'payment_intent.canceled',
    'payment_method.attached',
    'customer.created',
    'customer.updated',
    'invoice.payment_succeeded',
    'invoice.payment_failed'
  ],

  // Security settings
  security: {
    requireCVV: true,
    require3DSecure: false, // Enable for high-risk transactions
    fraudDetection: true,
    ipWhitelist: [], // Add trusted IPs if needed
    maxFailedAttempts: 3,
    lockoutDuration: 300000 // 5 minutes in milliseconds
  }
};

// Validate Stripe configuration
const validateStripeConfig = () => {
  const requiredKeys = ['secretKey', 'publishableKey', 'webhookSecret'];
  const missing = requiredKeys.filter(key => !paymentConfig.stripe[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required Stripe configuration: ${missing.join(', ')}`);
  }

  // Validate key formats
  if (!paymentConfig.stripe.secretKey.startsWith('sk_')) {
    throw new Error('Invalid Stripe secret key format');
  }

  if (!paymentConfig.stripe.publishableKey.startsWith('pk_')) {
    throw new Error('Invalid Stripe publishable key format');
  }

  if (!paymentConfig.stripe.webhookSecret.startsWith('whsec_')) {
    throw new Error('Invalid Stripe webhook secret format');
  }
};

// Calculate tax for a given amount and state
const calculateTax = (amount, state = null) => {
  const taxRate = state && paymentConfig.tax.ratesByState[state] 
    ? paymentConfig.tax.ratesByState[state]
    : paymentConfig.tax.defaultRate;
  
  return Math.round(amount * taxRate * 100) / 100;
};

// Calculate shipping cost
const calculateShipping = (amount, shippingType = 'standard') => {
  // Free shipping if amount exceeds threshold
  if (amount >= paymentConfig.shipping.freeShippingThreshold) {
    return 0;
  }

  const shippingRate = paymentConfig.shipping.rates[shippingType];
  return shippingRate ? shippingRate.price : paymentConfig.shipping.rates.standard.price;
};

// Apply coupon discount
const applyCoupon = (amount, couponCode) => {
  const coupon = paymentConfig.coupons[couponCode];
  
  if (!coupon) {
    return { discount: 0, error: 'Invalid coupon code' };
  }

  if (amount < coupon.minAmount) {
    return { 
      discount: 0, 
      error: `Minimum order amount of $${coupon.minAmount} required` 
    };
  }

  let discount = 0;

  if (coupon.type === 'percentage') {
    discount = Math.round(amount * (coupon.value / 100) * 100) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.type === 'fixed') {
    discount = coupon.value;
  } else if (coupon.type === 'free_shipping') {
    // This would be handled in shipping calculation
    discount = 0;
  }

  return { discount, error: null };
};

// Validate payment amount
const validatePaymentAmount = (amount) => {
  if (amount < paymentConfig.limits.minAmount) {
    return { valid: false, error: `Minimum payment amount is $${paymentConfig.limits.minAmount}` };
  }

  if (amount > paymentConfig.limits.maxAmount) {
    return { valid: false, error: `Maximum payment amount is $${paymentConfig.limits.maxAmount}` };
  }

  return { valid: true, error: null };
};

// Format currency
const formatCurrency = (amount, currency = paymentConfig.defaultCurrency) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(amount);
};

// Initialize Stripe with configuration
const initializeStripe = () => {
  try {
    validateStripeConfig();
    return stripe;
  } catch (error) {
    console.error('Stripe initialization failed:', error.message);
    throw error;
  }
};

module.exports = {
  paymentConfig,
  validateStripeConfig,
  calculateTax,
  calculateShipping,
  applyCoupon,
  validatePaymentAmount,
  formatCurrency,
  initializeStripe,
  stripe
};
