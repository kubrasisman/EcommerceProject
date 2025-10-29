import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/store/store'
import { placeOrder } from '@/store/slices/orderSlice'
import Layout from '@/components/common/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import type { PaymentMethod } from '@/types/order.types'
import type { Address, CreateAddressDto } from '@/types/address.types'
import { useToast } from '@/components/ui/toast'
import Loader from '@/components/common/Loader'
import { Check, Plus, MapPin } from 'lucide-react'
import { addressService } from '@/services/addressService'
import { cartService } from '@/services/cartService'
import { clearCartLocal } from '@/store/slices/cartSlice'

type CheckoutStep = 1 | 2 | 3

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { addToast } = useToast()
  const { items, subtotal, total } = useAppSelector((state) => state.cart)
  const { loading } = useAppSelector((state) => state.orders)

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [isSavingAddress, setIsSavingAddress] = useState(false)
  const [isUpdatingCart, setIsUpdatingCart] = useState(false)

  const [newAddress, setNewAddress] = useState<CreateAddressDto>({
    addressTitle: '',
    street: '',
    city: '',
    country: '',
    postalCode: '',
    phoneNumber: '',
  })

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD')
  const [notes, setNotes] = useState('')

  // Kullanıcının adreslerini yükle
  useEffect(() => {
    loadAddresses()
    loadCartData()
  }, [])

  const loadCartData = async () => {
    try {
      const cartData = await cartService.getCart()
      // Eğer cart'ta payment method varsa state'e set et
      if (cartData.paymentMethod) {
        setPaymentMethod(cartData.paymentMethod)
      }
    } catch (error) {
      console.error('Cart bilgileri yüklenemedi:', error)
    }
  }

  const loadAddresses = async () => {
    setLoadingAddresses(true)
    try {
      const data = await addressService.getCustomerAddresses()
      setAddresses(data)
      if (data.length > 0) {
        setSelectedAddress(data[0])
      }
    } catch (error) {
      console.error('Adresler yüklenemedi:', error)
    } finally {
      setLoadingAddresses(false)
    }
  }

  const steps = [
    { number: 1, title: 'Teslimat Adresi', description: 'Teslimat bilgilerinizi girin' },
    { number: 2, title: 'Ödeme Yöntemi', description: 'Ödeme yönteminizi seçin' },
    { number: 3, title: 'Sipariş Özeti', description: 'Siparişinizi gözden geçirin' },
  ]

  const handleCreateAddress = async () => {
    // Validasyon
    if (!newAddress.addressTitle || !newAddress.street || !newAddress.city ||
      !newAddress.country || !newAddress.postalCode || !newAddress.phoneNumber) {
      addToast({
        title: 'Hata',
        description: 'Lütfen tüm zorunlu alanları doldurun',
        variant: 'destructive',
      })
      return
    }

    setIsSavingAddress(true)
    try {
      const createdAddress = await addressService.createAddress(newAddress)
      setAddresses([...addresses, createdAddress])
      setSelectedAddress(createdAddress)
      setIsAddressModalOpen(false)

      // Formu temizle
      setNewAddress({
        addressTitle: '',
        street: '',
        city: '',
        country: '',
        postalCode: '',
        phoneNumber: '',
      })

      addToast({
        title: 'Başarılı',
        description: 'Adres başarıyla kaydedildi',
        variant: 'success',
      })
    } catch (error) {
      addToast({
        title: 'Hata',
        description: 'Adres kaydedilemedi',
        variant: 'destructive',
      })
    } finally {
      setIsSavingAddress(false)
    }
  }

  const validateStep = (step: CheckoutStep): boolean => {
    if (step === 1) {
      if (!selectedAddress) {
        addToast({
          title: 'Hata',
          description: 'Lütfen bir teslimat adresi seçin',
          variant: 'destructive',
        })
        return false
      }
    }
    return true
  }

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return
    }

    setIsUpdatingCart(true)
    try {
      // Step 1'den çıkarken seçili adresi cart'a kaydet
      if (currentStep === 1 && selectedAddress) {
        await cartService.updateAddress(selectedAddress.id)
        addToast({
          title: 'Başarılı',
          description: 'Teslimat adresi kaydedildi',
          variant: 'success',
        })
      }

      // Step 2'den çıkarken payment method'u cart'a kaydet
      if (currentStep === 2) {
        await cartService.updatePaymentMethod(paymentMethod)
        addToast({
          title: 'Başarılı',
          description: 'Ödeme yöntemi kaydedildi',
          variant: 'success',
        })
      }
    } catch (error) {
      addToast({
        title: 'Hata',
        description: currentStep === 1 ? 'Adres kaydedilemedi' : 'Ödeme yöntemi kaydedilemedi',
        variant: 'destructive',
      })
      setIsUpdatingCart(false)
      return
    } finally {
      setIsUpdatingCart(false)
    }

    setCurrentStep((prev) => Math.min(prev + 1, 3) as CheckoutStep)
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as CheckoutStep)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      addToast({
        title: 'Hata',
        description: 'Sepetiniz boş',
        variant: 'destructive',
      })
      return
    }

    try {
      // Cart'tan sipariş oluştur (adres ve payment method zaten cart'a kaydedildi)
      const result = await dispatch(placeOrder()).unwrap()

      dispatch(clearCartLocal())
      addToast({
        title: 'Sipariş başarıyla oluşturuldu!',
        description: `Sipariş No: #${result.code}`,
        variant: 'success',
      })

      // Sipariş özet sayfasına yönlendir (code kullanılıyor)
      navigate(`/order-summary/${result.code}`)
    } catch (error) {
      addToast({
        title: 'Hata',
        description: 'Sipariş oluşturulamadı',
        variant: 'destructive',
      })
    }
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Sepetiniz boş</h2>
              <Button onClick={() => navigate('/')}>Alışverişe Devam Et</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Ödeme</h1>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${currentStep > step.number
                        ? 'bg-green-500 border-green-500 text-white'
                        : currentStep === step.number
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-gray-200 border-gray-300 text-gray-500'
                      }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <span className="font-bold">{step.number}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-1 mx-4 mt-[-40px] transition-colors ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Teslimat Adresi</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddressModalOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Yeni Adres Ekle
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadingAddresses ? (
                    <div className="py-8 text-center">
                      <Loader text="Adresler yükleniyor..." />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="py-12 text-center">
                      <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Henüz kayıtlı adresiniz yok</h3>
                      <p className="text-gray-600 mb-4">
                        Teslimat için bir adres ekleyin
                      </p>
                      <Button onClick={() => setIsAddressModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        İlk Adresimi Ekle
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddress(address)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedAddress?.id === address.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-lg">{address.addressTitle}</h4>
                                {selectedAddress?.id === address.id && (
                                  <Check className="w-5 h-5 text-blue-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {address.owner.firstName} {address.owner.lastName}
                              </p>
                              <p className="text-sm text-gray-600">{address.phoneNumber}</p>
                              <p className="text-sm text-gray-600 mt-2">
                                {address.street}
                              </p>
                              <p className="text-sm text-gray-600">
                                {address.city}, {address.postalCode}
                              </p>
                              <p className="text-sm text-gray-600">{address.country}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button onClick={handleNext} disabled={!selectedAddress || isUpdatingCart}>
                      {isUpdatingCart ? 'Kaydediliyor...' : 'Devam Et'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Ödeme Yöntemi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select
                    options={[
                      { value: 'CREDIT_CARD', label: 'Kredi Kartı' },
                      { value: 'WIRE_TRANSFER', label: 'Havale / EFT' },
                    ]}
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  />

                  <div>
                    <Label htmlFor="notes">Ek Notlar</Label>
                    <Textarea
                      id="notes"
                      placeholder="Özel talimatlarınız..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handleBack} disabled={isUpdatingCart}>
                      Geri
                    </Button>
                    <Button onClick={handleNext} disabled={isUpdatingCart}>
                      {isUpdatingCart ? 'Kaydediliyor...' : 'Devam Et'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Order Review */}
            {currentStep === 3 && selectedAddress && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Teslimat Adresi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-medium text-lg">{selectedAddress.addressTitle}</p>
                    <p className="font-medium">
                      {selectedAddress.owner.firstName} {selectedAddress.owner.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{selectedAddress.phoneNumber}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedAddress.street}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedAddress.city}, {selectedAddress.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{selectedAddress.country}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ödeme Yöntemi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {paymentMethod === 'CREDIT_CARD' && 'Kredi Kartı'}
                      {paymentMethod === 'WIRE_TRANSFER' && 'Havale / EFT'}
                    </p>
                    {notes && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-1">Ek Notlar:</p>
                        <p className="text-sm text-gray-600">{notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sipariş Ürünleri</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                          </div>
                          <p className="font-medium">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack}>
                    Geri
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading === 'loading'}>
                    {loading === 'loading' ? 'İşleniyor...' : 'Siparişi Tamamla'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="line-clamp-1">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ara Toplam</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Toplam</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {loading === 'loading' && <Loader fullScreen text="Siparişiniz işleniyor..." />}

        {/* Adres Ekleme Modal */}
        <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Adres Ekle</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="addressTitle">Adres Başlığı *</Label>
                <Input
                  id="addressTitle"
                  placeholder="Örn: Ev, İş"
                  value={newAddress.addressTitle}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, addressTitle: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber">Telefon *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Telefon numaranız"
                  value={newAddress.phoneNumber}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phoneNumber: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="street">Adres *</Label>
                <Textarea
                  id="street"
                  placeholder="Cadde, sokak, bina no, daire no"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Şehir *</Label>
                  <Input
                    id="city"
                    placeholder="Şehir"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="postalCode">Posta Kodu *</Label>
                  <Input
                    id="postalCode"
                    placeholder="Posta kodu"
                    value={newAddress.postalCode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, postalCode: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Ülke *</Label>
                <Input
                  id="country"
                  placeholder="Ülke"
                  value={newAddress.country}
                  onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddressModalOpen(false)}
                disabled={isSavingAddress}
              >
                İptal
              </Button>
              <Button onClick={handleCreateAddress} disabled={isSavingAddress}>
                {isSavingAddress ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}
