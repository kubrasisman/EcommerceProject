import { Link } from 'react-router-dom'
import { Star, ShoppingCart } from 'lucide-react'
import type { Product } from '@/types/product.types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAppDispatch } from '@/store/store'
import { useToast } from '@/components/ui/toast'
import { addToCart } from '@/store/slices/cartSlice'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const { addToast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ productId: product.id, quantity: 1 }))
    addToast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
      variant: 'success',
      duration: 3000,
    })
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-card rounded-lg border overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2" variant="destructive">
            -{discountPercentage}%
          </Badge>
        )}
        {product.stock === 0 && (
          <Badge className="absolute top-2 right-2" variant="secondary">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Category */}
        <p className="text-xs text-muted-foreground uppercase">{product.category}</p>

        {/* Name */}
        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline space-x-2">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Link>
  )
}

