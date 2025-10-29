import api from '@/lib/api'
import type { Address, CreateAddressDto } from '@/types/address.types'

export const addressService = {
  // Kullanıcının tüm adreslerini getir
  getCustomerAddresses: async (): Promise<Address[]> => {
    const response = await api.get<Address[]>('/customers/address/customer')
    return response.data
  },

  // Belirli bir adresi getir
  getAddress: async (id: number): Promise<Address> => {
    const response = await api.get<Address>(`/customers/address/${id}`)
    return response.data
  },

  // Yeni adres oluştur
  createAddress: async (addressData: CreateAddressDto): Promise<Address> => {
    const response = await api.post<Address>('/customers/address', addressData)
    return response.data
  },
}

