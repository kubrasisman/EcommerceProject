export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount?: number
  category: string
  subcategory?: string
  brand?: string
  images: string[]
  thumbnail: string
  stock: number
  rating: number
  reviewCount: number
  tags?: string[]
  specifications?: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface ProductFilter {
  category?: string
  subcategory?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  tags?: string[]
  search?: string
}

export interface ProductSort {
  field: 'price' | 'rating' | 'createdAt' | 'name'
  order: 'asc' | 'desc'
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  images?: string[]
  createdAt: string
  updatedAt: string
}

