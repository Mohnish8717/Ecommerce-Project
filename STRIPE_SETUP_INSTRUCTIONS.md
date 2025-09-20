# 🚀 Quick Stripe Setup Guide

Your payment system is currently running in **demo mode**. Follow these steps to enable real Stripe payments:

## Step 1: Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" and create your account
3. Complete the account verification process

## Step 2: Get Your API Keys

1. **Login to Stripe Dashboard**
2. **Navigate to Developers → API keys**
3. **Copy your keys:**
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

## Step 3: Update Environment Variables

### Frontend (.env file in `/frontend` folder):
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

### Backend (.env file in `/backend` folder):
```env
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

## Step 4: Set Up Webhooks (Optional for testing)

1. **Go to Stripe Dashboard → Developers → Webhooks**
2. **Click "Add endpoint"**
3. **Enter your endpoint URL:**
   - For local development: `http://localhost:5000/api/payments/webhook`
   - For production: `https://yourdomain.com/api/payments/webhook`
4. **Select events to send:**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
5. **Copy the webhook signing secret** and add to your backend `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Step 5: Test Your Setup

### Test Cards (Use these for testing):
- **Success:** `4242424242424242`
- **Declined:** `4000000000000002`
- **Requires Authentication:** `4000002500003155`

### Test Details:
- **Expiry:** Any future date (e.g., `12/25`)
- **CVC:** Any 3 digits (e.g., `123`)
- **ZIP:** Any 5 digits (e.g., `12345`)

## Step 6: Restart Your Application

After updating the environment variables:

1. **Stop your development servers** (Ctrl+C)
2. **Restart both frontend and backend:**
   ```bash
   # In backend folder
   npm run dev
   
   # In frontend folder (new terminal)
   npm run dev
   ```

## 🎉 You're Done!

Once you've completed these steps:
- ✅ Real Stripe payment processing will be enabled
- ✅ The demo notice will disappear
- ✅ You can process real test payments
- ✅ Webhook events will be handled automatically

## Need Help?

- **Stripe Documentation:** [https://stripe.com/docs](https://stripe.com/docs)
- **Test Cards:** [https://stripe.com/docs/testing](https://stripe.com/docs/testing)
- **Webhooks Guide:** [https://stripe.com/docs/webhooks](https://stripe.com/docs/webhooks)

## Security Notes

⚠️ **Important:**
- Never commit real API keys to version control
- Use test keys for development
- Use live keys only in production
- Keep your secret keys secure and private

---

**Current Status:** 🟡 Demo Mode (Mock payments enabled)  
**After Setup:** 🟢 Live Mode (Real Stripe payments enabled)
