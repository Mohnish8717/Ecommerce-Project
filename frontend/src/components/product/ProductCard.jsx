import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi'
import { addToCart } from '../../store/slices/cartSlice'
import { toast } from 'react-hot-toast'
import { formatPrice, calculateDiscountPercentage } from '../../utils/currency'
import CSS3DShowcase from '../3d/CSS3DShowcase'

const ProductCard = ({ product, variant = 'default' }) => {
  const dispatch = useDispatch()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    dispatch(addToCart({ product, quantity: 1 }))
    toast.success('Added to cart!')
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating || 0)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const getDiscountPercentage = () => {
    return calculateDiscountPercentage(product.price, product.discountPrice)
  }

  if (variant === 'list') {
    return (
      <div className="bg-white border-b border-gray-200 p-4 hover:shadow-md transition-shadow">
        <Link to={`/products/${product._id}`} className="flex space-x-4">
          <div className="flex-shrink-0 w-32 h-32">
            <img
              src={product.images?.[0]?.url || product.images?.[0] || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800 mb-2 line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                ({product.numReviews || 0})
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    -{getDiscountPercentage()}%
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {product.stock > 0 ? (
                  <span className="text-green-600">In Stock</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="bg-orange-400 hover:bg-orange-500 disabled:bg-gray-300 text-gray-900 px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <CSS3DShowcase className="h-full">
      <div className="card-3d group cursor-pointer overflow-hidden h-full">
        <Link to={`/products/${product._id}`} className="block h-full flex flex-col">
        <div className="relative" style={{ transformStyle: "preserve-3d" }}>
          <div className="aspect-square overflow-hidden rounded-t-2xl">
            <img
              src={product.images?.[0]?.url || product.images?.[0] || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              style={{ transform: "translateZ(5px)" }}
            />
          </div>
          {product.discountPrice && (
            <div
              className="absolute top-3 left-3 gradient-accent text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg neon-glow"
              style={{ transform: "translateZ(15px)" }}
            >
              -{getDiscountPercentage()}% off
            </div>
          )}
          <button
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 floating-3d"
            style={{ transform: "translateZ(20px)" }}
          >
            <FiHeart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* 3D Floating Elements */}
          <div
            className="absolute top-1/4 right-1/4 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-60 floating-3d"
            style={{ transform: "translateZ(25px)" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-40 floating-3d"
            style={{ transform: "translateZ(30px)", animationDelay: "1s" }}
          ></div>
        </div>

        <div className="p-5" style={{ transform: "translateZ(10px)" }}>
          <h3
            className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 text-3d"
            style={{ transform: "translateZ(5px)" }}
          >
            {product.name}
          </h3>

          <div
            className="flex items-center mb-3"
            style={{ transform: "translateZ(8px)" }}
          >
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="ml-2 text-sm text-gray-500 font-medium">
              ({product.numReviews || 0})
            </span>
          </div>

          <div
            className="flex items-center space-x-2 mb-4"
            style={{ transform: "translateZ(12px)" }}
          >
            <span className="text-xl font-bold text-gray-900 text-3d">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div
            className="text-xs text-gray-600 mb-3"
            style={{ transform: "translateZ(6px)" }}
          >
            {product.stock > 0 ? (
              <span className="badge-success">In Stock</span>
            ) : (
              <span className="badge-secondary">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
      
      <div className="px-5 pb-5" style={{ transform: "translateZ(15px)" }}>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full btn-3d btn-primary py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed morph-3d"
          style={{ transform: "translateZ(5px)" }}
        >
          <FiShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
      </div>
    </CSS3DShowcase>
  )
}

export default ProductCard
