import { useState } from 'react'
import { FiCreditCard, FiSmartphone, FiDollarSign, FiCheck, FiZap } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const PaymentMethodSelector = ({ selectedMethod, onMethodChange, availableMethods = [] }) => {
  const [hoveredMethod, setHoveredMethod] = useState(null)

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, American Express',
      icon: FiCreditCard,
      color: 'blue',
      available: true
    },
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay using UPI ID or QR Code',
      icon: FiZap,
      color: 'purple',
      available: true
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      description: 'Pay with Touch ID or Face ID',
      icon: FiSmartphone,
      color: 'gray',
      available: availableMethods.includes('apple_pay')
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      description: 'Pay with your Google account',
      icon: FiSmartphone,
      color: 'green',
      available: availableMethods.includes('google_pay')
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: FiDollarSign,
      color: 'yellow',
      available: false // Not implemented yet
    }
  ]

  const getColorClasses = (color, isSelected, isHovered) => {
    const colors = {
      blue: {
        border: isSelected ? 'border-blue-500' : isHovered ? 'border-blue-300' : 'border-gray-200',
        bg: isSelected ? 'bg-blue-50' : isHovered ? 'bg-blue-25' : 'bg-white',
        icon: isSelected ? 'text-blue-600' : 'text-blue-500',
        text: isSelected ? 'text-blue-900' : 'text-gray-900'
      },
      gray: {
        border: isSelected ? 'border-gray-500' : isHovered ? 'border-gray-300' : 'border-gray-200',
        bg: isSelected ? 'bg-gray-50' : isHovered ? 'bg-gray-25' : 'bg-white',
        icon: isSelected ? 'text-gray-600' : 'text-gray-500',
        text: isSelected ? 'text-gray-900' : 'text-gray-900'
      },
      green: {
        border: isSelected ? 'border-green-500' : isHovered ? 'border-green-300' : 'border-gray-200',
        bg: isSelected ? 'bg-green-50' : isHovered ? 'bg-green-25' : 'bg-white',
        icon: isSelected ? 'text-green-600' : 'text-green-500',
        text: isSelected ? 'text-green-900' : 'text-gray-900'
      },
      yellow: {
        border: isSelected ? 'border-yellow-500' : isHovered ? 'border-yellow-300' : 'border-gray-200',
        bg: isSelected ? 'bg-yellow-50' : isHovered ? 'bg-yellow-25' : 'bg-white',
        icon: isSelected ? 'text-yellow-600' : 'text-yellow-500',
        text: isSelected ? 'text-yellow-900' : 'text-gray-900'
      },
      purple: {
        border: isSelected ? 'border-purple-500' : isHovered ? 'border-purple-300' : 'border-gray-200',
        bg: isSelected ? 'bg-purple-50' : isHovered ? 'bg-purple-25' : 'bg-white',
        icon: isSelected ? 'text-purple-600' : 'text-purple-500',
        text: isSelected ? 'text-purple-900' : 'text-gray-900'
      }
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id
          const isHovered = hoveredMethod === method.id
          const colorClasses = getColorClasses(method.color, isSelected, isHovered)
          const IconComponent = method.icon

          return (
            <motion.div
              key={method.id}
              initial={{ opacity: 0, y: 20, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.3, delay: method.id === 'upi' ? 0.1 : 0 }}
              className={`relative cursor-pointer transition-all duration-300 transform-gpu ${
                method.available ? '' : 'opacity-50 cursor-not-allowed'
              }`}
              onMouseEnter={() => method.available && setHoveredMethod(method.id)}
              onMouseLeave={() => setHoveredMethod(null)}
              onClick={() => method.available && onMethodChange(method.id)}
              whileHover={method.available ? {
                scale: 1.02,
                rotateY: isSelected ? 0 : 2,
                rotateX: 1,
                z: 20
              } : {}}
              whileTap={method.available ? { scale: 0.98 } : {}}
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className={`
                relative border-2 rounded-xl p-6 transition-all duration-300 overflow-hidden
                ${colorClasses.border} ${colorClasses.bg}
                ${method.available ? (isSelected ? 'shadow-2xl shadow-purple-200/40' : 'hover:shadow-xl hover:shadow-gray-200/40') : ''}
              `}>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300
                        ${isSelected
                          ? `bg-gradient-to-br ${method.color === 'purple' ? 'from-purple-500 to-purple-600' : 'from-blue-500 to-blue-600'} shadow-lg shadow-${method.color}-500/30`
                          : 'bg-gray-100 group-hover:bg-gray-200'
                        }
                      `}
                      whileHover={{ scale: 1.1, rotateZ: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <IconComponent className={`w-6 h-6 ${
                        isSelected ? 'text-white' : colorClasses.icon
                      }`} />
                    </motion.div>

                    <div>
                      <h4 className={`text-lg font-semibold ${colorClasses.text}`}>
                        {method.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {method.description}
                      </p>
                      {method.id === 'upi' && (
                        <div className="flex items-center mt-1">
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                            ⚡ Instant
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!method.available && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    )}
                    
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className={`
                            w-6 h-6 rounded-full flex items-center justify-center
                            ${method.color === 'blue' ? 'bg-blue-600' :
                              method.color === 'green' ? 'bg-green-600' :
                              method.color === 'yellow' ? 'bg-yellow-600' :
                              method.color === 'purple' ? 'bg-purple-600' : 'bg-gray-600'}
                          `}
                        >
                          <FiCheck className="w-3 h-3 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Gradient overlay for selected state */}
                {isSelected && (
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${
                    method.color === 'purple' ? 'from-purple-400/10 to-purple-600/20' : 'from-blue-400/10 to-blue-600/20'
                  }`}></div>
                )}

                {/* Shine effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

                {/* Selection indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      className={`
                        absolute bottom-0 left-0 right-0 h-1 rounded-b-xl
                        ${method.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          method.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          method.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                          method.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'}
                      `}
                      style={{ originX: 0 }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-800">Secure Payment</h4>
            <p className="text-sm text-green-700 mt-1">
              Your payment information is encrypted and processed securely. We never store your card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethodSelector
