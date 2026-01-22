import api from '@/lib/api'
import type { SearchParams, SearchResponse, SearchProductDocument } from '@/types/search.types'
import type { ProductListResponse, Product } from '@/types/product.types'

/**
 * Maps Elasticsearch ProductDocument to frontend Product type
 */
function mapSearchDocumentToProduct(doc: SearchProductDocument): Product {
  return {
    id: parseInt(doc.id),
    code: doc.code,
    name: doc.name,
    title: doc.title || doc.name,
    description: doc.description,
    brand: doc.brand,
    price: doc.price,
    imageUrl: doc.imageUrl,
    categoryCodes: doc.categoryCodes.map(code => ({
      id: code,
      code: code,
      name: '',
      description: ''
    }))
  }
}

export const searchService = {
  /**
   * Search products using Elasticsearch
   * Supports keyword search, category filtering, or both
   */
  searchProducts: async (params: SearchParams): Promise<ProductListResponse> => {
    const queryParams = new URLSearchParams()

    if (params.keyword) queryParams.append('keyword', params.keyword)
    if (params.categoryCode) queryParams.append('categoryCode', params.categoryCode.toString())
    if (params.page !== undefined) queryParams.append('page', params.page.toString())
    if (params.size) queryParams.append('size', params.size.toString())

    const response = await api.get<SearchResponse>(
      `/search/products/search?${queryParams.toString()}`
    )

    return {
      products: response.data.products.map(mapSearchDocumentToProduct),
      currentPage: response.data.currentPage,
      totalPage: response.data.totalPage
    }
  }
}