import api from '@/lib/api'
import type { AuthResponse, LoginCredentials, RegisterData, User, UpdateProfileData } from '@/types/user.types'

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  // Logout
  logout: async (): Promise<void> => {
    localStorage.removeItem('token')
    await api.post('/auth/logout')
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  // Update profile
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await api.put<User>('/auth/profile', data)
    return response.data
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', { currentPassword, newPassword })
  },
}

