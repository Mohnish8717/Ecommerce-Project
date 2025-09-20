const crypto = require('crypto');

class UPIService {
  constructor() {
    this.merchantId = process.env.UPI_MERCHANT_ID || 'MERCHANT001';
    this.merchantName = process.env.UPI_MERCHANT_NAME || 'Nomotix';
    this.merchantVPA = process.env.UPI_MERCHANT_VPA || 'merchant@upi';
  }

  /**
   * Validate UPI ID format
   */
  validateUpiId(upiId) {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
    return upiRegex.test(upiId);
  }

  /**
   * Generate UPI payment link
   */
  generateUpiLink(amount, orderId, description = 'Payment') {
    const params = new URLSearchParams({
      pa: this.merchantVPA,
      pn: this.merchantName,
      am: amount.toFixed(2),
      cu: 'INR',
      tn: description,
      tr: orderId || this.generateTransactionId(),
      mc: this.merchantId
    });

    return `upi://pay?${params.toString()}`;
  }

  /**
   * Generate UPI QR code data
   */
  generateQRCodeData(amount, orderId, description = 'Payment') {
    return this.generateUpiLink(amount, orderId, description);
  }

  /**
   * Generate transaction ID
   */
  generateTransactionId() {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `UPI${timestamp}${random}`;
  }

  /**
   * Create UPI payment intent
   */
  async createUpiPaymentIntent(paymentData) {
    try {
      const {
        amount,
        currency = 'INR',
        orderId,
        description,
        customerUpiId,
        customerName,
        customerEmail
      } = paymentData;

      // Validate amount
      if (!amount || amount <= 0) {
        throw new Error('Invalid amount');
      }

      // Validate UPI ID if provided
      if (customerUpiId && !this.validateUpiId(customerUpiId)) {
        throw new Error('Invalid UPI ID format');
      }

      const transactionId = this.generateTransactionId();
      const upiLink = this.generateUpiLink(amount, orderId, description);

      const paymentIntent = {
        id: transactionId,
        amount: amount,
        currency: currency,
        status: 'pending',
        paymentMethod: 'upi',
        upiLink: upiLink,
        qrCodeData: upiLink,
        orderId: orderId,
        description: description,
        customerDetails: {
          upiId: customerUpiId,
          name: customerName,
          email: customerEmail
        },
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      };

      return {
        success: true,
        paymentIntent
      };
    } catch (error) {
      console.error('UPI payment intent creation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify UPI payment (mock implementation)
   */
  async verifyUpiPayment(transactionId, upiTransactionId) {
    try {
      // In a real implementation, this would verify with UPI gateway
      // For demo purposes, we'll simulate verification
      
      const isValid = this.simulatePaymentVerification();
      
      if (isValid) {
        return {
          success: true,
          status: 'completed',
          transactionId: transactionId,
          upiTransactionId: upiTransactionId,
          verifiedAt: new Date()
        };
      } else {
        return {
          success: false,
          status: 'failed',
          error: 'Payment verification failed'
        };
      }
    } catch (error) {
      console.error('UPI payment verification error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Simulate payment verification (for demo)
   */
  simulatePaymentVerification() {
    // 90% success rate for demo
    return Math.random() > 0.1;
  }

  /**
   * Get UPI payment status
   */
  async getPaymentStatus(transactionId) {
    try {
      // In a real implementation, this would check with UPI gateway
      // For demo purposes, we'll return mock status
      
      const statuses = ['pending', 'completed', 'failed', 'expired'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        success: true,
        transactionId: transactionId,
        status: randomStatus,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('UPI payment status check error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cancel UPI payment
   */
  async cancelUpiPayment(transactionId) {
    try {
      // In a real implementation, this would cancel with UPI gateway
      
      return {
        success: true,
        transactionId: transactionId,
        status: 'cancelled',
        cancelledAt: new Date()
      };
    } catch (error) {
      console.error('UPI payment cancellation error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get supported UPI apps
   */
  getSupportedUpiApps() {
    return [
      {
        name: 'PhonePe',
        packageName: 'com.phonepe.app',
        scheme: 'phonepe://',
        icon: 'phonepe'
      },
      {
        name: 'Google Pay',
        packageName: 'com.google.android.apps.nfc.payment',
        scheme: 'tez://',
        icon: 'googlepay'
      },
      {
        name: 'Paytm',
        packageName: 'net.one97.paytm',
        scheme: 'paytmmp://',
        icon: 'paytm'
      },
      {
        name: 'BHIM',
        packageName: 'in.org.npci.upiapp',
        scheme: 'bhim://',
        icon: 'bhim'
      },
      {
        name: 'Amazon Pay',
        packageName: 'in.amazon.mShop.android.shopping',
        scheme: 'amazonpay://',
        icon: 'amazonpay'
      }
    ];
  }

  /**
   * Generate deep link for specific UPI app
   */
  generateAppDeepLink(appName, amount, orderId, description) {
    const apps = this.getSupportedUpiApps();
    const app = apps.find(a => a.name.toLowerCase() === appName.toLowerCase());
    
    if (!app) {
      return this.generateUpiLink(amount, orderId, description);
    }

    const baseLink = this.generateUpiLink(amount, orderId, description);
    
    // For specific apps, you might need different URL schemes
    switch (appName.toLowerCase()) {
      case 'phonepe':
        return baseLink.replace('upi://', 'phonepe://');
      case 'google pay':
        return baseLink.replace('upi://', 'tez://');
      case 'paytm':
        return baseLink.replace('upi://', 'paytmmp://');
      default:
        return baseLink;
    }
  }

  /**
   * Format amount for UPI
   */
  formatAmount(amount) {
    return parseFloat(amount).toFixed(2);
  }

  /**
   * Get UPI transaction limits
   */
  getTransactionLimits() {
    return {
      minAmount: 1.00,
      maxAmount: 100000.00,
      dailyLimit: 100000.00,
      monthlyLimit: 1000000.00
    };
  }

  /**
   * Validate transaction amount against limits
   */
  validateTransactionAmount(amount) {
    const limits = this.getTransactionLimits();
    
    if (amount < limits.minAmount) {
      return {
        valid: false,
        error: `Minimum transaction amount is ₹${limits.minAmount}`
      };
    }
    
    if (amount > limits.maxAmount) {
      return {
        valid: false,
        error: `Maximum transaction amount is ₹${limits.maxAmount}`
      };
    }
    
    return { valid: true };
  }
}

module.exports = new UPIService();
