import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { toast } from 'react-hot-toast'
import { FiShoppingCart, FiLock, FiTruck, FiCreditCard } from 'react-icons/fi'
import CheckoutForm from '../components/payment/CheckoutForm'
import MockPaymentForm from '../components/payment/MockPaymentForm'
import OrderSummary from '../components/payment/OrderSummary'
import ShippingForm from '../components/payment/ShippingForm'
import { createPaymentIntent, calculateTotals } from '../store/slices/paymentSlice'

// Initialize Stripe
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = stripePublishableKey && stripePublishableKey !== 'pk_test_demo_key'
  ? loadStripe(stripePublishableKey)
  : null

// Check if we should use mock payment (when Stripe is not properly configured)
const useMockPayment = !stripePublishableKey || stripePublishableKey === 'pk_test_demo_key'

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items, totalPrice } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const {
    clientSecret,
    orderTotals,
    shippingAddress,
    isLoading,
    error
  } = useSelector((state) => state.payment)

  const [currentStep, setCurrentStep] = useState(1)
  const [paymentReady, setPaymentReady] = useState(false)

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      navigate('/cart')
    }
  }, [items, navigate])

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error('Please login to continue')
      navigate('/login')
    }
  }, [user, navigate])

  // Calculate totals when cart items change
  useEffect(() => {
    if (items.length > 0) {
      dispatch(calculateTotals({ cartItems: items }))
    }
  }, [items, dispatch])

  // Create payment intent when ready (only for real Stripe integration)
  useEffect(() => {
    if (!useMockPayment && currentStep === 3 && orderTotals.totalPrice > 0 && !clientSecret) {
      dispatch(createPaymentIntent({
        amount: orderTotals.totalPrice,
        currency: 'usd'
      }))
    }
  }, [currentStep, orderTotals.totalPrice, clientSecret, dispatch, useMockPayment])

  // Set payment ready when client secret is available
  useEffect(() => {
    if (clientSecret) {
      setPaymentReady(true)
    }
  }, [clientSecret])

  const handleStepChange = (step) => {
    setCurrentStep(step)
  }

  const steps = [
    { id: 1, name: 'Shipping', icon: FiTruck },
    { id: 2, name: 'Review', icon: FiShoppingCart },
    { id: 3, name: 'Payment', icon: FiCreditCard }
  ]

  if (items.length === 0 || !user) {
    return null
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <ShippingForm onNext={() => handleStepChange(2)} />
              )}

              {/* Step 2: Review Order */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={() => handleStepChange(1)}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => handleStepChange(3)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div>
                  <div className="flex items-center mb-6">
                    <FiLock className="w-5 h-5 text-green-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-900">Secure Payment</h2>
                  </div>

                  {useMockPayment ? (
                    // Use mock payment form when Stripe is not configured
                    <MockPaymentForm
                      onBack={() => handleStepChange(2)}
                      orderTotals={orderTotals}
                      shippingAddress={shippingAddress}
                    />
                  ) : paymentReady && clientSecret ? (
                    // Use real Stripe payment form when properly configured
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: 'stripe',
                          variables: {
                            colorPrimary: '#2563eb',
                          }
                        }
                      }}
                    >
                      <CheckoutForm
                        onBack={() => handleStepChange(2)}
                        orderTotals={orderTotals}
                        shippingAddress={shippingAddress}
                      />
                    </Elements>
                  ) : (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">Preparing payment...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-4">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
