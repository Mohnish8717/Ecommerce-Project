import { useState, useEffect } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { FiLock, FiCreditCard } from 'react-icons/fi'
import { confirmPayment, setPaymentStatus } from '../../store/slices/paymentSlice'
import { clearCart } from '../../store/slices/cartSlice'
import PaymentLoader from './PaymentLoader'
import PaymentError from './PaymentError'
import PaymentSuccess from './PaymentSuccess'

const CheckoutForm = ({ onBack, orderTotals, shippingAddress }) => {
  const stripe = useStripe()
  const elements = useElements()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { isProcessing } = useSelector((state) => state.payment)
  const { user } = useSelector((state) => state.auth)
  
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [savePaymentMethod, setSavePaymentMethod] = useState(false)
  const [paymentStage, setPaymentStage] = useState('ready') // ready, processing, success, error
  const [paymentResult, setPaymentResult] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setPaymentStage('processing')

    try {
      // Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setErrorMessage(submitError.message)
        setPaymentStage('error')
        setIsLoading(false)
        return
      }

      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
          payment_method_data: {
            billing_details: {
              name: user.name,
              email: user.email,
              address: {
                line1: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postal_code: shippingAddress.zipCode,
                country: shippingAddress.country || 'US'
              }
            }
          }
        },
        redirect: 'if_required'
      })

      if (error) {
        setErrorMessage(error.message)
        setPaymentStage('error')
        dispatch(setPaymentStatus('failed'))
        toast.error('Payment failed: ' + error.message)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded
        setPaymentStage('success')
        setPaymentResult({
          paymentIntentId: paymentIntent.id,
          amount: orderTotals.totalPrice,
          orderId: `ORD-${Date.now()}`
        })
        dispatch(setPaymentStatus('succeeded'))

        // Clear cart
        dispatch(clearCart())

        // Show success message
        toast.success('Payment successful!')

        // Navigate to success page after delay
        setTimeout(() => {
          navigate('/order-confirmation', {
            state: {
              paymentIntent: paymentIntent.id,
              orderTotals,
              shippingAddress
            }
          })
        }, 3000)
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.')
      setPaymentStage('error')
      console.error('Payment error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetryPayment = () => {
    setPaymentStage('ready')
    setErrorMessage('')
    setPaymentResult(null)
  }

  const handleBackToPayment = () => {
    setPaymentStage('ready')
    setErrorMessage('')
  }

  // Show different UI based on payment stage
  if (paymentStage === 'processing') {
    return (
      <PaymentLoader
        stage="processing"
        message="Processing your payment securely..."
        showSteps={true}
      />
    )
  }

  if (paymentStage === 'success' && paymentResult) {
    return (
      <PaymentSuccess
        amount={paymentResult.amount}
        orderId={paymentResult.orderId}
        estimatedDelivery="5-7 business days"
        onContinue={() => navigate('/products')}
        onViewOrder={() => navigate('/orders')}
      />
    )
  }

  if (paymentStage === 'error') {
    return (
      <PaymentError
        error={{ message: errorMessage }}
        onRetry={handleRetryPayment}
        onBack={handleBackToPayment}
        onContactSupport={() => navigate('/contact')}
      />
    )
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Payment Element */}
      <motion.div
        className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <FiCreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
            <p className="text-sm text-gray-500">Enter your payment details securely</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <PaymentElement
            options={{
              layout: 'tabs',
              paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
              fields: {
                billingDetails: 'auto'
              }
            }}
          />
        </div>
      </motion.div>

      {/* Save Payment Method Option */}
      <motion.div
        className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <input
          id="save-payment-method"
          type="checkbox"
          checked={savePaymentMethod}
          onChange={(e) => setSavePaymentMethod(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="save-payment-method" className="ml-3 text-sm text-blue-800">
          <span className="font-medium">Save payment method</span> for faster checkout next time
        </label>
      </motion.div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <FiLock className="w-5 h-5 text-green-600 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-green-800">Secure Payment</h4>
            <p className="text-sm text-green-700">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

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
          {orderTotals.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-${orderTotals.discountAmount?.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-gray-200 pt-1 mt-2">
            <div className="flex justify-between font-medium text-lg">
              <span>Total:</span>
              <span>${orderTotals.totalPrice?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        className="flex justify-between pt-6 border-t border-gray-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
          disabled={isLoading || isProcessing}
        >
          Back to Review
        </button>

        <motion.button
          type="submit"
          disabled={!stripe || !elements || isLoading || isProcessing}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading || isProcessing ? (
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
        </motion.button>
      </motion.div>
    </motion.form>
  )
}

export default CheckoutForm
