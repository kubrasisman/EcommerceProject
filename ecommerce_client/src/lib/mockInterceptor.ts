import type { AxiosInstance } from 'axios'
import { mockProducts, getMockProducts, searchMockProducts, getMockProductByCode } from './mockData'
import { generateOrderNumber, generateId } from './helpers'
import type { Cart, CartItem } from '@/types/cart.types'
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

      // CART ENDPOINTS
      
      // GET /cart - Get user's cart
      if (method === 'GET' && url.endsWith('/cart')) {
        if (!storage.cart) {
          storage.cart = {
            id: generateId(),
            userId: 'user1',
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

      // POST /cart/items - Add item to cart
      if (method === 'POST' && url.includes('/cart/items')) {
        const { productId, quantity, selectedSize, selectedColor } = config.data
        const product = getMockProductByCode(parseInt(productId))
        
        if (product) {
          if (!storage.cart) {
            storage.cart = {
              id: generateId(),
              userId: 'user1',
              items: [],
              subtotal: 0,
              tax: 0,
              shipping: 0,
              total: 0,
              updatedAt: new Date().toISOString(),
            }
          }

          const existingItem = storage.cart.items.find(
            item => item.product.code === product.code && 
                   item.selectedSize === selectedSize && 
                   item.selectedColor === selectedColor
          )

          if (existingItem) {
            existingItem.quantity += quantity
          } else {
            const newItem: CartItem = {
              id: generateId(),
              product,
              quantity,
              selectedSize,
              selectedColor,
              addedAt: new Date().toISOString(),
            }
            storage.cart.items.push(newItem)
          }

          // Recalculate totals
          storage.cart.subtotal = storage.cart.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          )
          storage.cart.tax = storage.cart.subtotal * 0.1
          storage.cart.shipping = storage.cart.subtotal > 100 ? 0 : 10
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

      // PUT /cart/items/{id} - Update cart item
      if (method === 'PUT' && url.includes('/cart/items/')) {
        const itemId = url.split('/').pop()
        const { quantity } = config.data

        if (storage.cart) {
          const item = storage.cart.items.find(i => i.id === itemId)
          if (item) {
            item.quantity = quantity
          }

          // Recalculate totals
          storage.cart.subtotal = storage.cart.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          )
          storage.cart.tax = storage.cart.subtotal * 0.1
          storage.cart.shipping = storage.cart.subtotal > 100 ? 0 : 10
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

      // DELETE /cart/items/{id} - Remove item from cart
      if (method === 'DELETE' && url.includes('/cart/items/')) {
        const itemId = url.split('/').pop()

        if (storage.cart) {
          storage.cart.items = storage.cart.items.filter(i => i.id !== itemId)

          // Recalculate totals
          storage.cart.subtotal = storage.cart.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          )
          storage.cart.tax = storage.cart.subtotal * 0.1
          storage.cart.shipping = storage.cart.subtotal > 100 ? 0 : 10
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

      // DELETE /cart - Clear cart
      if (method === 'DELETE' && url.endsWith('/cart')) {
        storage.cart = {
          id: generateId(),
          userId: 'user1',
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          updatedAt: new Date().toISOString(),
        }

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
        const newOrder: Order = {
          id: generateId(),
          userId: 'user1',
          orderNumber: generateOrderNumber(),
          items: orderData.items.map((item: CartItem) => ({
            id: generateId(),
            productId: item.product.code.toString(),
            productName: item.product.name,
            productImage: item.product.imageUrl,
            quantity: item.quantity,
            price: item.product.price,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
          })),
          subtotal: storage.cart?.subtotal || 0,
          tax: storage.cart?.tax || 0,
          shipping: storage.cart?.shipping || 0,
          total: storage.cart?.total || 0,
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
          id: generateId(),
          userId: 'user1',
          items: [],
          subtotal: 0,
          tax: 0,
          shipping: 0,
          total: 0,
          updatedAt: new Date().toISOString(),
        }

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
            token: 'mock-jwt-token',
            user: {
              id: 'user1',
              email: config.data.email,
              fullName: 'John Doe',
              phone: '+1234567890',
              role: 'customer',
              createdAt: new Date().toISOString(),
            },
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
            token: 'mock-jwt-token',
            user: {
              id: generateId(),
              email: config.data.email,
              fullName: config.data.fullName,
              phone: config.data.phone,
              role: 'customer',
              createdAt: new Date().toISOString(),
            },
          },
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
            id: 'user1',
            email: 'user@example.com',
            fullName: 'John Doe',
            phone: '+1234567890',
            role: 'customer',
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
