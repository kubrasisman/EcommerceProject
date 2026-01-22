import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import axios from "axios"

interface User {
  customerId: string
  email: string
  fullName: string
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Axios instance with interceptor
export const api = axios.create({
  baseURL: "http://localhost:8888",
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("adminAccessToken")
    const storedUser = localStorage.getItem("adminUser")

    if (storedToken && storedUser) {
      setAccessToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Setup axios interceptor
  useEffect(() => {
    const interceptor = api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("adminAccessToken")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    return () => {
      api.interceptors.request.eject(interceptor)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await axios.post("http://localhost:8888/api/auth/login", {
      email,
      password,
    })

    const { accessToken: token, refreshToken, customerId, email: userEmail, fullName } = response.data

    const userData: User = {
      customerId,
      email: userEmail,
      fullName,
    }

    setAccessToken(token)
    setUser(userData)

    localStorage.setItem("adminAccessToken", token)
    localStorage.setItem("adminRefreshToken", refreshToken)
    localStorage.setItem("adminUser", JSON.stringify(userData))
  }

  const logout = () => {
    setAccessToken(null)
    setUser(null)
    localStorage.removeItem("adminAccessToken")
    localStorage.removeItem("adminRefreshToken")
    localStorage.removeItem("adminUser")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}