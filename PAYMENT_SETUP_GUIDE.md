# Payment Integration Setup Guide

This guide will help you set up the complete payment integration system for the ecommerce project using Stripe.

## Prerequisites

1. **Stripe Account**: Create a Stripe account at [stripe.com](https://stripe.com)
2. **Node.js**: Ensure Node.js is installed (v16 or higher)
3. **MongoDB**: Database for storing orders and user data

## Backend Setup

### 1. Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Payment Security
PAYMENT_ENCRYPTION_KEY=your_32_character_encryption_key_here

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development
```

### 2. Install Dependencies

The following packages are required for payment processing:

```bash
npm install stripe express-validator express-rate-limit
```

### 3. Stripe Webhook Setup

1. **Create Webhook Endpoint**:
   - Go to Stripe Dashboard → Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://yourdomain.com/api/payments/webhook`
   - Events to send:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `payment_intent.canceled`
     - `payment_method.attached`
     - `customer.created`

2. **Get Webhook Secret**:
   - Copy the webhook signing secret
   - Add it to your `.env` file as `STRIPE_WEBHOOK_SECRET`

### 4. Test Webhook Locally

For local development, use Stripe CLI:

```bash
# Install Stripe CLI
# Download from: https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/payments/webhook
```

## Frontend Setup

### 1. Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# App Configuration
VITE_APP_NAME=Nomotix
VITE_APP_VERSION=1.0.0
```

### 2. Install Dependencies

The following packages are required:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## Payment Flow

### 1. Checkout Process

1. **Cart → Checkout**: User proceeds from cart to checkout
2. **Shipping Info**: User enters shipping address
3. **Order Review**: User reviews order details
4. **Payment**: User enters payment information
5. **Confirmation**: Order confirmation page

### 2. Payment Processing

1. **Create Payment Intent**: Backend creates Stripe payment intent
2. **Client Secret**: Frontend receives client secret
3. **Payment Form**: Stripe Elements handles payment form
4. **Confirm Payment**: Payment is confirmed with Stripe
5. **Webhook**: Stripe sends webhook to update order status

## API Endpoints

### Payment Routes

- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/webhook` - Handle Stripe webhooks
- `GET /api/payments/methods` - Get saved payment methods
- `POST /api/payments/customer` - Create/get Stripe customer
- `POST /api/payments/save-method` - Save payment method
- `DELETE /api/payments/methods/:id` - Delete payment method
- `GET /api/payments/intent/:id` - Get payment intent status

## Security Features

### 1. Input Validation
- All payment inputs are validated using express-validator
- Sanitization prevents XSS and injection attacks
- Amount limits and currency validation

### 2. Rate Limiting
- Payment attempts are rate-limited per user/IP
- Failed attempt tracking with lockout periods
- Webhook signature validation

### 3. Data Encryption
- Sensitive payment data is encrypted at rest
- Secure token generation for payment sessions
- CSRF protection with nonces

### 4. Fraud Detection
- Suspicious activity detection
- IP-based monitoring
- Pattern analysis for unusual transactions

## Testing

### 1. Test Cards

Use Stripe's test cards for development:

```
# Successful payments
4242424242424242 - Visa
5555555555554444 - Mastercard
378282246310005 - American Express

# Failed payments
4000000000000002 - Card declined
4000000000009995 - Insufficient funds
4000000000009987 - Lost card
```

### 2. Test Scenarios

1. **Successful Payment**: Use test card 4242424242424242
2. **Failed Payment**: Use test card 4000000000000002
3. **3D Secure**: Use test card 4000000000003220
4. **Webhook Testing**: Use Stripe CLI to test webhooks

## Deployment

### 1. Production Environment

1. **Replace Test Keys**: Use live Stripe keys in production
2. **HTTPS Required**: Stripe requires HTTPS in production
3. **Webhook URLs**: Update webhook URLs to production domain
4. **Environment Variables**: Set all production environment variables

### 2. Security Checklist

- [ ] Use HTTPS for all payment pages
- [ ] Validate all inputs on server-side
- [ ] Implement proper error handling
- [ ] Set up monitoring and logging
- [ ] Regular security audits
- [ ] PCI compliance considerations

## Troubleshooting

### Common Issues

1. **Webhook Signature Verification Failed**
   - Check webhook secret in environment variables
   - Ensure raw body is passed to webhook handler
   - Verify webhook URL is accessible

2. **Payment Intent Creation Failed**
   - Verify Stripe secret key is correct
   - Check amount is in cents (multiply by 100)
   - Ensure user is authenticated

3. **Frontend Stripe Loading Issues**
   - Check publishable key in environment variables
   - Verify Stripe.js is loaded correctly
   - Check browser console for errors

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
DEBUG=stripe:*
```

## Support

For additional help:

1. **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
2. **Stripe Support**: Available in Stripe Dashboard
3. **Community**: Stack Overflow with `stripe-payments` tag

## Security Notes

⚠️ **Important Security Reminders**:

1. Never expose secret keys in client-side code
2. Always validate payments on the server-side
3. Use webhooks to handle payment status updates
4. Implement proper error handling and logging
5. Regular security audits and updates
6. Follow PCI DSS guidelines for payment processing

## Next Steps

After setup:

1. Test the complete payment flow
2. Set up monitoring and alerts
3. Configure backup payment methods
4. Implement refund functionality
5. Add payment analytics and reporting
