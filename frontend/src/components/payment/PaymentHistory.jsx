import { useState, useEffect } from 'react'
import { FiCreditCard, FiCalendar, FiDollarSign, FiEye, FiDownload } from 'react-icons/fi'
import PaymentStatus from './PaymentStatus'

const PaymentHistory = () => {
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  // Mock payment data - replace with actual API call
  useEffect(() => {
    const mockPayments = [
      {
        id: 'pi_1234567890',
        amount: 129.99,
        currency: 'usd',
        status: 'succeeded',
        created: new Date('2024-01-15'),
        paymentMethod: {
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            exp_month: 12,
            exp_year: 2025
          }
        },
        description: 'Order #ORD-001',
        receipt_url: 'https://pay.stripe.com/receipts/...'
      },
      {
        id: 'pi_0987654321',
        amount: 89.50,
        currency: 'usd',
        status: 'succeeded',
        created: new Date('2024-01-10'),
        paymentMethod: {
          type: 'card',
          card: {
            brand: 'mastercard',
            last4: '8888',
            exp_month: 8,
            exp_year: 2026
          }
        },
        description: 'Order #ORD-002',
        receipt_url: 'https://pay.stripe.com/receipts/...'
      },
      {
        id: 'pi_1122334455',
        amount: 45.00,
        currency: 'usd',
        status: 'failed',
        created: new Date('2024-01-08'),
        paymentMethod: {
          type: 'card',
          card: {
            brand: 'visa',
            last4: '0000',
            exp_month: 3,
            exp_year: 2024
          }
        },
        description: 'Order #ORD-003',
        failure_reason: 'Your card was declined.'
      }
    ]

    setTimeout(() => {
      setPayments(mockPayments)
      setIsLoading(false)
    }, 1000)
  }, [])

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount)
  }

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment)
    setShowDetails(true)
  }

  const handleDownloadReceipt = (payment) => {
    if (payment.receipt_url) {
      window.open(payment.receipt_url, '_blank')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading payment history...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
        <div className="text-sm text-gray-500">
          {payments.length} payment{payments.length !== 1 ? 's' : ''}
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <FiCreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-600">Your payment history will appear here once you make a purchase.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiCreditCard className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.paymentMethod.card.brand.toUpperCase()} •••• {payment.paymentMethod.card.last4}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiDollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount, payment.currency)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.status === 'succeeded' 
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {formatDate(payment.created)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(payment)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <FiEye className="w-4 h-4 mr-1" />
                          View
                        </button>
                        {payment.receipt_url && (
                          <button
                            onClick={() => handleDownloadReceipt(payment)}
                            className="text-gray-600 hover:text-gray-900 flex items-center"
                          >
                            <FiDownload className="w-4 h-4 mr-1" />
                            Receipt
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {showDetails && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <PaymentStatus
                  status={selectedPayment.status}
                  message={selectedPayment.failure_reason}
                  amount={selectedPayment.amount}
                  paymentMethod={selectedPayment.paymentMethod}
                />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Payment ID:</span>
                    <p className="text-gray-600 font-mono">{selectedPayment.id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p className="text-gray-600">{formatDate(selectedPayment.created)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="text-gray-600">{selectedPayment.description}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Currency:</span>
                    <p className="text-gray-600">{selectedPayment.currency.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentHistory
