export interface SearchParams {
  keyword?: string
  categoryCode?: number
  page?: number
  size?: number
}

export interface SearchProductDocument {
  id: string
  code: number
  title: string
  name: string
  description: string
  price: number
  imageUrl: string
  brand: string
  categoryCodes: number[]
}

export interface SearchResponse {
  products: SearchProductDocument[]
  currentPage: number
  totalPage: number
  totalElements: number
}