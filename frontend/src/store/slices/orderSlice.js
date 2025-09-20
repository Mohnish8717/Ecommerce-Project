import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import orderService from '../../services/orderService'

const initialState = {
  orders: [],
  order: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
}

// Create order
export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, thunkAPI) => {
    try {
      return await orderService.createOrder(orderData)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get user orders
export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, thunkAPI) => {
    try {
      return await orderService.getUserOrders()
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get all orders (for admin/seller)
export const getOrders = createAsyncThunk(
  'orders/getAll',
  async (_, thunkAPI) => {
    try {
      return await orderService.getAllOrders()
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get order by ID
export const getOrderById = createAsyncThunk(
  'orders/getById',
  async (id, thunkAPI) => {
    try {
      return await orderService.getOrderById(id)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      return await orderService.updateOrderStatus(id, status)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },
    clearOrder: (state) => {
      state.order = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.order = action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false
        state.order = action.payload
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        const updatedOrder = action.payload
        state.orders = state.orders.map(order =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
        if (state.order && state.order._id === updatedOrder._id) {
          state.order = updatedOrder
        }
      })
  },
})

export const { reset, clearOrder } = orderSlice.actions
export default orderSlice.reducer
