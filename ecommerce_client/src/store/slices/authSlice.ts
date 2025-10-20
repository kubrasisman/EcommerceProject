import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { User, LoginCredentials, RegisterData } from '@/types/user.types'
import type { LoadingState } from '@/types/common.types'
import { authService } from '@/services/authService'

interface AuthState {
  user: User | null
  token: string | null
  loading: LoadingState
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
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
    setToken: (state, action) => {
      state.token = action.payload
      localStorage.setItem('token', action.payload)
    },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem('token')
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
        state.user = action.payload.user
        state.token = action.payload.token
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
        state.user = action.payload.user
        state.token = action.payload.token
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
        state.token = null
        localStorage.removeItem('token')
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
      })
  },
})

export const { clearError, setToken, clearAuth } = authSlice.actions
export default authSlice.reducer
