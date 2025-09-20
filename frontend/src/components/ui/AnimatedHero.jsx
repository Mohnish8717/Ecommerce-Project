import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiStar } from 'react-icons/fi'

const AnimatedHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { scrollY } = useScroll()
  
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const slides = [
    {
      title: "Discover Amazing Products",
      subtitle: "Shop the latest trends with exclusive deals",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      cta: "Shop Now",
      color: "from-blue-600 to-purple-600"
    },
    {
      title: "Premium Electronics",
      subtitle: "Latest tech at unbeatable prices",
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800",
      cta: "Explore Tech",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Fashion Forward",
      subtitle: "Style that speaks to you",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800",
      cta: "Shop Fashion",
      color: "from-pink-500 to-purple-500"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    })
  }

  return (
    <motion.section 
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
      style={{ opacity }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Shapes */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-orange-400 rounded-full opacity-20"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-blue-400 rounded-full opacity-20"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-12 h-12 bg-purple-400 rounded-full opacity-20"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />

        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 gap-4 h-full">
            {[...Array(144)].map((_, i) => (
              <motion.div
                key={i}
                className="border border-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{
                  duration: 3,
                  delay: i * 0.02,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Content Side */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ y: y1 }}
          >
            <motion.div variants={itemVariants}>
              <motion.h1 
                className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 15,
                  delay: 0.2 
                }}
              >
                Welcome to{' '}
                <motion.span 
                  className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Nomotix
                </motion.span>
              </motion.h1>
            </motion.div>

            <motion.div variants={itemVariants}>
              <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
                Discover amazing products, unbeatable prices, and exceptional service. 
                Your premium shopping destination awaits.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/products"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <FiShoppingBag className="mr-2 group-hover:animate-bounce" />
                  Start Shopping
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FiArrowRight />
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>

            {/* Features */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {[
                { icon: FiTruck, text: "Free Shipping", color: "text-green-400" },
                { icon: FiShield, text: "Secure Payment", color: "text-blue-400" },
                { icon: FiStar, text: "Top Quality", color: "text-yellow-400" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className={`p-2 rounded-full bg-white bg-opacity-20 ${feature.color}`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <feature.icon className="w-5 h-5" />
                  </motion.div>
                  <span className="font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Carousel Side */}
          <motion.div 
            className="relative h-96 lg:h-full"
            style={{ y: y2 }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <div className="relative w-full h-full">
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${slides[currentSlide].color} opacity-80`} />
                    
                    <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                      <div>
                        <motion.h3 
                          className="text-3xl font-bold text-white mb-4"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {slides[currentSlide].title}
                        </motion.h3>
                        <motion.p 
                          className="text-lg text-white mb-6"
                          initial={{ y: 30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {slides[currentSlide].subtitle}
                        </motion.p>
                        <motion.button
                          className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {slides[currentSlide].cta}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                  <motion.button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>

            {/* 3D Floating Elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl"
              animate={{
                rotate: [0, 360],
                y: [-10, 10, -10],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            
            <motion.div
              className="absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-xl"
              animate={{
                rotate: [360, 0],
                x: [-5, 5, -5],
              }}
              transition={{
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                x: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.section>
  )
}

export default AnimatedHero
