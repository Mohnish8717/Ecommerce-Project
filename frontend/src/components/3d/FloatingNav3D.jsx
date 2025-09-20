import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHome, FiShoppingBag, FiUser, FiHeart, FiSearch } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'

const FloatingNav3D = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const location = useLocation()

  const navItems = [
    { icon: FiHome, label: 'Home', path: '/', color: 'from-blue-500 to-cyan-500' },
    { icon: FiShoppingBag, label: 'Products', path: '/products', color: 'from-purple-500 to-pink-500' },
    { icon: FiSearch, label: 'Search', path: '/search', color: 'from-green-500 to-emerald-500' },
    { icon: FiHeart, label: 'Wishlist', path: '/wishlist', color: 'from-red-500 to-rose-500' },
    { icon: FiUser, label: 'Profile', path: '/profile', color: 'from-orange-500 to-yellow-500' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const currentIndex = navItems.findIndex(item => item.path === location.pathname)
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex)
    }
  }, [location.pathname])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <motion.div
            className="relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Main Navigation Container */}
            <motion.div
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-full p-2 border border-white/20"
              style={{
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                transform: "translateZ(0px)"
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = index === activeIndex
                
                return (
                  <Link key={index} to={item.path}>
                    <motion.div
                      className="relative"
                      onHoverStart={() => setActiveIndex(index)}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Active Background */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            layoutId="activeBackground"
                            className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-full`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            style={{ transform: "translateZ(-5px)" }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </AnimatePresence>
                      
                      {/* Icon Container */}
                      <motion.div
                        className={`relative w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                        }`}
                        style={{ transform: "translateZ(10px)" }}
                        whileHover={{ 
                          scale: 1.2,
                          rotateY: 15,
                          rotateX: 15,
                        }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <Icon className="w-5 h-5" />
                        
                        {/* Floating Particles */}
                        {isActive && (
                          <>
                            <motion.div
                              className="absolute w-1 h-1 bg-white rounded-full"
                              animate={{
                                x: [0, 10, -10, 0],
                                y: [0, -10, 10, 0],
                                opacity: [0, 1, 1, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              style={{ transform: "translateZ(20px)" }}
                            />
                            <motion.div
                              className="absolute w-1 h-1 bg-white rounded-full"
                              animate={{
                                x: [0, -8, 8, 0],
                                y: [0, 8, -8, 0],
                                opacity: [0, 1, 1, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5
                              }}
                              style={{ transform: "translateZ(15px)" }}
                            />
                          </>
                        )}
                      </motion.div>
                      
                      {/* Tooltip */}
                      <motion.div
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 pointer-events-none"
                        style={{ transform: "translateZ(30px) translateX(-50%)" }}
                        whileHover={{ opacity: 1, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.label}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
                      </motion.div>
                    </motion.div>
                  </Link>
                )
              })}
            </motion.div>
            
            {/* Floating Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl"
              style={{ transform: "translateZ(-10px)" }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Orbiting Elements */}
            <motion.div
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              style={{ transform: "translateZ(25px)" }}
              animate={{
                x: [0, 60, 0, -60, 0],
                y: [0, -30, -60, -30, 0],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <motion.div
              className="absolute w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              style={{ transform: "translateZ(20px)" }}
              animate={{
                x: [0, -50, 0, 50, 0],
                y: [0, 40, 80, 40, 0],
                rotate: [360, 270, 180, 90, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FloatingNav3D
