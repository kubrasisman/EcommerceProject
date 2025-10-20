// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  TIMEOUT: 30000,
}

// App Configuration
export const APP_CONFIG = {
  NAME: 'ShopHub',
  DESCRIPTION: 'Your one-stop shop for all your needs',
  VERSION: '1.0.0',
}

// Cart Configuration
export const CART_CONFIG = {
  TAX_RATE: 0.1, // 10%
  FREE_SHIPPING_THRESHOLD: 50,
  SHIPPING_COST: 10,
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  DEFAULT_PAGE: 1,
}

// Order Status Colors
export const ORDER_STATUS_COLORS = {
  pending: 'default',
  confirmed: 'default',
  processing: 'default',
  shipped: 'default',
  delivered: 'success',
  cancelled: 'destructive',
} as const

// Payment Methods
export const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'cash_on_delivery', label: 'Cash on Delivery' },
] as const

// Sort Options
export const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'name-asc', label: 'Name: A to Z' },
] as const

// Categories
export const CATEGORIES = [
  { name: 'Electronics', icon: '📱', color: 'from-blue-500 to-cyan-500' },
  { name: 'Fashion', icon: '👔', color: 'from-pink-500 to-rose-500' },
  { name: 'Home', icon: '🏠', color: 'from-green-500 to-emerald-500' },
  { name: 'Sports', icon: '⚽', color: 'from-orange-500 to-red-500' },
  { name: 'Books', icon: '📚', color: 'from-purple-500 to-indigo-500' },
  { name: 'Toys', icon: '🎮', color: 'from-yellow-500 to-amber-500' },
] as const

