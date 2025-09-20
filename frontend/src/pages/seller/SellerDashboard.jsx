import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  FiPackage,
  FiDollarSign,
  FiShoppingCart,
  FiTrendingUp,
  FiPlus,
  FiEye,
  FiEdit,
  FiBarChart2,
  FiUsers,
  FiStar
} from 'react-icons/fi'
import { getProducts } from '../../store/slices/productSlice'
import { formatPrice } from '../../utils/currency'

const SellerDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { products, isLoading } = useSelector(state => state.product)

  const [timeRange, setTimeRange] = useState('30')
  const [sellerProducts, setSellerProducts] = useState([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    averageRating: 0
  })

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  useEffect(() => {
    if (products && user) {
      // Filter products by seller
      const userProducts = products.filter(product =>
        product.seller === user._id || product.seller?._id === user._id
      )
      setSellerProducts(userProducts)

      // Calculate stats
      const totalProducts = userProducts.length
      const totalRevenue = userProducts.reduce((sum, product) => {
        return sum + (product.price * (product.sold || 0))
      }, 0)
      const totalOrders = userProducts.reduce((sum, product) => sum + (product.sold || 0), 0)
      const averageRating = userProducts.length > 0
        ? userProducts.reduce((sum, product) => sum + (product.rating || 0), 0) / userProducts.length
        : 0

      setStats({
        totalRevenue,
        totalOrders,
        totalProducts,
        averageRating
      })
    }
  }, [products, user])

  // Using imported formatPrice function for Indian Rupees

  const recentOrders = [
    { id: '12345678', date: new Date(), amount: 2499, status: 'delivered' },
    { id: '12345679', date: new Date(), amount: 1299, status: 'shipped' },
    { id: '12345680', date: new Date(), amount: 799, status: 'processing' },
    { id: '12345681', date: new Date(), amount: 1699, status: 'pending' },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading seller dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <Link
                to="/seller/products/new"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Product</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(stats.totalRevenue)}
                </p>
                <p className="text-xs text-green-600 mt-1">+12% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders}
                </p>
                <p className="text-xs text-blue-600 mt-1">+8% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiPackage className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProducts}
                </p>
                <p className="text-xs text-purple-600 mt-1">Active listings</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiStar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageRating.toFixed(1)}
                </p>
                <p className="text-xs text-orange-600 mt-1">Customer satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
                <Link
                  to="/seller/orders"
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <FiShoppingCart className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">#{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {order.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatPrice(order.amount)}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Your Products</h2>
                <Link
                  to="/seller/products"
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  Manage all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {sellerProducts && sellerProducts.length > 0 ? (
                <div className="space-y-4">
                  {sellerProducts.slice(0, 5).map((product) => (
                    <div key={product._id} className="flex items-center space-x-4">
                      <img
                        src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {formatPrice(product.price)}
                          </span>
                          <div className="flex items-center">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {product.rating?.toFixed(1) || '0.0'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/seller/products/${product._id}/edit`}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/products/${product._id}`}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <FiEye className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No products yet</p>
                  <Link
                    to="/seller/products/new"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Add Your First Product
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/seller/products/new"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiPlus className="w-8 h-8 text-orange-500 mr-4" />
              <div>
                <p className="font-medium text-gray-900">Add New Product</p>
                <p className="text-sm text-gray-600">Create a new product listing</p>
              </div>
            </Link>

            <Link
              to="/seller/analytics"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiBarChart2 className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <p className="font-medium text-gray-900">View Analytics</p>
                <p className="text-sm text-gray-600">Track your performance</p>
              </div>
            </Link>

            <Link
              to="/seller/profile"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiUsers className="w-8 h-8 text-green-500 mr-4" />
              <div>
                <p className="font-medium text-gray-900">Seller Profile</p>
                <p className="text-sm text-gray-600">Manage your store info</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard
