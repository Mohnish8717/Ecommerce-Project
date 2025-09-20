import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiMapPin,
  FiChevronDown,
  FiGlobe,
  FiX
} from 'react-icons/fi'
import { logout } from '../../store/slices/authSlice'
import { setMobileMenuOpen } from '../../store/slices/uiSlice'
import NomotixLogo from '../ui/NomotixLogo'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchCategory, setSearchCategory] = useState('All')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [locationMenuOpen, setLocationMenuOpen] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { totalItems } = useSelector((state) => state.cart)
  const { mobileMenuOpen } = useSelector((state) => state.ui)

  const categories = [
    'All', 'Electronics', 'Clothing', 'Home & Garden', 'Sports',
    'Books', 'Beauty', 'Automotive', 'Toys'
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams()
      params.set('search', searchQuery.trim())
      if (searchCategory !== 'All') {
        params.set('category', searchCategory)
      }
      navigate(`/products?${params.toString()}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    setUserMenuOpen(false)
    navigate('/')
  }

  const toggleMobileMenu = () => {
    dispatch(setMobileMenuOpen(!mobileMenuOpen))
  }

  return (
    <div className="gradient-primary text-white sticky top-0 z-50 shadow-xl" style={{ transformStyle: "preserve-3d" }}>
      {/* Main Navigation Bar */}
      <div className="gradient-primary">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center h-20" style={{ transform: "translateZ(10px)" }}>
            {/* Logo */}
            <div className="mr-6">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-all duration-300">
                  <NomotixLogo size="md" color="white" linkTo={null} />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight hidden sm:block">Nomotix</span>
              </Link>
            </div>

            {/* Delivery Location */}
            <div
              className="hidden lg:flex items-center text-sm cursor-pointer hover:bg-white/10 p-3 rounded-xl transition-all duration-300 relative"
              onClick={() => setLocationMenuOpen(!locationMenuOpen)}
            >
              <FiMapPin className="text-white/80 mr-2" />
              <div>
                <div className="text-white/70 text-xs">Deliver to</div>
                <div className="text-white font-semibold">Mumbai 400001</div>
              </div>
            </div>

            {/* 3D Search Bar */}
            <div className="flex-1 max-w-4xl mx-6" style={{ transform: "translateZ(15px)" }}>
              <form onSubmit={handleSearch} className="flex bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden tilt-3d">
                {/* Category Dropdown */}
                <div className="relative" style={{ transform: "translateZ(5px)" }}>
                  <select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="bg-transparent text-gray-700 px-4 py-4 border-r border-gray-200 focus:outline-none h-14 text-sm font-medium cursor-pointer"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-4 text-gray-700 focus:outline-none h-14 placeholder-gray-400 bg-transparent"
                  style={{ transform: "translateZ(3px)" }}
                />

                {/* 3D Search Button */}
                <button
                  type="submit"
                  className="btn-3d gradient-accent hover:scale-105 px-6 py-4 h-14 flex items-center justify-center transition-all duration-300"
                  style={{ transform: "translateZ(8px)" }}
                >
                  <FiSearch className="w-5 h-5 text-white" />
                </button>
              </form>
            </div>

            {/* Language Selector */}
            <div className="hidden lg:flex items-center text-sm cursor-pointer hover:border border-white p-2 rounded">
              <FiGlobe className="mr-1" />
              <span>EN</span>
              <FiChevronDown className="ml-1 w-3 h-3" />
            </div>

            {/* Account & Lists */}
            <div className="relative">
              <div
                className="flex items-center text-sm cursor-pointer hover:bg-white/10 p-3 rounded-xl transition-all duration-300"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user && user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div>
                    <div className="text-white/70 text-xs">
                      Hello, {user && user.name ? user.name.split(' ')[0] : 'Sign in'}
                    </div>
                    <div className="text-white font-semibold flex items-center">
                      Account & Lists
                      <FiChevronDown className="ml-1 w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-50 text-gray-900">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b">
                        <div className="font-bold">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Your Account
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Your Orders
                      </Link>
                      {user.role === 'seller' && (
                        <Link
                          to="/seller"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Seller Central
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4">
                      <Link
                        to="/login"
                        className="block w-full bg-yellow-400 hover:bg-yellow-500 text-center py-2 px-4 rounded mb-2 text-gray-900 font-medium"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <div className="text-sm text-center">
                        New customer?{' '}
                        <Link
                          to="/register"
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Start here.
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Returns & Orders */}
            <Link
              to="/orders"
              className="hidden lg:flex items-center text-sm cursor-pointer hover:border border-white p-2 rounded"
            >
              <div>
                <div className="text-gray-300 text-xs">Returns</div>
                <div className="text-white font-bold">& Orders</div>
              </div>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="flex items-center text-sm cursor-pointer hover:bg-white/10 p-3 rounded-xl transition-all duration-300 relative group"
            >
              <div className="relative">
                <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300">
                  <FiShoppingCart className="w-6 h-6 text-white" />
                </div>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 gradient-accent text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="ml-3 hidden lg:block">
                <div className="text-white/70 text-xs">Cart</div>
                <div className="text-white font-semibold">{totalItems} items</div>
              </div>
            </Link>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-white hover:bg-gray-800 rounded"
              >
                <FiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="bg-gray-800">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex items-center h-10 space-x-6 text-sm">
            <div className="flex items-center cursor-pointer hover:border border-white p-1 rounded">
              <FiMenu className="mr-2" />
              <span>All</span>
            </div>

            <Link to="/products?category=Electronics" className="hover:border border-white p-1 rounded">
              Electronics
            </Link>
            <Link to="/products?category=Clothing" className="hover:border border-white p-1 rounded">
              Fashion
            </Link>
            <Link to="/products?category=Home & Garden" className="hover:border border-white p-1 rounded">
              Home & Garden
            </Link>
            <Link to="/products?category=Sports" className="hover:border border-white p-1 rounded">
              Sports
            </Link>
            <Link to="/products?category=Books" className="hover:border border-white p-1 rounded">
              Books
            </Link>
            <Link to="/products?featured=true" className="hover:border border-white p-1 rounded">
              Today's Deals
            </Link>
            <Link to="/products" className="hover:border border-white p-1 rounded">
              Best Sellers
            </Link>

            <div className="hidden lg:block text-orange-400 hover:text-orange-300 cursor-pointer">
              Nomotix Video
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white text-gray-900 border-t">
          <div className="px-4 py-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search Nomotix"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  type="submit"
                  className="bg-orange-400 hover:bg-orange-500 px-4 py-2 rounded-r-md"
                >
                  <FiSearch className="text-gray-900 w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                to="/products"
                className="block py-2 text-gray-900 hover:text-orange-600"
                onClick={() => dispatch(setMobileMenuOpen(false))}
              >
                All Categories
              </Link>
              <Link
                to="/products?category=Electronics"
                className="block py-2 text-gray-900 hover:text-orange-600"
                onClick={() => dispatch(setMobileMenuOpen(false))}
              >
                Electronics
              </Link>
              <Link
                to="/products?category=Clothing"
                className="block py-2 text-gray-900 hover:text-orange-600"
                onClick={() => dispatch(setMobileMenuOpen(false))}
              >
                Fashion
              </Link>
              <Link
                to="/cart"
                className="flex items-center py-2 text-gray-900 hover:text-orange-600"
                onClick={() => dispatch(setMobileMenuOpen(false))}
              >
                <FiShoppingCart className="w-5 h-5 mr-2" />
                Cart ({totalItems})
              </Link>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block py-2 text-gray-900 hover:text-orange-600"
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                  >
                    Your Account
                  </Link>
                  <Link
                    to="/orders"
                    className="block py-2 text-gray-900 hover:text-orange-600"
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                  >
                    Your Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-gray-900 hover:text-orange-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2 text-gray-900 hover:text-orange-600"
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 text-gray-900 hover:text-orange-600"
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
