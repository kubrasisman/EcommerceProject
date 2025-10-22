import { X, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/store/store'
import { Button } from '@/components/ui/button'
import CartItemComponent from '@/components/common/CartItemComponent'
import EmptyState from '@/components/common/EmptyState'

interface MiniCartProps {
  isOpen: boolean
  onClose: () => void
}

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const { items, total } = useAppSelector((state) => state.cart)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Alışveriş Sepeti</h2>
            <button
              onClick={onClose}
              className="rounded-md p-2 hover:bg-accent"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={ShoppingBag}
                title="Sepetiniz boş"
                description="Alışverişe başlamak için ürün ekleyin"
                actionLabel="Alışverişe Başla"
                onAction={onClose}
              />
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItemComponent key={item.id} item={item} compact />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Toplam:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="space-y-2">
                  <Link to="/cart" onClick={onClose}>
                    <Button variant="outline" className="w-full">
                      Sepeti Görüntüle
                    </Button>
                  </Link>
                  <Link to="/checkout" onClick={onClose}>
                    <Button className="w-full">
                      Ödemeye Geç
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
