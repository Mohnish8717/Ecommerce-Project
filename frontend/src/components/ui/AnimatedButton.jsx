import { motion } from 'framer-motion'
import { useState } from 'react'

const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false)

  const variants = {
    primary: {
      base: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg',
      hover: 'from-orange-600 to-orange-700 shadow-xl',
      disabled: 'from-gray-300 to-gray-400 text-gray-500'
    },
    secondary: {
      base: 'bg-white border-2 border-orange-500 text-orange-600 shadow-md',
      hover: 'bg-orange-50 border-orange-600 text-orange-700 shadow-lg',
      disabled: 'bg-gray-100 border-gray-300 text-gray-400'
    },
    outline: {
      base: 'border-2 border-gray-300 text-gray-700 bg-transparent',
      hover: 'border-orange-500 text-orange-600 bg-orange-50',
      disabled: 'border-gray-200 text-gray-400'
    },
    ghost: {
      base: 'text-gray-700 bg-transparent hover:bg-gray-100',
      hover: 'text-orange-600 bg-orange-50',
      disabled: 'text-gray-400'
    },
    danger: {
      base: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg',
      hover: 'from-red-600 to-red-700 shadow-xl',
      disabled: 'from-gray-300 to-gray-400 text-gray-500'
    }
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }

  const buttonVariants = {
    initial: { 
      scale: 1,
      boxShadow: variants[variant].base.includes('shadow-lg') ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    hover: { 
      scale: disabled ? 1 : 1.02,
      boxShadow: disabled ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    tap: { 
      scale: disabled ? 1 : 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  }

  const iconVariants = {
    initial: { x: 0, rotate: 0 },
    hover: { 
      x: 2,
      rotate: Icon?.name?.includes('Arrow') ? 5 : 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  }

  const rippleVariants = {
    initial: { scale: 0, opacity: 0.5 },
    animate: { 
      scale: 4, 
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const handleClick = (e) => {
    if (disabled || loading) return
    
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 600)
    
    if (onClick) {
      onClick(e)
    }
  }

  const getVariantClasses = () => {
    if (disabled) return variants[variant].disabled
    return variants[variant].base
  }

  return (
    <motion.button
      className={`
        relative overflow-hidden font-medium rounded-lg transition-all duration-200 
        focus:outline-none focus:ring-4 focus:ring-orange-200 
        disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${sizes[size]}
        ${className}
      `}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effect */}
      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-white rounded-lg"
          variants={rippleVariants}
          initial="initial"
          animate="animate"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}

      {/* Button content */}
      <div className="relative flex items-center justify-center space-x-2">
        {loading ? (
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            variants={loadingVariants}
            animate="animate"
          />
        ) : Icon ? (
          <motion.div variants={iconVariants}>
            <Icon className="w-5 h-5" />
          </motion.div>
        ) : null}
        
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: loading ? 0.7 : 1 }}
        >
          {children}
        </motion.span>
      </div>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        animate={{
          x: ['-100%', '100%'],
          opacity: [0, 0.1, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  )
}

export default AnimatedButton
