import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { CartItem, AddToCartPayload, UpdateCartItemPayload, CartData } from '@/types/cart.types'
import type { LoadingState } from '@/types/common.types'
import { cartService } from '@/services/cartService'

interface CartState {
  cartId: number | null
  cartCode: string | null
  items: CartItem[]
  subtotal: number
  total: number
  loading: LoadingState
  error: string | null
}

const initialState: CartState = {
  cartId: null,
  cartCode: null,
  items: [],
  subtotal: 0,
  total: 0,
  loading: 'idle',
  error: null,
}

// Helper function to convert CartData to CartState
const convertCartDataToState = (cartData: CartData): Partial<CartState> => {
  const items: CartItem[] = cartData.entries.map(entry => ({
    id: entry.code,
    code: entry.code,
    product: entry.product,
    quantity: entry.quantity,
  }))

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return {
    cartId: cartData.id,
    cartCode: cartData.code,
    items,
    subtotal,
    total: cartData.totalPrice,
  }
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
  async (entryCode: string) => {
    const response = await cartService.removeFromCart(entryCode)
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
    clearCartLocal: (state) => {
      state.cartId = null
      state.cartCode = null
      state.items = []
      state.subtotal = 0
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
        const cartState = convertCartDataToState(action.payload)
        Object.assign(state, cartState)
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Sepet yüklenemedi'
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        const cartState = convertCartDataToState(action.payload)
        Object.assign(state, cartState)
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Sepete eklenemedi'
      })

      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = 'loading'
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        const cartState = convertCartDataToState(action.payload)
        Object.assign(state, cartState)
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Güncelleme başarısız'
      })

      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = 'loading'
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        const cartState = convertCartDataToState(action.payload)
        Object.assign(state, cartState)
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Ürün çıkarılamadı'
      })

      // Clear Cart
      .addCase(clearCart.fulfilled, (state) => {
        state.cartId = null
        state.cartCode = null
        state.items = []
        state.subtotal = 0
        state.total = 0
      })
  },
})

export const { clearCartLocal } = cartSlice.actions

export default cartSlice.reducer

