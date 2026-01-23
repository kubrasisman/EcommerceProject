import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { fetchOrderByCode } from '@/store/slices/orderSlice'
import Layout from '@/components/common/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, MapPin, CreditCard, User } from 'lucide-react'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { selectedOrder, loading } = useAppSelector((state) => state.orders)

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderByCode(id))
    }
  }, [dispatch, id])

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

  if (loading === 'loading' || !selectedOrder) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Sipariş #{selectedOrder.code}</h1>
              <p className="text-muted-foreground">
                Sipariş Tarihi: {new Date(selectedOrder.creationDate).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <Badge variant={getStatusColor(selectedOrder.status) as any} className="text-lg px-4 py-1">
              {getStatusLabel(selectedOrder.status)}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Sipariş Ürünleri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedOrder.entries?.map((entry, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="h-20 w-20 rounded bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {entry.product?.imageUrl && entry.product.imageUrl.startsWith('http') ? (
                          <img
                            src={entry.product.imageUrl}
                            alt={entry.product?.name || 'Ürün'}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Link
                          to={`/product/${entry.product?.code}`}
                          className="font-semibold hover:text-primary"
                        >
                          {entry.product?.name || 'Ürün'}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Adet: {entry.quantity}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Birim Fiyat: {formatPrice(entry.basePrice)}
                        </p>
                        {entry.shippedAmount !== undefined && entry.shippedAmount > 0 && (
                          <p className="text-sm text-green-600">
                            Gönderilen: {entry.shippedAmount}
                          </p>
                        )}
                        {entry.canceledAmount !== undefined && entry.canceledAmount > 0 && (
                          <p className="text-sm text-red-600">
                            İptal Edilen: {entry.canceledAmount}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(entry.totalPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {selectedOrder.address ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Teslimat Adresi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-semibold">{selectedOrder.address.addressTitle}</p>
                    <p>{selectedOrder.address.street}</p>
                    <p>
                      {selectedOrder.address.city}, {selectedOrder.address.postalCode}
                    </p>
                    <p>{selectedOrder.address.country}</p>
                    <p className="pt-2">Telefon: {selectedOrder.address.phoneNumber}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Teslimat Adresi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Adres bilgisi bulunmuyor</p>
                </CardContent>
              </Card>
            )}

            {/* Customer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Müşteri Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-semibold">
                    {selectedOrder.owner.firstName} {selectedOrder.owner.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.owner.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span>Toplam</span>
                    <span>{formatPrice(selectedOrder.totalPrice)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center text-sm">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>
                      Ödeme: {selectedOrder.paymentMethod === 'CREDIT_CARD' ? 'Kredi Kartı' : 'Havale/EFT'}
                    </span>
                  </div>
                  {selectedOrder.payments && selectedOrder.payments.length > 0 && (
                    <div className="flex items-center text-sm">
                      <Badge variant={selectedOrder.payments[0].status === 'PAID' ? 'success' : 'default'}>
                        {selectedOrder.payments[0].status}
                      </Badge>
                    </div>
                  )}
                </div>

                {selectedOrder.payments && selectedOrder.payments.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-semibold mb-2">Ödeme İşlemleri</p>
                    <div className="space-y-2">
                      {selectedOrder.payments.map((payment, index) => (
                        <div key={index} className="text-sm border-l-2 border-gray-300 pl-3 py-1">
                          <p className="font-medium">{formatPrice(payment.amount)}</p>
                          <p className="text-xs text-muted-foreground">
                            {payment.transactionId}
                          </p>
                          <Badge variant={payment.status === 'PAID' ? 'success' : 'default'} className="mt-1">
                            {payment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
