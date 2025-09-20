import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FiStar, FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiRotateCcw } from 'react-icons/fi'
import { getProduct } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { toast } from 'react-hot-toast'
import { formatPrice, calculateDiscountPercentage } from '../utils/currency'

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)

  const { product, isLoading } = useSelector((state) => state.product)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    if (id) {
      dispatch(getProduct(id))
    }
  }, [dispatch, id])

  const handleAddToCart = () => {
    if (!product) return

    dispatch(addToCart({
      product,
      quantity,
      variant: selectedVariant
    }))
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
    return calculateDiscountPercentage(product?.price, product?.discountPrice)
  }

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-200 rounded"></div>
                  <div className="flex space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-16 h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-screen-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <Link
              to="/products"
              className="bg-orange-400 hover:bg-orange-500 text-gray-900 px-6 py-3 rounded font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/products" className="hover:text-orange-600">Products</Link>
          <span className="mx-2">›</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-orange-600">
            {product.category}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="bg-white rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8">
            {/* Product Images */}
            <div className="lg:col-span-5">
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={product.images?.[selectedImage]?.url || product.images?.[selectedImage] || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail Images */}
                {product.images && product.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-16 h-16 border-2 rounded overflow-hidden ${
                          selectedImage === index ? 'border-orange-400' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image.url || image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:col-span-4">
              <div className="space-y-4">
                <h1 className="text-2xl font-normal text-gray-900">
                  {product.name}
                </h1>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                    {product.numReviews || 0} ratings
                  </span>
                </div>

                <div className="border-t border-b border-gray-200 py-4">
                  <div className="flex items-center space-x-3">
                    {product.discountPrice && (
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                        -{getDiscountPercentage()}%
                      </span>
                    )}
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl text-red-600">
                        {formatPrice(product.discountPrice || product.price)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    & FREE Shipping
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="font-medium">Brand: </span>
                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                      {product.brand}
                    </span>
                  </div>

                  {product.stock > 0 ? (
                    <div className="text-green-600 text-sm font-medium">
                      In Stock
                    </div>
                  ) : (
                    <div className="text-red-600 text-sm font-medium">
                      Currently unavailable
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">About this item</h3>
                    <p className="text-sm text-gray-700">
                      {product.description}
                    </p>
                  </div>

                  {product.features && product.features.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Features</h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Purchase Options */}
            <div className="lg:col-span-3">
              <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                <div className="text-2xl font-normal">
                  {formatPrice(product.discountPrice || product.price)}
                </div>

                <div className="text-sm text-gray-600">
                  & FREE Delivery across India
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FiTruck className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">FREE delivery by tomorrow</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FiRotateCcw className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">FREE Returns</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FiShield className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Secure transaction</span>
                  </div>
                </div>

                {product.stock > 0 && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity:
                      </label>
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-20 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                      >
                        {[...Array(Math.min(10, product.stock))].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 px-4 rounded font-medium transition-colors"
                    >
                      Add to Cart
                    </button>

                    <button className="w-full bg-orange-400 hover:bg-orange-500 text-gray-900 py-2 px-4 rounded font-medium transition-colors">
                      Buy Now
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                    <FiHeart className="w-4 h-4" />
                    <span>Add to Wish List</span>
                  </button>

                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                    <FiShare2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                  <div>Ships from Nomotix</div>
                  <div>Sold by {product.seller?.name || 'Nomotix'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg mt-4 p-8">
          <div className="space-y-6">
            {product.specifications && product.specifications.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex">
                      <span className="font-medium text-gray-700 w-1/3">{spec.name}:</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Reviews</h3>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-lg font-medium">{product.rating || 0} out of 5</span>
                <span className="text-gray-600">{product.numReviews || 0} global ratings</span>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.slice(0, 5).map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                        </div>
                        <span className="font-medium">{review.name}</span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      {review.isVerifiedPurchase && (
                        <span className="text-xs text-orange-600 mt-2 inline-block">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
