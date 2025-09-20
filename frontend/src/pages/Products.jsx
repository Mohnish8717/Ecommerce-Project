import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { FiGrid, FiList, FiFilter, FiChevronDown, FiStar } from 'react-icons/fi'
import { getProducts, setFilters, setCurrentPage } from '../store/slices/productSlice'
import ProductCard from '../components/product/ProductCard'

const Products = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const {
    products,
    isLoading,
    totalProducts,
    currentPage,
    totalPages,
    filters
  } = useSelector((state) => state.product)

  const categories = [
    'All', 'Electronics', 'Clothing', 'Home & Garden', 'Sports',
    'Books', 'Beauty', 'Automotive', 'Toys'
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Featured' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Reviews' },
    { value: 'newest', label: 'Newest Arrivals' }
  ]

  useEffect(() => {
    const params = Object.fromEntries(searchParams)
    dispatch(setFilters(params))
    dispatch(getProducts({ ...params, page: currentPage }))
  }, [searchParams, currentPage, dispatch])

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    newParams.delete('page') // Reset to first page when filtering
    setSearchParams(newParams)
    dispatch(setCurrentPage(1))
  }

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSortChange = (sortValue) => {
    const newParams = new URLSearchParams(searchParams)

    switch (sortValue) {
      case 'price_low':
        newParams.set('sortBy', 'price')
        newParams.set('sortOrder', 'asc')
        break
      case 'price_high':
        newParams.set('sortBy', 'price')
        newParams.set('sortOrder', 'desc')
        break
      case 'rating':
        newParams.set('sortBy', 'rating')
        newParams.set('sortOrder', 'desc')
        break
      case 'newest':
        newParams.set('sortBy', 'createdAt')
        newParams.set('sortOrder', 'desc')
        break
      default:
        newParams.delete('sortBy')
        newParams.delete('sortOrder')
    }

    setSearchParams(newParams)
  }

  const currentCategory = searchParams.get('category') || 'All'
  const currentSearch = searchParams.get('search') || ''

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          <span>Home</span>
          {currentCategory !== 'All' && (
            <>
              <span className="mx-2">›</span>
              <span>{currentCategory}</span>
            </>
          )}
          {currentSearch && (
            <>
              <span className="mx-2">›</span>
              <span>"{currentSearch}"</span>
            </>
          )}
        </div>

        {/* Results Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">
                {currentSearch ? `Results for "${currentSearch}"` : currentCategory}
              </h1>
              <p className="text-sm text-gray-600">
                {totalProducts} results
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      Sort by: {option.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-200' : 'bg-white'}`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 rounded px-4 py-2 text-sm"
              >
                <FiFilter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <div className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 className="font-bold text-gray-900 mb-4">Filters</h3>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={currentCategory === category}
                        onChange={() => handleFilterChange('category', category === 'All' ? '' : category)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      onChange={() => {
                        handleFilterChange('minPrice', '')
                        handleFilterChange('maxPrice', '')
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Any Price</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      onChange={() => {
                        handleFilterChange('minPrice', '0')
                        handleFilterChange('maxPrice', '25')
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Under $25</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      onChange={() => {
                        handleFilterChange('minPrice', '25')
                        handleFilterChange('maxPrice', '50')
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">$25 to $50</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      onChange={() => {
                        handleFilterChange('minPrice', '50')
                        handleFilterChange('maxPrice', '100')
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">$50 to $100</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      onChange={() => {
                        handleFilterChange('minPrice', '100')
                        handleFilterChange('maxPrice', '')
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">$100 & Above</span>
                  </label>
                </div>
              </div>

              {/* Customer Reviews */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Customer Reviews</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        onChange={() => handleFilterChange('rating', rating.toString())}
                        className="mr-2"
                      />
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-700">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="flex-1">
            {isLoading ? (
              <div className={`grid gap-4 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'grid-cols-1'
              }`}>
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 border">
                    <div className="w-full h-48 bg-gray-200 rounded mb-4 skeleton"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 skeleton"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 skeleton"></div>
                  </div>
                ))}
              </div>
              ) : products && products.length > 0 ? (
                <>
                  <div className={`grid gap-4 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  }`}>
                    {products.map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        variant={viewMode}
                      />
                    ))}
                  </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>

                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 border text-sm rounded ${
                              currentPage === page
                                ? 'bg-orange-400 text-gray-900 border-orange-400'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
                </>
              ) : (
                <div className="bg-white rounded-lg p-8 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
