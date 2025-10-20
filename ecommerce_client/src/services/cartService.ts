import api from '@/lib/api'
import type { Cart, AddToCartPayload, UpdateCartItemPayload } from '@/types/cart.types'

export const cartService = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    const response = await api.get<Cart>('/cart')
    return response.data
  },

  // Add item to cart
  addToCart: async (payload: AddToCartPayload): Promise<Cart> => {
    const response = await api.post<Cart>('/cart/items', payload)
    return response.data
  },

  // Update cart item quantity
  updateCartItem: async (payload: UpdateCartItemPayload): Promise<Cart> => {
    const { cartItemId, ...data } = payload
    const response = await api.put<Cart>(`/cart/items/${cartItemId}`, data)
    return response.data
  },

  // Remove item from cart
  removeFromCart: async (cartItemId: string): Promise<Cart> => {
    const response = await api.delete<Cart>(`/cart/items/${cartItemId}`)
    return response.data
  },

  // Clear cart
  clearCart: async (): Promise<void> => {
    await api.delete('/cart')
  },

  // Sync local cart with server
  syncCart: async (localCartItems: AddToCartPayload[]): Promise<Cart> => {
    const response = await api.post<Cart>('/cart/sync', { items: localCartItems })
    return response.data
  },
}

