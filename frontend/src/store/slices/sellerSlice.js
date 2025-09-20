import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

// Async thunks
export const getSellerProducts = createAsyncThunk(
  'seller/getSellerProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/seller/products')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch seller products')
    }
  }
)

export const getSellerOrders = createAsyncThunk(
  'seller/getSellerOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/seller/orders')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch seller orders')
    }
  }
)

export const getSellerStats = createAsyncThunk(
  'seller/getSellerStats',
  async ({ timeRange }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/seller/stats?timeRange=${timeRange}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch seller stats')
    }
  }
)

export const updateSellerProfile = createAsyncThunk(
  'seller/updateSellerProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/api/seller/profile', profileData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update seller profile')
    }
  }
)

export const getSellerAnalytics = createAsyncThunk(
  'seller/getSellerAnalytics',
  async ({ timeRange }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/seller/analytics?timeRange=${timeRange}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch seller analytics')
    }
  }
)

const initialState = {
  products: [],
  orders: [],
  stats: {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    averageRating: 0,
    revenueChange: 0,
    ordersChange: 0
  },
  analytics: {
    revenue: {
      current: 0,
      previous: 0,
      change: 0
    },
    orders: {
      current: 0,
      previous: 0,
      change: 0
    },
    topProducts: [],
    recentSales: [],
    customerStats: {
      totalCustomers: 0,
      returningCustomers: 0
    }
  },
  profile: null,
  isLoading: false,
  error: null
}

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    clearSellerError: (state) => {
      state.error = null
    },
    resetSellerState: (state) => {
      return initialState
    },
    updateProductInList: (state, action) => {
      const { productId, updates } = action.payload
      const productIndex = state.products.findIndex(p => p._id === productId)
      if (productIndex !== -1) {
        state.products[productIndex] = { ...state.products[productIndex], ...updates }
      }
    },
    removeProductFromList: (state, action) => {
      const productId = action.payload
      state.products = state.products.filter(p => p._id !== productId)
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload
      const orderIndex = state.orders.findIndex(o => o._id === orderId)
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = status
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Seller Products
      .addCase(getSellerProducts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getSellerProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload
      })
      .addCase(getSellerProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Seller Orders
      .addCase(getSellerOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getSellerOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload
      })
      .addCase(getSellerOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Seller Stats
      .addCase(getSellerStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getSellerStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
      })
      .addCase(getSellerStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Update Seller Profile
      .addCase(updateSellerProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateSellerProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload
      })
      .addCase(updateSellerProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Get Seller Analytics
      .addCase(getSellerAnalytics.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getSellerAnalytics.fulfilled, (state, action) => {
        state.isLoading = false
        state.analytics = action.payload
      })
      .addCase(getSellerAnalytics.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const {
  clearSellerError,
  resetSellerState,
  updateProductInList,
  removeProductFromList,
  updateOrderStatus
} = sellerSlice.actions

export default sellerSlice.reducer
