import api from '@/lib/api'
import type { Category } from '@/types/category.types'

export const categoryService = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories')
    return response.data
  },

  // Get single category by code
  getCategoryByCode: async (code: number): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${code}`)
    return response.data
  },

  // Create category
  createCategory: async (category: Partial<Category>): Promise<Category> => {
    const response = await api.post<Category>('/categories/save', category)
    return response.data
  },

  // Update category
  updateCategory: async (category: Partial<Category>): Promise<Category> => {
    const response = await api.post<Category>('/categories/update', category)
    return response.data
  },

  // Delete category
  deleteCategory: async (id: number): Promise<boolean> => {
    const response = await api.delete<boolean>(`/categories/remove/${id}`)
    return response.data
  },
}

