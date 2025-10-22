import type { AxiosInstance } from 'axios'
import { mockProducts, getMockProducts, searchMockProducts, getMockProductByCode } from './mockData'
import { generateOrderNumber, generateId } from './helpers'
import type { CartData, CartEntryData } from '@/types/cart.types'
import type { Order } from '@/types/order.types'
import type { Category } from '@/types/category.types'

// Mock categories
const mockCategories: Category[] = [
  { id: 1, code: 1001, name: 'Electronics', description: 'Electronic devices and accessories' },
  { id: 2, code: 1002, name: 'Fashion', description: 'Clothing, shoes and accessories' },
  { id: 3, code: 1003, name: 'Home & Living', description: 'Furniture and home decor' },
  { id: 4, code: 1004, name: 'Sports', description: 'Sports equipment and outdoor gear' },
  { id: 5, code: 1005, name: 'Books', description: 'Books, magazines and e-books' },
  { id: 6, code: 1006, name: 'Toys & Games', description: 'Toys, games and hobbies' },
]

// In-memory storage for mock data
const storage = {
  cart: null as CartData | null,
  cartEntries: [] as CartEntryData[],
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
      await delay(300)

      // Mock responses
      
      // CATEGORY ENDPOINTS
      
      // GET /categories - Get all categories
      if (method === 'GET' && url.endsWith('/categories')) {
        const mockResponse = {
          data: mockCategories,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // GET /categories/{code} - Get category by code
      if (method === 'GET' && url.match(/\/categories\/\d+$/)) {
        const code = parseInt(url.split('/').pop() || '0')
        const category = mockCategories.find(c => c.code === code)
        
        const mockResponse = {
          data: category || mockCategories[0],
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // POST /categories/save - Create category
      if (method === 'POST' && url.includes('/categories/save')) {
        const mockResponse = {
          data: { ...config.data, id: mockCategories.length + 1, code: 1000 + mockCategories.length + 1 },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // POST /categories/update - Update category
      if (method === 'POST' && url.includes('/categories/update')) {
        const mockResponse = {
          data: config.data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // DELETE /categories/remove/{id} - Delete category
      if (method === 'DELETE' && url.includes('/categories/remove/')) {
        const mockResponse = {
          data: true,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // PRODUCT ENDPOINTS
      
      // GET /products/{code} - Get product by code
      if (method === 'GET' && url.match(/\/products\/\d+$/)) {
        const code = parseInt(url.split('/').pop() || '0')
        const product = getMockProductByCode(code)
        
        const mockResponse = {
          data: product || mockProducts[0],
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // GET /products?... - Get products with pagination and filters
      if (method === 'GET' && url.includes('/products')) {
        const params = new URLSearchParams(url.split('?')[1] || '')
        const page = parseInt(params.get('page') || '0')
        const limit = parseInt(params.get('limit') || '20')
        const search = params.get('search')
        const category = params.get('category')
        const brand = params.get('brand')

        let result = getMockProducts(page, limit)

        // Apply search filter
        if (search) {
          result = searchMockProducts(search, page, limit)
        }
        
        // Apply category filter
        if (category && !search) {
          const filtered = mockProducts.filter(p => 
            p.categoryCodes.some(c => c.name.toLowerCase() === category.toLowerCase())
          )
          const start = page * limit
          const end = start + limit
          result = {
            products: filtered.slice(start, end),
            currentPage: page,
            totalPage: Math.ceil(filtered.length / limit),
          }
        }

        // Apply brand filter
        if (brand) {
          const filtered = result.products.filter(p => 
            p.brand.toLowerCase() === brand.toLowerCase()
          )
          result = {
            ...result,
            products: filtered,
            totalPage: Math.ceil(filtered.length / limit),
          }
        }
        
        const mockResponse = {
          data: result,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // POST /products/save - Create product
      if (method === 'POST' && url.includes('/products/save')) {
        const mockResponse = {
          data: { ...config.data, id: mockProducts.length + 1, code: 10000 + mockProducts.length + 1 },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // POST /products/update - Update product
      if (method === 'POST' && url.includes('/products/update')) {
        const mockResponse = {
          data: config.data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // DELETE /products/remove/{id} - Delete product
      if (method === 'DELETE' && url.includes('/products/remove/')) {
        const mockResponse = {
          data: true,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // CART ENDPOINTS (Backend API uyumlu)
      
      // GET /cart - Get user's cart
      if (method === 'GET' && url.endsWith('/cart')) {
        if (!storage.cart) {
          storage.cart = {
            id: Math.floor(Math.random() * 1000),
            code: `CART-${generateId()}`,
            totalPrice: 0,
            customerEmail: 'user@example.com',
            creationDate: new Date().toISOString(),
            entries: [],
          }
          storage.cartEntries = []
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

      // POST /cart/add - Add item to cart
      if (method === 'POST' && url.includes('/cart/add')) {
        const { product: productCode, quantity } = config.data
        const product = getMockProductByCode(productCode)
        
        if (product) {
          if (!storage.cart) {
            storage.cart = {
              id: Math.floor(Math.random() * 1000),
              code: `CART-${generateId()}`,
              totalPrice: 0,
              customerEmail: 'user@example.com',
              creationDate: new Date().toISOString(),
              entries: [],
            }
            storage.cartEntries = []
          }

          const existingEntry = storage.cartEntries.find(
            entry => entry.product.code === product.code
          )

          if (existingEntry) {
            existingEntry.quantity += quantity
            existingEntry.totalPrice = existingEntry.basePrice * existingEntry.quantity
          } else {
            const newEntry: CartEntryData = {
              code: `ENTRY-${generateId()}`,
              product,
              quantity,
              basePrice: product.price,
              totalPrice: product.price * quantity,
            }
            storage.cartEntries.push(newEntry)
          }

          // Update cart
          storage.cart.entries = storage.cartEntries
          storage.cart.totalPrice = storage.cartEntries.reduce(
            (sum, entry) => sum + entry.totalPrice,
            0
          )
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

      // PUT /cart/update - Update cart item
      if (method === 'PUT' && url.includes('/cart/update')) {
        const { code: entryCode, quantity } = config.data

        if (storage.cart) {
          const entry = storage.cartEntries.find(e => e.code === entryCode)
          if (entry) {
            entry.quantity = quantity
            entry.totalPrice = entry.basePrice * quantity
          }

          // Update cart
          storage.cart.entries = storage.cartEntries
          storage.cart.totalPrice = storage.cartEntries.reduce(
            (sum, entry) => sum + entry.totalPrice,
            0
          )
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

      // DELETE /cart/remove/{entry} - Remove item from cart
      if (method === 'DELETE' && url.includes('/cart/remove/')) {
        const entryCode = url.split('/').pop()

        if (storage.cart) {
          storage.cartEntries = storage.cartEntries.filter(e => e.code !== entryCode)

          // Update cart
          storage.cart.entries = storage.cartEntries
          storage.cart.totalPrice = storage.cartEntries.reduce(
            (sum, entry) => sum + entry.totalPrice,
            0
          )
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

      // DELETE /cart - Clear cart
      if (method === 'DELETE' && url.endsWith('/cart')) {
        storage.cart = {
          id: Math.floor(Math.random() * 1000),
          code: `CART-${generateId()}`,
          totalPrice: 0,
          customerEmail: 'user@example.com',
          creationDate: new Date().toISOString(),
          entries: [],
        }
        storage.cartEntries = []

        const mockResponse = {
          data: null,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // ORDER ENDPOINTS

      // POST /orders - Create order
      if (method === 'POST' && url.endsWith('/orders')) {
        const orderData = config.data
        const cartTotalPrice = storage.cart?.totalPrice || 0
        
        const newOrder: Order = {
          id: generateId(),
          userId: 'user1',
          orderNumber: generateOrderNumber(),
          items: storage.cartEntries.map((entry: CartEntryData) => ({
            id: generateId(),
            productId: entry.product.code.toString(),
            productName: entry.product.name,
            productImage: entry.product.imageUrl,
            quantity: entry.quantity,
            price: entry.basePrice,
          })),
          subtotal: cartTotalPrice,
          tax: 0,
          shipping: 0,
          total: cartTotalPrice,
          status: 'pending',
          paymentStatus: 'pending',
          paymentMethod: orderData.paymentMethod,
          shippingAddress: orderData.shippingAddress,
          billingAddress: orderData.billingAddress,
          notes: orderData.notes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        storage.orders.push(newOrder)
        
        // Clear cart after order
        storage.cart = {
          id: Math.floor(Math.random() * 1000),
          code: `CART-${generateId()}`,
          totalPrice: 0,
          customerEmail: 'user@example.com',
          creationDate: new Date().toISOString(),
          entries: [],
        }
        storage.cartEntries = []

        const mockResponse = {
          data: newOrder,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // GET /orders - Get user's orders
      if (method === 'GET' && url.includes('/orders') && !url.includes('/orders/')) {
        const params = new URLSearchParams(url.split('?')[1] || '')
        const page = parseInt(params.get('page') || '1')
        const pageSize = parseInt(params.get('pageSize') || '10')

        const mockResponse = {
          data: {
            orders: storage.orders,
            total: storage.orders.length,
            page,
            pageSize,
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // GET /orders/{id} - Get order by ID
      if (method === 'GET' && url.match(/\/orders\/[^/]+$/)) {
        const orderId = url.split('/').pop()
        const order = storage.orders.find(o => o.id === orderId)

        const mockResponse = {
          data: order || storage.orders[0],
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // AUTH ENDPOINTS

      // POST /auth/login - Login
      if (method === 'POST' && url.includes('/auth/login')) {
        const mockResponse = {
          data: {
            accessToken: 'mock-jwt-access-token',
            refreshToken: 'mock-jwt-refresh-token',
            customerId: 'customer-123',
            email: config.data.email,
            fullName: 'John Doe',
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // POST /auth/register - Register
      if (method === 'POST' && url.includes('/auth/register')) {
        const mockResponse = {
          data: {
            accessToken: 'mock-jwt-access-token',
            refreshToken: 'mock-jwt-refresh-token',
            customerId: generateId(),
            email: config.data.email,
            fullName: config.data.fullName,
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // POST /auth/refresh - Refresh Token
      if (method === 'POST' && url.includes('/auth/refresh')) {
        const mockResponse = {
          data: {
            accessToken: 'mock-jwt-access-token-new',
            refreshToken: 'mock-jwt-refresh-token-new',
            customerId: 'customer-123',
            email: 'user@example.com',
            fullName: 'John Doe',
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // POST /auth/logout - Logout
      if (method === 'POST' && url.includes('/auth/logout')) {
        const mockResponse = {
          data: {},
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        }
        throw { response: mockResponse, config: { ...config, adapter: () => Promise.resolve(mockResponse) } }
      }

      // GET /auth/me - Get current user
      if (method === 'GET' && url.includes('/auth/me')) {
        const mockResponse = {
          data: {
            customerId: 'customer-123',
            email: 'user@example.com',
            fullName: 'John Doe',
            phone: '+1234567890',
            createdAt: new Date().toISOString(),
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
    (error) => Promise.reject(error)
  )

  // Response interceptor to handle mock errors
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.config?.adapter) {
        return error.config.adapter()
      }
      return Promise.reject(error)
    }
  )
}
