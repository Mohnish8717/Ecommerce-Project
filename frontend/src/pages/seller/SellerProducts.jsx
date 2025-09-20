import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiStar,
  FiPackage
} from 'react-icons/fi'
import { getProducts, deleteProduct } from '../../store/slices/productSlice'
import { toast } from 'react-hot-toast'

const SellerProducts = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { products, isLoading } = useSelector(state => state.product)
  
  const [sellerProducts, setSellerProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  useEffect(() => {
    if (products && user) {
      // Filter products by seller
      let userProducts = products.filter(product => 
        product.seller === user._id || product.seller?._id === user._id
      )

      // Apply search filter
      if (searchTerm) {
        userProducts = userProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Apply category filter
      if (categoryFilter !== 'all') {
        userProducts = userProducts.filter(product => 
          product.category === categoryFilter
        )
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          userProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        case 'oldest':
          userProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          break
        case 'price-high':
          userProducts.sort((a, b) => b.price - a.price)
          break
        case 'price-low':
          userProducts.sort((a, b) => a.price - b.price)
          break
        case 'rating':
          userProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        default:
          break
      }

      setSellerProducts(userProducts)
    }
  }, [products, user, searchTerm, categoryFilter, sortBy])

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap()
        toast.success('Product deleted successfully')
      } catch (error) {
        toast.error('Failed to delete product')
      }
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const categories = ['all', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Automotive', 'Toys']

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
              <p className="text-gray-600">Manage your product listings</p>
            </div>
            <Link
              to="/seller/products/new"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-3 py-2 text-sm font-medium ${
                  viewMode === 'grid'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiGrid className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-3 py-2 text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiList className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {sellerProducts.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {sellerProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <div className="aspect-square p-4">
                      <img
                        src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          ({product.numReviews || 0})
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.stock > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium text-center"
                        >
                          <FiEye className="w-4 h-4 inline mr-1" />
                          View
                        </Link>
                        <Link
                          to={`/seller/products/${product._id}/edit`}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md text-sm font-medium text-center"
                        >
                          <FiEdit className="w-4 h-4 inline mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  // List View
                  <div className="flex items-center p-6">
                    <img
                      src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg mr-6"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                        <div className="flex items-center">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-600">
                            {product.rating?.toFixed(1) || '0.0'} ({product.numReviews || 0})
                          </span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.stock > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/products/${product._id}`}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <FiEye className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/seller/products/${product._id}/edit`}
                        className="p-2 text-orange-500 hover:text-orange-600"
                      >
                        <FiEdit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start by adding your first product to your store'
              }
            </p>
            <Link
              to="/seller/products/new"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md font-medium"
            >
              Add Your First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerProducts
