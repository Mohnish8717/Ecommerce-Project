import { Link } from 'react-router-dom'
import { FiGlobe } from 'react-icons/fi'
import NomotixLogo from '../ui/NomotixLogo'

const Footer = () => {
  return (
    <footer className="gradient-primary text-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>

      {/* Back to top */}
      <div
        className="bg-white/10 hover:bg-white/20 text-center py-4 cursor-pointer transition-all duration-300 backdrop-blur-sm"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span className="text-sm font-medium">Back to top</span>
      </div>

      {/* Main footer content */}
      <div className="gradient-primary relative z-10">
        <div className="max-w-screen-2xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Get to Know Us */}
            <div>
              <h3 className="text-white font-bold mb-4">Get to Know Us</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-white text-sm transition-colors">
                    About Nomotix
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/press" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Press Releases
                  </Link>
                </li>
                <li>
                  <Link to="/investor" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Nomotix Cares
                  </Link>
                </li>
                <li>
                  <Link to="/gift-cards" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Gift Cards
                  </Link>
                </li>
              </ul>
            </div>

            {/* Make Money with Us */}
            <div>
              <h3 className="text-white font-bold mb-4">Make Money with Us</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/sell" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Sell products on Nomotix
                  </Link>
                </li>
                <li>
                  <Link to="/sell-apps" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Sell apps on Nomotix
                  </Link>
                </li>
                <li>
                  <Link to="/affiliate" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Become an Affiliate
                  </Link>
                </li>
                <li>
                  <Link to="/advertise" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Advertise Your Products
                  </Link>
                </li>
                <li>
                  <Link to="/self-publish" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Self-Publish with Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Nomotix Payment Products */}
            <div>
              <h3 className="text-white font-bold mb-4">Nomotix Payment Products</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/business-card" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Nomotix Business Card
                  </Link>
                </li>
                <li>
                  <Link to="/shop-points" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Shop with Points
                  </Link>
                </li>
                <li>
                  <Link to="/reload" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Reload Your Balance
                  </Link>
                </li>
                <li>
                  <Link to="/currency-converter" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Nomotix Currency Converter
                  </Link>
                </li>
              </ul>
            </div>

            {/* Let Us Help You */}
            <div>
              <h3 className="text-white font-bold mb-4">Let Us Help You</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/covid" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Nomotix and COVID-19
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Your Account
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Your Orders
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Shipping Rates & Policies
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Returns & Replacements
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Help
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-screen-2xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            {/* Logo */}
            <NomotixLogo size="md" color="white" />

            {/* Language/Country */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 border border-gray-600 rounded px-3 py-1 hover:bg-gray-700 cursor-pointer">
                <FiGlobe className="w-4 h-4" />
                <span className="text-sm">English</span>
              </div>

              <div className="flex items-center space-x-2 border border-gray-600 rounded px-3 py-1 hover:bg-gray-700 cursor-pointer">
                <span className="text-sm">$ USD</span>
              </div>

              <div className="flex items-center space-x-2 border border-gray-600 rounded px-3 py-1 hover:bg-gray-700 cursor-pointer">
                <span className="text-sm">🇺🇸 United States</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-screen-2xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 text-xs text-gray-400">
            <Link to="/conditions" className="hover:text-white">
              Conditions of Use
            </Link>
            <Link to="/privacy" className="hover:text-white">
              Privacy Notice
            </Link>
            <Link to="/interest-ads" className="hover:text-white">
              Interest-Based Ads
            </Link>
            <span>© 2024, Nomotix.com, Inc. or its affiliates</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
