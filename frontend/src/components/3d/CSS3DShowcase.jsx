import { useState, useRef } from 'react'

const CSS3DShowcase = ({ children, className = '' }) => {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    const rotateX = (mouseY / rect.height) * -30
    const rotateY = (mouseX / rect.width) * 30

    setTransform({ rotateX, rotateY })
  }

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 })
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <div
      ref={containerRef}
      className={`relative cursor-pointer transition-all duration-300 ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      <div
        className="transition-transform duration-300 ease-out"
        style={{
          transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) ${
            isHovered ? 'translateZ(20px)' : 'translateZ(0px)'
          }`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
      
      {/* Shadow */}
      <div
        className="absolute inset-0 bg-black rounded-2xl opacity-10 blur-xl transition-all duration-300"
        style={{
          transform: `translateZ(-10px) translateY(${isHovered ? '30px' : '20px'}) scale(${
            isHovered ? '1.1' : '1'
          })`,
          opacity: isHovered ? 0.2 : 0.1,
        }}
      />
    </div>
  )
}

export default CSS3DShowcase
