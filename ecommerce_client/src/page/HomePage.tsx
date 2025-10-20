import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { fetchFeaturedProducts, fetchProducts } from '@/store/slices/productSlice'
import Layout from '@/components/common/Layout'
import ProductCard from '@/components/common/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronRight } from 'lucide-react'

const categories = [
  { 
    name: 'Electronics', 
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    path: '/search?category=electronics'
  },
  { 
    name: 'Fashion', 
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
    path: '/search?category=fashion'
  },
  { 
    name: 'Home & Living', 
    image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400&h=300&fit=crop',
    path: '/search?category=home'
  },
  { 
    name: 'Sports', 
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop',
    path: '/search?category=sports'
  },
]

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { featuredProducts, loading } = useAppSelector((state) => state.products)

  useEffect(() => {
    // Load all products for search functionality
    dispatch(fetchProducts({}))
    // Load featured products for homepage
    dispatch(fetchFeaturedProducts(8))
  }, [dispatch])

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#0f1111] via-[#232f3e] to-[#37475a] text-white">
        <div className="container mx-auto px-4">
          <div className="relative h-[400px] flex items-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 gap-4 h-full">
                {[...Array(32)].map((_, i) => (
                  <div key={i} className="bg-white/5 rounded"></div>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to ShopHub
              </h1>
              <p className="text-xl mb-6 text-gray-200">
                Find deals, get rewards and see what's new.
              </p>
              <Link 
                to="/search" 
                className="inline-flex items-center bg-[#febd69] hover:bg-[#f3a847] text-gray-900 px-6 py-3 rounded-md font-semibold transition-colors"
              >
                Shop now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      {/* Category Cards */}
      <section className="py-8 -mt-20 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.name} 
                to={category.path}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold mb-4">{category.name}</h3>
                <div className="aspect-[4/3] mb-4 overflow-hidden rounded">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                  Shop now →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Deals */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Today's Deals</h2>
              <Link to="/search" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                See all deals
              </Link>
            </div>

            {loading === 'loading' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {featuredProducts.slice(0, 5).map((product) => (
                  <Link 
                    key={product.id} 
                    to={`/product/${product.id}`}
                    className="group"
                  >
                    <div className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={product.thumbnail} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-3">
                        <div className="text-xs text-red-600 font-semibold mb-1">
                          {product.discount ? `-${product.discount}% Deal` : 'Special Offer'}
                        </div>
                        <div className="text-sm line-clamp-2 mb-2">{product.name}</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-500 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top Products */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Top products for you</h2>
          
          {loading === 'loading' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sign In Banner */}
      <section className="py-12 bg-white border-t border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">
              See personalized recommendations
            </h2>
            <Link to="/login">
              <button className="bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 px-8 py-2 rounded-md font-medium border border-gray-300 shadow-sm">
                Sign in
              </button>
            </Link>
            <p className="mt-3 text-sm">
              New customer?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline">
                Start here.
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
