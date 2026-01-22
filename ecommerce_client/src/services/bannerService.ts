import api from '@/lib/api'
import type { Banner } from '@/types/banner.types'

export const bannerService = {
  getActiveBanners: async (): Promise<Banner[]> => {
    const response = await api.get<Banner[]>('/banners')
    return response.data
  },

  getAllBanners: async (): Promise<Banner[]> => {
    const response = await api.get<Banner[]>('/banners/all')
    return response.data
  },

  getBannerByCode: async (code: number): Promise<Banner> => {
    const response = await api.get<Banner>(`/banners/${code}`)
    return response.data
  },

  createBanner: async (banner: Partial<Banner>): Promise<Banner> => {
    const response = await api.post<Banner>('/banners/save', banner)
    return response.data
  },

  updateBanner: async (banner: Partial<Banner>): Promise<Banner> => {
    const response = await api.post<Banner>('/banners/update', banner)
    return response.data
  },

  deleteBanner: async (code: number): Promise<boolean> => {
    const response = await api.delete<boolean>(`/banners/remove/${code}`)
    return response.data
  }
}