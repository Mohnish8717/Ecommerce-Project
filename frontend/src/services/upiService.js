import api from './api'

const API_URL = '/api/payments/upi'

// Create UPI payment intent
const createUpiPaymentIntent = async (paymentData) => {
  const response = await api.post(`${API_URL}/create-intent`, paymentData)
  return response.data
}

// Verify UPI payment
const verifyUpiPayment = async (verificationData) => {
  const response = await api.post(`${API_URL}/verify`, verificationData)
  return response.data
}

// Get UPI payment status
const getUpiPaymentStatus = async (transactionId) => {
  const response = await api.get(`${API_URL}/status/${transactionId}`)
  return response.data
}

// Get supported UPI apps
const getSupportedUpiApps = async () => {
  const response = await api.get(`${API_URL}/apps`)
  return response.data
}

// Generate UPI deep link
const generateUpiDeepLink = async (linkData) => {
  const response = await api.post(`${API_URL}/deep-link`, linkData)
  return response.data
}

// Validate UPI ID format
const validateUpiId = (upiId) => {
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/
  return upiRegex.test(upiId)
}

// Format UPI amount
const formatUpiAmount = (amount) => {
  return parseFloat(amount).toFixed(2)
}

// Generate UPI payment link
const generateUpiLink = (merchantVPA, merchantName, amount, transactionNote, transactionId) => {
  const params = new URLSearchParams({
    pa: merchantVPA || 'merchant@upi',
    pn: merchantName || 'Nomotix',
    am: formatUpiAmount(amount),
    cu: 'INR',
    tn: transactionNote || 'Payment',
    tr: transactionId || `TXN${Date.now()}`
  })

  return `upi://pay?${params.toString()}`
}

// Check if device supports UPI
const isUpiSupported = () => {
  // Check if running on mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  // Check if UPI apps might be available (Android primarily)
  const isAndroid = /Android/i.test(navigator.userAgent)
  
  return isMobile && isAndroid
}

// Open UPI app with payment link
const openUpiApp = (upiLink, appName = null) => {
  if (!isUpiSupported()) {
    throw new Error('UPI is not supported on this device')
  }

  try {
    // Try to open the UPI link
    window.location.href = upiLink
    
    // Fallback: try to open in new window after a delay
    setTimeout(() => {
      window.open(upiLink, '_blank')
    }, 1000)
    
    return true
  } catch (error) {
    console.error('Failed to open UPI app:', error)
    return false
  }
}

// Get UPI app icon
const getUpiAppIcon = (appName) => {
  const icons = {
    'phonepe': '📱',
    'googlepay': '💳',
    'google pay': '💳',
    'paytm': '💰',
    'bhim': '🏦',
    'amazonpay': '🛒',
    'amazon pay': '🛒'
  }
  
  return icons[appName.toLowerCase()] || '💳'
}

// Get UPI app color scheme
const getUpiAppColor = (appName) => {
  const colors = {
    'phonepe': '#5f259f',
    'googlepay': '#4285f4',
    'google pay': '#4285f4',
    'paytm': '#00baf2',
    'bhim': '#ff6b35',
    'amazonpay': '#ff9900',
    'amazon pay': '#ff9900'
  }
  
  return colors[appName.toLowerCase()] || '#6366f1'
}

// Copy UPI link to clipboard
const copyUpiLink = async (upiLink) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(upiLink)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = upiLink
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      return successful
    }
  } catch (error) {
    console.error('Failed to copy UPI link:', error)
    return false
  }
}

// Generate QR code data URL (mock implementation)
const generateQRCodeDataUrl = (upiLink) => {
  // In a real implementation, you would use a QR code library
  // For demo purposes, return a placeholder
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="white"/>
      <rect x="20" y="20" width="160" height="160" fill="black"/>
      <rect x="40" y="40" width="120" height="120" fill="white"/>
      <text x="100" y="105" text-anchor="middle" font-family="Arial" font-size="12" fill="black">QR Code</text>
      <text x="100" y="125" text-anchor="middle" font-family="Arial" font-size="8" fill="gray">₹${upiLink.match(/am=([^&]+)/)?.[1] || '0'}</text>
    </svg>
  `)}`
}

// Check UPI transaction limits
const checkTransactionLimits = (amount) => {
  const limits = {
    minAmount: 1.00,
    maxAmount: 100000.00,
    dailyLimit: 100000.00
  }
  
  if (amount < limits.minAmount) {
    return {
      valid: false,
      error: `Minimum transaction amount is ₹${limits.minAmount}`
    }
  }
  
  if (amount > limits.maxAmount) {
    return {
      valid: false,
      error: `Maximum transaction amount is ₹${limits.maxAmount}`
    }
  }
  
  return { valid: true }
}

// Format currency for UPI (Indian Rupees)
const formatUpiCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Get popular UPI providers
const getPopularUpiProviders = () => {
  return [
    { name: 'PhonePe', suffix: '@ybl', color: '#5f259f', icon: '📱' },
    { name: 'Google Pay', suffix: '@okaxis', color: '#4285f4', icon: '💳' },
    { name: 'Paytm', suffix: '@paytm', color: '#00baf2', icon: '💰' },
    { name: 'BHIM', suffix: '@upi', color: '#ff6b35', icon: '🏦' },
    { name: 'Amazon Pay', suffix: '@apl', color: '#ff9900', icon: '🛒' }
  ]
}

// Extract UPI ID components
const parseUpiId = (upiId) => {
  const parts = upiId.split('@')
  if (parts.length !== 2) {
    return null
  }
  
  return {
    username: parts[0],
    provider: parts[1],
    full: upiId
  }
}

const upiService = {
  createUpiPaymentIntent,
  verifyUpiPayment,
  getUpiPaymentStatus,
  getSupportedUpiApps,
  generateUpiDeepLink,
  validateUpiId,
  formatUpiAmount,
  generateUpiLink,
  isUpiSupported,
  openUpiApp,
  getUpiAppIcon,
  getUpiAppColor,
  copyUpiLink,
  generateQRCodeDataUrl,
  checkTransactionLimits,
  formatUpiCurrency,
  getPopularUpiProviders,
  parseUpiId
}

export default upiService
