export interface User {
  id: number
  email: string
  fullName: string
  kvkkConsent: boolean
  emailValid: boolean
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

