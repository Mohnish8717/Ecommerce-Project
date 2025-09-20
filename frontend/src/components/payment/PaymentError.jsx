import { motion } from 'framer-motion'
import { FiAlertCircle, FiRefreshCw, FiArrowLeft, FiHelpCircle, FiCreditCard } from 'react-icons/fi'

const PaymentError = ({ 
  error, 
  onRetry, 
  onBack, 
  onContactSupport,
  showRetry = true,
  showBack = true 
}) => {
  const getErrorDetails = (error) => {
    const errorMap = {
      'card_declined': {
        title: 'Card Declined',
        description: 'Your card was declined. Please try a different payment method or contact your bank.',
        icon: FiCreditCard,
        color: 'red',
        suggestions: [
          'Check that your card details are correct',
          'Ensure you have sufficient funds',
          'Try a different card',
          'Contact your bank'
        ]
      },
      'insufficient_funds': {
        title: 'Insufficient Funds',
        description: 'Your card does not have sufficient funds for this transaction.',
        icon: FiCreditCard,
        color: 'orange',
        suggestions: [
          'Check your account balance',
          'Try a different payment method',
          'Add funds to your account'
        ]
      },
      'expired_card': {
        title: 'Card Expired',
        description: 'The card you are trying to use has expired.',
        icon: FiCreditCard,
        color: 'orange',
        suggestions: [
          'Check the expiration date on your card',
          'Use a different card',
          'Contact your bank for a replacement'
        ]
      },
      'incorrect_cvc': {
        title: 'Incorrect Security Code',
        description: 'The security code (CVC) you entered is incorrect.',
        icon: FiCreditCard,
        color: 'orange',
        suggestions: [
          'Check the 3-digit code on the back of your card',
          'For Amex, use the 4-digit code on the front',
          'Make sure you entered it correctly'
        ]
      },
      'processing_error': {
        title: 'Processing Error',
        description: 'There was an error processing your payment. Please try again.',
        icon: FiAlertCircle,
        color: 'red',
        suggestions: [
          'Try again in a few moments',
          'Check your internet connection',
          'Use a different payment method'
        ]
      },
      'authentication_required': {
        title: 'Authentication Required',
        description: 'Your bank requires additional authentication for this payment.',
        icon: FiAlertCircle,
        color: 'blue',
        suggestions: [
          'Complete the authentication with your bank',
          'Check for SMS or app notifications',
          'Try again after authentication'
        ]
      },
      'network_error': {
        title: 'Connection Error',
        description: 'Unable to connect to payment services. Please check your connection.',
        icon: FiAlertCircle,
        color: 'gray',
        suggestions: [
          'Check your internet connection',
          'Try refreshing the page',
          'Wait a moment and try again'
        ]
      }
    }

    return errorMap[error?.code] || errorMap[error?.type] || {
      title: 'Payment Failed',
      description: error?.message || 'An unexpected error occurred while processing your payment.',
      icon: FiAlertCircle,
      color: 'red',
      suggestions: [
        'Try again in a few moments',
        'Use a different payment method',
        'Contact support if the problem persists'
      ]
    }
  }

  const errorDetails = getErrorDetails(error)
  const IconComponent = errorDetails.icon

  const getColorClasses = (color) => {
    const colors = {
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-600',
        title: 'text-red-900',
        text: 'text-red-700',
        button: 'bg-red-600 hover:bg-red-700'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        title: 'text-orange-900',
        text: 'text-orange-700',
        button: 'bg-orange-600 hover:bg-orange-700'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        title: 'text-blue-900',
        text: 'text-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      gray: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: 'text-gray-600',
        title: 'text-gray-900',
        text: 'text-gray-700',
        button: 'bg-gray-600 hover:bg-gray-700'
      }
    }
    return colors[color] || colors.red
  }

  const colorClasses = getColorClasses(errorDetails.color)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto"
    >
      {/* Error Card */}
      <div className={`rounded-lg border p-6 ${colorClasses.bg} ${colorClasses.border}`}>
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex justify-center mb-4"
        >
          <div className={`w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm`}>
            <IconComponent className={`w-8 h-8 ${colorClasses.icon}`} />
          </div>
        </motion.div>

        {/* Error Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-center mb-6"
        >
          <h3 className={`text-xl font-semibold mb-2 ${colorClasses.title}`}>
            {errorDetails.title}
          </h3>
          <p className={`${colorClasses.text}`}>
            {errorDetails.description}
          </p>
        </motion.div>

        {/* Suggestions */}
        {errorDetails.suggestions && errorDetails.suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mb-6"
          >
            <h4 className={`text-sm font-medium mb-3 ${colorClasses.title}`}>
              What you can try:
            </h4>
            <ul className="space-y-2">
              {errorDetails.suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                  className={`text-sm flex items-start space-x-2 ${colorClasses.text}`}
                >
                  <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0" />
                  <span>{suggestion}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="space-y-3"
        >
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className={`w-full flex items-center justify-center px-4 py-3 rounded-md text-white font-medium transition-colors ${colorClasses.button}`}
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          )}

          <div className="flex space-x-3">
            {showBack && onBack && (
              <button
                onClick={onBack}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
              >
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </button>
            )}

            {onContactSupport && (
              <button
                onClick={onContactSupport}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors"
              >
                <FiHelpCircle className="w-4 h-4 mr-2" />
                Get Help
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Additional Help */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-600">
          Need help? Contact our support team at{' '}
          <a 
            href="mailto:support@nomotix.com" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            support@nomotix.com
          </a>
        </p>
      </motion.div>
    </motion.div>
  )
}

export default PaymentError
