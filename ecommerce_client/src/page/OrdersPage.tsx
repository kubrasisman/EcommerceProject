
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
  const { orders, loading, error } = useAppSelector((state) => state.orders)

  useEffect(() => {
    console.log('OrdersPage: Fetching orders...')
    dispatch(fetchOrdersByEmail())
      .unwrap()
      .then((data) => {
        console.log('OrdersPage: Orders fetched successfully', data)
      })
      .catch((err) => {
        console.error('OrdersPage: Error fetching orders', err)
      })
  }, [dispatch])

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      READY: 'default',
      PAID: 'default',
      PROCESSING: 'secondary',
      SHIPPED: 'outline',
      DELIVERED: 'success',
      CANCELED: 'destructive',
      RETURN_REQUESTED: 'warning',
      RETURNED: 'secondary',
      REFUNDED: 'secondary',
    }
    return colors[status] || 'default'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      READY: 'Hazırlanıyor',
      PAID: 'Ödendi',
      PROCESSING: 'İşleniyor',
      SHIPPED: 'Kargoya Verildi',
      DELIVERED: 'Teslim Edildi',
      CANCELED: 'İptal Edildi',
      RETURN_REQUESTED: 'İade Talebi',
      RETURNED: 'İade Edildi',
      REFUNDED: 'Geri Ödendi',
    }
    return labels[status] || status
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price)
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

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Siparişlerim</h1>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <div className="text-red-600 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-800">Siparişler yüklenemedi</h3>
              <p className="mt-2 text-red-600">{error}</p>
              <button
                onClick={() => dispatch(fetchOrdersByEmail())}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Tekrar Dene
              </button>
            </CardContent>
          </Card>
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
                          {getStatusLabel(order.status)}
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
                        {order.entries?.length || 0} ürün
                      </p>
                      {order.address && (
                        <p className="text-sm text-muted-foreground">
                          Teslimat: {order.address.addressTitle}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold">{formatPrice(order.totalPrice)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {order.paymentMethod === 'CREDIT_CARD' && 'Kredi Kartı'}
                        {order.paymentMethod === 'WIRE_TRANSFER' && 'Havale/EFT'}
                      </p>
                    </div>
                  </div>

                  {order.entries && order.entries.length > 0 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto">
                      {order.entries.slice(0, 4).map((entry, index) => (
                        <div key={index} className="h-16 w-16 rounded bg-muted flex items-center justify-center overflow-hidden">
                          {entry.product?.imageUrl && entry.product.imageUrl.startsWith('http') ? (
                            <img
                              src={entry.product.imageUrl}
                              alt={entry.product?.name || 'Ürün'}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                      {order.entries.length > 4 && (
                        <div className="h-16 w-16 rounded bg-muted flex items-center justify-center text-sm text-muted-foreground">
                          +{order.entries.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}
