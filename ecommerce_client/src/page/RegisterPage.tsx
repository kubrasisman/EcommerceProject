import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { registerUser, fetchCurrentUser } from '@/store/slices/authSlice'
import { fetchCart } from '@/store/slices/cartSlice'
import Layout from '@/components/common/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import Loader from '@/components/common/Loader'

export default function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { addToast } = useToast()
  const { loading, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    kvkkConsent: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      addToast({
        title: 'Hata',
        description: 'Şifreler eşleşmiyor',
        variant: 'destructive',
      })
      return
    }

    if (!formData.kvkkConsent) {
      addToast({
        title: 'Hata',
        description: 'Kullanım koşullarını kabul etmelisiniz',
        variant: 'destructive',
      })
      return
    }

    try {
      await dispatch(registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        kvkkConsent: formData.kvkkConsent,
      })).unwrap()
      
      // Kullanıcı bilgilerini yükle
      await dispatch(fetchCurrentUser()).unwrap()
      // Yeni kullanıcının sepetini oluştur/yükle
      dispatch(fetchCart())
      
      addToast({
        title: 'Kayıt Başarılı',
        description: 'ShopHub\'a hoş geldiniz!',
        variant: 'success',
      })
      navigate('/')
    } catch (err) {
      addToast({
        title: 'Kayıt Başarısız',
        description: error || 'Bir şeyler yanlış gitti',
        variant: 'destructive',
      })
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Hesap Oluştur</CardTitle>
              <CardDescription>
                ShopHub'a katılın ve bugün alışverişe başlayın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Ad Soyad</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Ahmet Yılmaz"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@ornek.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Şifre</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">En az 6 karakter olmalıdır</p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <input 
                    type="checkbox" 
                    id="kvkkConsent"
                    name="kvkkConsent"
                    required 
                    className="mt-1 rounded" 
                    checked={formData.kvkkConsent} 
                    onChange={handleChange} 
                  />
                  <label htmlFor="kvkkConsent" className="text-sm text-muted-foreground cursor-pointer">
                    <Link to="/terms" className="text-primary hover:underline">
                      Kullanım Koşulları
                    </Link>{' '}
                    ve{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Gizlilik Politikası
                    </Link>'nı kabul ediyorum
                  </label>
                </div>

                <Button type="submit" className="w-full" disabled={loading === 'loading'}>
                  {loading === 'loading' ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Zaten hesabınız var mı? </span>
                <Link to="/login" className="text-primary hover:underline font-semibold">
                  Giriş Yap
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading === 'loading' && <Loader fullScreen text="Hesabınız oluşturuluyor..." />}
      </div>
    </Layout>
  )
}
