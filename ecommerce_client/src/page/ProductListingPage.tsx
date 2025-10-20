import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { fetchProducts, searchProducts } from '@/store/slices/productSlice'
import type { ProductFilter, ProductSort } from '@/types/product.types'
import Layout from '@/components/common/Layout'
import ProductCard from '@/components/common/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const { products, loading, page, totalPages } = useAppSelector((state) => state.products)

  const [sort, setSort] = useState<ProductSort>({ field: 'createdAt', order: 'desc' })

  const category = searchParams.get('category') || undefined
  const query = searchParams.get('q') || undefined

  useEffect(() => {
    const filter: ProductFilter = {
      category,
      search: query,
    }

    if (query) {
      dispatch(searchProducts({ query, page }))
    } else {
      dispatch(fetchProducts({ filter, sort, page }))
    }
  }, [dispatch, category, query, sort, page])

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-')
    setSort({ field: field as ProductSort['field'], order: order as 'asc' | 'desc' })
  }

  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString())
    setSearchParams(searchParams)
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {query ? `Search Results for "${query}"` : category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}
            </h1>
            <p className="text-muted-foreground">
              {loading === 'succeeded' && `${products.length} products found`}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Select
              options={[
                { value: 'createdAt-desc', label: 'Newest' },
                { value: 'price-asc', label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' },
                { value: 'rating-desc', label: 'Highest Rated' },
                { value: 'name-asc', label: 'Name: A to Z' },
              ]}
              value={`${sort.field}-${sort.order}`}
              onChange={(e) => handleSortChange(e.target.value)}
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading === 'loading' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
