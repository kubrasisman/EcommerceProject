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

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token')
      //window.location.href = '/login'
      console.error('Unauthorized, redirecting to login.', error)
    }
    return Promise.reject(error)
  }
)

export default api
