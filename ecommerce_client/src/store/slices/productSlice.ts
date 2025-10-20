import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Product, ProductFilter, ProductSort } from '@/types/product.types'
import type { LoadingState } from '@/types/common.types'
import { productService } from '@/services/productService'

interface ProductState {
  products: Product[]
  featuredProducts: Product[]
  selectedProduct: Product | null
  relatedProducts: Product[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  loading: LoadingState
  error: string | null
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  selectedProduct: null,
  relatedProducts: [],
  total: 0,
  page: 1,
  pageSize: 20,
  totalPages: 0,
  loading: 'idle',
  error: null,
}

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: { filter?: ProductFilter; sort?: ProductSort; page?: number; pageSize?: number }) => {
    const response = await productService.getProducts(
      params.filter,
      params.sort,
      params.page,
      params.pageSize
    )
    return response
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId: string) => {
    const response = await productService.getProductById(productId)
    return response
  }
)

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (limit?: number) => {
    const response = await productService.getFeaturedProducts(limit)
    return response
  }
)

export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelatedProducts',
  async (productId: string) => {
    const response = await productService.getRelatedProducts(productId)
    return response
  }
)

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (params: { query: string; page?: number; pageSize?: number }) => {
    const response = await productService.searchProducts(
      params.query,
      params.page,
      params.pageSize
    )
    return response
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null
      state.relatedProducts = []
    },
    clearProducts: (state) => {
      state.products = []
      state.total = 0
      state.page = 1
      state.totalPages = 0
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.products = action.payload.products
        state.total = action.payload.total
        state.page = action.payload.page
        state.pageSize = action.payload.pageSize
        state.totalPages = action.payload.totalPages
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Failed to fetch products'
      })

      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.selectedProduct = action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Failed to fetch product'
      })

      // Fetch Featured Products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.featuredProducts = action.payload
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Failed to fetch featured products'
      })

      // Fetch Related Products
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload
      })

      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.loading = 'loading'
        state.error = null
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = 'succeeded'
        state.products = action.payload.products
        state.total = action.payload.total
        state.page = action.payload.page
        state.pageSize = action.payload.pageSize
        state.totalPages = action.payload.totalPages
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = 'failed'
        state.error = action.error.message || 'Failed to search products'
      })
  },
})

export const { clearSelectedProduct, clearProducts } = productSlice.actions
export default productSlice.reducer

