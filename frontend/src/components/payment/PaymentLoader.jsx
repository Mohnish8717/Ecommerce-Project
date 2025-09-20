import { motion } from 'framer-motion'
import { FiCreditCard, FiLock, FiCheck } from 'react-icons/fi'

const PaymentLoader = ({ 
  stage = 'processing', 
  message = 'Processing payment...', 
  showSteps = true 
}) => {
  const stages = {
    'preparing': {
      icon: FiCreditCard,
      title: 'Preparing Payment',
      description: 'Setting up secure payment...',
      color: 'blue'
    },
    'processing': {
      icon: FiLock,
      title: 'Processing Payment',
      description: 'Securely processing your payment...',
      color: 'yellow'
    },
    'confirming': {
      icon: FiCheck,
      title: 'Confirming Payment',
      description: 'Confirming payment details...',
      color: 'green'
    },
    'complete': {
      icon: FiCheck,
      title: 'Payment Complete',
      description: 'Payment processed successfully!',
      color: 'green'
    }
  }

  const currentStage = stages[stage] || stages.processing
  const IconComponent = currentStage.icon

  const steps = [
    { id: 'preparing', label: 'Prepare' },
    { id: 'processing', label: 'Process' },
    { id: 'confirming', label: 'Confirm' },
    { id: 'complete', label: 'Complete' }
  ]

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === stage)
  }

  const getStepStatus = (stepIndex) => {
    const currentIndex = getCurrentStepIndex()
    if (stepIndex < currentIndex) return 'complete'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      {/* Main Loading Animation */}
      <div className="relative mb-8">
        {/* Outer Ring */}
        <motion.div
          className={`w-24 h-24 rounded-full border-4 border-gray-200`}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner Ring */}
        <motion.div
          className={`absolute inset-2 w-20 h-20 rounded-full border-4 border-t-transparent ${
            currentStage.color === 'blue' ? 'border-blue-500' :
            currentStage.color === 'yellow' ? 'border-yellow-500' :
            'border-green-500'
          }`}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center Icon */}
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              currentStage.color === 'blue' ? 'bg-blue-100' :
              currentStage.color === 'yellow' ? 'bg-yellow-100' :
              'bg-green-100'
            }`}
          >
            <IconComponent className={`w-6 h-6 ${
              currentStage.color === 'blue' ? 'text-blue-600' :
              currentStage.color === 'yellow' ? 'text-yellow-600' :
              'text-green-600'
            }`} />
          </motion.div>
        </div>
      </div>

      {/* Status Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {currentStage.title}
        </h3>
        <p className="text-gray-600">
          {message || currentStage.description}
        </p>
      </motion.div>

      {/* Progress Steps */}
      {showSteps && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(index)
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  {/* Step Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
                      status === 'complete' 
                        ? 'bg-green-500 text-white' 
                        : status === 'active'
                        ? currentStage.color === 'blue' ? 'bg-blue-500 text-white' :
                          currentStage.color === 'yellow' ? 'bg-yellow-500 text-white' :
                          'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {status === 'complete' ? (
                      <FiCheck className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                  
                  {/* Step Label */}
                  <span className={`text-xs mt-2 transition-colors duration-300 ${
                    status === 'active' ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                  
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-4 left-1/2 transform -translate-y-1/2 translate-x-4 w-16 h-0.5 bg-gray-200">
                      <motion.div
                        className={`h-full transition-colors duration-500 ${
                          status === 'complete' ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        initial={{ width: '0%' }}
                        animate={{ width: status === 'complete' ? '100%' : '0%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8 text-center"
      >
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <FiLock className="w-4 h-4" />
          <span>Secured by 256-bit SSL encryption</span>
        </div>
      </motion.div>

      {/* Animated Dots */}
      {stage === 'processing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex space-x-1 mt-4"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-gray-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default PaymentLoader
