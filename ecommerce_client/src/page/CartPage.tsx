import { Link } from 'react-router-dom'
import { useAppSelector } from '@/store/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import CartItemComponent from '@/components/common/CartItemComponent'
import EmptyState from '@/components/common/EmptyState'
import { ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { items, subtotal, total } = useAppSelector((state) => state.cart)

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Sepetiniz boş"
          description="Sepetinize henüz bir ürün eklemediniz"
          actionLabel="Alışverişe Devam Et"
          onAction={() => window.location.href = '/'}
        />
      </div>
    )
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Alışveriş Sepeti</h1>
      <p className="text-muted-foreground mb-8">{itemCount} ürün</p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {items.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Sipariş Özeti</h2>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ara Toplam</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kargo</span>
                  <span className="text-green-600 font-medium">ÜCRETSİZ</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Toplam</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full" size="lg">
                  Ödemeye Geç
                </Button>
              </Link>

              <Link to="/">
                <Button variant="outline" className="w-full">
                  Alışverişe Devam Et
                </Button>
              </Link>

              <div className="text-xs text-muted-foreground text-center pt-2">
                <p>Güvenli ödeme</p>
                <p>Hızlı teslimat</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

