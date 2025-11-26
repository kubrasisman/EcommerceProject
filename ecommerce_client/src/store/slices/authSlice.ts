import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { User, LoginCredentials, RegisterData } from '@/types/user.types'
import type { LoadingState } from '@/types/common.types'
import { authService } from '@/services/authService'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  loading: LoadingState
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  loading: 'idle',
  error: null,
}

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    return response
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData) => {
    const response = await authService.register(userData)
    return response
  }
)

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async () => {
    const response = await authService.getCurrentUser()
    return response
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await authService.logout()
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      localStorage.setItem('accessToken', action.payload.accessToken)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
      if (action.payload.customerId) {
        localStorage.setItem('customerId', action.payload.customerId)
      }
    },
    clearAuth: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('customerId')
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.user = {
          customerId: action.payload.customerId,
          email: action.payload.email,
          fullName: action.payload.fullName,
        }
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Login failed'
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.user = {
          customerId: action.payload.customerId,
          email: action.payload.email,
          fullName: action.payload.fullName,
        }
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Registration failed'
      })

      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = 'loading'
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.user = action.payload
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = 'failed'
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('customerId')
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
      })
  },
})

export const { clearError, setTokens, clearAuth } = authSlice.actions
export default authSlice.reducer
