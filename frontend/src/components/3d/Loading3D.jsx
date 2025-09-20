const Loading3D = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`relative ${sizeClasses[size]}`}
        style={{ 
          perspective: '200px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Outer Ring */}
        <div
          className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full"
          style={{
            animation: 'spin 2s linear infinite',
            transform: 'rotateX(60deg) rotateY(45deg)',
          }}
        />
        
        {/* Middle Ring */}
        <div
          className="absolute inset-2 border-4 border-transparent border-t-green-500 border-l-yellow-500 rounded-full"
          style={{
            animation: 'spin 1.5s linear infinite reverse',
            transform: 'rotateX(-60deg) rotateZ(45deg)',
          }}
        />
        
        {/* Inner Ring */}
        <div
          className="absolute inset-4 border-4 border-transparent border-b-red-500 border-r-orange-500 rounded-full"
          style={{
            animation: 'spin 1s linear infinite',
            transform: 'rotateY(60deg) rotateX(45deg)',
          }}
        />
        
        {/* Center Dot */}
        <div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
          style={{
            animation: 'pulse 2s ease-in-out infinite',
            transform: 'translateZ(20px) translateX(-50%) translateY(-50%)',
            boxShadow: '0 0 20px currentColor',
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              top: '50%',
              left: '50%',
              transform: `
                translateX(-50%) translateY(-50%) 
                rotateZ(${i * 60}deg) 
                translateY(-${20 + i * 2}px) 
                translateZ(${10 + i * 5}px)
              `,
              animation: `float3d ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Loading3D
