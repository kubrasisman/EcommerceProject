import api from '@/lib/api'
import type { Order, CreateOrderPayload, OrderListResponse } from '@/types/order.types'

export const orderService = {
  // Create new order
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const response = await api.post<Order>('/orders', payload)
    return response.data
  },

  // Get user's orders
  getOrders: async (page = 1, pageSize = 10): Promise<OrderListResponse> => {
    const response = await api.get<OrderListResponse>(
      `/orders?page=${page}&pageSize=${pageSize}`
    )
    return response.data
  },

  // Get single order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${orderId}`)
    return response.data
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await api.post<Order>(`/orders/${orderId}/cancel`)
    return response.data
  },

  // Track order
  trackOrder: async (orderNumber: string) => {
    const response = await api.get(`/orders/track/${orderNumber}`)
    return response.data
  },
}

