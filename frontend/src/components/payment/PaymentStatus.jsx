import { FiCheckCircle, FiXCircle, FiClock, FiAlertCircle } from 'react-icons/fi'

const PaymentStatus = ({ status, message, amount, paymentMethod }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'succeeded':
        return {
          icon: FiCheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully.'
        }
      case 'processing':
        return {
          icon: FiClock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'Payment Processing',
          description: 'Your payment is being processed. Please wait...'
        }
      case 'requires_payment_method':
        return {
          icon: FiAlertCircle,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Payment Method Required',
          description: 'Please provide a valid payment method to continue.'
        }
      case 'requires_confirmation':
        return {
          icon: FiAlertCircle,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Confirmation Required',
          description: 'Please confirm your payment to complete the transaction.'
        }
      case 'requires_action':
        return {
          icon: FiAlertCircle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'Action Required',
          description: 'Additional authentication is required to complete your payment.'
        }
      case 'canceled':
        return {
          icon: FiXCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          title: 'Payment Canceled',
          description: 'The payment has been canceled.'
        }
      case 'failed':
      default:
        return {
          icon: FiXCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Payment Failed',
          description: 'There was an issue processing your payment. Please try again.'
        }
    }
  }

  const config = getStatusConfig(status)
  const StatusIcon = config.icon

  return (
    <div className={`rounded-lg border p-6 ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 ${config.color}`}>
          <StatusIcon className="w-8 h-8" />
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${config.color}`}>
            {config.title}
          </h3>
          
          <p className="mt-1 text-sm text-gray-600">
            {message || config.description}
          </p>
          
          {amount && (
            <div className="mt-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Amount:</span> ${amount.toFixed(2)}
              </p>
            </div>
          )}
          
          {paymentMethod && (
            <div className="mt-2">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Payment Method:</span>{' '}
                {paymentMethod.card ? (
                  <>
                    {paymentMethod.card.brand.charAt(0).toUpperCase() + paymentMethod.card.brand.slice(1)} 
                    •••• {paymentMethod.card.last4}
                  </>
                ) : (
                  paymentMethod.type
                )}
              </p>
            </div>
          )}
          
          {status === 'processing' && (
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                <span className="text-sm text-gray-600">Processing payment...</span>
              </div>
            </div>
          )}
          
          {status === 'failed' && (
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          )}
          
          {status === 'succeeded' && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 text-sm text-green-700">
                <FiCheckCircle className="w-4 h-4" />
                <span>Transaction completed successfully</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PaymentStatus
