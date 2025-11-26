import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Order, CreateOrderPayload } from '@/types/order.types'
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
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (payload: CreateOrderPayload) => {
    const response = await orderService.createOrder(payload)
    return response
  }
)

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params: { page?: number; pageSize?: number } = {}) => {
    const response = await orderService.getOrders(params.page, params.pageSize)
    return response
  }
)

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId: string) => {
    const response = await orderService.getOrderById(orderId)
    return response
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId: string) => {
    const response = await orderService.cancelOrder(orderId)
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
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.orders.unshift(action.payload)
        state.selectedOrder = action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Failed to create order'
      })

      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.orders = action.payload.orders
        state.total = action.payload.total
        state.page = action.payload.page
        state.pageSize = action.payload.pageSize
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Failed to fetch orders'
      })

      // Fetch Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.selectedOrder = action.payload
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Failed to fetch order'
      })

      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex((order) => order.id === action.payload.id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload
        }
      })
  },
})

export const { clearSelectedOrder } = orderSlice.actions
export default orderSlice.reducer

