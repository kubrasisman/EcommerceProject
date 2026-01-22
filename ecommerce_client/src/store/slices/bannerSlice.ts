import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Banner } from '@/types/banner.types'
import type { LoadingState } from '@/types/common.types'
import { bannerService } from '@/services/bannerService'

interface BannerState {
  banners: Banner[]
  loading: LoadingState
  error: string | null
}

const initialState: BannerState = {
  banners: [],
  loading: 'idle',
  error: null,
}

export const fetchBanners = createAsyncThunk(
  'banners/fetchBanners',
  async () => {
    const response = await bannerService.getActiveBanners()
    return response
  }
)

const bannerSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {
    clearBanners: (state) => {
      state.banners = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.banners = action.payload
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Failed to fetch banners'
      })
  },
})

export const { clearBanners } = bannerSlice.actions
export default bannerSlice.reducer
