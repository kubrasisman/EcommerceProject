import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Product, ProductFilter, ProductQueryParams } from '@/types/product.types'
import type { LoadingState } from '@/types/common.types'
import { productService } from '@/services/productService'
import { searchService } from '@/services/searchService'
import { categoryService } from '@/services/categoryService'
import type { Category } from '@/types/category.types'

interface ProductState {
    products: Product[]
    featuredProducts: Product[]
    selectedProduct: Product | null
    categories: Category[] | null
    categoryHierarchy: Category[] | null
    brands: Category[] | null
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
    categoryHierarchy: null,
    brands: null,
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

export const searchProducts = createAsyncThunk(
    'products/searchProducts',
    async (params: { keyword?: string; categoryCode?: number; page?: number; size?: number }) => {
        const response = await searchService.searchProducts({
            keyword: params.keyword,
            categoryCode: params.categoryCode,
            page: params.page || 0,
            size: params.size || 20
        })
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

export const fetchCategoryHierarchy = createAsyncThunk(
    'products/fetchCategoryHierarchy',
    async () => {
        const response = await categoryService.getHierarchy()
        return response
    }
)

export const fetchBrands = createAsyncThunk(
    'products/fetchBrands',
    async () => {
        const response = await categoryService.getBrands()
        return response
    }
)

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearSelectedProduct: (state) => {
            state.selectedProduct = null
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

            // Fetch Category Hierarchy
            .addCase(fetchCategoryHierarchy.pending, (state) => {
                state.error = null
            })
            .addCase(fetchCategoryHierarchy.fulfilled, (state, action) => {
                state.categoryHierarchy = action.payload
            })
            .addCase(fetchCategoryHierarchy.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch category hierarchy'
            })

            // Fetch Brands
            .addCase(fetchBrands.pending, (state) => {
                state.error = null
            })
            .addCase(fetchBrands.fulfilled, (state, action) => {
                state.brands = action.payload
            })
            .addCase(fetchBrands.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to fetch brands'
            })

    },
})

export const { clearSelectedProduct, clearProducts } = productSlice.actions
export default productSlice.reducer
