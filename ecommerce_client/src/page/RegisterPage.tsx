import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { registerUser } from '@/store/slices/authSlice'
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
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      addToast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      })
      return
    }

    try {
      await dispatch(registerUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      })).unwrap()
      
      addToast({
        title: 'Registration successful',
        description: 'Welcome to ShopHub!',
        variant: 'success',
      })
      navigate('/')
    } catch (err) {
      addToast({
        title: 'Registration failed',
        description: error || 'Something went wrong',
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
              <CardTitle className="text-2xl">Create an Account</CardTitle>
              <CardDescription>
                Join ShopHub and start shopping today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
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
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
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
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                  <input type="checkbox" required className="mt-1 rounded" />
                  <span className="text-sm text-muted-foreground">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </div>

                <Button type="submit" className="w-full" disabled={loading === 'loading'}>
                  {loading === 'loading' ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link to="/login" className="text-primary hover:underline font-semibold">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading === 'loading' && <Loader fullScreen text="Creating your account..." />}
      </div>
    </Layout>
  )
}
