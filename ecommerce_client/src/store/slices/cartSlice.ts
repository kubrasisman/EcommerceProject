import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { CartItem, AddToCartPayload, UpdateCartItemPayload } from '@/types/cart.types'
import type { LoadingState } from '@/types/common.types'
import { cartService } from '@/services/cartService'

interface CartState {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  loading: LoadingState
  error: string | null
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  loading: 'idle',
  error: null,
}

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.1 // 10% tax
  const shipping = subtotal > 50 ? 0 : 10 // Free shipping over $50
  const total = subtotal + tax + shipping
  
  return { subtotal, tax, shipping, total }
}

// Async Thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await cartService.getCart()
  return response
})

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (payload: AddToCartPayload) => {
    const response = await cartService.addToCart(payload)
    return response
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (payload: UpdateCartItemPayload) => {
    const response = await cartService.updateCartItem(payload)
    return response
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (payload: { cartItemId: string }) => {
    const response = await cartService.removeFromCart(payload.cartItemId)
    return response
  }
)

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
  await cartService.clearCart()
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local cart operations for offline support
    addToCartLocal: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.product.id
      )
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      
      const totals = calculateTotals(state.items)
      Object.assign(state, totals)
    },
    updateCartItemLocal: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload.cartItemId)
      if (item) {
        item.quantity = action.payload.quantity
      }
      
      const totals = calculateTotals(state.items)
      Object.assign(state, totals)
    },
    removeFromCartLocal: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.cartItemId)
      
      const totals = calculateTotals(state.items)
      Object.assign(state, totals)
    },
    clearCartLocal: (state) => {
      state.items = []
      state.subtotal = 0
      state.tax = 0
      state.shipping = 0
      state.total = 0
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.items = action.payload.items
        state.subtotal = action.payload.subtotal
        state.tax = action.payload.tax
        state.shipping = action.payload.shipping
        state.total = action.payload.total
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Failed to fetch cart'
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.items = action.payload.items
        state.subtotal = action.payload.subtotal
        state.tax = action.payload.tax
        state.shipping = action.payload.shipping
        state.total = action.payload.total
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Failed to add to cart'
      })

      // Update Cart Item
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items
        state.subtotal = action.payload.subtotal
        state.tax = action.payload.tax
        state.shipping = action.payload.shipping
        state.total = action.payload.total
      })

      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items
        state.subtotal = action.payload.subtotal
        state.tax = action.payload.tax
        state.shipping = action.payload.shipping
        state.total = action.payload.total
      })

      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = []
        state.subtotal = 0
        state.tax = 0
        state.shipping = 0
        state.total = 0
      })
  },
})

export const {
  addToCartLocal,
  updateCartItemLocal,
  removeFromCartLocal,
  clearCartLocal,
} = cartSlice.actions

export default cartSlice.reducer

