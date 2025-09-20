import { motion } from 'framer-motion'

const AnimatedLoader = ({ size = 'md', text = 'Loading...', variant = 'spinner' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const SpinnerLoader = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`border-4 border-gray-200 border-t-orange-500 rounded-full ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {text && (
        <motion.p
          className="text-gray-600 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )

  const DotsLoader = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-orange-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      {text && (
        <motion.p
          className="text-gray-600 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )

  const PulseLoader = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className={`bg-orange-500 rounded-full ${sizeClasses[size]}`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {text && (
        <motion.p
          className="text-gray-600 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )

  const WaveLoader = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex space-x-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className="w-2 h-8 bg-orange-500 rounded-full"
            animate={{
              scaleY: [1, 2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      {text && (
        <motion.p
          className="text-gray-600 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  )

  const NomotixLoader = () => (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className="w-16 h-16 border-4 border-gray-200 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Inner ring */}
        <motion.div
          className="absolute inset-2 border-4 border-orange-500 border-t-transparent rounded-full"
          animate={{ rotate: -360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Center logo */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <span className="text-orange-500 font-bold text-lg">N</span>
        </motion.div>
      </div>
      
      {text && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-600 text-sm font-medium">{text}</p>
          <motion.div
            className="flex justify-center mt-2"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full" />
          </motion.div>
        </motion.div>
      )}
    </div>
  )

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader />
      case 'pulse':
        return <PulseLoader />
      case 'wave':
        return <WaveLoader />
      case 'nomotix':
        return <NomotixLoader />
      default:
        return <SpinnerLoader />
    }
  }

  return (
    <motion.div
      className="flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {renderLoader()}
    </motion.div>
  )
}

export default AnimatedLoader
