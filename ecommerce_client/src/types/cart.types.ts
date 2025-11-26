import type { Product } from './product.types'
import type { PaymentMethod } from './order.types'

// Backend CartEntryData
export interface CartEntryData {
  code: string
  product: Product
  quantity: number
  totalPrice: number
  basePrice: number
}

// Backend CartData
export interface CartData {
  id: number
  code: string
  totalPrice: number
  owner: string
  creationDate: string
  entries: CartEntryData[]
  paymentMethod?: PaymentMethod
  deliveryAddressId?: number
}

// Request DTOs
export interface CartEntryDto {
  cart?: string
  product: number // Product ID/Code
  quantity: number
  code?: string
}

export interface AddToCartPayload {
  product: number
  quantity: number
}

export interface UpdateCartItemPayload {
  code: string // Entry code
  product: number
  quantity: number
}

export interface RemoveFromCartPayload {
  entryCode: string
}

// Legacy support for existing components
export interface CartItem {
  id: string
  code: string
  product: Product
  quantity: number
  addedAt?: string
}

export interface Cart {
  id: number
  code: string
  items: CartItem[]
  subtotal: number
  total: number
  updatedAt: string
}

