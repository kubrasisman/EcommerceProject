
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { fetchOrdersByEmail } from '@/store/slices/orderSlice'
import Layout from '@/components/common/Layout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import EmptyState from '@/components/common/EmptyState'
import { Package } from 'lucide-react'

export default function OrdersPage() {
  const dispatch = useAppDispatch()
  const { orders, loading } = useAppSelector((state) => state.orders)
  useEffect(() => {

      dispatch(fetchOrdersByEmail())

  }, [dispatch])

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'default',
      confirmed: 'default',
      processing: 'default',
      shipped: 'default',
      delivered: 'success',
      cancelled: 'destructive',
    }
    return colors[status as keyof typeof colors] || 'default'
  }

  if (loading === 'loading') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Siparişlerim</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <EmptyState
            icon={Package}
            title="Henüz sipariş yok"
            description="Henüz bir siparişiniz bulunmuyor. Alışverişe başlayın!"
            actionLabel="Alışverişe Başla"
            onAction={() => window.location.href = '/'}
          />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Siparişlerim</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.code} to={`/order/${order.code}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <h3 className="font-semibold">Sipariş #{order.code}</h3>
                        <Badge variant={getStatusColor(order.status) as any}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sipariş Tarihi: {new Date(order.creationDate).toLocaleDateString('tr-TR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.entries.length} ürün
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Teslimat: {order.address.addressTitle}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold">${order.totalPrice.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {order.paymentMethod === 'CREDIT_CARD' && 'Kredi Kartı'}
                        {order.paymentMethod === 'WIRE_TRANSFER' && 'Havale/EFT'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 overflow-x-auto">
                    {order.entries.slice(0, 4).map((entry, index) => (
                      <div key={index}>
                        {entry.product.imageUrl && (
                          <img
                            src={entry.product.imageUrl}
                            alt={entry.product.name}
                            className="h-16 w-16 rounded object-cover"
                          />
                        )}
                      </div>
                    ))}
                    {order.entries.length > 4 && (
                      <div className="h-16 w-16 rounded bg-muted flex items-center justify-center text-sm text-muted-foreground">
                        +{order.entries.length - 4}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}
