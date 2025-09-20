import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const Product3DShowcase = ({ product, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

  const handleMouseMove = (e) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY: rotateY,
        rotateX: rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative cursor-pointer ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Main Card */}
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          boxShadow: isHovered 
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
        }}
      >
        {/* Background Layers for Depth */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50"
          style={{ transform: "translateZ(-20px)" }}
        />
        
        {/* Product Image */}
        <motion.div
          className="relative aspect-square overflow-hidden"
          style={{ transform: "translateZ(10px)" }}
        >
          <img
            src={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Floating Elements */}
          <motion.div
            className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20"
            animate={{
              y: isHovered ? [-5, 5, -5] : [0, -10, 0],
              rotate: isHovered ? [0, 180, 360] : [0, 90, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ transform: "translateZ(30px)" }}
          />
          
          <motion.div
            className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-30"
            animate={{
              y: isHovered ? [5, -5, 5] : [0, 10, 0],
              rotate: isHovered ? [360, 180, 0] : [0, -90, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            style={{ transform: "translateZ(25px)" }}
          />
        </motion.div>
        
        {/* Content */}
        <motion.div
          className="p-6"
          style={{ transform: "translateZ(15px)" }}
        >
          <motion.h3
            className="text-lg font-bold text-gray-900 mb-2"
            animate={{
              color: isHovered ? "#3b82f6" : "#111827"
            }}
          >
            {product.name}
          </motion.h3>
          
          <motion.div
            className="flex items-center justify-between"
            style={{ transform: "translateZ(20px)" }}
          >
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            
            <motion.button
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{ transform: "translateZ(25px)" }}
            >
              Add to Cart
            </motion.button>
          </motion.div>
        </motion.div>
        
        {/* Holographic Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          animate={{
            opacity: isHovered ? [0, 0.1, 0] : 0,
            x: isHovered ? [-100, 400] : 0,
          }}
          transition={{
            duration: 1.5,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut"
          }}
          style={{ transform: "translateZ(40px)" }}
        />
      </motion.div>
      
      {/* Floating Shadow */}
      <motion.div
        className="absolute inset-0 bg-black rounded-3xl opacity-10 blur-xl"
        style={{
          transform: "translateZ(-10px) translateY(20px)",
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.2 : 0.1,
        }}
      />
    </motion.div>
  )
}

export default Product3DShowcase
