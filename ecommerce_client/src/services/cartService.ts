import api from '@/lib/api'
import type { CartData, AddToCartPayload, UpdateCartItemPayload, CartEntryDto } from '@/types/cart.types'

export const cartService = {
  // Get user's cart
  getCart: async (): Promise<CartData> => {
    const response = await api.get<CartData>('/cart')
    return response.data
  },

  // Add item to cart
  addToCart: async (payload: AddToCartPayload): Promise<CartData> => {
    const cartEntryDto: CartEntryDto = {
      product: payload.product,
      quantity: payload.quantity,
    }
    const response = await api.post<CartData>('/cart/add', cartEntryDto)
    return response.data
  },

  // Update cart item quantity
  updateCartItem: async (payload: UpdateCartItemPayload): Promise<CartData> => {
    const cartEntryDto: CartEntryDto = {
      code: payload.code,
      product: payload.product,
      quantity: payload.quantity,
    }
    const response = await api.put<CartData>('/cart/update', cartEntryDto)
    return response.data
  },

  // Remove item from cart
  removeFromCart: async (entryCode: string): Promise<CartData> => {
    const response = await api.delete<CartData>(`/cart/remove/${entryCode}`)
    return response.data
  },

  // Clear cart (if needed)
  clearCart: async (): Promise<void> => {
    await api.delete('/cart')
  },
}

