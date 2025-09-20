import api from './api'

const orderService = {
  // Create order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  // Get user orders
  getUserOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/orders/myorders?${queryString}`)
    return response.data
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  // Update order status (seller/admin)
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status })
    return response.data
  },

  // Get all orders (admin)
  getAllOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/orders?${queryString}`)
    return response.data
  },

  // Get seller orders
  getSellerOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/orders/seller/my-orders?${queryString}`)
    return response.data
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`)
    return response.data
  },

  // Track order
  trackOrder: async (id) => {
    const response = await api.get(`/orders/${id}/track`)
    return response.data
  },
}

export default orderService
