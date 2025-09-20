import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMapPin, FiPlus, FiEdit3, FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

const AddressBook = ({ addresses = [], onAddAddress, onUpdateAddress, onDeleteAddress }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    label: '',
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    isDefault: false
  })

  const resetForm = () => {
    setFormData({
      label: '',
      fullName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
      isDefault: false
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingId) {
        await onUpdateAddress(editingId, formData)
        toast.success('Address updated successfully')
        setEditingId(null)
      } else {
        await onAddAddress(formData)
        toast.success('Address added successfully')
        setShowAddForm(false)
      }
      resetForm()
    } catch (error) {
      toast.error('Failed to save address')
    }
  }

  const handleEdit = (address) => {
    setFormData({
      label: address.label || '',
      fullName: address.fullName || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country || 'US',
      isDefault: address.isDefault || false
    })
    setEditingId(address._id)
    setShowAddForm(false)
  }

  const handleDelete = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await onDeleteAddress(addressId)
        toast.success('Address deleted successfully')
      } catch (error) {
        toast.error('Failed to delete address')
      }
    }
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingId(null)
    resetForm()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Address Book</h3>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingId(null)
            resetForm()
          }}
          className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Address
        </button>
      </div>

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <motion.div
            key={address._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`border rounded-lg p-4 relative ${
              address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
          >
            {address.isDefault && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  <FiCheck className="w-3 h-3 mr-1" />
                  Default
                </span>
              </div>
            )}

            <div className="flex items-start mb-3">
              <FiMapPin className="w-4 h-4 text-gray-400 mt-1 mr-2" />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{address.label}</h4>
                <p className="text-sm text-gray-600">{address.fullName}</p>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => handleEdit(address)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Edit address"
              >
                <FiEdit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(address._id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete address"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(showAddForm || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-gray-200 rounded-lg p-6 bg-gray-50"
          >
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Label
                  </label>
                  <input
                    type="text"
                    value={formData.label}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Home, Work, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                  Set as default address
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <FiX className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FiCheck className="w-4 h-4 mr-2" />
                  {editingId ? 'Update Address' : 'Add Address'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {addresses.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <FiMapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-600 mb-4">Add an address to make checkout faster</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Your First Address
          </button>
        </div>
      )}
    </div>
  )
}

export default AddressBook
