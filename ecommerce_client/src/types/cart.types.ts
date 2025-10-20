import type { Product } from './product.types'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedSize?: string
  selectedColor?: string
  addedAt: string
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  updatedAt: string
}

export interface AddToCartPayload {
  productId: string
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

export interface UpdateCartItemPayload {
  cartItemId: string
  quantity: number
}

export interface RemoveFromCartPayload {
  cartItemId: string
}

