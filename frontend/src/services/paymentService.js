import api from './api'

const API_URL = '/api/payments'

// Create payment intent
const createPaymentIntent = async (paymentData) => {
  const response = await api.post(`${API_URL}/create-payment-intent`, paymentData)
  return response.data
}

// Get payment methods
const getPaymentMethods = async () => {
  const response = await api.get(`${API_URL}/methods`)
  return response.data
}

// Create or get Stripe customer
const createCustomer = async () => {
  const response = await api.post(`${API_URL}/customer`)
  return response.data
}

// Save payment method
const savePaymentMethod = async (paymentMethodId) => {
  const response = await api.post(`${API_URL}/save-method`, { paymentMethodId })
  return response.data
}

// Delete payment method
const deletePaymentMethod = async (paymentMethodId) => {
  const response = await api.delete(`${API_URL}/methods/${paymentMethodId}`)
  return response.data
}

// Confirm payment
const confirmPayment = async (paymentData) => {
  const response = await api.post(`${API_URL}/confirm`, paymentData)
  return response.data
}

// Get payment intent status
const getPaymentIntentStatus = async (paymentIntentId) => {
  const response = await api.get(`${API_URL}/intent/${paymentIntentId}`)
  return response.data
}

// Calculate order totals
const calculateOrderTotals = (items, shippingAddress, couponCode = null) => {
  const itemsPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  
  // Calculate tax (example: 8.5% tax rate)
  const taxRate = 0.085
  const taxPrice = itemsPrice * taxRate
  
  // Calculate shipping (example: free shipping over $50, otherwise $5.99)
  const shippingPrice = itemsPrice >= 50 ? 0 : 5.99
  
  // Apply discount if coupon code is provided
  let discountAmount = 0
  if (couponCode) {
    // Example: 10% discount for 'SAVE10' coupon
    if (couponCode === 'SAVE10') {
      discountAmount = itemsPrice * 0.1
    }
  }
  
  const totalPrice = itemsPrice + taxPrice + shippingPrice - discountAmount
  
  return {
    itemsPrice: Math.round(itemsPrice * 100) / 100,
    taxPrice: Math.round(taxPrice * 100) / 100,
    shippingPrice: Math.round(shippingPrice * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100
  }
}

// Format currency
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// Validate card number (basic Luhn algorithm)
const validateCardNumber = (cardNumber) => {
  const num = cardNumber.replace(/\s/g, '')
  if (!/^\d+$/.test(num)) return false
  
  let sum = 0
  let isEven = false
  
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

// Get card type from number
const getCardType = (cardNumber) => {
  const num = cardNumber.replace(/\s/g, '')
  
  if (/^4/.test(num)) return 'visa'
  if (/^5[1-5]/.test(num)) return 'mastercard'
  if (/^3[47]/.test(num)) return 'amex'
  if (/^6/.test(num)) return 'discover'
  
  return 'unknown'
}

// Format card number with spaces
const formatCardNumber = (cardNumber) => {
  const num = cardNumber.replace(/\s/g, '')
  const match = num.match(/\d{1,4}/g)
  return match ? match.join(' ') : ''
}

// Format expiry date
const formatExpiryDate = (expiry) => {
  const num = expiry.replace(/\D/g, '')
  if (num.length >= 2) {
    return num.substring(0, 2) + (num.length > 2 ? '/' + num.substring(2, 4) : '')
  }
  return num
}

const paymentService = {
  createPaymentIntent,
  getPaymentMethods,
  createCustomer,
  savePaymentMethod,
  deletePaymentMethod,
  confirmPayment,
  getPaymentIntentStatus,
  calculateOrderTotals,
  formatCurrency,
  validateCardNumber,
  getCardType,
  formatCardNumber,
  formatExpiryDate
}

export default paymentService
