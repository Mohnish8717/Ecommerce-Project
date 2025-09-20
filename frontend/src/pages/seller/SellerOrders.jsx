import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiClock,
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit,
  FiDownload
} from 'react-icons/fi'
import { getOrders, updateOrderStatus } from '../../store/slices/orderSlice'
import { toast } from 'react-hot-toast'

const SellerOrders = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { orders, isLoading } = useSelector(state => state.order)
  
  const [sellerOrders, setSellerOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    dispatch(getOrders())
  }, [dispatch])

  useEffect(() => {
    if (orders && user) {
      // Filter orders that contain products from this seller
      let filteredOrders = orders.filter(order => 
        order.items?.some(item => 
          item.product?.seller === user._id || 
          item.product?.seller?._id === user._id
        )
      )

      // Apply search filter
      if (searchTerm) {
        filteredOrders = filteredOrders.filter(order =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter)
      }

      // Apply date filter
      if (dateFilter !== 'all') {
        const now = new Date()
        const filterDate = new Date()
        
        switch (dateFilter) {
          case 'today':
            filterDate.setHours(0, 0, 0, 0)
            break
          case 'week':
            filterDate.setDate(now.getDate() - 7)
            break
          case 'month':
            filterDate.setMonth(now.getMonth() - 1)
            break
          default:
            break
        }
        
        if (dateFilter !== 'all') {
          filteredOrders = filteredOrders.filter(order => 
            new Date(order.createdAt) >= filterDate
          )
        }
      }

      // Sort by newest first
      filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      setSellerOrders(filteredOrders)
    }
  }, [orders, user, searchTerm, statusFilter, dateFilter])

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap()
      toast.success('Order status updated successfully')
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="w-4 h-4" />
      case 'processing': return <FiPackage className="w-4 h-4" />
      case 'shipped': return <FiTruck className="w-4 h-4" />
      case 'delivered': return <FiCheckCircle className="w-4 h-4" />
      default: return <FiPackage className="w-4 h-4" />
    }
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="text-gray-600">Manage your customer orders</p>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2">
              <FiDownload className="w-4 h-4" />
              <span>Export Orders</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              {sellerOrders.length} order{sellerOrders.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Orders List */}
        {sellerOrders.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sellerOrders.map((order) => {
                    // Filter items to show only seller's products
                    const sellerItems = order.items?.filter(item => 
                      item.product?.seller === user._id || 
                      item.product?.seller?._id === user._id
                    ) || []

                    const sellerTotal = sellerItems.reduce((sum, item) => 
                      sum + (item.price * item.quantity), 0
                    )

                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #{order._id.slice(-8)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.paymentMethod}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {order.user?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.user?.email || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {sellerItems.length} item{sellerItems.length !== 1 ? 's' : ''}
                          </div>
                          <div className="text-sm text-gray-500">
                            {sellerItems.map(item => item.product?.name).join(', ').substring(0, 50)}
                            {sellerItems.map(item => item.product?.name).join(', ').length > 50 ? '...' : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(sellerTotal)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.status}</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-orange-600 hover:text-orange-900"
                              title="View Details"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            
                            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                              >
                                {statusOptions.map(option => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'You haven\'t received any orders yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerOrders
