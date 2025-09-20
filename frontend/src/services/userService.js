import api from './api'

const API_URL = '/api/users'

// Get user profile
const getProfile = async () => {
  const response = await api.get(`${API_URL}/profile`)
  return response.data
}

// Update user profile
const updateProfile = async (profileData) => {
  const response = await api.put(`${API_URL}/profile`, profileData)
  return response.data
}

// Change password
const changePassword = async (passwordData) => {
  const response = await api.put(`${API_URL}/change-password`, passwordData)
  return response.data
}

// Delete account
const deleteAccount = async () => {
  const response = await api.delete(`${API_URL}/profile`)
  return response.data
}

// Get user orders
const getUserOrders = async (page = 1, limit = 10) => {
  const response = await api.get(`${API_URL}/orders?page=${page}&limit=${limit}`)
  return response.data
}

// Get specific order
const getOrder = async (orderId) => {
  const response = await api.get(`${API_URL}/orders/${orderId}`)
  return response.data
}

// Upload profile image
const uploadProfileImage = async (imageFile) => {
  const formData = new FormData()
  formData.append('profileImage', imageFile)
  
  const response = await api.post(`${API_URL}/upload-profile-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

// Get user statistics
const getUserStats = async () => {
  const response = await api.get(`${API_URL}/stats`)
  return response.data
}

// Update notification preferences
const updateNotificationPreferences = async (preferences) => {
  const response = await api.put(`${API_URL}/preferences/notifications`, preferences)
  return response.data
}

// Update privacy settings
const updatePrivacySettings = async (settings) => {
  const response = await api.put(`${API_URL}/preferences/privacy`, settings)
  return response.data
}

// Export user data
const exportUserData = async () => {
  const response = await api.get(`${API_URL}/export-data`, {
    responseType: 'blob'
  })
  return response.data
}

// Validate profile data
const validateProfileData = (data) => {
  const errors = {}
  
  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long'
  }
  
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email address'
  }
  
  if (data.phone && !/^\+?[\d\s\-\(\)]+$/.test(data.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }
  
  if (data.dateOfBirth) {
    const birthDate = new Date(data.dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    
    if (age < 13) {
      errors.dateOfBirth = 'You must be at least 13 years old'
    }
    
    if (birthDate > today) {
      errors.dateOfBirth = 'Birth date cannot be in the future'
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validate password change
const validatePasswordChange = (data) => {
  const errors = {}
  
  if (!data.currentPassword) {
    errors.currentPassword = 'Current password is required'
  }
  
  if (!data.newPassword) {
    errors.newPassword = 'New password is required'
  } else if (data.newPassword.length < 6) {
    errors.newPassword = 'New password must be at least 6 characters long'
  }
  
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your new password'
  } else if (data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }
  
  if (data.currentPassword === data.newPassword) {
    errors.newPassword = 'New password must be different from current password'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Format user data for display
const formatUserData = (user) => {
  const userName = user?.name || 'User'
  return {
    ...user,
    fullName: userName,
    initials: userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2),
    memberSince: new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    }),
    lastLoginFormatted: user.lastLogin 
      ? new Date(user.lastLogin).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      : 'Never',
    ageFromBirthDate: user.dateOfBirth 
      ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()
      : null
  }
}

// Get default avatar URL
const getDefaultAvatarUrl = (name) => {
  if (!name || typeof name !== 'string') {
    name = 'User'
  }

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  // Generate a color based on the name
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]
  
  const colorIndex = name.length % colors.length
  const backgroundColor = colors[colorIndex]
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${backgroundColor.slice(1)}&color=fff&size=200&bold=true`
}

// Calculate profile completion percentage
const calculateProfileCompletion = (user) => {
  if (!user) return 0

  const fields = [
    'name', 'email', 'phone', 'dateOfBirth', 'gender',
    'address.street', 'address.city', 'address.state', 'address.zipCode'
  ]

  let completedFields = 0

  fields.forEach(field => {
    const fieldParts = field.split('.')
    let value = user

    for (const part of fieldParts) {
      value = value?.[part]
    }

    if (value && value.toString().trim()) {
      completedFields++
    }
  })

  return Math.round((completedFields / fields.length) * 100)
}

const userService = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getUserOrders,
  getOrder,
  uploadProfileImage,
  getUserStats,
  updateNotificationPreferences,
  updatePrivacySettings,
  exportUserData,
  validateProfileData,
  validatePasswordChange,
  formatUserData,
  getDefaultAvatarUrl,
  calculateProfileCompletion
}

export default userService
