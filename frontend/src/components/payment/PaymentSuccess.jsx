import { motion } from 'framer-motion'
import { FiCheck, FiMail, FiTruck, FiStar } from 'react-icons/fi'

const PaymentSuccess = ({ 
  amount, 
  orderId, 
  estimatedDelivery,
  onContinue,
  onViewOrder 
}) => {
  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        pathLength: { duration: 0.8, ease: "easeInOut" },
        opacity: { duration: 0.3 }
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-md mx-auto text-center py-8"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.1
        }}
        className="relative mb-8"
      >
        {/* Outer Ring Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center relative"
        >
          {/* Success Checkmark SVG */}
          <svg
            className="w-12 h-12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M7 13l3 3 7-7"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={checkmarkVariants}
              initial="hidden"
              animate="visible"
            />
          </svg>

          {/* Ripple Effect */}
          <motion.div
            className="absolute inset-0 bg-green-200 rounded-full"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.div
            className="absolute inset-0 bg-green-200 rounded-full"
            initial={{ scale: 1, opacity: 0.4 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.7 }}
          />
        </motion.div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              x: Math.cos(i * 60 * Math.PI / 180) * 60,
              y: Math.sin(i * 60 * Math.PI / 180) * 60,
              opacity: [1, 0],
              scale: [1, 0]
            }}
            transition={{
              duration: 1.5,
              delay: 0.8 + i * 0.1,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>

      {/* Success Message */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </motion.div>

      {/* Order Details */}
      <motion.div 
        variants={itemVariants}
        className="bg-gray-50 rounded-lg p-6 mb-8 text-left"
      >
        <div className="space-y-3">
          {amount && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-semibold text-gray-900">
                ${amount.toFixed(2)}
              </span>
            </div>
          )}
          
          {orderId && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-sm text-gray-900">
                {orderId}
              </span>
            </div>
          )}
          
          {estimatedDelivery && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Estimated Delivery:</span>
              <span className="text-gray-900">
                {estimatedDelivery}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What happens next?
        </h3>
        
        <div className="space-y-4">
          <motion.div
            variants={itemVariants}
            className="flex items-start space-x-3 text-left"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FiMail className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Email Confirmation</h4>
              <p className="text-sm text-gray-600">
                You'll receive an order confirmation email shortly
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-start space-x-3 text-left"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <FiTruck className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Order Processing</h4>
              <p className="text-sm text-gray-600">
                We'll prepare your order and send tracking information
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-start space-x-3 text-left"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FiStar className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Delivery & Review</h4>
              <p className="text-sm text-gray-600">
                Enjoy your purchase and leave us a review!
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="space-y-3">
        {onViewOrder && (
          <button
            onClick={onViewOrder}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            View Order Details
          </button>
        )}
        
        {onContinue && (
          <button
            onClick={onContinue}
            className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        )}
      </motion.div>

      {/* Celebration Confetti Effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'][i % 4],
              left: `${Math.random() * 100}%`,
              top: '-10px'
            }}
            animate={{
              y: window.innerHeight + 100,
              rotate: 360,
              opacity: [1, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

export default PaymentSuccess
