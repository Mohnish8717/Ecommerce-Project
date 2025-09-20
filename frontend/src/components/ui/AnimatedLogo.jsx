import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const AnimatedLogo = ({ 
  size = 'md', 
  color = 'white', 
  showDotCom = true, 
  className = '',
  linkTo = '/',
  animate3D = false
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  }

  const colorClasses = {
    white: 'text-white',
    black: 'text-gray-900',
    blue: 'text-blue-600',
    orange: 'text-orange-400'
  }

  const logoVariants = {
    initial: { 
      scale: 1,
      rotateY: 0,
      textShadow: '0px 0px 0px rgba(255, 153, 0, 0)'
    },
    hover: { 
      scale: 1.05,
      rotateY: animate3D ? 5 : 0,
      textShadow: animate3D ? '2px 2px 8px rgba(255, 153, 0, 0.3)' : '0px 0px 0px rgba(255, 153, 0, 0)',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    tap: { 
      scale: 0.95,
      rotateY: animate3D ? -2 : 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  }

  const letterVariants = {
    initial: { y: 0, rotateX: 0 },
    hover: { 
      y: animate3D ? -2 : 0,
      rotateX: animate3D ? 10 : 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 20
      }
    }
  }

  const dotComVariants = {
    initial: { 
      scale: 1,
      color: '#fb923c',
      textShadow: '0px 0px 0px rgba(251, 146, 60, 0)'
    },
    hover: { 
      scale: 1.1,
      color: '#ea580c',
      textShadow: animate3D ? '0px 0px 10px rgba(251, 146, 60, 0.6)' : '0px 0px 0px rgba(251, 146, 60, 0)',
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  }

  const LogoContent = () => (
    <motion.div 
      className={`font-bold tracking-tight ${sizeClasses[size]} ${colorClasses[color]} ${className} cursor-pointer select-none`}
      variants={logoVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.span className="inline-block">
        {['n', 'o', 'm', 'o', 't', 'i', 'x'].map((letter, index) => (
          <motion.span
            key={index}
            className="inline-block"
            variants={letterVariants}
            custom={index}
            style={{
              transformOrigin: 'center bottom'
            }}
            animate={isHovered ? 'hover' : 'initial'}
            transition={{
              delay: index * 0.05
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.span>
      {showDotCom && (
        <motion.span 
          className="text-orange-400 text-xs ml-1 inline-block"
          variants={dotComVariants}
          animate={isHovered ? 'hover' : 'initial'}
        >
          .com
        </motion.span>
      )}
    </motion.div>
  )

  if (linkTo) {
    return (
      <Link to={linkTo} className="flex items-center">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}

export default AnimatedLogo
