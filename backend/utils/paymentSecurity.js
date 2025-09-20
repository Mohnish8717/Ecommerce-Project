const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

// Payment security utilities
class PaymentSecurity {
  constructor() {
    this.failedAttempts = new Map();
    this.suspiciousIPs = new Set();
    this.encryptionKey = process.env.PAYMENT_ENCRYPTION_KEY || crypto.randomBytes(32);
  }

  // Encrypt sensitive payment data
  encryptPaymentData(data) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
      
      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      return {
        encrypted,
        iv: iv.toString('hex')
      };
    } catch (error) {
      console.error('Payment data encryption failed:', error);
      throw new Error('Failed to encrypt payment data');
    }
  }

  // Decrypt sensitive payment data
  decryptPaymentData(encryptedData, iv) {
    try {
      const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
      
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Payment data decryption failed:', error);
      throw new Error('Failed to decrypt payment data');
    }
  }

  // Generate secure payment token
  generatePaymentToken(userId, amount, timestamp = Date.now()) {
    const data = `${userId}-${amount}-${timestamp}`;
    const hash = crypto.createHmac('sha256', this.encryptionKey)
                      .update(data)
                      .digest('hex');
    
    return `pt_${hash.substring(0, 32)}`;
  }

  // Validate payment token
  validatePaymentToken(token, userId, amount, maxAge = 3600000) { // 1 hour default
    try {
      if (!token.startsWith('pt_')) {
        return false;
      }

      const tokenHash = token.substring(3);
      const timestamp = Date.now();
      
      // Check multiple timestamps within the maxAge window
      for (let i = 0; i < maxAge; i += 1000) {
        const testTimestamp = timestamp - i;
        const expectedToken = this.generatePaymentToken(userId, amount, testTimestamp);
        
        if (expectedToken.substring(3) === tokenHash) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Payment token validation failed:', error);
      return false;
    }
  }

  // Track failed payment attempts
  trackFailedAttempt(identifier, maxAttempts = 5, lockoutDuration = 300000) {
    const now = Date.now();
    const attempts = this.failedAttempts.get(identifier) || { count: 0, firstAttempt: now, lockedUntil: 0 };

    // Check if currently locked out
    if (attempts.lockedUntil > now) {
      return {
        locked: true,
        remainingTime: Math.ceil((attempts.lockedUntil - now) / 1000)
      };
    }

    // Reset if enough time has passed
    if (now - attempts.firstAttempt > lockoutDuration) {
      attempts.count = 0;
      attempts.firstAttempt = now;
    }

    attempts.count++;

    // Lock if max attempts reached
    if (attempts.count >= maxAttempts) {
      attempts.lockedUntil = now + lockoutDuration;
      this.failedAttempts.set(identifier, attempts);
      
      return {
        locked: true,
        remainingTime: Math.ceil(lockoutDuration / 1000)
      };
    }

    this.failedAttempts.set(identifier, attempts);
    
    return {
      locked: false,
      attemptsRemaining: maxAttempts - attempts.count
    };
  }

  // Clear failed attempts (on successful payment)
  clearFailedAttempts(identifier) {
    this.failedAttempts.delete(identifier);
  }

  // Detect suspicious payment patterns
  detectSuspiciousActivity(paymentData) {
    const suspiciousIndicators = [];

    // Check for unusual amounts
    if (paymentData.amount > 10000) {
      suspiciousIndicators.push('high_amount');
    }

    // Check for rapid successive payments
    if (paymentData.rapidPayments && paymentData.rapidPayments > 5) {
      suspiciousIndicators.push('rapid_payments');
    }

    // Check for unusual locations
    if (paymentData.country && !['US', 'CA', 'GB', 'AU'].includes(paymentData.country)) {
      suspiciousIndicators.push('unusual_location');
    }

    // Check for mismatched billing/shipping addresses
    if (paymentData.billingCountry !== paymentData.shippingCountry) {
      suspiciousIndicators.push('address_mismatch');
    }

    return {
      suspicious: suspiciousIndicators.length > 0,
      indicators: suspiciousIndicators,
      riskScore: suspiciousIndicators.length * 25 // 0-100 scale
    };
  }

  // Sanitize payment input
  sanitizePaymentInput(input) {
    if (typeof input !== 'object' || input === null) {
      return input;
    }

    const sanitized = {};
    const allowedFields = [
      'amount', 'currency', 'paymentMethodId', 'orderId', 
      'shippingAddress', 'billingAddress', 'couponCode'
    ];

    for (const field of allowedFields) {
      if (input.hasOwnProperty(field)) {
        if (typeof input[field] === 'string') {
          // Remove potentially dangerous characters
          sanitized[field] = input[field]
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .trim();
        } else if (typeof input[field] === 'number') {
          sanitized[field] = Math.abs(input[field]); // Ensure positive numbers
        } else if (typeof input[field] === 'object') {
          sanitized[field] = this.sanitizePaymentInput(input[field]);
        } else {
          sanitized[field] = input[field];
        }
      }
    }

    return sanitized;
  }

  // Generate payment nonce for CSRF protection
  generatePaymentNonce() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Validate payment nonce
  validatePaymentNonce(nonce, storedNonce) {
    return crypto.timingSafeEqual(
      Buffer.from(nonce, 'hex'),
      Buffer.from(storedNonce, 'hex')
    );
  }

  // Create payment rate limiter
  createPaymentRateLimit(windowMs = 15 * 60 * 1000, max = 10) {
    return rateLimit({
      windowMs,
      max,
      message: {
        success: false,
        message: 'Too many payment requests. Please try again later.',
        retryAfter: Math.ceil(windowMs / 1000)
      },
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => {
        // Use combination of IP and user ID for more accurate limiting
        return `${req.ip}-${req.user?.id || 'anonymous'}`;
      }
    });
  }

  // Validate webhook signature
  validateWebhookSignature(payload, signature, secret) {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload, 'utf8')
        .digest('hex');

      const signatureElements = signature.split(',');
      const timestamp = signatureElements.find(el => el.startsWith('t='))?.split('=')[1];
      const signatures = signatureElements.filter(el => el.startsWith('v1='));

      if (!timestamp || signatures.length === 0) {
        return false;
      }

      // Check timestamp (reject if older than 5 minutes)
      const timestampMs = parseInt(timestamp) * 1000;
      if (Date.now() - timestampMs > 300000) {
        return false;
      }

      // Verify signature
      const payloadForSignature = `${timestamp}.${payload}`;
      const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(payloadForSignature, 'utf8')
        .digest('hex');

      return signatures.some(sig => {
        const sigValue = sig.split('=')[1];
        return crypto.timingSafeEqual(
          Buffer.from(computedSignature, 'hex'),
          Buffer.from(sigValue, 'hex')
        );
      });
    } catch (error) {
      console.error('Webhook signature validation failed:', error);
      return false;
    }
  }

  // Log security events
  logSecurityEvent(event, details) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      severity: this.getEventSeverity(event)
    };

    console.log('Payment Security Event:', JSON.stringify(logEntry));

    // In production, you might want to send this to a security monitoring service
    // or store in a dedicated security log database
  }

  // Get event severity level
  getEventSeverity(event) {
    const severityMap = {
      'failed_payment': 'low',
      'suspicious_activity': 'medium',
      'multiple_failed_attempts': 'high',
      'webhook_validation_failed': 'high',
      'encryption_failed': 'critical'
    };

    return severityMap[event] || 'medium';
  }
}

// Export singleton instance
module.exports = new PaymentSecurity();
