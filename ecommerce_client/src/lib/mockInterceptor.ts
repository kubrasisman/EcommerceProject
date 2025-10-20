import type { AxiosInstance } from 'axios'
import { mockProducts, getMockProducts } from './mockData'
import { generateOrderNumber, generateId } from './helpers'
import type { Cart, CartItem } from '@/types/cart.types'
import type { Order } from '@/types/order.types'

// In-memory storage for mock data
const storage = {
  cart: null as Cart | null,
  orders: [] as Order[],
}

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function setupMockInterceptor(apiInstance: AxiosInstance, useMock = true) {
  if (!useMock) return

  // Request interceptor for mock data
  apiInstance.interceptors.request.use(
    async (config) => {
      const url = config.url || ''
      const method = config.method?.toUpperCase()

      // Simulate network delay
      await delay(500)

      // Mock responses
      if (url.includes('/products/featured')) {
        const mockResponse = {
          data: mockProducts.slice(0, 8),
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      if (url.includes('/products/') && url.includes('/related')) {
        const mockResponse = {
          data: mockProducts.slice(0, 4),
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      if (url.includes('/products/search')) {
        const params = new URLSearchParams(url.split('?')[1])
        const query = params.get('q') || ''
        const filtered = getMockProducts({ search: query })
        
        const mockResponse = {
          data: {
            products: filtered,
            total: filtered.length,
            page: 1,
            pageSize: 20,
            totalPages: 1,
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      if (url.match(/\/products\/\d+$/)) {
        const id = url.split('/').pop()
        const product = mockProducts.find(p => p.id === id)
        
        const mockResponse = {
          data: product || mockProducts[0],
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      if (url.includes('/products')) {
        const params = new URLSearchParams(url.split('?')[1] || '')
        const category = params.get('category')
        const filtered = getMockProducts({ category: category || undefined })
        
        const mockResponse = {
          data: {
            products: filtered,
            total: filtered.length,
            page: 1,
            pageSize: 20,
            totalPages: 1,
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // Cart operations
      if (url.includes('/cart') && method === 'GET') {
        if (!storage.cart) {
          storage.cart = {
            id: generateId(),
            userId: 'mock-user-id',
            items: [],
            subtotal: 0,
            tax: 0,
            shipping: 0,
            total: 0,
            updatedAt: new Date().toISOString(),
          }
        }
        
        const mockResponse = {
          data: storage.cart,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      if (url.includes('/cart/items') && method === 'POST') {
        const { productId, quantity } = config.data
        const product = mockProducts.find(p => p.id === productId)
        
        if (product && storage.cart) {
          const existingItem = storage.cart.items.find(item => item.product.id === productId)
          
          if (existingItem) {
            existingItem.quantity += quantity
          } else {
            const newItem: CartItem = {
              id: generateId(),
              product,
              quantity,
              addedAt: new Date().toISOString(),
            }
            storage.cart.items.push(newItem)
          }
          
          // Recalculate totals
          storage.cart.subtotal = storage.cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
          storage.cart.tax = storage.cart.subtotal * 0.1
          storage.cart.shipping = storage.cart.subtotal > 50 ? 0 : 10
          storage.cart.total = storage.cart.subtotal + storage.cart.tax + storage.cart.shipping
          storage.cart.updatedAt = new Date().toISOString()
        }
        
        const mockResponse = {
          data: storage.cart,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // Orders
      if (url.includes('/orders') && method === 'GET' && !url.match(/\/orders\/\d+$/)) {
        const mockResponse = {
          data: {
            orders: storage.orders,
            total: storage.orders.length,
            page: 1,
            pageSize: 10,
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      if (url.includes('/orders') && method === 'POST') {
        const orderData = config.data
        const newOrder: Order = {
          id: generateId(),
          userId: 'mock-user-id',
          orderNumber: generateOrderNumber(),
          items: orderData.items.map((item: CartItem) => ({
            id: generateId(),
            productId: item.product.id,
            productName: item.product.name,
            productImage: item.product.thumbnail,
            quantity: item.quantity,
            price: item.product.price,
          })),
          subtotal: orderData.items.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0),
          tax: 0,
          shipping: 0,
          total: 0,
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: orderData.paymentMethod,
          shippingAddress: orderData.shippingAddress,
          notes: orderData.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        newOrder.tax = newOrder.subtotal * 0.1
        newOrder.shipping = newOrder.subtotal > 50 ? 0 : 10
        newOrder.total = newOrder.subtotal + newOrder.tax + newOrder.shipping
        
        storage.orders.push(newOrder)
        
        const mockResponse = {
          data: newOrder,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      if (url.match(/\/orders\/[\w-]+$/) && method === 'GET') {
        const id = url.split('/').pop()
        const order = storage.orders.find(o => o.id === id)
        
        const mockResponse = {
          data: order || storage.orders[0],
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // Auth operations - just return mock data
      if (url.includes('/auth/login') || url.includes('/auth/register')) {
        const mockResponse = {
          data: {
            token: 'mock-jwt-token',
            user: {
              id: 'mock-user-id',
              email: config.data.email,
              fullName: config.data.fullName || 'Mock User',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor to handle mock responses
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // If it's a mock response, resolve it
      if (error.response && error.config?.adapter) {
        return Promise.resolve(error.response)
      }
      return Promise.reject(error)
    }
  )
}

