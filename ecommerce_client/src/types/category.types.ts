export type CategoryType = 'CATEGORY' | 'BRAND'

export interface Category {
  id: number
  code: number
  name: string
  description: string
  parentCategoryCodes?: number[] | null
  type?: CategoryType
  children?: Category[]
}
