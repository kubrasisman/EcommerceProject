import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { fetchFeaturedProducts, fetchProducts, fetchCategories } from '@/store/slices/productSlice'
import Layout from '@/components/common/Layout'
import ProductCard from '@/components/common/ProductCard'
import BannerCarousel from '@/components/home/BannerCarousel'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ChevronRight, Clock, Zap, TrendingUp, Star, Truck, Shield, CreditCard } from 'lucide-react'

// Category images - Using high quality Unsplash images
const categoryImages: Record<string, string> = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop',
  home: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=400&fit=crop',
  books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
}

// Featured brands
const brands = [
  { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg' },
  { name: 'Sony', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
  { name: 'LG', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg' },
]

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { featuredProducts, loading, categories } = useAppSelector((state) => state.products)
  const { accessToken } = useAppSelector((state) => state.auth)

  // Countdown timer state (for visual effect)
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 23, seconds: 47 })

  useEffect(() => {
    dispatch(fetchProducts({}))
    dispatch(fetchFeaturedProducts(12))
    dispatch(fetchCategories())
  }, [dispatch])

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price)
  }

  // Get category image
  const getCategoryImage = (categoryName: string) => {
    const normalized = categoryName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')
    return categoryImages[normalized] || categoryImages['electronics']
  }

  // Display categories (from backend or fallback)
  const displayCategories = categories && categories.length > 0
    ? categories.slice(0, 6)
    : [
        { code: 1, name: 'Electronics' },
        { code: 2, name: 'Fashion' },
        { code: 3, name: 'Home' },
        { code: 4, name: 'Sports' },
      ]

  return (
    <Layout>
      {/* Hero Banner Carousel */}
      <BannerCarousel />

      {/* Category Cards - Modern Design */}
      <section className="py-12 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {displayCategories.map((category) => (
              <Link
                key={category.code}
                to={`/search?category=${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="group relative overflow-hidden rounded-xl aspect-[4/5] bg-gradient-to-br from-gray-800 to-gray-900"
              >
                <img
                  src={getCategoryImage(category.name)}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg mb-1">{category.name}</h3>
                  <span className="text-white/80 text-sm flex items-center gap-1 group-hover:text-white transition-colors">
                    Kesfet <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals with Timer */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="bg-white/20 p-3 rounded-full">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Gunun Firsatlari</h2>
                <p className="text-white/80 text-sm">Kacirmamak icin acele edin!</p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-white" />
              <div className="flex gap-2">
                <div className="bg-white/20 backdrop-blur px-3 py-2 rounded-lg text-center min-w-[50px]">
                  <div className="text-xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-white/70">Saat</div>
                </div>
                <span className="text-white text-xl font-bold">:</span>
                <div className="bg-white/20 backdrop-blur px-3 py-2 rounded-lg text-center min-w-[50px]">
                  <div className="text-xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-white/70">Dk</div>
                </div>
                <span className="text-white text-xl font-bold">:</span>
                <div className="bg-white/20 backdrop-blur px-3 py-2 rounded-lg text-center min-w-[50px]">
                  <div className="text-xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-white/70">Sn</div>
                </div>
              </div>
            </div>
          </div>

          {/* Deal Products */}
          {loading === 'loading' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-4">
                  <Skeleton className="aspect-square w-full mb-3 bg-white/20" />
                  <Skeleton className="h-4 w-3/4 mb-2 bg-white/20" />
                  <Skeleton className="h-4 w-1/2 bg-white/20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {featuredProducts.slice(0, 5).map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.code}`}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.thumbnail || product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.discount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        %{product.discount} INDIRIM
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-red-600">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/search">
              <Button variant="outline" className="bg-white hover:bg-gray-100 text-red-600 border-white">
                Tum Firsatlari Gor
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-gray-50 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Ucretsiz Kargo</h4>
                <p className="text-sm text-gray-500">150 TL ustu siparislerde</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Guvenli Alisveris</h4>
                <p className="text-sm text-gray-500">256-bit SSL sertifikasi</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Kolay Odeme</h4>
                <p className="text-sm text-gray-500">Tum kartlar gecerli</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Musteri Memnuniyeti</h4>
                <p className="text-sm text-gray-500">%98 olumlu degerlendirme</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Populer Markalar</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                to={`/search?brand=${brand.name.toLowerCase()}`}
                className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <div className="w-24 h-12 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">{brand.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sign In Banner - Only show when user is not logged in */}
      {!accessToken && (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                See personalized recommendations
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}
