import { useEffect, useState } from 'react'

const ParticleBackground = ({ particleCount = 50, className = '' }) => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = []
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          z: Math.random() * 100,
          size: Math.random() * 4 + 1,
          speed: Math.random() * 2 + 0.5,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`,
          opacity: Math.random() * 0.8 + 0.2,
          rotationSpeed: Math.random() * 2 + 0.5,
        })
      }
      setParticles(newParticles)
    }

    generateParticles()
  }, [particleCount])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ perspective: '1000px' }}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            transform: `translateZ(${particle.z}px)`,
            animation: `
              float3d ${particle.speed * 4}s ease-in-out infinite,
              rotate ${particle.rotationSpeed * 6}s linear infinite
            `,
            animationDelay: `${particle.id * 0.1}s`,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ))}
      
      {/* Floating Geometric Shapes */}
      <div
        className="absolute w-20 h-20 border-2 border-blue-400/30 rounded-full floating-3d"
        style={{
          top: '20%',
          left: '10%',
          transform: 'translateZ(50px)',
          animation: 'float3d 8s ease-in-out infinite',
        }}
      />
      
      <div
        className="absolute w-16 h-16 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-lg floating-3d"
        style={{
          top: '60%',
          right: '15%',
          transform: 'translateZ(30px) rotateY(45deg)',
          animation: 'float3d 6s ease-in-out infinite reverse',
        }}
      />
      
      <div
        className="absolute w-12 h-12 border-2 border-yellow-400/40 floating-3d"
        style={{
          top: '40%',
          left: '70%',
          transform: 'translateZ(40px) rotateX(30deg)',
          animation: 'float3d 10s ease-in-out infinite',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        }}
      />
      
      <div
        className="absolute w-24 h-24 border border-green-400/25 rounded-full floating-3d"
        style={{
          bottom: '20%',
          left: '20%',
          transform: 'translateZ(60px)',
          animation: 'float3d 12s ease-in-out infinite',
        }}
      />
      
      <div
        className="absolute w-14 h-14 bg-gradient-to-br from-cyan-400/15 to-blue-400/15 rounded-lg floating-3d"
        style={{
          top: '15%',
          right: '30%',
          transform: 'translateZ(35px) rotateZ(45deg)',
          animation: 'float3d 7s ease-in-out infinite reverse',
        }}
      />
    </div>
  )
}

export default ParticleBackground
