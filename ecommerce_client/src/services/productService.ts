import api from '@/lib/api'
import type { Product, ProductFilter, ProductListResponse, ProductSort, Review } from '@/types/product.types'

export const productService = {
  // Get all products with filters
  getProducts: async (
    filter?: ProductFilter,
    sort?: ProductSort,
    page = 1,
    pageSize = 20
  ): Promise<ProductListResponse> => {
    const params = new URLSearchParams()
    
    if (filter?.category) params.append('category', filter.category)
    if (filter?.subcategory) params.append('subcategory', filter.subcategory)
    if (filter?.brand) params.append('brand', filter.brand)
    if (filter?.minPrice) params.append('minPrice', filter.minPrice.toString())
    if (filter?.maxPrice) params.append('maxPrice', filter.maxPrice.toString())
    if (filter?.rating) params.append('rating', filter.rating.toString())
    if (filter?.inStock !== undefined) params.append('inStock', filter.inStock.toString())
    if (filter?.search) params.append('search', filter.search)
    if (filter?.tags?.length) params.append('tags', filter.tags.join(','))
    
    if (sort) {
      params.append('sortBy', sort.field)
      params.append('sortOrder', sort.order)
    }
    
    params.append('page', page.toString())
    params.append('pageSize', pageSize.toString())

    const response = await api.get<ProductListResponse>(`/products?${params.toString()}`)
    return response.data
  },

  // Get single product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/featured?limit=${limit}`)
    return response.data
  },

  // Get product reviews
  getProductReviews: async (productId: string, page = 1, pageSize = 10) => {
    const response = await api.get<{ reviews: Review[]; total: number }>(
      `/products/${productId}/reviews?page=${page}&pageSize=${pageSize}`
    )
    return response.data
  },

  // Add product review
  addProductReview: async (productId: string, review: { rating: number; comment: string }) => {
    const response = await api.post<Review>(`/products/${productId}/reviews`, review)
    return response.data
  },

  // Get related products
  getRelatedProducts: async (productId: string, limit = 4): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/${productId}/related?limit=${limit}`)
    return response.data
  },

  // Search products
  searchProducts: async (query: string, page = 1, pageSize = 20): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>(
      `/products/search?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`
    )
    return response.data
  },
}

