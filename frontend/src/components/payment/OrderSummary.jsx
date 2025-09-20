import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FiTag, FiX } from 'react-icons/fi'
import { setCouponCode } from '../../store/slices/paymentSlice'

const OrderSummary = () => {
  const dispatch = useDispatch()
  const { items } = useSelector((state) => state.cart)
  const { orderTotals, couponCode } = useSelector((state) => state.payment)
  
  const [couponInput, setCouponInput] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      dispatch(setCouponCode({ 
        couponCode: couponInput.trim(),
        cartItems: items 
      }))
      setCouponApplied(true)
    }
  }

  const handleRemoveCoupon = () => {
    dispatch(setCouponCode({ 
      couponCode: '',
      cartItems: items 
    }))
    setCouponInput('')
    setCouponApplied(false)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
      
      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500">
                ${item.price.toFixed(2)} each
              </p>
            </div>
            <div className="text-sm font-medium text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Code */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <FiTag className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Promo Code</span>
        </div>
        
        {!couponApplied ? (
          <div className="mt-2 flex space-x-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={!couponInput.trim()}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-md px-3 py-2">
            <span className="text-sm text-green-700 font-medium">
              {couponCode} applied
            </span>
            <button
              onClick={handleRemoveCoupon}
              className="text-green-600 hover:text-green-800"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Order Totals */}
      <div className="border-t border-gray-200 pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${orderTotals.itemsPrice?.toFixed(2) || '0.00'}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {orderTotals.shippingPrice === 0 ? 'Free' : `$${orderTotals.shippingPrice?.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">${orderTotals.taxPrice?.toFixed(2) || '0.00'}</span>
        </div>
        
        {orderTotals.discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-${orderTotals.discountAmount?.toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="text-base font-medium text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">
              ${orderTotals.totalPrice?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            SSL Secured
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified
          </div>
        </div>
        
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            Your payment information is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
