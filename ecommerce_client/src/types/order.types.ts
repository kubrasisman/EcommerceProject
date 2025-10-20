import type { CartItem } from './cart.types'

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled'

export type PaymentStatus = 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'refunded'

export type PaymentMethod = 
  | 'credit_card' 
  | 'debit_card' 
  | 'paypal' 
  | 'cash_on_delivery'

export interface ShippingAddress {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  quantity: number
  price: number
  selectedSize?: string
  selectedColor?: string
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: PaymentMethod
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  notes?: string
  trackingNumber?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderPayload {
  items: CartItem[]
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  paymentMethod: PaymentMethod
  notes?: string
}

export interface OrderListResponse {
  orders: Order[]
  total: number
  page: number
  pageSize: number
}

