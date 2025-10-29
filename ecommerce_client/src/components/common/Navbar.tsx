import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, Menu, MapPin, ChevronDown, User as UserIcon, Package, LogOut } from 'lucide-react'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/store'
import { fetchCategories } from '@/store/slices/productSlice'
import { logoutUser } from '@/store/slices/authSlice'
import { clearCartLocal } from '@/store/slices/cartSlice'
import { Button } from '@/components/ui/button'
import MiniCart from '@/components/cart/MiniCart'
import type { Product } from '@/types/product.types'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { user, accessToken } = useAppSelector((state) => state.auth)
  const { items } = useAppSelector((state) => state.cart)
  const { products, categories } = useAppSelector((state) => state.products)
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Memoized search suggestions to prevent infinite loops
  const filteredSuggestions = useMemo(() => {
    if (searchQuery.trim().length >= 2 && products.length > 0) {
      return products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.categoryCodes.some(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    }
    return []
  }, [searchQuery, products.length])

  // Update suggestions when filtered results change
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setSuggestions(filteredSuggestions)
      setShowSuggestions(filteredSuggestions.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery, filteredSuggestions])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (productCode: number) => {
    navigate(`/product/${productCode}`)
    setSearchQuery('')
    setShowSuggestions(false)
  }

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      // Sepeti temizle
      dispatch(clearCartLocal())
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Force logout even if API call fails
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('customerId')
      // Sepeti temizle
      dispatch(clearCartLocal())
      navigate('/login')
    }
  }

  return (
    <>
      {/* Main Header - Amazon Style */}
      <header className="sticky top-0 z-50 w-full bg-[#131921] text-white">
        {/* Top Bar */}
        <div className="bg-[#131921]">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center gap-4">
              {/* Logo */}
              <Link to="/" className="flex items-center hover:outline hover:outline-1 hover:outline-white px-2 py-1">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold">
                    SH
                  </div>
                  <span className="text-xl font-bold hidden sm:block">ShopHub</span>
                </div>
              </Link>

              {/* Deliver To */}
              <button className="hidden lg:flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded">
                <MapPin className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-xs text-gray-300">Deliver to</div>
                  <div className="text-sm font-bold">Turkey</div>
                </div>
              </button>

              {/* Search Bar */}
              <div ref={searchRef} className="flex-1 max-w-3xl relative">
                <form onSubmit={handleSearch}>
                  <div className="flex h-10">
                    <select 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="hidden md:block bg-gray-200 text-gray-900 px-3 rounded-l-md border-r border-gray-300 text-sm focus:outline-none"
                    >
                      <option value="All">All</option>
                      {categories && categories.map((category) => (
                        <option key={category.code} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Search ShopHub"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => searchQuery.trim().length >= 2 && setShowSuggestions(true)}
                      className="flex-1 px-4 text-white focus:outline-none md:rounded-none rounded-l-md"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      className="bg-[#febd69] hover:bg-[#f3a847] px-4 rounded-r-md transition-colors"
                    >
                      <Search className="h-5 w-5 text-gray-900" />
                    </button>
                  </div>
                </form>

                {/* Search Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white text-gray-900 shadow-lg rounded-md max-h-[500px] overflow-y-auto z-50 border border-gray-200">
                    {suggestions.map((product) => (
                      <button
                        key={product.code}
                        onClick={() => handleSuggestionClick(product.code)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 transition-colors text-left border-b last:border-b-0"
                      >
                        {/* Product Image */}
                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={product.thumbnail || product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium line-clamp-1 mb-1">
                            {product.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{product.categoryCodes[0]?.name || 'Product'}</span>
                            {product.rating && product.rating > 0 && (
                              <>
                                <span className="text-xs text-gray-300">•</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-yellow-600">★</span>
                                  <span className="text-xs text-gray-600">{product.rating.toFixed(1)}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex-shrink-0">
                          <span className="text-sm font-bold">${product.price.toFixed(2)}</span>
                        </div>
                      </button>
                    ))}

                    {/* View All Results */}
                    {suggestions.length > 0 && (
                      <button
                        onClick={handleSearch}
                        className="w-full p-3 text-center text-sm text-blue-600 hover:bg-gray-50 font-medium border-t"
                      >
                        See all results for "{searchQuery}"
                      </button>
                    )}
                  </div>
                )}

                {/* No Results */}
                {showSuggestions && searchQuery.trim().length >= 2 && suggestions.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white text-gray-900 shadow-lg rounded-md z-50 border border-gray-200">
                    <div className="p-4 text-center text-sm text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  </div>
                )}
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2">
                {/* Account Dropdown */}
                <div className="hidden md:block relative">
                  {accessToken ? (
                    <>
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex flex-col items-start hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded"
                      >
                        <div className="text-xs">Merhaba, {user?.fullName}</div>
                        <div className="text-sm font-bold flex items-center gap-1">
                          Hesabımı Yönet
                          <ChevronDown className="h-3 w-3" />
                        </div>
                      </button>
                      
                      {isUserMenuOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setIsUserMenuOpen(false)}
                          />
                          <div className="absolute top-full right-0 mt-1 w-64 bg-white text-gray-900 shadow-lg rounded-md border border-gray-200 z-50 py-2">
                            <Link
                              to="/profile"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                            >
                              <UserIcon className="h-5 w-5" />
                              <span>Profilim</span>
                            </Link>
                            <Link
                              to="/orders"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                            >
                              <Package className="h-5 w-5" />
                              <span>Siparişlerim</span>
                            </Link>
                            <div className="border-t my-1" />
                            <button
                              onClick={() => {
                                setIsUserMenuOpen(false)
                                handleLogout()
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 text-red-600"
                            >
                              <LogOut className="h-5 w-5" />
                              <span>Çıkış Yap</span>
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <Link 
                      to="/login" 
                      className="flex flex-col items-start hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded"
                    >
                      <div className="text-xs">Merhaba, Giriş Yap</div>
                      <div className="text-sm font-bold flex items-center gap-1">
                        Hesap & Listeler
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </Link>
                  )}
                </div>

                {/* Orders - Sadece desktop'ta göster */}
                <Link 
                  to="/orders" 
                  className="hidden lg:flex flex-col items-start hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded"
                >
                  <div className="text-xs">İadeler</div>
                  <div className="text-sm font-bold">& Siparişler</div>
                </Link>

                {/* Cart */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative flex items-center gap-2 hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded"
                >
                  <div className="relative">
                    <ShoppingCart className="h-8 w-8" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#febd69] text-xs text-gray-900 font-bold flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold hidden sm:block">Cart</span>
                </button>

                {/* Mobile Menu */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 hover:outline hover:outline-1 hover:outline-white rounded"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="bg-[#232f3e] border-t border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center h-10 gap-6 text-sm">
              {/* All Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className="flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded font-bold"
                >
                  <Menu className="h-4 w-4" />
                  All
                </button>
                
                {isCategoryMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsCategoryMenuOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white text-gray-900 shadow-lg rounded-md z-20">
                      {categories && categories.map((category) => (
                        <Link
                          key={category.code}
                          to={`/search?category=${category.name.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                          onClick={() => setIsCategoryMenuOpen(false)}
                          className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Category Links */}
              <div className="hidden lg:flex items-center gap-6">
                {categories && categories.slice(0, 5).map((category) => (
                  <Link
                    key={category.code}
                    to={`/search?category=${category.name.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                    className="hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded whitespace-nowrap"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* Today's Deals */}
              <Link
                to="/search"
                className="hidden md:block hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded text-[#febd69] font-bold whitespace-nowrap"
              >
                Today's Deals
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white text-gray-900">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-1">
                {/* User Info */}
                {accessToken ? (
                  <div className="pb-3 mb-3 border-b">
                    <div className="font-bold">Merhaba, {user?.fullName}</div>
                    <Link to="/profile" className="text-sm text-blue-600" onClick={() => setIsMenuOpen(false)}>
                      Hesabı Yönet
                    </Link>
                  </div>
                ) : (
                  <div className="pb-3 mb-3 border-b">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full mb-2">Giriş Yap</Button>
                    </Link>
                    <div className="text-sm">
                      Yeni müşteri misiniz? <Link to="/register" className="text-blue-600" onClick={() => setIsMenuOpen(false)}>Buradan başlayın</Link>
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div className="font-bold mb-2">Kategorilere Göre Alışveriş</div>
                {categories && categories.map((category) => (
                  <Link
                    key={category.code}
                    to={`/search?category=${category.name.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-3 hover:bg-gray-100 rounded"
                  >
                    {category.name}
                  </Link>
                ))}

                <div className="border-t pt-3 mt-3">
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 py-2 px-3 hover:bg-gray-100 rounded"
                  >
                    <Package className="h-4 w-4" />
                    Siparişlerim
                  </Link>
                  {user && (
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-2 text-left py-2 px-3 hover:bg-gray-100 rounded text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Çıkış Yap
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mini Cart Drawer */}
      <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}

