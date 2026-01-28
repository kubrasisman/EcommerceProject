import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/store/store'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import type { Product } from '@/types/product.types'

interface RelatedProductsProps {
  currentProductCode: number
  categoryNames: string[]
  brand?: string
}

export default function RelatedProducts({
  currentProductCode,
  categoryNames,
  brand,
}: RelatedProductsProps) {
  const { products } = useAppSelector((state) => state.products)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Filter related products (same category or brand, excluding current product)
  const relatedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // Exclude current product
      if (product.code === currentProductCode) return false

      // Check if shares category
      const productCategories = product.categoryCodes?.map((c) => c.name) || []
      const hasMatchingCategory = categoryNames.some((cat) =>
        productCategories.includes(cat)
      )

      // Check if same brand
      const isSameBrand = brand && product.brand === brand

      return hasMatchingCategory || isSameBrand
    })

    // Limit to 12 products and shuffle for variety
    return filtered.slice(0, 12).sort(() => Math.random() - 0.5)
  }, [products, currentProductCode, categoryNames, brand])

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [relatedProducts])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Benzer Urunler</h2>
        <Link
          to={`/search?category=${categoryNames[0]?.toLowerCase() || ''}`}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          Tumunu Gor
        </Link>
      </div>

      <div className="relative group">
        {/* Left scroll button */}
        {canScrollLeft && (
          <Button
            variant="outline"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Products carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {relatedProducts.map((product) => (
            <RelatedProductCard key={product.code} product={product} />
          ))}
        </div>

        {/* Right scroll button */}
        {canScrollRight && (
          <Button
            variant="outline"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </section>
  )
}

function RelatedProductCard({ product }: { product: Product }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price)
  }

  return (
    <Link
      to={`/product/${product.code}`}
      className="flex-shrink-0 w-48 bg-white rounded-lg border hover:shadow-lg transition-shadow overflow-hidden group"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.thumbnail || product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1 mb-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-600">
              {product.rating.toFixed(1)}
              {product.reviewCount && (
                <span className="text-gray-400"> ({product.reviewCount})</span>
              )}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Discount badge */}
        {product.discount && product.discount > 0 && (
          <span className="inline-block mt-1 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
            %{product.discount} indirim
          </span>
        )}
      </div>
    </Link>
  )
}