import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  FiUser, FiShoppingBag, FiCreditCard, FiLock,
  FiBell, FiShield, FiDownload, FiEdit3, FiCamera, FiCheck,
  FiX, FiEye, FiEyeOff, FiTrash2, FiMail, FiPhone, FiCalendar,
  FiMapPin
} from 'react-icons/fi'
import userService from '../services/userService'
import PaymentMethods from '../components/payment/PaymentMethods'
import PaymentHistory from '../components/payment/PaymentHistory'
import ProfileStats from '../components/profile/ProfileStats'
import OrderCard from '../components/profile/OrderCard'
import AddressBook from '../components/profile/AddressBook'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)

  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    preferences: {
      newsletter: true,
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    }
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [errors, setErrors] = useState({})
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    savedPaymentMethods: 0,
    profileCompletion: 0,
    totalSaved: 0,
    loyaltyPoints: 0,
    wishlistItems: 0,
    monthlyOrders: 0
  })

  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])

  // Load user profile data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'US'
        },
        preferences: {
          newsletter: user.preferences?.newsletter ?? true,
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            sms: user.preferences?.notifications?.sms ?? false,
            push: user.preferences?.notifications?.push ?? true
          }
        }
      })

      // Calculate profile completion
      const completion = userService.calculateProfileCompletion(user)
      setUserStats(prev => ({
        ...prev,
        profileCompletion: completion,
        totalOrders: 12,
        totalSpent: 1250.50,
        totalSaved: 125.75,
        loyaltyPoints: 850,
        wishlistItems: 5,
        monthlyOrders: 3,
        savedPaymentMethods: 2
      }))

      // Load user orders (mock data for now)
      setOrders([
        {
          _id: '1',
          orderStatus: 'delivered',
          totalPrice: 89.99,
          createdAt: new Date('2024-01-15'),
          deliveredAt: new Date('2024-01-18'),
          orderItems: [
            {
              product: {
                name: 'Wireless Headphones',
                image: '/api/placeholder/100/100'
              }
            },
            {
              product: {
                name: 'Phone Case',
                image: '/api/placeholder/100/100'
              }
            }
          ]
        },
        {
          _id: '2',
          orderStatus: 'shipped',
          totalPrice: 159.99,
          createdAt: new Date('2024-01-20'),
          estimatedDelivery: new Date('2024-01-25'),
          trackingNumber: 'TRK123456789',
          orderItems: [
            {
              product: {
                name: 'Bluetooth Speaker',
                image: '/api/placeholder/100/100'
              }
            }
          ]
        }
      ])

      // Load addresses (mock data for now)
      setAddresses([
        {
          _id: '1',
          label: 'Home',
          fullName: user.name,
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US',
          isDefault: true
        }
      ])
    }
  }, [user])

  const tabs = [
    { id: 'profile', name: 'Profile', icon: FiUser },
    { id: 'orders', name: 'Orders', icon: FiShoppingBag },
    { id: 'payments', name: 'Payments', icon: FiCreditCard },
    { id: 'security', name: 'Security', icon: FiLock },
    { id: 'notifications', name: 'Notifications', icon: FiBell },
    { id: 'privacy', name: 'Privacy', icon: FiShield }
  ]

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSaveProfile = async () => {
    const validation = userService.validateProfileData(profileData)

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsLoading(true)
    try {
      const response = await userService.updateProfile(profileData)
      if (response.success) {
        toast.success('Profile updated successfully!')
        setIsEditing(false)
        setErrors({})
        // Update Redux store if needed
      }
    } catch (error) {
      toast.error('Failed to update profile')
      console.error('Profile update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    const validation = userService.validatePasswordChange(passwordData)

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsLoading(true)
    try {
      const response = await userService.changePassword(passwordData)
      if (response.success) {
        toast.success('Password changed successfully!')
        setShowPasswordForm(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setErrors({})
      }
    } catch (error) {
      toast.error('Failed to change password')
      console.error('Password change error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Address management functions
  const handleAddAddress = async (addressData) => {
    // Mock implementation - replace with actual API call
    const newAddress = {
      _id: Date.now().toString(),
      ...addressData
    }
    setAddresses(prev => [...prev, newAddress])
  }

  const handleUpdateAddress = async (addressId, addressData) => {
    // Mock implementation - replace with actual API call
    setAddresses(prev =>
      prev.map(addr =>
        addr._id === addressId ? { ...addr, ...addressData } : addr
      )
    )
  }

  const handleDeleteAddress = async (addressId) => {
    // Mock implementation - replace with actual API call
    setAddresses(prev => prev.filter(addr => addr._id !== addressId))
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              {/* User Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={user?.profileImage || userService.getDefaultAvatarUrl(user?.name)}
                    alt={user?.name || 'User'}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <FiCamera className="w-3 h-3" />
                  </button>
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{user?.name || 'User'}</h3>
                <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>

                {/* Profile Completion */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Profile Completion</span>
                    <span className="font-medium text-gray-900">{userStats.profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${userStats.profileCompletion}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 mr-3" />
                      {tab.name}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm"
              >
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <FiEdit3 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setIsEditing(false)
                              setErrors({})
                            }}
                            className="flex items-center px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <FiX className="w-4 h-4 mr-2" />
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveProfile}
                            disabled={isLoading}
                            className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            <FiCheck className="w-4 h-4 mr-2" />
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <div className="relative">
                            <FiUser className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={profileData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                              } ${errors.name ? 'border-red-300' : ''}`}
                            />
                          </div>
                          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <div className="relative">
                            <FiMail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="email"
                              value={profileData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                              } ${errors.email ? 'border-red-300' : ''}`}
                            />
                          </div>
                          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <div className="relative">
                            <FiPhone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              disabled={!isEditing}
                              placeholder="(555) 123-4567"
                              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                              } ${errors.phone ? 'border-red-300' : ''}`}
                            />
                          </div>
                          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date of Birth
                          </label>
                          <div className="relative">
                            <FiCalendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="date"
                              value={profileData.dateOfBirth}
                              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                              disabled={!isEditing}
                              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                              } ${errors.dateOfBirth ? 'border-red-300' : ''}`}
                            />
                          </div>
                          {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                          </label>
                          <select
                            value={profileData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            disabled={!isEditing}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street Address
                          </label>
                          <div className="relative">
                            <FiMapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              value={profileData.address.street}
                              onChange={(e) => handleInputChange('address.street', e.target.value)}
                              disabled={!isEditing}
                              placeholder="123 Main Street"
                              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              value={profileData.address.city}
                              onChange={(e) => handleInputChange('address.city', e.target.value)}
                              disabled={!isEditing}
                              placeholder="New York"
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              State
                            </label>
                            <input
                              type="text"
                              value={profileData.address.state}
                              onChange={(e) => handleInputChange('address.state', e.target.value)}
                              disabled={!isEditing}
                              placeholder="NY"
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ZIP Code
                            </label>
                            <input
                              type="text"
                              value={profileData.address.zipCode}
                              onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                              disabled={!isEditing}
                              placeholder="10001"
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Country
                            </label>
                            <select
                              value={profileData.address.country}
                              onChange={(e) => handleInputChange('address.country', e.target.value)}
                              disabled={!isEditing}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                              <option value="MX">Mexico</option>
                              <option value="IN">India</option>
                              <option value="GB">United Kingdom</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Book Section */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <AddressBook
                        addresses={addresses}
                        onAddAddress={handleAddAddress}
                        onUpdateAddress={handleUpdateAddress}
                        onDeleteAddress={handleDeleteAddress}
                      />
                    </div>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
                      <div className="flex items-center space-x-4">
                        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="all">All Orders</option>
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    {/* Profile Stats */}
                    <ProfileStats stats={userStats} />

                    {/* Orders List */}
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <OrderCard
                            key={order._id}
                            order={order}
                            onViewDetails={(order) => {
                              // Handle view order details
                              console.log('View order details:', order)
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FiShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                        <button
                          onClick={() => window.location.href = '/products'}
                          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Start Shopping
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Payments Tab */}
                {activeTab === 'payments' && (
                  <div className="p-6">
                    <div className="space-y-8">
                      <PaymentMethods showAddButton={true} />
                      <PaymentHistory />
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

                    <div className="space-y-6">
                      {/* Change Password */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Password</h3>
                            <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                          </div>
                          <button
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Change Password
                          </button>
                        </div>

                        <AnimatePresence>
                          {showPasswordForm && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-4 pt-4 border-t border-gray-200"
                            >
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Current Password
                                </label>
                                <div className="relative">
                                  <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({
                                      ...prev,
                                      currentPassword: e.target.value
                                    }))}
                                    className={`w-full pr-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                      errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPasswords(prev => ({
                                      ...prev,
                                      current: !prev.current
                                    }))}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                  >
                                    {showPasswords.current ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                  </button>
                                </div>
                                {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  New Password
                                </label>
                                <div className="relative">
                                  <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({
                                      ...prev,
                                      newPassword: e.target.value
                                    }))}
                                    className={`w-full pr-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                      errors.newPassword ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPasswords(prev => ({
                                      ...prev,
                                      new: !prev.new
                                    }))}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                  >
                                    {showPasswords.new ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                  </button>
                                </div>
                                {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Confirm New Password
                                </label>
                                <div className="relative">
                                  <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData(prev => ({
                                      ...prev,
                                      confirmPassword: e.target.value
                                    }))}
                                    className={`w-full pr-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPasswords(prev => ({
                                      ...prev,
                                      confirm: !prev.confirm
                                    }))}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                  >
                                    {showPasswords.confirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                                  </button>
                                </div>
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                              </div>

                              <div className="flex justify-end space-x-3 pt-4">
                                <button
                                  onClick={() => {
                                    setShowPasswordForm(false)
                                    setPasswordData({
                                      currentPassword: '',
                                      newPassword: '',
                                      confirmPassword: ''
                                    })
                                    setErrors({})
                                  }}
                                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handlePasswordChange}
                                  disabled={isLoading}
                                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                  {isLoading ? 'Updating...' : 'Update Password'}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                          </div>
                          <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            Enable 2FA
                          </button>
                        </div>
                      </div>

                      {/* Login Sessions */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Active Sessions</h3>
                            <p className="text-sm text-gray-600">Manage your active login sessions</p>
                          </div>
                          <button className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            View All Sessions
                          </button>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Current session: Chrome on Windows • New York, NY</p>
                          <p className="text-xs text-gray-500 mt-1">Last activity: Just now</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>

                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Order Updates</p>
                              <p className="text-sm text-gray-600">Get notified about your order status</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={profileData.preferences.notifications.email}
                                onChange={(e) => handleInputChange('preferences.notifications.email', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Newsletter</p>
                              <p className="text-sm text-gray-600">Receive our weekly newsletter with deals and updates</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={profileData.preferences.newsletter}
                                onChange={(e) => handleInputChange('preferences.newsletter', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Browser Notifications</p>
                              <p className="text-sm text-gray-600">Get notified in your browser</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={profileData.preferences.notifications.push}
                                onChange={(e) => handleInputChange('preferences.notifications.push', e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Data</h2>

                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Data Export</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Download a copy of your personal data including profile information, orders, and preferences.
                        </p>
                        <button className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                          <FiDownload className="w-4 h-4 mr-2" />
                          Export My Data
                        </button>
                      </div>

                      <div className="border border-red-200 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-red-900 mb-4">Delete Account</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="flex items-center px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Delete Account Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg max-w-md w-full p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <FiTrash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete your account? All your data, including orders,
                  payment methods, and preferences will be permanently removed.
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await userService.deleteAccount()
                        toast.success('Account deleted successfully')
                        // Redirect to home or login page
                        window.location.href = '/'
                      } catch (error) {
                        toast.error('Failed to delete account')
                      }
                    }}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Profile
