import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiZap, FiUser, FiCheck, FiCopy, FiSmartphone } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

// Custom QR Code Icon Component
const QRCodeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2"/>
    <rect x="5" y="5" width="4" height="4" fill="currentColor"/>
    <rect x="15" y="5" width="4" height="4" fill="currentColor"/>
    <rect x="5" y="15" width="4" height="4" fill="currentColor"/>
    <rect x="13" y="13" width="2" height="2" fill="currentColor"/>
    <rect x="16" y="13" width="2" height="2" fill="currentColor"/>
    <rect x="19" y="13" width="2" height="2" fill="currentColor"/>
    <rect x="13" y="16" width="2" height="2" fill="currentColor"/>
    <rect x="19" y="16" width="2" height="2" fill="currentColor"/>
    <rect x="16" y="19" width="2" height="2" fill="currentColor"/>
    <rect x="19" y="19" width="2" height="2" fill="currentColor"/>
  </svg>
)

const UPIPaymentForm = ({ amount = 0, onSuccess, onError, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState('upi_id') // 'upi_id' or 'qr_code'
  const [upiId, setUpiId] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showQR, setShowQR] = useState(false)

  // Mock UPI ID validation
  const validateUpiId = (id) => {
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/
    return upiRegex.test(id)
  }

  // Popular UPI apps
  const upiApps = [
    { name: 'PhonePe', color: 'purple', icon: '📱' },
    { name: 'Google Pay', color: 'blue', icon: '💳' },
    { name: 'Paytm', color: 'blue', icon: '💰' },
    { name: 'BHIM', color: 'orange', icon: '🏦' },
    { name: 'Amazon Pay', color: 'orange', icon: '🛒' }
  ]

  const handleUpiPayment = async () => {
    if (paymentMethod === 'upi_id' && !validateUpiId(upiId)) {
      toast.error('Please enter a valid UPI ID')
      return
    }

    setIsProcessing(true)

    // Simulate UPI payment processing
    setTimeout(() => {
      // Simulate success (90% success rate)
      if (Math.random() > 0.1) {
        onSuccess({
          method: 'UPI',
          upiId: paymentMethod === 'upi_id' ? upiId : 'QR Code',
          transactionId: `UPI${Date.now()}`,
          amount
        })
        toast.success('UPI payment successful!')
      } else {
        onError('UPI payment failed. Please try again.')
        toast.error('Payment failed. Please try again.')
      }
      setIsProcessing(false)
    }, 3000)
  }

  const generateQRCode = () => {
    // In a real implementation, this would generate an actual UPI QR code
    return `upi://pay?pa=merchant@upi&pn=Nomotix&am=${amount}&cu=INR&tn=Payment for Order`
  }

  const copyUpiLink = () => {
    const upiLink = generateQRCode()
    navigator.clipboard.writeText(upiLink)
    toast.success('UPI link copied to clipboard!')
  }

  if (isProcessing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="relative mb-8">
          <motion.div
            className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FiZap className="w-10 h-10 text-purple-600" />
          </motion.div>
          <motion.div
            className="absolute inset-0 w-20 h-20 mx-auto border-4 border-purple-200 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Processing UPI Payment
        </h3>
        <p className="text-gray-600 mb-4">
          Please complete the payment in your UPI app
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-yellow-800">
            Check your UPI app for payment request and authorize the transaction
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* UPI Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiZap className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pay with UPI</h2>
        <p className="text-gray-600">Fast, secure, and instant payments</p>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">Choose Payment Method</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <motion.button
            onClick={() => setPaymentMethod('upi_id')}
            className={`relative p-6 border-2 rounded-xl transition-all duration-300 transform-gpu ${
              paymentMethod === 'upi_id'
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 via-white to-purple-50 shadow-2xl shadow-purple-200/40'
                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/20'
            }`}
            whileHover={{
              scale: 1.05,
              rotateY: 8,
              rotateX: 2,
              z: 50
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              perspective: '1000px'
            }}
          >
            <div className="relative z-10">
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                paymentMethod === 'upi_id'
                  ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30'
                  : 'bg-gray-100 group-hover:bg-purple-100'
              }`}>
                <FiUser className={`w-7 h-7 ${
                  paymentMethod === 'upi_id' ? 'text-white' : 'text-gray-500'
                }`} />
              </div>
              <div className={`text-base font-semibold mb-1 ${
                paymentMethod === 'upi_id' ? 'text-purple-700' : 'text-gray-900'
              }`}>
                UPI ID
              </div>
              <div className="text-sm text-gray-500">
                Enter your UPI ID
              </div>
            </div>
            {paymentMethod === 'upi_id' && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-purple-600/10 rounded-xl"></div>
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>

          <motion.button
            onClick={() => {
              setPaymentMethod('qr_code')
              setShowQR(true)
            }}
            className={`relative p-6 border-2 rounded-xl transition-all duration-300 transform-gpu ${
              paymentMethod === 'qr_code'
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 via-white to-purple-50 shadow-2xl shadow-purple-200/40'
                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-xl hover:shadow-purple-100/20'
            }`}
            whileHover={{
              scale: 1.05,
              rotateY: -8,
              rotateX: 2,
              z: 50
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              perspective: '1000px'
            }}
          >
            <div className="relative z-10">
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                paymentMethod === 'qr_code'
                  ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30'
                  : 'bg-gray-100 group-hover:bg-purple-100'
              }`}>
                <QRCodeIcon className={`w-7 h-7 ${
                  paymentMethod === 'qr_code' ? 'text-white' : 'text-gray-500'
                }`} />
              </div>
              <div className={`text-base font-semibold mb-1 ${
                paymentMethod === 'qr_code' ? 'text-purple-700' : 'text-gray-900'
              }`}>
                QR Code
              </div>
              <div className="text-sm text-gray-500">
                Scan to pay
              </div>
            </div>
            {paymentMethod === 'qr_code' && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-purple-600/10 rounded-xl"></div>
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </div>
      </div>

      {/* UPI ID Input */}
      <AnimatePresence>
        {paymentMethod === 'upi_id' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your UPI ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@paytm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-3">
                  {validateUpiId(upiId) && (
                    <FiCheck className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Example: yourname@paytm, yourname@phonepe, yourname@googlepay
              </p>
            </div>

            {/* Popular UPI Apps */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-4">Popular UPI Apps</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {upiApps.map((app, index) => (
                  <motion.div
                    key={app.name}
                    initial={{ opacity: 0, scale: 0, rotateY: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 20
                    }}
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                      z: 20
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex items-center space-x-3 bg-gradient-to-br from-white to-gray-50 border border-gray-200 px-4 py-3 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform-gpu"
                    style={{
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    <div className="text-2xl">{app.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{app.name}</div>
                      <div className="text-xs text-gray-500">Tap to open</div>
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Display */}
      <AnimatePresence>
        {paymentMethod === 'qr_code' && showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="text-center space-y-6"
          >
            <motion.div
              className="relative bg-gradient-to-br from-white via-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8 max-w-sm mx-auto shadow-2xl"
              whileHover={{
                scale: 1.02,
                rotateY: 2,
                rotateX: 2
              }}
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden'
              }}
            >
              {/* Mock QR Code */}
              <div className="relative w-56 h-56 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <QRCodeIcon className="w-20 h-20 text-gray-400 mx-auto mb-3" />
                  </motion.div>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-gray-700">Scan & Pay</p>
                    <p className="text-2xl font-bold text-purple-600">₹{amount}</p>
                    <p className="text-xs text-gray-500">UPI Payment</p>
                  </div>
                </div>

                {/* Animated corner indicators */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-purple-500 rounded-tl"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-purple-500 rounded-tr"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-purple-500 rounded-bl"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-purple-500 rounded-br"></div>
              </div>

              <motion.button
                onClick={copyUpiLink}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FiCopy className="w-4 h-4" />
                <span>Copy UPI Link</span>
              </motion.button>

              {/* Shine effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <FiSmartphone className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <h4 className="text-sm font-medium text-blue-900">How to pay</h4>
                  <ol className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>1. Open any UPI app on your phone</li>
                    <li>2. Scan this QR code or use the copied link</li>
                    <li>3. Verify amount and complete payment</li>
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Amount Display */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-purple-800 font-medium">Amount to Pay</span>
          <span className="text-2xl font-bold text-purple-900">₹{amount}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        
        <motion.button
          onClick={handleUpiPayment}
          disabled={paymentMethod === 'upi_id' && !validateUpiId(upiId)}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiZap className="w-5 h-5" />
          <span>Pay ₹{amount}</span>
        </motion.button>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-green-800">Secure UPI Payment</h4>
            <p className="text-sm text-green-700 mt-1">
              Your payment is processed securely through UPI. No card details required.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default UPIPaymentForm
