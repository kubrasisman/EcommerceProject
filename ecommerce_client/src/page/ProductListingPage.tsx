import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { fetchProducts, searchProducts } from '@/store/slices/productSlice'
import Layout from '@/components/common/Layout'
import ProductCard from '@/components/common/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const { products, loading, currentPage, totalPage } = useAppSelector((state) => state.products)

  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC')

  const category = searchParams.get('category') || undefined
  const query = searchParams.get('q') || undefined
  const pageParam = parseInt(searchParams.get('page') || '0')

  useEffect(() => {

    if (query) {
      dispatch(searchProducts({ 
        query, 
        page: pageParam,
        limit: 20
      }))
    } else {

      dispatch(fetchProducts({ 
        page: pageParam,
        limit: 20,
        sort: sortBy,
        order: sortOrder,
        category,
        search: query
      }))
    }
  }, [dispatch, category, query, sortBy, sortOrder, pageParam])

  const handleSortChange = (value: string) => {
    const [field, order] = value.split('-')
    setSortBy(field)
    setSortOrder(order as 'ASC' | 'DESC')
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
              {query ? `"${query}" için arama sonuçları` : category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Tüm Ürünler'}
            </h1>
            <p className="text-muted-foreground">
              {loading === 'succeeded' && `${products.length} ürün bulundu`}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Select
              options={[
                { value: 'id-DESC', label: 'En Yeni' },
                { value: 'price-ASC', label: 'Fiyat: Düşükten Yükseğe' },
                { value: 'price-DESC', label: 'Fiyat: Yüksekten Düşüğe' },
                { value: 'name-ASC', label: 'İsim: A-Z' },
                { value: 'name-DESC', label: 'İsim: Z-A' },
              ]}
              value={`${sortBy}-${sortOrder}`}
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
            <h2 className="text-2xl font-semibold mb-2">Ürün bulunamadı</h2>
            <p className="text-muted-foreground">Arama veya filtreleri değiştirmeyi deneyin</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.code} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPage > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Önceki
                </Button>
                <div className="flex items-center space-x-1">
                  {[...Array(Math.min(5, totalPage))].map((_, i) => {
                    return (
                      <Button
                        key={i}
                        variant={currentPage === i ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(i)}
                      >
                        {i + 1}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPage - 1}
                >
                  Sonraki
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
