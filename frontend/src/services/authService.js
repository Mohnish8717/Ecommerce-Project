import api from './api'

const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  },

  // Login user
  login: async (userData) => {
    console.log('Attempting login with:', userData)
    const response = await api.post('/auth/login', userData)
    console.log('Login response:', response.data)

    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }

    return response.data
  },

  // Logout user
  logout: async () => {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData)
    
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData)
    return response.data
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.put(`/auth/reset-password/${token}`, { password })
    return response.data
  },
}

export default authService
