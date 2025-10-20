import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Product, ProductFilter, ProductQueryParams } from '@/types/product.types'
import type { LoadingState } from '@/types/common.types'
import { productService } from '@/services/productService'
import { categoryService } from '@/services/categoryService'
import type { Category } from '@/types/category.types'

interface ProductState {
    products: Product[]
    featuredProducts: Product[]
    selectedProduct: Product | null
    relatedProducts: Product[]
    categories: Category[] | null
    currentPage: number
    totalPage: number
    loading: LoadingState
    error: string | null
}

const initialState: ProductState = {
    products: [],
    featuredProducts: [],
    selectedProduct: null,
    categories: [],
    relatedProducts: [],
    currentPage: 0,
    totalPage: 0,
    loading: 'idle',
    error: null,
}

// Async Thunks
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (params?: ProductQueryParams & ProductFilter) => {
        const response = await productService.getProducts(params)
        console.log('response', response)
        return response
    }
)

export const fetchProductByCode = createAsyncThunk(
    'products/fetchProductByCode',
    async (code: number) => {
        const response = await productService.getProductByCode(code)
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
    async (productId: number) => {
        const response = await productService.getRelatedProducts(productId)
        return response
    }
)

export const searchProducts = createAsyncThunk(
    'products/searchProducts',
    async (params: { query: string; page?: number; limit?: number }) => {
        const response = await productService.searchProducts(
            params.query,
            params.page,
            params.limit
        )
        return response
    }
)

export const fetchCategories = createAsyncThunk(
    'products/fetchCategories',
    async () => {
        const response = await categoryService.getAllCategories()
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
            state.currentPage = 0
            state.totalPage = 0
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
                state.currentPage = action.payload.currentPage
                state.totalPage = action.payload.totalPage
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.error.message || 'Failed to fetch products'
            })

            // Fetch Product By Code
            .addCase(fetchProductByCode.pending, (state) => {
                state.loading = 'loading'
                state.error = null
            })
            .addCase(fetchProductByCode.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.selectedProduct = action.payload
            })
            .addCase(fetchProductByCode.rejected, (state, action) => {
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
            .addCase(fetchRelatedProducts.pending, (state) => {
                state.error = null
            })
            .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
                state.relatedProducts = action.payload
            })
            .addCase(fetchRelatedProducts.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch related products'
            })

            // Search Products
            .addCase(searchProducts.pending, (state) => {
                state.loading = 'loading'
                state.error = null
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.loading = 'succeeded'
                state.products = action.payload.products
                state.currentPage = action.payload.currentPage
                state.totalPage = action.payload.totalPage
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.loading = 'failed'
                state.error = action.error.message || 'Failed to search products'
            })

            // Fetch Related Categories
            .addCase(fetchCategories.pending, (state) => {
                state.error = null
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch related products'
            })

    },
})

export const { clearSelectedProduct, clearProducts } = productSlice.actions
export default productSlice.reducer
