export interface User {
  customerId: string
  email: string
  fullName: string
  phone?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  customerId: string
  email: string
  fullName: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
  kvkkConsent: boolean
}

export interface UpdateProfileData {
  fullName?: string
  phone?: string
  avatar?: string
}

