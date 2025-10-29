import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { fetchOrderByCode } from '@/store/slices/orderSlice'
import Layout from '@/components/common/Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Package } from 'lucide-react'
import Loader from '@/components/common/Loader'

export default function OrderSummaryPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { selectedOrder, loading } = useAppSelector((state) => state.orders)

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderByCode(id))
    }
  }, [dispatch, id])

  if (loading === 'loading' || !selectedOrder) {
    return (
      <Layout>
        <Loader fullScreen text="Loading order details..." />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Sipariş Başarıyla Oluşturuldu!</h1>
            <p className="text-muted-foreground">
              Siparişiniz için teşekkür ederiz. Kısa süre içinde onay e-postası alacaksınız.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Sipariş #{selectedOrder.code}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Items */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Sipariş Ürünleri
                </h3>
                <div className="space-y-3">
                  {selectedOrder.entries.map((entry, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        {entry.product.imageUrl && (
                          <img
                            src={entry.product.imageUrl}
                            alt={entry.product.name}
                            className="h-12 w-12 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{entry.product.name}</p>
                          <p className="text-sm text-muted-foreground">Adet: {entry.quantity}</p>
                        </div>
                      </div>
                      <p className="font-semibold">${entry.totalPrice.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-xl font-bold pt-2">
                  <span>Toplam</span>
                  <span>${selectedOrder.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Teslimat Adresi</h3>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{selectedOrder.address.addressTitle}</p>
                  <p>{selectedOrder.address.phoneNumber}</p>
                  <p>{selectedOrder.address.street}</p>
                  <p>
                    {selectedOrder.address.city}, {selectedOrder.address.postalCode}
                  </p>
                  <p>{selectedOrder.address.country}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Ödeme Yöntemi</h3>
                <p className="text-sm">
                  {selectedOrder.paymentMethod === 'CREDIT_CARD' && 'Kredi Kartı'}
                  {selectedOrder.paymentMethod === 'WIRE_TRANSFER' && 'Havale / EFT'}
                </p>
              </div>

              {/* Order Status */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Sipariş Durumu</h3>
                <p className="text-sm capitalize">{selectedOrder.status}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={`/order/${selectedOrder.code}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Sipariş Detaylarını Görüntüle
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button className="w-full">Alışverişe Devam Et</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
