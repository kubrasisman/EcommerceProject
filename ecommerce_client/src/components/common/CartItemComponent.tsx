import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem } from '@/types/cart.types'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/store/store'
import  { updateCartItem, removeFromCart } from '@/store/slices/cartSlice'

interface CartItemComponentProps {
  item: CartItem
  compact?: boolean
}

export default function CartItemComponent({ item, compact = false }: CartItemComponentProps) {
  const dispatch = useAppDispatch()

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= item.product.stock) {
      dispatch(updateCartItem({ cartItemId: item.id, quantity: newQuantity }))
    }
  }

  const handleRemove = () => {
    dispatch(removeFromCart({ cartItemId: item.id }))
  }

  const itemTotal = item.product.price * item.quantity

  if (compact) {
    return (
      <div className="flex gap-3 py-3">
        <img
          src={item.product.thumbnail}
          alt={item.product.name}
          className="h-16 w-16 rounded-md object-cover"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium line-clamp-1">{item.product.name}</h4>
          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
          <p className="text-sm font-semibold">${itemTotal.toFixed(2)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Image */}
      <img
        src={item.product.thumbnail}
        alt={item.product.name}
        className="h-24 w-24 rounded-lg object-cover"
      />

      {/* Details */}
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold">{item.product.name}</h3>
            <p className="text-sm text-muted-foreground">{item.product.category}</p>
            {item.selectedSize && (
              <p className="text-xs text-muted-foreground">Size: {item.selectedSize}</p>
            )}
            {item.selectedColor && (
              <p className="text-xs text-muted-foreground">Color: {item.selectedColor}</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-semibold">${itemTotal.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-12 text-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>

        {item.product.stock < 10 && (
          <p className="text-xs text-orange-600">
            Only {item.product.stock} left in stock
          </p>
        )}
      </div>
    </div>
  )
}

