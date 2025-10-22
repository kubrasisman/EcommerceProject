import axios from 'axios'
import { setupMockInterceptor } from './mockInterceptor'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/api'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK === 'true' || false // Default to true for development

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Setup mock interceptor if enabled
setupMockInterceptor(api, USE_MOCK_DATA)

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Request interceptor to add auth token and customerId
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  const customerId = localStorage.getItem('customerId')
  
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  
  if (customerId) {
    config.headers['X-Customer-Id'] = customerId
  }
  
  return config
})

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        // No refresh token, logout
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('customerId')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        // Try to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken
        })

        const { accessToken, refreshToken: newRefreshToken, customerId } = response.data

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)
        localStorage.setItem('customerId', customerId)

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        
        processQueue(null, accessToken)
        isRefreshing = false

        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        isRefreshing = false
        
        // Refresh failed, logout
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('customerId')
        window.location.href = '/login'
        
        return Promise.reject(refreshError)
      }
    }

    // For other errors, just reject
    if (error.response?.status === 403) {
      console.error('Forbidden access', error)
    }

    return Promise.reject(error)
  }
)

export default api
