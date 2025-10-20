import type { Category } from './category.types'

export interface Product {
  id: number
  code: number
  name: string
  title: string
  description: string
  brand: string
  price: number
  imageUrl: string
  categoryCodes: Category[]
  // Computed/UI fields (not from backend)
  thumbnail?: string
  images?: string[]
  rating?: number
  reviewCount?: number
  stock?: number
  originalPrice?: number
  discount?: number
  slug?: string
  tags?: string[]
  specifications?: Record<string, string>
  createdAt?: string
  updatedAt?: string
}

export interface ProductFilter {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}

export interface ProductSort {
  sort: string // 'id' | 'name' | 'price' etc.
  order: 'ASC' | 'DESC'
}

export interface ProductQueryParams {
  page?: number
  limit?: number
  order?: 'ASC' | 'DESC'
  sort?: string
}

export interface ProductListResponse {
  products: Product[]
  currentPage: number
  totalPage: number
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
