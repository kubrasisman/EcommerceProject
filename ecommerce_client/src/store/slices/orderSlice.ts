import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Order } from '@/types/order.types'
import type { LoadingState } from '@/types/common.types'
import { orderService } from '@/services/orderService'

interface OrderState {
  orders: Order[]
  selectedOrder: Order | null
  total: number
  page: number
  pageSize: number
  loading: LoadingState
  error: string | null
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  total: 0,
  page: 1,
  pageSize: 10,
  loading: 'idle',
  error: null,
}

// Async Thunks
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async () => {
    const response = await orderService.placeOrder()
    return response
  }
)

export const fetchOrdersByEmail = createAsyncThunk(
  'orders/fetchOrdersByEmail',
  async () => {
    const response = await orderService.getOrdersByCustomerEmail()
    return response
  }
)

export const fetchOrderByCode = createAsyncThunk(
  'orders/fetchOrderByCode',
  async (code: string) => {
    const response = await orderService.getOrderByCode(code)
    return response
  }
)



const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Place Order (Checkout)
      .addCase(placeOrder.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.orders.unshift(action.payload)
        state.selectedOrder = action.payload
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Failed to place order'
      })

      // Fetch Orders By Email
      .addCase(fetchOrdersByEmail.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(fetchOrdersByEmail.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.orders = action.payload
        state.total = action.payload.length
      })
      .addCase(fetchOrdersByEmail.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Failed to fetch orders'
      })

      // Fetch Order By Code
      .addCase(fetchOrderByCode.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(fetchOrderByCode.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.selectedOrder = action.payload
      })
      .addCase(fetchOrderByCode.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Failed to fetch order'
      })

  },
})

export const { clearSelectedOrder } = orderSlice.actions
export default orderSlice.reducer

