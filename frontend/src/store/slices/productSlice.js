import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from '../../services/productService'

const initialState = {
  products: [],
  product: null,
  categories: [],
  totalPages: 0,
  currentPage: 1,
  totalProducts: 0,
  isLoading: false,
  isError: false,
  message: '',
  filters: {
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
}

// Get all products
export const getProducts = createAsyncThunk(
  'products/getAll',
  async (params, thunkAPI) => {
    try {
      return await productService.getProducts(params)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get single product
export const getProduct = createAsyncThunk(
  'products/getOne',
  async (id, thunkAPI) => {
    try {
      return await productService.getProduct(id)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get categories
export const getCategories = createAsyncThunk(
  'products/getCategories',
  async (_, thunkAPI) => {
    try {
      return await productService.getCategories()
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Search products
export const searchProducts = createAsyncThunk(
  'products/search',
  async (searchParams, thunkAPI) => {
    try {
      return await productService.searchProducts(searchParams)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create product
export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token
      return await productService.createProduct(productData, token)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update product
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, productData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token
      return await productService.updateProduct(id, productData, token)
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete product
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token
      await productService.deleteProduct(id, token)
      return id
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isError = false
      state.message = ''
    },
    clearProduct: (state) => {
      state.product = null
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload.products
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
        state.totalProducts = action.payload.totalProducts
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.product = action.payload
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload.products
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
        state.totalProducts = action.payload.totalProducts
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.products.unshift(action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.products.findIndex(product => product._id === action.payload._id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
        if (state.product && state.product._id === action.payload._id) {
          state.product = action.payload
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = state.products.filter(product => product._id !== action.payload)
        if (state.product && state.product._id === action.payload) {
          state.product = null
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset, clearProduct, setFilters, clearFilters, setCurrentPage } = productSlice.actions

// Alias for backward compatibility
export const getProductById = getProduct

export default productSlice.reducer
