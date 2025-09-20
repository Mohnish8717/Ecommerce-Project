import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import paymentService from '../../services/paymentService'
import upiService from '../../services/upiService'

const initialState = {
  paymentMethods: [],
  currentPaymentIntent: null,
  clientSecret: null,
  paymentStatus: null,
  orderTotals: {
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    discountAmount: 0,
    totalPrice: 0
  },
  shippingAddress: {
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  },
  billingAddress: {
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    sameAsShipping: true
  },
  selectedPaymentMethod: null,
  couponCode: '',
  // UPI specific state
  upiPaymentIntent: null,
  upiTransactionId: null,
  upiStatus: null,
  supportedUpiApps: [],
  isLoading: false,
  isProcessing: false,
  error: null,
  success: false
}

// Create payment intent
export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async (paymentData, thunkAPI) => {
    try {
      return await paymentService.createPaymentIntent(paymentData)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get payment methods
export const getPaymentMethods = createAsyncThunk(
  'payment/getPaymentMethods',
  async (_, thunkAPI) => {
    try {
      return await paymentService.getPaymentMethods()
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create customer
export const createCustomer = createAsyncThunk(
  'payment/createCustomer',
  async (_, thunkAPI) => {
    try {
      return await paymentService.createCustomer()
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Save payment method
export const savePaymentMethod = createAsyncThunk(
  'payment/savePaymentMethod',
  async (paymentMethodId, thunkAPI) => {
    try {
      const result = await paymentService.savePaymentMethod(paymentMethodId)
      // Refresh payment methods after saving
      thunkAPI.dispatch(getPaymentMethods())
      return result
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete payment method
export const deletePaymentMethod = createAsyncThunk(
  'payment/deletePaymentMethod',
  async (paymentMethodId, thunkAPI) => {
    try {
      const result = await paymentService.deletePaymentMethod(paymentMethodId)
      // Refresh payment methods after deletion
      thunkAPI.dispatch(getPaymentMethods())
      return result
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Confirm payment
export const confirmPayment = createAsyncThunk(
  'payment/confirmPayment',
  async (paymentData, thunkAPI) => {
    try {
      return await paymentService.confirmPayment(paymentData)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create UPI payment intent
export const createUpiPaymentIntent = createAsyncThunk(
  'payment/createUpiPaymentIntent',
  async (paymentData, thunkAPI) => {
    try {
      return await upiService.createUpiPaymentIntent(paymentData)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Verify UPI payment
export const verifyUpiPayment = createAsyncThunk(
  'payment/verifyUpiPayment',
  async (verificationData, thunkAPI) => {
    try {
      return await upiService.verifyUpiPayment(verificationData)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get UPI payment status
export const getUpiPaymentStatus = createAsyncThunk(
  'payment/getUpiPaymentStatus',
  async (transactionId, thunkAPI) => {
    try {
      return await upiService.getUpiPaymentStatus(transactionId)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // Reset payment state
    resetPayment: (state) => {
      state.currentPaymentIntent = null
      state.clientSecret = null
      state.paymentStatus = null
      state.selectedPaymentMethod = null
      state.isLoading = false
      state.isProcessing = false
      state.error = null
      state.success = false
    },
    
    // Set shipping address
    setShippingAddress: (state, action) => {
      state.shippingAddress = { ...state.shippingAddress, ...action.payload }
      // Recalculate totals when address changes
      const cartItems = action.payload.cartItems || []
      state.orderTotals = paymentService.calculateOrderTotals(
        cartItems,
        state.shippingAddress,
        state.couponCode
      )
    },
    
    // Set billing address
    setBillingAddress: (state, action) => {
      state.billingAddress = { ...state.billingAddress, ...action.payload }
    },
    
    // Toggle same as shipping for billing
    toggleSameAsShipping: (state) => {
      state.billingAddress.sameAsShipping = !state.billingAddress.sameAsShipping
      if (state.billingAddress.sameAsShipping) {
        state.billingAddress = {
          ...state.shippingAddress,
          sameAsShipping: true
        }
      }
    },
    
    // Set selected payment method
    setSelectedPaymentMethod: (state, action) => {
      state.selectedPaymentMethod = action.payload
    },
    
    // Set coupon code
    setCouponCode: (state, action) => {
      state.couponCode = action.payload
      // Recalculate totals when coupon changes
      const cartItems = action.payload.cartItems || []
      state.orderTotals = paymentService.calculateOrderTotals(
        cartItems,
        state.shippingAddress,
        state.couponCode
      )
    },
    
    // Calculate order totals
    calculateTotals: (state, action) => {
      const { cartItems } = action.payload
      state.orderTotals = paymentService.calculateOrderTotals(
        cartItems,
        state.shippingAddress,
        state.couponCode
      )
    },
    
    // Set payment status
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null
    },
    
    // Set processing state
    setProcessing: (state, action) => {
      state.isProcessing = action.payload
    },

    // UPI specific actions
    setUpiTransactionId: (state, action) => {
      state.upiTransactionId = action.payload
    },

    setUpiStatus: (state, action) => {
      state.upiStatus = action.payload
    },

    clearUpiData: (state) => {
      state.upiPaymentIntent = null
      state.upiTransactionId = null
      state.upiStatus = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Create payment intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.isLoading = false
        state.success = true
        state.clientSecret = action.payload.clientSecret
        state.currentPaymentIntent = action.payload.paymentIntentId
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Get payment methods
      .addCase(getPaymentMethods.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getPaymentMethods.fulfilled, (state, action) => {
        state.isLoading = false
        state.paymentMethods = action.payload.paymentMethods || []
      })
      .addCase(getPaymentMethods.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Create customer
      .addCase(createCustomer.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.isLoading = false
        state.success = true
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Save payment method
      .addCase(savePaymentMethod.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(savePaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false
        state.success = true
      })
      .addCase(savePaymentMethod.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Delete payment method
      .addCase(deletePaymentMethod.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false
        state.success = true
      })
      .addCase(deletePaymentMethod.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Confirm payment
      .addCase(confirmPayment.pending, (state) => {
        state.isProcessing = true
        state.error = null
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.isProcessing = false
        state.success = true
        state.paymentStatus = 'succeeded'
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.isProcessing = false
        state.error = action.payload
        state.paymentStatus = 'failed'
      })

      // Create UPI payment intent
      .addCase(createUpiPaymentIntent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createUpiPaymentIntent.fulfilled, (state, action) => {
        state.isLoading = false
        state.success = true
        state.upiPaymentIntent = action.payload.paymentIntent
      })
      .addCase(createUpiPaymentIntent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Verify UPI payment
      .addCase(verifyUpiPayment.pending, (state) => {
        state.isProcessing = true
        state.error = null
      })
      .addCase(verifyUpiPayment.fulfilled, (state, action) => {
        state.isProcessing = false
        state.success = true
        state.upiStatus = action.payload.verification.status
        state.paymentStatus = action.payload.verification.status === 'completed' ? 'succeeded' : 'failed'
      })
      .addCase(verifyUpiPayment.rejected, (state, action) => {
        state.isProcessing = false
        state.error = action.payload
        state.paymentStatus = 'failed'
      })

      // Get UPI payment status
      .addCase(getUpiPaymentStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getUpiPaymentStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.upiStatus = action.payload.status.status
      })
      .addCase(getUpiPaymentStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const {
  resetPayment,
  setShippingAddress,
  setBillingAddress,
  toggleSameAsShipping,
  setSelectedPaymentMethod,
  setCouponCode,
  calculateTotals,
  setPaymentStatus,
  clearError,
  setProcessing,
  setUpiTransactionId,
  setUpiStatus,
  clearUpiData
} = paymentSlice.actions

export default paymentSlice.reducer
