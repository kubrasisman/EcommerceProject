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
  | 'CREDIT_CARD' 
  | 'WIRE_TRANSFER'

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

// Backend OrderEntryDtoResponse
export interface OrderEntry {
  product: {
    id: number
    code: string
    name: string
    price: number
    imageUrl?: string
  }
  quantity: number
  basePrice: number
  totalPrice: number
  canceledAmount?: number
  shippedAmount?: number
}

// Backend PaymentTransactionDtoResponse
export interface PaymentTransaction {
  paymentMethod: PaymentMethod
  transactionId: string
  amount: number
  status: PaymentStatus
  paymentInfo?: any
}

// Backend OrderDtoResponse
export interface Order {
  code: string
  totalPrice: number
  owner: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
  creationDate: string
  address: {
    id: number
    addressTitle: string
    street: string
    city: string
    country: string
    postalCode: string
    phoneNumber: string
  }
  payments: PaymentTransaction[]
  paymentMethod: PaymentMethod
  entries: OrderEntry[]
  status: OrderStatus
  
  // Eski yapı ile uyumluluk için (frontend'de bazı yerlerde kullanılıyor)
  id?: string
  orderNumber?: string
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

