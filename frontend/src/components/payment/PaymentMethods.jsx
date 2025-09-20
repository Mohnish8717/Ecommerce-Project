import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FiCreditCard, FiTrash2, FiPlus, FiEdit } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { 
  getPaymentMethods, 
  deletePaymentMethod, 
  setSelectedPaymentMethod 
} from '../../store/slices/paymentSlice'

const PaymentMethods = ({ onAddNew, showAddButton = true, selectable = false }) => {
  const dispatch = useDispatch()
  const { paymentMethods, selectedPaymentMethod, isLoading } = useSelector((state) => state.payment)
  
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    dispatch(getPaymentMethods())
  }, [dispatch])

  const handleDeletePaymentMethod = async (paymentMethodId) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      setDeletingId(paymentMethodId)
      try {
        await dispatch(deletePaymentMethod(paymentMethodId)).unwrap()
        toast.success('Payment method deleted successfully')
      } catch (error) {
        toast.error('Failed to delete payment method')
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleSelectPaymentMethod = (paymentMethod) => {
    if (selectable) {
      dispatch(setSelectedPaymentMethod(paymentMethod))
    }
  }

  const getCardBrand = (brand) => {
    const brands = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      discover: 'Discover',
      diners: 'Diners Club',
      jcb: 'JCB',
      unionpay: 'UnionPay'
    }
    return brands[brand] || brand.charAt(0).toUpperCase() + brand.slice(1)
  }

  const getCardIcon = (brand) => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳'
    }
    return icons[brand] || '💳'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading payment methods...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
        {showAddButton && (
          <button
            onClick={onAddNew}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FiPlus className="w-4 h-4 mr-1" />
            Add New
          </button>
        )}
      </div>

      {paymentMethods.length === 0 ? (
        <div className="text-center py-8">
          <FiCreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h4>
          <p className="text-gray-600 mb-4">Add a payment method to get started</p>
          {showAddButton && (
            <button
              onClick={onAddNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Payment Method
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((paymentMethod) => (
            <div
              key={paymentMethod.id}
              className={`border rounded-lg p-4 transition-colors ${
                selectable 
                  ? selectedPaymentMethod?.id === paymentMethod.id
                    ? 'border-blue-500 bg-blue-50 cursor-pointer'
                    : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                  : 'border-gray-200'
              }`}
              onClick={() => handleSelectPaymentMethod(paymentMethod)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectable && (
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={selectedPaymentMethod?.id === paymentMethod.id}
                      onChange={() => handleSelectPaymentMethod(paymentMethod)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {getCardIcon(paymentMethod.card.brand)}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {getCardBrand(paymentMethod.card.brand)}
                        </span>
                        <span className="text-gray-600">
                          •••• {paymentMethod.card.last4}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Expires {paymentMethod.card.exp_month.toString().padStart(2, '0')}/{paymentMethod.card.exp_year}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {paymentMethod.card.brand === 'amex' && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      AMEX
                    </span>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeletePaymentMethod(paymentMethod.id)
                    }}
                    disabled={deletingId === paymentMethod.id}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Delete payment method"
                  >
                    {deletingId === paymentMethod.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    ) : (
                      <FiTrash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Additional card info */}
              <div className="mt-2 text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>
                    Funding: {paymentMethod.card.funding.charAt(0).toUpperCase() + paymentMethod.card.funding.slice(1)}
                  </span>
                  {paymentMethod.card.country && (
                    <span>Country: {paymentMethod.card.country}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PaymentMethods
