import api from './api'

const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/products?${queryString}`)
    return response.data
  },

  // Get single product
  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data.product
  },

  // Search products
  searchProducts: async (searchParams) => {
    const queryString = new URLSearchParams(searchParams).toString()
    const response = await api.get(`/products/search?${queryString}`)
    return response.data
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/products/categories')
    return response.data
  },

  // Create product (seller/admin)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData)
    return response.data
  },

  // Update product (seller/admin)
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  },

  // Delete product (seller/admin)
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  // Add review
  addReview: async (productId, reviewData) => {
    const response = await api.post(`/products/${productId}/reviews`, reviewData)
    return response.data
  },

  // Get product reviews
  getReviews: async (productId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/products/${productId}/reviews?${queryString}`)
    return response.data
  },

  // Upload product images
  uploadImages: async (productId, images) => {
    const formData = new FormData()
    images.forEach((image) => {
      formData.append('images', image)
    })

    const response = await api.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Get seller products
  getSellerProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/products/seller/my-products?${queryString}`)
    return response.data
  },
}

export default productService
