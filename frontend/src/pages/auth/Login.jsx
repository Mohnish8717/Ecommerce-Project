import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi'
import { login, reset } from '../../store/slices/authSlice'
import NomotixLogo from '../../components/ui/NomotixLogo'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const { email, password } = formData
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate(from, { replace: true })
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, from, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    const userData = {
      email,
      password,
    }

    dispatch(login(userData))
  }

  const fillDemoCredentials = (role) => {
    const credentials = {
      buyer: { email: 'buyer@demo.com', password: 'demo123' },
      seller: { email: 'seller@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'demo123' }
    }

    setFormData(credentials[role])
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8">
      {/* Nomotix Logo */}
      <div className="mb-8">
        <NomotixLogo size="lg" color="black" showDotCom={false} />
      </div>

      <div className="w-full max-w-sm">
        <div className="border border-gray-300 rounded-lg p-6">
          <h1 className="text-2xl font-normal mb-4">Sign in</h1>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
                Email or mobile phone number
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                value={email}
                onChange={onChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent pr-10"
                  value={password}
                  onChange={onChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 px-4 rounded font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <div className="text-xs text-gray-600">
              By continuing, you agree to Nomotix's{' '}
              <Link to="/conditions" className="text-blue-600 hover:text-blue-800">
                Conditions of Use
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                Privacy Notice
              </Link>
              .
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-800"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="w-full max-w-sm mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-3">Demo Credentials:</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Buyer:</span>
              <button
                onClick={() => fillDemoCredentials('buyer')}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                buyer@demo.com / demo123
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Seller:</span>
              <button
                onClick={() => fillDemoCredentials('seller')}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                seller@demo.com / demo123
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Admin:</span>
              <button
                onClick={() => fillDemoCredentials('admin')}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                admin@demo.com / demo123
              </button>
            </div>
          </div>
        </div>

        {/* Create Account */}
        <div className="w-full max-w-sm mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to Nomotix?</span>
            </div>
          </div>

          <Link
            to="/register"
            className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 px-4 rounded border border-gray-300 font-medium transition-colors text-center block"
          >
            Create your Nomotix account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
