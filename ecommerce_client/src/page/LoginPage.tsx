import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { loginUser } from '@/store/slices/authSlice'
import { fetchCart } from '@/store/slices/cartSlice'
import Layout from '@/components/common/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import Loader from '@/components/common/Loader'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { addToast } = useToast()
  const { loading, error } = useAppSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await dispatch(loginUser(formData)).unwrap()
      // Kullanıcının sepetini yükle
      dispatch(fetchCart())
      addToast({
        title: 'Giriş Başarılı',
        description: 'Hoş geldiniz!',
        variant: 'success',
      })
      navigate('/')
    } catch (err) {
      addToast({
        title: 'Giriş Başarısız',
        description: error || 'Geçersiz email veya şifre',
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
              <CardTitle className="text-2xl">Hoş Geldiniz</CardTitle>
              <CardDescription>
                Alışverişe devam etmek için hesabınıza giriş yapın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Beni hatırla</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Şifremi unuttum
                  </Link>
                </div>

                <Button type="submit" className="w-full" disabled={loading === 'loading'}>
                  {loading === 'loading' ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Hesabınız yok mu? </span>
                <Link to="/register" className="text-primary hover:underline font-semibold">
                  Kayıt Ol
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading === 'loading' && <Loader fullScreen text="Giriş yapılıyor..." />}
      </div>
    </Layout>
  )
}
