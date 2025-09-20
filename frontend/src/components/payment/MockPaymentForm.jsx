import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCreditCard, FiLock, FiCheck, FiZap } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { clearCart } from '../../store/slices/cartSlice'
import PaymentLoader from './PaymentLoader'
import PaymentSuccess from './PaymentSuccess'
import PaymentMethodSelector from './PaymentMethodSelector'
import UPIPaymentForm from './UPIPaymentForm'

const MockPaymentForm = ({ onBack, orderTotals, shippingAddress }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStage, setPaymentStage] = useState('ready')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '')
    }
    return v
  }

  const handleInputChange = (field, value) => {
    let formattedValue = value
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4)
    }
    
    setCardDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }))
  }

  const validateForm = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = cardDetails
    
    if (!cardholderName.trim()) {
      toast.error('Please enter cardholder name')
      return false
    }
    
    if (cardNumber.replace(/\s/g, '').length < 13) {
      toast.error('Please enter a valid card number')
      return false
    }
    
    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      toast.error('Please enter a valid expiry date (MM/YY)')
      return false
    }
    
    if (cvv.length < 3) {
      toast.error('Please enter a valid CVV')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (selectedPaymentMethod === 'card' && !validateForm()) return

    setIsProcessing(true)
    setPaymentStage('processing')

    // Simulate payment processing
    setTimeout(() => {
      // Simulate successful payment
      setPaymentStage('success')
      dispatch(clearCart())
      toast.success('Payment successful!')

      // Navigate after showing success
      setTimeout(() => {
        navigate('/order-confirmation', {
          state: {
            paymentIntent: `pi_mock_${Date.now()}`,
            orderTotals,
            shippingAddress
          }
        })
      }, 3000)
    }, 2000)
  }

  const handleUpiSuccess = (paymentData) => {
    setPaymentStage('success')
    dispatch(clearCart())
    toast.success('UPI payment successful!')

    setTimeout(() => {
      navigate('/order-confirmation', {
        state: {
          paymentIntent: paymentData.transactionId,
          orderTotals,
          shippingAddress
        }
      })
    }, 3000)
  }

  const handleUpiError = (error) => {
    toast.error(error)
    setIsProcessing(false)
  }

  if (paymentStage === 'processing') {
    return (
      <PaymentLoader 
        stage="processing" 
        message="Processing your payment securely..."
        showSteps={true}
      />
    )
  }

  if (paymentStage === 'success') {
    return (
      <PaymentSuccess
        amount={orderTotals.totalPrice}
        orderId={`ORD-${Date.now()}`}
        estimatedDelivery="5-7 business days"
        onContinue={() => navigate('/products')}
        onViewOrder={() => navigate('/orders')}
      />
    )
  }

  // Show UPI form if UPI is selected
  if (selectedPaymentMethod === 'upi') {
    return (
      <UPIPaymentForm
        amount={orderTotals.totalPrice}
        onSuccess={handleUpiSuccess}
        onError={handleUpiError}
        onBack={() => setSelectedPaymentMethod('card')}
      />
    )
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Payment Method Selection */}
      <PaymentMethodSelector
        selectedMethod={selectedPaymentMethod}
        onMethodChange={setSelectedPaymentMethod}
        availableMethods={['upi']}
      />

      {/* Demo Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Demo Mode</h4>
            <p className="text-sm text-yellow-700 mt-1">
              This is a demo payment form. Choose your preferred payment method to test the checkout flow.
            </p>
          </div>
        </div>
      </div>

      {/* Card Payment Form - Only show if card is selected */}
      {selectedPaymentMethod === 'card' && (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >

      {/* Payment Form */}
      <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <FiCreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
            <p className="text-sm text-gray-500">Enter your payment details securely</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardDetails.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <input
              type="text"
              value={cardDetails.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1234 5678 9012 3456"
              maxLength="19"
            />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                value={cardDetails.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM/YY"
                maxLength="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                value={cardDetails.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123"
                maxLength="4"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <FiLock className="w-5 h-5 text-green-600 mt-0.5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-800">Secure Payment</h4>
            <p className="text-sm text-green-700 mt-1">
              Your payment information is encrypted and secure. This is a demo environment.
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Order Total</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span>${orderTotals.itemsPrice?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping:</span>
            <span>${orderTotals.shippingPrice?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax:</span>
            <span>${orderTotals.taxPrice?.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-1 mt-2">
            <div className="flex justify-between font-medium text-lg">
              <span>Total:</span>
              <span>${orderTotals.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          disabled={isProcessing}
        >
          Back to Review
        </button>
        
        <button
          type="submit"
          disabled={isProcessing}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg transition-all duration-200"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <FiLock className="w-4 h-4 mr-2" />
              Pay ${orderTotals.totalPrice?.toFixed(2)}
            </>
          )}
        </button>
      </div>
        </motion.form>
      )}
    </motion.div>
  )
}

export default MockPaymentForm
