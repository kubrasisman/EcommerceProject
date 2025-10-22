import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/store'
import { fetchProductByCode, fetchRelatedProducts } from '@/store/slices/productSlice'
import { addToCart } from '@/store/slices/cartSlice'
import Layout from '@/components/common/Layout'
import ProductCard from '@/components/common/ProductCard'
import ReviewSection from '@/components/product/ReviewSection'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/toast'
import { Star, ShoppingCart, Heart, Share2, Truck, Shield } from 'lucide-react'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { addToast } = useToast()
  const { selectedProduct, relatedProducts, loading } = useAppSelector((state) => state.products)
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (id) {
      const code = parseInt(id)
      dispatch(fetchProductByCode(code))
      dispatch(fetchRelatedProducts(code))
    }
  }, [dispatch, id])

  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(addToCart({ product: selectedProduct.code, quantity }))
      addToast({
        title: 'Sepete Eklendi',
        description: `${selectedProduct.name} sepetinize eklendi.`,
        variant: 'success',
        duration: 3000,
      })
    }
  }

  if (loading === 'loading' || !selectedProduct) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const discountPercentage = selectedProduct.originalPrice
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
    : 0

  const primaryCategory = selectedProduct.categoryCodes[0]?.name || 'Product'
  const productImages = selectedProduct.images || [selectedProduct.thumbnail || selectedProduct.imageUrl]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          {' / '}
          <Link to={`/search?category=${primaryCategory.toLowerCase()}`} className="hover:text-foreground">
            {primaryCategory}
          </Link>
          {' / '}
          <span className="text-foreground">{selectedProduct.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
              <img
                src={productImages[selectedImage]}
                alt={selectedProduct.name}
                className="h-full w-full object-cover"
              />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={image} alt={`${selectedProduct.name} ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {selectedProduct.categoryCodes.map((cat) => (
                  <Badge key={cat.code}>{cat.name}</Badge>
                ))}
                {discountPercentage > 0 && (
                  <Badge variant="destructive">-{discountPercentage}%</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{selectedProduct.name}</h1>
              {selectedProduct.title && selectedProduct.title !== selectedProduct.name && (
                <h2 className="text-xl text-muted-foreground mb-2">{selectedProduct.title}</h2>
              )}
              <div className="flex items-center space-x-4">
                {selectedProduct.rating && selectedProduct.reviewCount ? (
                  <>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold">{selectedProduct.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-muted-foreground">({selectedProduct.reviewCount} reviews)</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">No reviews yet</span>
                )}
              </div>
            </div>

            <div className="flex items-baseline space-x-3">
              <span className="text-4xl font-bold">${selectedProduct.price.toFixed(2)}</span>
              {selectedProduct.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${selectedProduct.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{selectedProduct.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 p-0"
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 p-0"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <span>1 year warranty included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Specifications */}
        {selectedProduct.specifications && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Product Specifications</h2>
            <div className="bg-white border rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                  <div key={key} className="flex py-2 border-b">
                    <span className="font-semibold w-1/3">{key}:</span>
                    <span className="text-muted-foreground w-2/3">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customer Reviews */}
        <div className="mb-16">
          <ReviewSection
            productId={selectedProduct.code.toString()}
            productName={selectedProduct.name}
            averageRating={selectedProduct.rating || 0}
            totalReviews={selectedProduct.reviewCount || 0}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.code} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
