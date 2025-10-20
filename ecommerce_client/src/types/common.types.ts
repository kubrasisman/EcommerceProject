export interface ApiError {
  message: string
  status?: number
  errors?: Record<string, string[]>
}

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface AsyncState {
  loading: LoadingState
  error: string | null
}

