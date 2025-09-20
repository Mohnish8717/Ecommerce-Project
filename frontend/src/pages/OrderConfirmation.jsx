import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiCheckCircle, FiTruck, FiMail, FiHome, FiShoppingBag } from 'react-icons/fi'
import { resetPayment } from '../store/slices/paymentSlice'

const OrderConfirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [orderData, setOrderData] = useState(null)
  const [estimatedDelivery, setEstimatedDelivery] = useState('')

  useEffect(() => {
    // Get order data from navigation state
    if (location.state) {
      setOrderData(location.state)
      
      // Calculate estimated delivery date (5-7 business days)
      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + 7)
      setEstimatedDelivery(deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
    } else {
      // Redirect if no order data
      navigate('/')
    }

    // Reset payment state
    dispatch(resetPayment())
  }, [location.state, navigate, dispatch])

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const { paymentIntent, orderTotals, shippingAddress } = orderData

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <FiCheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          <div className="bg-white rounded-lg shadow-sm p-4 inline-block">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono text-lg font-semibold text-gray-900">
              {paymentIntent}
            </p>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FiTruck className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">{shippingAddress.fullName}</p>
              <p className="text-gray-600">{shippingAddress.address}</p>
              <p className="text-gray-600">
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
              </p>
              <p className="text-gray-600">{shippingAddress.country}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="font-medium text-gray-900">{estimatedDelivery}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FiShoppingBag className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">${orderTotals.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-gray-900">
                  {orderTotals.shippingPrice === 0 ? 'Free' : `$${orderTotals.shippingPrice?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span className="text-gray-900">${orderTotals.taxPrice?.toFixed(2)}</span>
              </div>
              {orderTotals.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${orderTotals.discountAmount?.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">${orderTotals.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">What's Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <FiMail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Order Confirmation</h3>
              <p className="text-sm text-gray-600">
                You'll receive an email confirmation with your order details shortly.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <FiTruck className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Order Processing</h3>
              <p className="text-sm text-gray-600">
                We'll prepare your order and send you tracking information once it ships.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Delivery</h3>
              <p className="text-sm text-gray-600">
                Your order will be delivered to your specified address.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center font-medium"
          >
            View Order Status
          </Link>
          <Link
            to="/products"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-center font-medium"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-center font-medium flex items-center justify-center"
          >
            <FiHome className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Support Information */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need help with your order?
          </p>
          <div className="space-x-4">
            <Link to="/contact" className="text-blue-600 hover:text-blue-800 text-sm">
              Contact Support
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/faq" className="text-blue-600 hover:text-blue-800 text-sm">
              FAQ
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/returns" className="text-blue-600 hover:text-blue-800 text-sm">
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
