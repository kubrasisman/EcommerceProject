import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/store/store'
import { fetchBanners } from '@/store/slices/bannerSlice'
import { Skeleton } from '@/components/ui/skeleton'

const AUTO_SLIDE_INTERVAL = 5000 // 5 seconds

export default function BannerCarousel() {
  const dispatch = useAppDispatch()
  const { banners, loading } = useAppSelector((state) => state.banners)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Fetch banners on mount
  useEffect(() => {
    if (banners.length === 0) {
      dispatch(fetchBanners())
    }
  }, [dispatch, banners.length])

  // Auto-slide functionality
  const nextSlide = useCallback(() => {
    if (banners.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }
  }, [banners.length])

  const prevSlide = useCallback(() => {
    if (banners.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length)
    }
  }, [banners.length])

  // Auto-slide timer
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return

    const timer = setInterval(nextSlide, AUTO_SLIDE_INTERVAL)
    return () => clearInterval(timer)
  }, [banners.length, isPaused, nextSlide])

  // Loading state
  if (loading === 'loading') {
    return (
      <div className="container mx-auto px-4 py-6">
        <Skeleton className="w-full h-[280px] md:h-[320px] rounded-xl" />
      </div>
    )
  }

  // No banners - show fallback
  if (banners.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="relative h-[280px] md:h-[320px] rounded-xl overflow-hidden bg-gradient-to-r from-[#232f3e] to-[#37475a]">
          <div className="absolute inset-0 flex items-center px-8 md:px-12">
            <div className="max-w-lg text-white">
              <h1 className="text-2xl md:text-4xl font-bold mb-3">
                Welcome to ShopHub
              </h1>
              <p className="text-base md:text-lg mb-4 text-gray-200">
                Find deals, get rewards and see what's new.
              </p>
              <Link
                to="/search"
                className="inline-flex items-center bg-[#febd69] hover:bg-[#f3a847] text-gray-900 px-5 py-2.5 rounded-md font-semibold transition-colors text-sm"
              >
                Shop now
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div
        className="relative h-[280px] md:h-[320px] rounded-xl overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Banner Slides */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {banners.map((banner) => (
            <Link
              key={banner.code}
              to={banner.linkUrl || '/search'}
              className="min-w-full h-full relative block"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
              >
                {/* Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center px-8 md:px-12">
                <div className="max-w-lg text-white">
                  <h2 className="text-2xl md:text-4xl font-bold mb-3">
                    {banner.title}
                  </h2>
                  {banner.description && (
                    <p className="text-base md:text-lg mb-4 text-gray-200">
                      {banner.description}
                    </p>
                  )}
                  <span className="inline-flex items-center bg-[#febd69] hover:bg-[#f3a847] text-gray-900 px-5 py-2.5 rounded-md font-semibold transition-colors text-sm">
                    Shop now
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); prevSlide(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
              aria-label="Previous banner"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); nextSlide(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-colors"
              aria-label="Next banner"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.preventDefault(); setCurrentIndex(index); }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-white'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}