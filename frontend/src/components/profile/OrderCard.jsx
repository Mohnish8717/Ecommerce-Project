import { motion } from 'framer-motion'
import { FiPackage, FiTruck, FiCheck, FiClock, FiEye } from 'react-icons/fi'

const OrderCard = ({ order, onViewDetails }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-4 h-4" />
      case 'processing':
        return <FiPackage className="w-4 h-4" />
      case 'shipped':
        return <FiTruck className="w-4 h-4" />
      case 'delivered':
        return <FiCheck className="w-4 h-4" />
      default:
        return <FiClock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      case 'shipped':
        return 'text-purple-600 bg-purple-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order #{order._id?.slice(-8) || 'N/A'}
          </h3>
          <p className="text-sm text-gray-600">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
            {getStatusIcon(order.orderStatus)}
            <span className="ml-1 capitalize">{order.orderStatus}</span>
          </span>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="mb-4">
        <div className="flex items-center space-x-3">
          {order.orderItems?.slice(0, 3).map((item, index) => (
            <div key={index} className="flex-shrink-0">
              <img
                src={item.product?.image || '/placeholder-image.jpg'}
                alt={item.product?.name || 'Product'}
                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
              />
            </div>
          ))}
          {order.orderItems?.length > 3 && (
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-600 font-medium">
                +{order.orderItems.length - 3}
              </span>
            </div>
          )}
        </div>
        
        <div className="mt-3">
          <p className="text-sm text-gray-600">
            {order.orderItems?.length || 0} item{(order.orderItems?.length || 0) !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div>
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(order.totalPrice || 0)}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {order.orderStatus === 'delivered' && (
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Write Review
            </button>
          )}
          
          {order.orderStatus === 'shipped' && order.trackingNumber && (
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Track Package
            </button>
          )}
          
          <button
            onClick={() => onViewDetails(order)}
            className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FiEye className="w-4 h-4 mr-1" />
            View Details
          </button>
        </div>
      </div>

      {/* Delivery Information */}
      {order.orderStatus === 'shipped' && order.estimatedDelivery && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <FiTruck className="w-4 h-4 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Estimated Delivery
              </p>
              <p className="text-sm text-blue-700">
                {formatDate(order.estimatedDelivery)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Confirmation */}
      {order.orderStatus === 'delivered' && order.deliveredAt && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <FiCheck className="w-4 h-4 text-green-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-900">
                Delivered
              </p>
              <p className="text-sm text-green-700">
                {formatDate(order.deliveredAt)}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default OrderCard
