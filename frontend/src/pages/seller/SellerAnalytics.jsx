import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  FiTrendingUp, 
  FiTrendingDown,
  FiDollarSign,
  FiShoppingCart,
  FiPackage,
  FiStar,
  FiUsers,
  FiCalendar
} from 'react-icons/fi'
import { getProducts } from '../../store/slices/productSlice'
import { getOrders } from '../../store/slices/orderSlice'

const SellerAnalytics = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { products } = useSelector(state => state.product)
  const { orders } = useSelector(state => state.order)
  
  const [timeRange, setTimeRange] = useState('30')
  const [analytics, setAnalytics] = useState({
    revenue: {
      current: 0,
      previous: 0,
      change: 0
    },
    orders: {
      current: 0,
      previous: 0,
      change: 0
    },
    products: {
      total: 0,
      active: 0,
      outOfStock: 0
    },
    topProducts: [],
    recentSales: [],
    customerStats: {
      totalCustomers: 0,
      returningCustomers: 0
    }
  })

  useEffect(() => {
    dispatch(getProducts())
    dispatch(getOrders())
  }, [dispatch])

  useEffect(() => {
    if (products && orders && user) {
      calculateAnalytics()
    }
  }, [products, orders, user, timeRange])

  const calculateAnalytics = () => {
    // Filter seller's products
    const sellerProducts = products.filter(product => 
      product.seller === user._id || product.seller?._id === user._id
    )

    // Filter seller's orders
    const sellerOrders = orders.filter(order => 
      order.items?.some(item => 
        item.product?.seller === user._id || 
        item.product?.seller?._id === user._id
      )
    )

    // Calculate date ranges
    const now = new Date()
    const currentPeriodStart = new Date()
    const previousPeriodStart = new Date()
    const previousPeriodEnd = new Date()

    currentPeriodStart.setDate(now.getDate() - parseInt(timeRange))
    previousPeriodEnd.setDate(now.getDate() - parseInt(timeRange))
    previousPeriodStart.setDate(now.getDate() - (parseInt(timeRange) * 2))

    // Filter orders by time periods
    const currentPeriodOrders = sellerOrders.filter(order => 
      new Date(order.createdAt) >= currentPeriodStart
    )
    const previousPeriodOrders = sellerOrders.filter(order => 
      new Date(order.createdAt) >= previousPeriodStart && 
      new Date(order.createdAt) < previousPeriodEnd
    )

    // Calculate revenue
    const currentRevenue = currentPeriodOrders.reduce((sum, order) => {
      const sellerItems = order.items?.filter(item => 
        item.product?.seller === user._id || item.product?.seller?._id === user._id
      ) || []
      return sum + sellerItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0)
    }, 0)

    const previousRevenue = previousPeriodOrders.reduce((sum, order) => {
      const sellerItems = order.items?.filter(item => 
        item.product?.seller === user._id || item.product?.seller?._id === user._id
      ) || []
      return sum + sellerItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0)
    }, 0)

    const revenueChange = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0

    // Calculate orders
    const currentOrderCount = currentPeriodOrders.length
    const previousOrderCount = previousPeriodOrders.length
    const orderChange = previousOrderCount > 0 
      ? ((currentOrderCount - previousOrderCount) / previousOrderCount) * 100 
      : 0

    // Product stats
    const activeProducts = sellerProducts.filter(product => product.stock > 0).length
    const outOfStockProducts = sellerProducts.filter(product => product.stock === 0).length

    // Top products (mock data for now)
    const topProducts = sellerProducts
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5)
      .map(product => ({
        ...product,
        sales: Math.floor(Math.random() * 100) + 10,
        revenue: product.price * (Math.floor(Math.random() * 100) + 10)
      }))

    // Recent sales (mock data)
    const recentSales = currentPeriodOrders.slice(0, 5).map(order => ({
      id: order._id,
      customer: order.user?.name || 'Anonymous',
      amount: order.totalAmount,
      date: order.createdAt,
      status: order.status
    }))

    // Customer stats
    const uniqueCustomers = new Set(sellerOrders.map(order => order.user?._id)).size
    const returningCustomers = Math.floor(uniqueCustomers * 0.3) // Mock calculation

    setAnalytics({
      revenue: {
        current: currentRevenue,
        previous: previousRevenue,
        change: revenueChange
      },
      orders: {
        current: currentOrderCount,
        previous: previousOrderCount,
        change: orderChange
      },
      products: {
        total: sellerProducts.length,
        active: activeProducts,
        outOfStock: outOfStockProducts
      },
      topProducts,
      recentSales,
      customerStats: {
        totalCustomers: uniqueCustomers,
        returningCustomers
      }
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600">Track your store performance</p>
            </div>
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.revenue.current)}
                </p>
                <div className="flex items-center mt-2">
                  {analytics.revenue.change >= 0 ? (
                    <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    analytics.revenue.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(analytics.revenue.change)}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.orders.current}
                </p>
                <div className="flex items-center mt-2">
                  {analytics.orders.change >= 0 ? (
                    <FiTrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <FiTrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${
                    analytics.orders.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(analytics.orders.change)}
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.products.total}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {analytics.products.active} active, {analytics.products.outOfStock} out of stock
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiPackage className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Customers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.customerStats.totalCustomers}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {analytics.customerStats.returningCustomers} returning
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Top Products</h2>
            </div>
            <div className="p-6">
              {analytics.topProducts.length > 0 ? (
                <div className="space-y-4">
                  {analytics.topProducts.map((product, index) => (
                    <div key={product._id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {index + 1}
                        </span>
                      </div>
                      <img
                        src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{product.sales} sales</span>
                          <span>{formatCurrency(product.revenue)}</span>
                          <div className="flex items-center">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span>{product.rating?.toFixed(1) || '0.0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No product data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Sales */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Sales</h2>
            </div>
            <div className="p-6">
              {analytics.recentSales.length > 0 ? (
                <div className="space-y-4">
                  {analytics.recentSales.map((sale) => (
                    <div key={sale.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {sale.customer}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(sale.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(sale.amount)}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          sale.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          sale.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sale.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No recent sales</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerAnalytics
