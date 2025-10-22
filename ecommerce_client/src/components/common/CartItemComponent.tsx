import { Minus, Plus, Trash2 } from 'lucide-react'
import type { CartItem } from '@/types/cart.types'
import { Button } from '@/components/ui/button'
import { useAppDispatch } from '@/store/store'
import  { updateCartItem, removeFromCart } from '@/store/slices/cartSlice'
import { useToast } from '@/components/ui/toast'
import { useState } from 'react'

interface CartItemComponentProps {
  item: CartItem
  compact?: boolean
}

export default function CartItemComponent({ item, compact = false }: CartItemComponentProps) {
  const dispatch = useAppDispatch()
  const { addToast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity > 0 && !isUpdating) {
      setIsUpdating(true)
      try {
        await dispatch(updateCartItem({ 
          code: item.code,
          product: item.product.code,
          quantity: newQuantity 
        })).unwrap()
        
        addToast({
          title: 'Sepet güncellendi',
          description: `${item.product.name} miktarı güncellendi.`,
          variant: 'success',
          duration: 2000,
        })
      } catch (error) {
        addToast({
          title: 'Hata',
          description: 'Miktar güncellenirken bir hata oluştu.',
          variant: 'destructive',
          duration: 3000,
        })
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    try {
      await dispatch(removeFromCart(item.code)).unwrap()
      
      addToast({
        title: 'Ürün kaldırıldı',
        description: `${item.product.name} sepetten kaldırıldı.`,
        variant: 'success',
        duration: 2000,
      })
    } catch (error) {
      addToast({
        title: 'Hata',
        description: 'Ürün kaldırılırken bir hata oluştu.',
        variant: 'destructive',
        duration: 3000,
      })
      } finally {
        setIsUpdating(false)
      }
  }

  const itemTotal = item.product.price * item.quantity

  if (compact) {
    return (
      <div className="flex gap-3 py-3 border-b">
        <img
          src={item.product.imageUrl}
          alt={item.product.name}
          className="h-20 w-20 rounded-md object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-medium line-clamp-2 flex-1 pr-2">{item.product.name}</h4>
            <button
              onClick={handleRemove}
              disabled={isUpdating}
              className="text-muted-foreground hover:text-destructive transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Kaldır"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          
          <p className="text-sm font-semibold mb-2">${itemTotal.toFixed(2)}</p>
          
          {/* Quantity Controls - Compact */}
          <div className="flex items-center border rounded-md w-fit">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              className="h-7 w-7 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isUpdating}
              className="h-7 w-7 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Image */}
      <img
        src={item.product.imageUrl}
        alt={item.product.name}
        className="h-24 w-24 rounded-lg object-cover"
      />
    
      {/* Details */}
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold">{item.product.name}</h3>
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
              disabled={item.quantity <= 1 || isUpdating}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-12 text-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={isUpdating}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isUpdating ? 'Kaldırılıyor...' : 'Kaldır'}
          </Button>
        </div>
      </div>
    </div>
  )
}

