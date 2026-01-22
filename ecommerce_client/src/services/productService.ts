import api from '@/lib/api'
import type { Category } from '@/types/category.types'
import type { Product, ProductFilter, ProductListResponse, ProductQueryParams, Review } from '@/types/product.types'

export const productService = {
  // Get all products with pagination and filters
  getProducts: async (
    params?: ProductQueryParams & ProductFilter
  ): Promise<ProductListResponse> => {
    const queryParams = new URLSearchParams()

    if (params?.page !== undefined) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.order) queryParams.append('order', params.order)
    if (params?.sort) queryParams.append('sort', params.sort)
    if (params?.category) queryParams.append('category', params.category)
    if (params?.brand) queryParams.append('brand', params.brand)
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString())
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString())
    if (params?.search) queryParams.append('search', encodeURIComponent(params.search))

    const response = await api.get<ProductListResponse>(`/products?${queryParams.toString()}`)
    return response.data
  },

  // Get single product by code
  getProductByCode: async (code: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${code}`)
    return response.data
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8): Promise<Product[]> => {
    const response = await api.get<ProductListResponse>(`/products?limit=${limit}&order=DESC&sort=id`)
    return response.data.products
  },

  // Get product reviews
  getProductReviews: async (productId: number, page = 1, pageSize = 10) => {
    const response = await api.get<{ reviews: Review[]; total: number }>(
      `/products/${productId}/reviews?page=${page}&pageSize=${pageSize}`
    )
    return response.data
  },

  // Add product review
  addProductReview: async (productId: number, review: { rating: number; comment: string }) => {
    const response = await api.post<Review>(`/products/${productId}/reviews`, review)
    return response.data
  },

  // Search products
  searchProducts: async (query: string, page = 0, limit = 20): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>(
      `/products?search=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
    )
    return response.data
  },

  // Create product
  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const response = await api.post<Product>('/products/save', product)
    return response.data
  },

  // Update product
  updateProduct: async (product: Partial<Product>): Promise<Product> => {
    const response = await api.post<Product>('/products/update', product)
    return response.data
  },

  // Delete product
  deleteProduct: async (id: number): Promise<boolean> => {
    const response = await api.delete<boolean>(`/products/remove/${id}`)
    return response.data
  },

  // Get categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>(`/categories`)
    return response.data
  },
}
