import { motion } from 'framer-motion'
import { useMemo } from 'react'

const FloatingElements = ({ count = 20, className = '' }) => {
  const elements = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20, // 20-80px
      x: Math.random() * 100, // 0-100%
      y: Math.random() * 100, // 0-100%
      delay: Math.random() * 5, // 0-5s delay
      duration: Math.random() * 10 + 10, // 10-20s duration
      shape: Math.random() > 0.5 ? 'circle' : 'square',
      color: [
        'bg-orange-200',
        'bg-blue-200', 
        'bg-purple-200',
        'bg-pink-200',
        'bg-yellow-200',
        'bg-green-200'
      ][Math.floor(Math.random() * 6)],
      opacity: Math.random() * 0.3 + 0.1 // 0.1-0.4
    }))
  }, [count])

  const floatingVariants = {
    animate: (custom) => ({
      y: [0, -30, 0],
      x: [0, custom.drift || 0, 0],
      rotate: [0, 360],
      scale: [1, 1.1, 1],
      transition: {
        duration: custom.duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: custom.delay
      }
    })
  }

  const Element = ({ element }) => {
    const isCircle = element.shape === 'circle'
    
    return (
      <motion.div
        className={`
          absolute pointer-events-none
          ${element.color}
          ${isCircle ? 'rounded-full' : 'rounded-lg'}
        `}
        style={{
          width: element.size,
          height: element.size,
          left: `${element.x}%`,
          top: `${element.y}%`,
          opacity: element.opacity
        }}
        variants={floatingVariants}
        animate="animate"
        custom={{
          duration: element.duration,
          delay: element.delay,
          drift: (Math.random() - 0.5) * 40 // -20 to 20px drift
        }}
      />
    )
  }

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {elements.map((element) => (
        <Element key={element.id} element={element} />
      ))}
    </div>
  )
}

export default FloatingElements
