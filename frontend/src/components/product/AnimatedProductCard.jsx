import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiStar, FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi'
import { addToCart } from '../../store/slices/cartSlice'
import { toast } from 'react-hot-toast'
import { useState } from 'react'

const AnimatedProductCard = ({ product, variant = 'default', index = 0 }) => {
  const dispatch = useDispatch()
  const [isHovered, setIsHovered] = useState(false)
  
  // 3D tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    dispatch(addToCart({ product, quantity: 1 }))
    toast.success('Added to cart!', {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    })
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
      >
        <FiStar
          className={`w-4 h-4 ${
            i < Math.floor(rating || 0)
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      </motion.div>
    ))
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getDiscountPercentage = () => {
    if (product.discountPrice && product.price > product.discountPrice) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100)
    }
    return 0
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  }

  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    tap: { 
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-shadow group relative overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-50 to-blue-50 opacity-0"
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <Link to={`/products/${product._id}`} className="block relative z-10">
        <div className="relative overflow-hidden rounded-t-xl">
          {/* Product Image */}
          <div className="aspect-square p-4 relative">
            <motion.img
              src={product.images?.[0]?.url || product.images?.[0] || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
              variants={imageVariants}
              style={{ transformStyle: "preserve-3d" }}
            />
            
            {/* Discount Badge */}
            {product.discountPrice && (
              <motion.div
                className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              >
                -{getDiscountPercentage()}% OFF
              </motion.div>
            )}

            {/* Hover Overlay */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center"
              variants={overlayVariants}
              initial="hidden"
              animate={isHovered ? "visible" : "hidden"}
            >
              <motion.div
                className="flex space-x-3"
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.button
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiHeart className="w-4 h-4 text-gray-600" />
                </motion.button>
                <motion.button
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FiEye className="w-4 h-4 text-gray-600" />
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <div className="p-4 relative z-10">
          {/* Product Name */}
          <motion.h3 
            className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600"
            style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
          >
            {product.name}
          </motion.h3>
          
          {/* Rating */}
          <motion.div 
            className="flex items-center mb-2"
            style={{ transformStyle: "preserve-3d", transform: "translateZ(15px)" }}
          >
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <motion.span 
              className="ml-2 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ({product.numReviews || 0})
            </motion.span>
          </motion.div>
          
          {/* Price */}
          <motion.div 
            className="flex items-center space-x-2 mb-3"
            style={{ transformStyle: "preserve-3d", transform: "translateZ(10px)" }}
          >
            <motion.span 
              className="text-lg font-bold text-gray-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            >
              {formatPrice(product.discountPrice || product.price)}
            </motion.span>
            {product.discountPrice && (
              <motion.span 
                className="text-sm text-gray-500 line-through"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                {formatPrice(product.price)}
              </motion.span>
            )}
          </motion.div>
          
          {/* Stock Status */}
          <motion.div 
            className="text-xs text-gray-600 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ transformStyle: "preserve-3d", transform: "translateZ(5px)" }}
          >
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">✓ In Stock</span>
            ) : (
              <span className="text-red-600 font-medium">✗ Out of Stock</span>
            )}
          </motion.div>
        </div>
      </Link>
      
      {/* Add to Cart Button */}
      <div className="px-4 pb-4 relative z-10">
        <motion.button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 text-white py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileTap="tap"
          whileHover={{ 
            boxShadow: "0 10px 25px rgba(251, 146, 60, 0.4)",
            y: -2
          }}
          style={{ transformStyle: "preserve-3d", transform: "translateZ(30px)" }}
        >
          <motion.div
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <FiShoppingCart className="w-4 h-4" />
          </motion.div>
          <span>Add to Cart</span>
        </motion.button>
      </div>

      {/* Floating particles effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full"
              initial={{ 
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                scale: 0,
                opacity: 0
              }}
              animate={{ 
                y: '-100%',
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default AnimatedProductCard
