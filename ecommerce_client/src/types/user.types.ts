export interface User {
  id: string
  email: string
  fullName: string
  phone?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
  phone?: string
}

export interface UpdateProfileData {
  fullName?: string
  phone?: string
  avatar?: string
}

