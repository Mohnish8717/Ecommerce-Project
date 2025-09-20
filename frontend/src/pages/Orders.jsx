import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPackage, FiTruck, FiCheck, FiClock, FiX, FiEye, FiDownload,
  FiRefreshCw, FiFilter, FiSearch, FiCalendar, FiDollarSign,
  FiShoppingBag, FiAlertCircle, FiCreditCard, FiMapPin, FiStar
} from 'react-icons/fi'
import { toast } from 'react-hot-toast'

const Orders = () => {
  const { user } = useSelector((state) => state.auth)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  // Mock orders data with various statuses
  const mockOrders = [
    {
      _id: '1',
      orderNumber: 'ORD-2024-001',
      orderStatus: 'pending_payment',
      paymentStatus: 'pending',
      totalPrice: 299.99,
      createdAt: new Date('2024-01-25T10:30:00'),
      estimatedDelivery: new Date('2024-01-30T18:00:00'),
      shippingAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      orderItems: [
        {
          _id: '1',
          quantity: 1,
          price: 199.99,
          product: {
            _id: 'p1',
            name: 'Wireless Bluetooth Headphones',
            image: '/api/placeholder/100/100',
            brand: 'TechSound'
          }
        },
        {
          _id: '2',
          quantity: 2,
          price: 50.00,
          product: {
            _id: 'p2',
            name: 'Phone Case',
            image: '/api/placeholder/100/100',
            brand: 'ProtectPro'
          }
        }
      ]
    },
    {
      _id: '2',
      orderNumber: 'ORD-2024-002',
      orderStatus: 'confirmed',
      paymentStatus: 'completed',
      totalPrice: 89.99,
      createdAt: new Date('2024-01-20T14:15:00'),
      estimatedDelivery: new Date('2024-01-28T18:00:00'),
      shippingAddress: {
        street: '456 Oak Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210'
      },
      orderItems: [
        {
          _id: '3',
          quantity: 1,
          price: 89.99,
          product: {
            _id: 'p3',
            name: 'Smart Watch',
            image: '/api/placeholder/100/100',
            brand: 'FitTech'
          }
        }
      ]
    },
    {
      _id: '3',
      orderNumber: 'ORD-2024-003',
      orderStatus: 'processing',
      paymentStatus: 'completed',
      totalPrice: 159.99,
      createdAt: new Date('2024-01-18T09:45:00'),
      estimatedDelivery: new Date('2024-01-26T18:00:00'),
      trackingNumber: 'TRK123456789',
      shippingAddress: {
        street: '789 Pine Road',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601'
      },
      orderItems: [
        {
          _id: '4',
          quantity: 1,
          price: 159.99,
          product: {
            _id: 'p4',
            name: 'Bluetooth Speaker',
            image: '/api/placeholder/100/100',
            brand: 'SoundWave'
          }
        }
      ]
    },
    {
      _id: '4',
      orderNumber: 'ORD-2024-004',
      orderStatus: 'shipped',
      paymentStatus: 'completed',
      totalPrice: 249.99,
      createdAt: new Date('2024-01-15T16:20:00'),
      shippedAt: new Date('2024-01-17T10:00:00'),
      estimatedDelivery: new Date('2024-01-25T18:00:00'),
      trackingNumber: 'TRK987654321',
      shippingAddress: {
        street: '321 Elm Street',
        city: 'Miami',
        state: 'FL',
        zipCode: '33101'
      },
      orderItems: [
        {
          _id: '5',
          quantity: 1,
          price: 249.99,
          product: {
            _id: 'p5',
            name: 'Gaming Mouse',
            image: '/api/placeholder/100/100',
            brand: 'GamePro'
          }
        }
      ]
    },
    {
      _id: '5',
      orderNumber: 'ORD-2024-005',
      orderStatus: 'delivered',
      paymentStatus: 'completed',
      totalPrice: 399.99,
      createdAt: new Date('2024-01-10T11:30:00'),
      shippedAt: new Date('2024-01-12T09:00:00'),
      deliveredAt: new Date('2024-01-15T14:30:00'),
      trackingNumber: 'TRK456789123',
      shippingAddress: {
        street: '654 Maple Drive',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101'
      },
      orderItems: [
        {
          _id: '6',
          quantity: 1,
          price: 399.99,
          product: {
            _id: 'p6',
            name: 'Mechanical Keyboard',
            image: '/api/placeholder/100/100',
            brand: 'TypeMaster'
          }
        }
      ]
    },
    {
      _id: '6',
      orderNumber: 'ORD-2024-006',
      orderStatus: 'cancelled',
      paymentStatus: 'refunded',
      totalPrice: 129.99,
      createdAt: new Date('2024-01-08T13:45:00'),
      cancelledAt: new Date('2024-01-09T10:15:00'),
      cancelReason: 'Customer requested cancellation',
      shippingAddress: {
        street: '987 Cedar Lane',
        city: 'Boston',
        state: 'MA',
        zipCode: '02101'
      },
      orderItems: [
        {
          _id: '7',
          quantity: 1,
          price: 129.99,
          product: {
            _id: 'p7',
            name: 'Webcam HD',
            image: '/api/placeholder/100/100',
            brand: 'VisionTech'
          }
        }
      ]
    }
  ]

  // Load orders on component mount
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrders(mockOrders)
      setFilteredOrders(mockOrders)
      setIsLoading(false)
    }

    loadOrders()
  }, [])

  // Filter orders based on status and search query
  useEffect(() => {
    let filtered = orders

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === selectedStatus)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderItems.some(item =>
          item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    setFilteredOrders(filtered)
  }, [orders, selectedStatus, searchQuery])

  const orderStatuses = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending_payment', label: 'Pending Payment', count: orders.filter(o => o.orderStatus === 'pending_payment').length },
    { value: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.orderStatus === 'confirmed').length },
    { value: 'processing', label: 'Processing', count: orders.filter(o => o.orderStatus === 'processing').length },
    { value: 'shipped', label: 'Shipped', count: orders.filter(o => o.orderStatus === 'shipped').length },
    { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.orderStatus === 'delivered').length },
    { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.orderStatus === 'cancelled').length }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Status Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              {orderStatuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedStatus === status.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{status.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    selectedStatus === status.value
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {status.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <FiShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || selectedStatus !== 'all' ? 'No orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedStatus !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Start shopping to see your orders here'
              }
            </p>
            {!searchQuery && selectedStatus === 'all' && (
              <button
                onClick={() => window.location.href = '/products'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  index={index}
                  onViewDetails={(order) => {
                    setSelectedOrder(order)
                    setShowOrderDetails(true)
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Order Details Modal */}
        <AnimatePresence>
          {showOrderDetails && selectedOrder && (
            <OrderDetailsModal
              order={selectedOrder}
              onClose={() => {
                setShowOrderDetails(false)
                setSelectedOrder(null)
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Order Card Component
const OrderCard = ({ order, index, onViewDetails }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending_payment':
        return <FiCreditCard className="w-5 h-5" />
      case 'confirmed':
        return <FiCheck className="w-5 h-5" />
      case 'processing':
        return <FiPackage className="w-5 h-5" />
      case 'shipped':
        return <FiTruck className="w-5 h-5" />
      case 'delivered':
        return <FiCheck className="w-5 h-5" />
      case 'cancelled':
        return <FiX className="w-5 h-5" />
      default:
        return <FiClock className="w-5 h-5" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_payment':
        return 'text-orange-600 bg-orange-100 border-orange-200'
      case 'confirmed':
        return 'text-blue-600 bg-blue-100 border-blue-200'
      case 'processing':
        return 'text-purple-600 bg-purple-100 border-purple-200'
      case 'shipped':
        return 'text-indigo-600 bg-indigo-100 border-indigo-200'
      case 'delivered':
        return 'text-green-600 bg-green-100 border-green-200'
      case 'cancelled':
        return 'text-red-600 bg-red-100 border-red-200'
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_payment':
        return 'Payment Pending'
      case 'confirmed':
        return 'Order Confirmed'
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {order.orderNumber}
            </h3>
            <p className="text-sm text-gray-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
              {getStatusIcon(order.orderStatus)}
              <span className="ml-2">{getStatusText(order.orderStatus)}</span>
            </span>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            {order.orderItems.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex-shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              </div>
            ))}
            {order.orderItems.length > 3 && (
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <span className="text-sm text-gray-600 font-medium">
                  +{order.orderItems.length - 3}
                </span>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600">
            {totalItems} item{totalItems !== 1 ? 's' : ''} • {formatCurrency(order.totalPrice)}
          </div>
        </div>

        {/* Order Actions and Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            {order.orderStatus === 'pending_payment' && (
              <button className="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                Complete Payment
              </button>
            )}

            {order.trackingNumber && (
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Track Package
              </button>
            )}

            {order.orderStatus === 'delivered' && (
              <button className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center">
                <FiStar className="w-4 h-4 mr-1" />
                Write Review
              </button>
            )}
          </div>

          <button
            onClick={() => onViewDetails(order)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            <FiEye className="w-4 h-4 mr-1" />
            View Details
          </button>
        </div>

        {/* Additional Status Info */}
        {order.orderStatus === 'shipped' && order.estimatedDelivery && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <FiTruck className="w-4 h-4 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Estimated Delivery: {formatDate(order.estimatedDelivery)}
                </p>
                {order.trackingNumber && (
                  <p className="text-xs text-blue-700">
                    Tracking: {order.trackingNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {order.orderStatus === 'cancelled' && order.cancelReason && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <FiAlertCircle className="w-4 h-4 text-red-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-red-900">Order Cancelled</p>
                <p className="text-xs text-red-700">{order.cancelReason}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Order Details Modal Component
const OrderDetailsModal = ({ order, onClose }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending_payment':
        return <FiCreditCard className="w-5 h-5" />
      case 'confirmed':
        return <FiCheck className="w-5 h-5" />
      case 'processing':
        return <FiPackage className="w-5 h-5" />
      case 'shipped':
        return <FiTruck className="w-5 h-5" />
      case 'delivered':
        return <FiCheck className="w-5 h-5" />
      case 'cancelled':
        return <FiX className="w-5 h-5" />
      default:
        return <FiClock className="w-5 h-5" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_payment':
        return 'text-orange-600 bg-orange-100'
      case 'confirmed':
        return 'text-blue-600 bg-blue-100'
      case 'processing':
        return 'text-purple-600 bg-purple-100'
      case 'shipped':
        return 'text-indigo-600 bg-indigo-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const subtotal = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 9.99
  const tax = subtotal * 0.08
  const total = order.totalPrice

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
              <p className="text-sm text-gray-600">{order.orderNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Order Status */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Order Status</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                {getStatusIcon(order.orderStatus)}
                <span className="ml-2 capitalize">{order.orderStatus.replace('_', ' ')}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order Placed</p>
                <p className="font-medium">{formatDate(order.createdAt)}</p>
              </div>
              {order.shippedAt && (
                <div>
                  <p className="text-gray-600">Shipped</p>
                  <p className="font-medium">{formatDate(order.shippedAt)}</p>
                </div>
              )}
              {order.deliveredAt && (
                <div>
                  <p className="text-gray-600">Delivered</p>
                  <p className="font-medium">{formatDate(order.deliveredAt)}</p>
                </div>
              )}
              {order.estimatedDelivery && !order.deliveredAt && (
                <div>
                  <p className="text-gray-600">Estimated Delivery</p>
                  <p className="font-medium">{formatDate(order.estimatedDelivery)}</p>
                </div>
              )}
            </div>

            {order.trackingNumber && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                    <p className="text-sm text-blue-700">{order.trackingNumber}</p>
                  </div>
                  <button className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Track Package
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">{item.product.brand}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(item.price)}</p>
                    <p className="text-sm text-gray-600">each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{order.shippingAddress.street}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">{formatCurrency(tax)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-medium text-gray-900">Total</span>
                  <span className="text-lg font-medium text-gray-900">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {order.orderStatus === 'pending_payment' && (
              <button className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                Complete Payment
              </button>
            )}

            {order.orderStatus === 'delivered' && (
              <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center">
                <FiStar className="w-4 h-4 mr-2" />
                Write Review
              </button>
            )}

            <button className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center">
              <FiDownload className="w-4 h-4 mr-2" />
              Download Invoice
            </button>

            {(order.orderStatus === 'confirmed' || order.orderStatus === 'processing') && (
              <button className="flex-1 border border-red-300 text-red-700 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors font-medium">
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Orders
