import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown, ChevronUp, ChevronRight, X, SlidersHorizontal } from 'lucide-react'
import type { Product } from '@/types/product.types'
import type { Category } from '@/types/category.types'

export interface FilterState {
  minPrice: number | null
  maxPrice: number | null
  brands: string[]
  categories: string[]
  inStock: boolean
  minRating: number | null
}

interface ProductFiltersProps {
  products: Product[]
  categories: Category[]
  onFilterChange: (filters: FilterState) => void
  initialFilters?: Partial<FilterState>
}

const initialFilterState: FilterState = {
  minPrice: null,
  maxPrice: null,
  brands: [],
  categories: [],
  inStock: false,
  minRating: null,
}

// Recursive category filter item component
function CategoryFilterItem({
  category,
  selectedCategories,
  onToggle,
  depth,
}: {
  category: Category
  selectedCategories: string[]
  onToggle: (name: string) => void
  depth: number
}) {
  const [isExpanded, setIsExpanded] = useState(depth < 1) // Auto-expand first level
  const hasChildren = category.children && category.children.length > 0

  return (
    <div>
      <div
        className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 p-1 rounded"
        style={{ paddingLeft: `${depth * 12}px` }}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="p-0.5 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-gray-500" />
            ) : (
              <ChevronRight className="h-3 w-3 text-gray-500" />
            )}
          </button>
        )}
        {!hasChildren && <span className="w-4" />}
        <label className="flex items-center gap-2 cursor-pointer flex-1">
          <Checkbox
            checked={selectedCategories.includes(category.name)}
            onCheckedChange={() => onToggle(category.name)}
          />
          <span className="text-sm text-gray-700">{category.name}</span>
        </label>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {category.children!.map((child) => (
            <CategoryFilterItem
              key={child.code}
              category={child}
              selectedCategories={selectedCategories}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProductFilters({
  products,
  categories,
  onFilterChange,
  initialFilters,
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    ...initialFilterState,
    ...initialFilters,
  })
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    category: true,
    rating: true,
  })

  // Extract unique brands from products
  const availableBrands = useMemo(() => {
    const brands = new Set<string>()
    products.forEach((p) => {
      if (p.brand) brands.add(p.brand)
    })
    return Array.from(brands).sort()
  }, [products])

  // Price range from products
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 10000 }
    const prices = products.map((p) => p.price)
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    }
  }, [products])

  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : Number(value)
    setFilters((prev) => ({
      ...prev,
      [type === 'min' ? 'minPrice' : 'maxPrice']: numValue,
    }))
  }

  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }))
  }

  const handleCategoryToggle = (categoryName: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryName)
        ? prev.categories.filter((c) => c !== categoryName)
        : [...prev.categories, categoryName],
    }))
  }

  const handleRatingChange = (rating: number) => {
    setFilters((prev) => ({
      ...prev,
      minRating: prev.minRating === rating ? null : rating,
    }))
  }

  const clearAllFilters = () => {
    setFilters(initialFilterState)
  }

  const hasActiveFilters =
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.brands.length > 0 ||
    filters.categories.length > 0 ||
    filters.inStock ||
    filters.minRating !== null

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtreler</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-3 w-3 mr-1" />
            Temizle
          </Button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900"
        >
          Fiyat Araligi
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.price && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label className="text-xs text-gray-500">Min</Label>
                <Input
                  type="number"
                  placeholder={priceRange.min.toString()}
                  value={filters.minPrice ?? ''}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="mt-1"
                />
              </div>
              <span className="mt-5 text-gray-400">-</span>
              <div className="flex-1">
                <Label className="text-xs text-gray-500">Max</Label>
                <Input
                  type="number"
                  placeholder={priceRange.max.toString()}
                  value={filters.maxPrice ?? ''}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            {/* Quick price buttons */}
            <div className="flex flex-wrap gap-2">
              {[100, 500, 1000, 5000].map((price) => (
                <button
                  key={price}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: price,
                      minPrice: null,
                    }))
                  }
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    filters.maxPrice === price && filters.minPrice === null
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {price} TL'ye kadar
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-4 border-t pt-4">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900"
          >
            Kategori
            {expandedSections.category ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.category && (
            <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
              {categories.map((category) => (
                <CategoryFilterItem
                  key={category.code}
                  category={category}
                  selectedCategories={filters.categories}
                  onToggle={handleCategoryToggle}
                  depth={0}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div className="mb-4 border-t pt-4">
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900"
          >
            Marka
            {expandedSections.brand ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.brand && (
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
              {availableBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                >
                  <Checkbox
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => handleBrandToggle(brand)}
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rating */}
      <div className="mb-4 border-t pt-4">
        <button
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900"
        >
          Puan
          {expandedSections.rating ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedSections.rating && (
          <div className="mt-3 space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`flex items-center gap-2 w-full p-2 rounded transition-colors ${
                  filters.minRating === rating
                    ? 'bg-yellow-50 border border-yellow-300'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-sm ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">{rating}+ yildiz</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stock filter */}
      <div className="border-t pt-4">
        <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
          <Checkbox
            checked={filters.inStock}
            onCheckedChange={(checked) =>
              setFilters((prev) => ({ ...prev, inStock: checked === true }))
            }
          />
          <span className="text-sm text-gray-700">Sadece stokta olanlar</span>
        </label>
      </div>
    </div>
  )
}