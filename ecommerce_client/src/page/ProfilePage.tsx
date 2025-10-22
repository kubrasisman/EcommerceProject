import { useAppSelector } from '@/store/store'
import { useNavigate } from 'react-router-dom'
import Layout from '@/components/common/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Package, MapPin, Settings } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth)
  const navigate = useNavigate()

  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-semibold mb-1">{user.fullName}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </CardContent>
            </Card>

            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => navigate('/orders')}
              >
                <Package className="mr-2 h-4 w-4" />
                Orders
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <MapPin className="mr-2 h-4 w-4" />
                Addresses
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                  <p className="text-lg">{user.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Email</label>
                  <p className="text-lg">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Phone</label>
                    <p className="text-lg">{user.phone}</p>
                  </div>
                )}
                {user.createdAt && (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Member Since</label>
                    <p className="text-lg">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                <Button>Edit Profile</Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <p className="text-3xl font-bold text-primary">0</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <p className="text-3xl font-bold text-primary">$0</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

