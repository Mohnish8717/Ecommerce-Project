import { createSlice } from '@reduxjs/toolkit'

// Get cart from localStorage
const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart')
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    return []
  }
}

// Calculate totals
const calculateTotals = (items) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  return { totalItems, totalPrice }
}

// Initialize state with calculated totals
const items = getCartFromStorage()
const totals = calculateTotals(items)

const initialState = {
  items,
  totalItems: totals.totalItems,
  totalPrice: totals.totalPrice,
  isLoading: false,
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload
      const existingItem = state.items.find(item => item.id === product._id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.items.push({
          id: product._id,
          productId: product._id,
          name: product.name,
          price: product.discountPrice || product.price,
          originalPrice: product.discountPrice ? product.price : null,
          image: product.images?.[0]?.url || product.images?.[0] || '/placeholder-product.jpg',
          seller: product.seller,
          stock: product.stock,
          quantity,
        })
      }

      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalPrice = totals.totalPrice

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload
      state.items = state.items.filter(item => item.id !== productId)

      const totals = calculateTotals(state.items)
      state.totalItems = totals.totalItems
      state.totalPrice = totals.totalPrice

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.items))
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id)
        } else {
          item.quantity = quantity
        }

        const totals = calculateTotals(state.items)
        state.totalItems = totals.totalItems
        state.totalPrice = totals.totalPrice

        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(state.items))
      }
    },
    
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0

      // Clear localStorage
      localStorage.removeItem('cart')
    },
    
    loadCart: (state) => {
      const items = getCartFromStorage()
      state.items = items

      const totals = calculateTotals(items)
      state.totalItems = totals.totalItems
      state.totalPrice = totals.totalPrice
    },
  },
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  loadCart,
} = cartSlice.actions

export default cartSlice.reducer
