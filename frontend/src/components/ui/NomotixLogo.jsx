import { Link } from 'react-router-dom'

const NomotixLogo = ({ 
  size = 'md', 
  color = 'white', 
  showDotCom = true, 
  className = '',
  linkTo = '/' 
}) => {
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

  const LogoContent = () => (
    <div className={`font-bold tracking-tight ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
      nomotix
      {showDotCom && (
        <span className="text-orange-400 text-xs ml-1">.com</span>
      )}
    </div>
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

export default NomotixLogo
