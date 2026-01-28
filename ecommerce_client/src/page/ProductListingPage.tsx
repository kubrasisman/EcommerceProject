import { useEffect, useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { fetchProducts, searchProducts, fetchCategories, fetchCategoryHierarchy } from '@/store/slices/productSlice'
import Layout from '@/components/common/Layout'
import ProductCard from '@/components/common/ProductCard'
import ProductFilters from '@/components/product/ProductFilters'
import type { FilterState } from '@/components/product/ProductFilters'
import { Skeleton } from '@/components/ui/skeleton'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, SlidersHorizontal, X } from 'lucide-react'

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const { products, loading, currentPage, totalPage, categories, categoryHierarchy } = useAppSelector((state) => state.products)

  // Get main categories (children of root category with code=1)
  const mainCategories = useMemo(() => {
    if (!categoryHierarchy || categoryHierarchy.length === 0) return []
    const rootCategory = categoryHierarchy.find(cat => cat.code === 1)
    return rootCategory?.children || []
  }, [categoryHierarchy])

  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC')
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [goToPage, setGoToPage] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    minPrice: null,
    maxPrice: null,
    brands: [],
    categories: [],
    inStock: false,
    minRating: null,
  })

  const category = searchParams.get('category') || undefined
  const categoryCodeParam = searchParams.get('categoryCode') || undefined
  const query = searchParams.get('q') || undefined
  const pageParam = parseInt(searchParams.get('page') || '0')

  // Load categories if not already loaded
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories())
    }
    if (!categoryHierarchy || categoryHierarchy.length === 0) {
      dispatch(fetchCategoryHierarchy())
    }
  }, [dispatch, categories, categoryHierarchy])

  // Helper function to map category name (from URL) to category code
  // Searches recursively through all categories including children
  const getCategoryCodeFromName = useMemo(() => {
    const findCategoryRecursive = (cats: typeof categories, normalizedName: string): number | undefined => {
      if (!cats) return undefined
      for (const cat of cats) {
        const catNameNormalized = cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')
        if (catNameNormalized === normalizedName || cat.name.toLowerCase() === normalizedName) {
          return cat.code
        }
        // Search in children
        if (cat.children && cat.children.length > 0) {
          const foundInChildren = findCategoryRecursive(cat.children, normalizedName)
          if (foundInChildren) return foundInChildren
        }
      }
      return undefined
    }

    return (categoryName: string | undefined): number | undefined => {
      if (!categoryName) return undefined
      const normalizedName = categoryName.toLowerCase()
      // First search in hierarchy (includes all levels)
      if (categoryHierarchy && categoryHierarchy.length > 0) {
        const found = findCategoryRecursive(categoryHierarchy, normalizedName)
        if (found) return found
      }
      // Fallback to flat categories
      if (categories && categories.length > 0) {
        return findCategoryRecursive(categories, normalizedName)
      }
      return undefined
    }
  }, [categories, categoryHierarchy])

  useEffect(() => {
    // Wait for categories to load before searching by category name (not needed for categoryCode)
    if (category && !categoryCodeParam && (!categoryHierarchy || categoryHierarchy.length === 0)) {
      return // Wait for hierarchy to load
    }

    try {
      if (query || category || categoryCodeParam) {
        // Use categoryCodeParam directly if available, otherwise resolve from name
        const categoryCode = categoryCodeParam
          ? parseInt(categoryCodeParam)
          : getCategoryCodeFromName(category)

        dispatch(searchProducts({
          // If category not found, use it as keyword instead
          keyword: query || (category && !categoryCode ? category : undefined),
          categoryCode: categoryCode,
          page: pageParam,
          size: itemsPerPage
        }))
      } else {
        dispatch(fetchProducts({
          page: pageParam,
          limit: itemsPerPage,
          sort: sortBy,
          order: sortOrder
        }))
      }
    } catch (error) {
      console.error('Search error:', error)
    }
  }, [dispatch, category, categoryCodeParam, query, sortBy, sortOrder, pageParam, itemsPerPage, getCategoryCodeFromName, categoryHierarchy])

  // Apply local filters to products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Price filter
      if (activeFilters.minPrice !== null && product.price < activeFilters.minPrice) {
        return false
      }
      if (activeFilters.maxPrice !== null && product.price > activeFilters.maxPrice) {
        return false
      }
      // Brand filter
      if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(product.brand)) {
        return false
      }
      // Category filter (local)
      if (activeFilters.categories.length > 0) {
        const productCategories = product.categoryCodes?.map(c => c.name) || []
        if (!activeFilters.categories.some(c => productCategories.includes(c))) {
          return false
        }
      }
      // Rating filter
      if (activeFilters.minRating !== null && (product.rating || 0) < activeFilters.minRating) {
        return false
      }
      // Stock filter
      if (activeFilters.inStock && product.stock !== undefined && product.stock <= 0) {
        return false
      }
      return true
    })
  }, [products, activeFilters])

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-')
    setSortBy(field)
    setSortOrder(order as 'ASC' | 'DESC')
  }

  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString())
    setSearchParams(searchParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGoToPage = () => {
    const page = parseInt(goToPage) - 1
    if (page >= 0 && page < totalPage) {
      handlePageChange(page)
      setGoToPage('')
    }
  }

  const handleFilterChange = useCallback((filters: FilterState) => {
    setActiveFilters(filters)
  }, [])

  // Generate pagination numbers with ellipsis
  const getPaginationNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisible = 5

    if (totalPage <= maxVisible + 2) {
      // Show all pages
      for (let i = 0; i < totalPage; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(0)

      if (currentPage <= 2) {
        // Near start
        for (let i = 1; i <= 3; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPage - 1)
      } else if (currentPage >= totalPage - 3) {
        // Near end
        pages.push('ellipsis')
        for (let i = totalPage - 4; i < totalPage; i++) {
          pages.push(i)
        }
      } else {
        // Middle
        pages.push('ellipsis')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('ellipsis')
        pages.push(totalPage - 1)
      }
    }

    return pages
  }

  const activeFilterCount =
    (activeFilters.minPrice !== null ? 1 : 0) +
    (activeFilters.maxPrice !== null ? 1 : 0) +
    activeFilters.brands.length +
    activeFilters.categories.length +
    (activeFilters.inStock ? 1 : 0) +
    (activeFilters.minRating !== null ? 1 : 0)

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <span className="hover:text-gray-700 cursor-pointer">Ana Sayfa</span>
          <span className="mx-2">/</span>
          {category && (
            <>
              <span className="text-gray-900 font-medium">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
            </>
          )}
          {query && (
            <span className="text-gray-900 font-medium">Arama: "{query}"</span>
          )}
          {!category && !query && (
            <span className="text-gray-900 font-medium">Tum Urunler</span>
          )}
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              {query ? `"${query}" icin sonuclar` : category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Tum Urunler'}
            </h1>
            <p className="text-gray-500 text-sm">
              {loading === 'succeeded' && `${filteredProducts.length} urun bulundu`}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 md:mt-0">
            {/* Mobile filter button */}
            <Button
              variant="outline"
              className="md:hidden flex items-center gap-2"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtreler
              {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Items per page */}
            <Select
              options={[
                { value: '12', label: '12 urun' },
                { value: '24', label: '24 urun' },
                { value: '48', label: '48 urun' },
              ]}
              value={itemsPerPage.toString()}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="w-28"
            />

            {/* Sort */}
            <Select
              options={[
                { value: 'id-DESC', label: 'En Yeni' },
                { value: 'price-ASC', label: 'Fiyat: Artan' },
                { value: 'price-DESC', label: 'Fiyat: Azalan' },
                { value: 'name-ASC', label: 'A-Z' },
                { value: 'name-DESC', label: 'Z-A' },
              ]}
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-36"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <ProductFilters
                products={products}
                categories={mainCategories}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active filters tags */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.minPrice !== null && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Min: {activeFilters.minPrice} TL
                    <button onClick={() => setActiveFilters(prev => ({ ...prev, minPrice: null }))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {activeFilters.maxPrice !== null && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Max: {activeFilters.maxPrice} TL
                    <button onClick={() => setActiveFilters(prev => ({ ...prev, maxPrice: null }))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {activeFilters.brands.map(brand => (
                  <span key={brand} className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {brand}
                    <button onClick={() => setActiveFilters(prev => ({ ...prev, brands: prev.brands.filter(b => b !== brand) }))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {activeFilters.categories.map(cat => (
                  <span key={cat} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {cat}
                    <button onClick={() => setActiveFilters(prev => ({ ...prev, categories: prev.categories.filter(c => c !== cat) }))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {activeFilters.minRating !== null && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    {activeFilters.minRating}+ Yildiz
                    <button onClick={() => setActiveFilters(prev => ({ ...prev, minRating: null }))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {activeFilters.inStock && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                    Stokta Var
                    <button onClick={() => setActiveFilters(prev => ({ ...prev, inStock: false }))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {loading === 'loading' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold mb-2">Urun bulunamadi</h2>
                <p className="text-gray-500 mb-4">Arama veya filtreleri degistirmeyi deneyin</p>
                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setActiveFilters({
                      minPrice: null,
                      maxPrice: null,
                      brands: [],
                      categories: [],
                      inStock: false,
                      minRating: null,
                    })}
                  >
                    Filtreleri Temizle
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.code} product={product} />
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {totalPage > 1 && (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-12">
                    <div className="flex items-center space-x-1">
                      {/* First page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(0)}
                        disabled={currentPage === 0}
                        title="Ilk sayfa"
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>

                      {/* Previous */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {/* Page numbers */}
                      {getPaginationNumbers().map((page, idx) => (
                        page === 'ellipsis' ? (
                          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                        ) : (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="min-w-[40px]"
                          >
                            {page + 1}
                          </Button>
                        )
                      ))}

                      {/* Next */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPage - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>

                      {/* Last page */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(totalPage - 1)}
                        disabled={currentPage === totalPage - 1}
                        title="Son sayfa"
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Go to page */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Sayfaya git:</span>
                      <Input
                        type="number"
                        min={1}
                        max={totalPage}
                        value={goToPage}
                        onChange={(e) => setGoToPage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGoToPage()}
                        className="w-16 h-8 text-center"
                        placeholder={String(currentPage + 1)}
                      />
                      <Button size="sm" variant="outline" onClick={handleGoToPage}>
                        Git
                      </Button>
                    </div>

                    <span className="text-sm text-gray-500">
                      Sayfa {currentPage + 1} / {totalPage}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-semibold">Filtreler</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <ProductFilters
                products={products}
                categories={mainCategories}
                onFilterChange={handleFilterChange}
                initialFilters={activeFilters}
              />
            </div>
            <div className="p-4 border-t">
              <Button className="w-full" onClick={() => setShowMobileFilters(false)}>
                {filteredProducts.length} Urun Goster
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
