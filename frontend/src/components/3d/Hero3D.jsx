import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'

const Hero3D = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll()
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const x = useSpring(0, springConfig)
  const rotateX = useSpring(0, springConfig)
  const rotateY = useSpring(0, springConfig)

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const mouseX = (e.clientX - centerX) / (rect.width / 2)
      const mouseY = (e.clientY - centerY) / (rect.height / 2)
      
      setMousePosition({ x: mouseX, y: mouseY })
      
      x.set(mouseX * 20)
      rotateX.set(mouseY * 10)
      rotateY.set(mouseX * 10)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [x, rotateX, rotateY])

  const floatingElements = [
    { size: 'w-20 h-20', color: 'from-pink-400 to-purple-600', delay: 0 },
    { size: 'w-16 h-16', color: 'from-blue-400 to-cyan-600', delay: 0.5 },
    { size: 'w-12 h-12', color: 'from-yellow-400 to-orange-600', delay: 1 },
    { size: 'w-24 h-24', color: 'from-green-400 to-emerald-600', delay: 1.5 },
    { size: 'w-14 h-14', color: 'from-red-400 to-pink-600', delay: 2 },
  ]

  return (
    <motion.section
      ref={containerRef}
      className="relative h-screen overflow-hidden gradient-primary"
      style={{ y, opacity }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className={`absolute ${element.size} bg-gradient-to-r ${element.color} rounded-full opacity-20 blur-xl`}
            style={{
              left: `${20 + index * 15}%`,
              top: `${10 + index * 20}%`,
              transformStyle: "preserve-3d",
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 30, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: element.delay,
            }}
          />
        ))}
        
        {/* Particle System */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <motion.div
          className="text-center max-w-6xl mx-auto px-4"
          style={{
            transformStyle: "preserve-3d",
            rotateX,
            rotateY,
          }}
        >
          {/* 3D Text Layers */}
          <motion.div
            className="relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Background Text Shadow */}
            <motion.h1
              className="text-6xl md:text-8xl font-bold text-black/10 absolute inset-0"
              style={{ transform: "translateZ(-20px) translateY(4px) translateX(4px)" }}
              animate={{
                rotateY: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Welcome to Nomotix
            </motion.h1>
            
            {/* Main Text */}
            <motion.h1
              className="text-6xl md:text-8xl font-bold text-white relative z-10"
              style={{ 
                transform: "translateZ(20px)",
                textShadow: "0 0 20px rgba(255,255,255,0.5)",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Welcome to{' '}
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                Nomotix
              </motion.span>
            </motion.h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-12 font-medium"
            style={{ transform: "translateZ(15px)" }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            Discover amazing products with stunning 3D experiences
          </motion.p>

          {/* 3D Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            style={{ transform: "translateZ(25px)" }}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <Link to="/products">
              <motion.button
                className="relative px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-2xl overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Shop Now</span>
                
                {/* Button Glow */}
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 blur-xl"
                  whileHover={{ opacity: 0.2 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>

            <Link to="/products?category=Electronics">
              <motion.button
                className="relative px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border border-white/30 overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: -5,
                  rotateX: 5,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Explore Electronics</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Floating 3D Elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-60"
            style={{ transform: "translateZ(40px)" }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-60"
            style={{ transform: "translateZ(35px)" }}
            animate={{
              y: [0, 15, 0],
              rotate: [360, 180, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        style={{ transform: "translateZ(30px)" }}
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{
              y: [0, 12, 0],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </motion.section>
  )
}

export default Hero3D
