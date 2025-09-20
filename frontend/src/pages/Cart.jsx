import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiTrash2, FiPlus, FiMinus, FiShield, FiTruck, FiShoppingCart } from 'react-icons/fi'
import { updateQuantity, removeFromCart, clearCart } from '../store/slices/cartSlice'
import { toast } from 'react-hot-toast'

const Cart = () => {
  const dispatch = useDispatch()
  const { items, totalItems, totalPrice } = useSelector((state) => state.cart)

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) return
    dispatch(updateQuantity({ id, quantity }))
  }

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id))
    toast.success('Item removed from cart')
  }

  const handleClearCart = () => {
    dispatch(clearCart())
    toast.success('Cart cleared')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Nomotix Cart is empty</h1>
              <p className="text-gray-600">Shop today's deals</p>
            </div>

            <div className="space-y-4">
              <Link
                to="/login"
                className="block w-full max-w-sm mx-auto bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 px-4 rounded font-medium transition-colors"
              >
                Sign in to your account
              </Link>

              <Link
                to="/register"
                className="block w-full max-w-sm mx-auto bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded border border-gray-300 font-medium transition-colors"
              >
                Sign up now
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">Shop categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Electronics', 'Clothing', 'Home & Garden', 'Sports'].map((category) => (
                  <Link
                    key={category}
                    to={`/products?category=${category}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear cart
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-32 h-32">
                        <img
                          src={item.image || '/placeholder-product.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <Link
                              to={`/products/${item.productId}`}
                              className="text-lg font-medium text-blue-600 hover:text-blue-800 line-clamp-2"
                            >
                              {item.name}
                            </Link>

                            <div className="mt-2 space-y-1">
                              <div className="text-green-600 text-sm font-medium">
                                In Stock
                              </div>

                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <FiTruck className="w-4 h-4" />
                                  <span>FREE Shipping</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <FiShield className="w-4 h-4" />
                                  <span>Secure transaction</span>
                                </div>
                              </div>
                            </div>

                            {/* Quantity and Actions */}
                            <div className="mt-4 flex items-center space-x-4">
                              <div className="flex items-center border border-gray-300 rounded">
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 hover:bg-gray-100"
                                  disabled={item.quantity <= 1}
                                >
                                  <FiMinus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 border-l border-r border-gray-300">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 hover:bg-gray-100"
                                >
                                  <FiPlus className="w-4 h-4" />
                                </button>
                              </div>

                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                              >
                                <FiTrash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>

                              <button className="text-sm text-blue-600 hover:text-blue-800">
                                Save for later
                              </button>

                              <button className="text-sm text-blue-600 hover:text-blue-800">
                                Compare with similar items
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {formatPrice(item.price)}
                            </div>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <div className="text-sm text-gray-500 line-through">
                                {formatPrice(item.originalPrice)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Products */}
            <div className="bg-white rounded-lg mt-6 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Customers who bought items in your cart also bought
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* This would be populated with actual recommended products */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border border-gray-200 rounded p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-200 rounded mb-2"></div>
                    <div className="text-sm text-blue-600 hover:text-blue-800 line-clamp-2">
                      Recommended Product {i}
                    </div>
                    <div className="text-sm font-bold text-gray-900 mt-1">
                      $29.99
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-6 sticky top-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <FiTruck className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Your order qualifies for FREE Shipping
                  </span>
                </div>

                <div className="text-lg">
                  <span className="text-gray-600">Subtotal ({totalItems} items): </span>
                  <span className="font-bold text-gray-900">{formatPrice(totalPrice)}</span>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">This order contains a gift</span>
                  </label>
                </div>

                <Link
                  to="/checkout"
                  className="block w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 px-4 rounded font-medium text-center transition-colors"
                >
                  Proceed to checkout
                </Link>

                <div className="text-xs text-gray-600 space-y-1">
                  <div>The price and availability of items at Nomotix.com are subject to change.</div>
                  <div>The Cart is a temporary place to store a list of your items and reflects each item's most recent price.</div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-white rounded-lg p-6 mt-6">
              <div className="flex items-start space-x-3">
                <FiShield className="w-5 h-5 text-gray-600 mt-1" />
                <div>
                  <h4 className="font-medium text-gray-900">Secure Shopping</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Your payment information is processed securely. We do not store credit card details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
