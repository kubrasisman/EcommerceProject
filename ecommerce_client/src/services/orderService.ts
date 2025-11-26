import api from '@/lib/api'
import type { Order } from '@/types/order.types'

export const orderService = {
  // Place order from cart (checkout)
  placeOrder: async (): Promise<Order> => {
    const response = await api.post<Order>('/orders/checkout')
    return response.data
  },

  // Get single order by code
  getOrderByCode: async (code: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${code}`)
    return response.data
  },

  // Get customer's orders by email
  getOrdersByCustomerEmail: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>(`/orders/customer`)
    return response.data
  },

  // Get all orders
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders')
    return response.data
  },


}

