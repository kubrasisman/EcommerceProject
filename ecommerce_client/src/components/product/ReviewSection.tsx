import { useState } from 'react'
import { Star, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { useAppSelector } from '@/store/store'
import { useToast } from '@/components/ui/toast'

interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: string
  helpful: number
}

interface ReviewSectionProps {
  productId: string
  productName: string
  averageRating: number
  totalReviews: number
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'John D.',
    rating: 5,
    comment: 'Excellent product! Exceeded my expectations. The quality is outstanding and it arrived quickly. Highly recommend to anyone looking for this type of product.',
    createdAt: '2024-01-15',
    helpful: 24,
  },
  {
    id: '2',
    userName: 'Sarah M.',
    rating: 4,
    comment: 'Very good product overall. The quality is great and it works as advertised. Just wish it came in more color options.',
    createdAt: '2024-01-10',
    helpful: 12,
  },
  {
    id: '3',
    userName: 'Mike R.',
    rating: 5,
    comment: 'Best purchase I\'ve made this year. Fantastic quality and the price is unbeatable. Will definitely buy again!',
    createdAt: '2024-01-05',
    helpful: 8,
  },
  {
    id: '4',
    userName: 'Emily L.',
    rating: 3,
    comment: 'It\'s okay, does what it\'s supposed to do. Nothing particularly special but nothing wrong either. Average product for the price.',
    createdAt: '2023-12-28',
    helpful: 5,
  },
]

export default function ReviewSection({ productId, productName, averageRating, totalReviews }: ReviewSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const { user } = useAppSelector((state) => state.auth)
  const { addToast } = useToast()

  const ratingDistribution = [
    { stars: 5, percentage: 65, count: Math.floor(totalReviews * 0.65) },
    { stars: 4, percentage: 20, count: Math.floor(totalReviews * 0.20) },
    { stars: 3, percentage: 10, count: Math.floor(totalReviews * 0.10) },
    { stars: 2, percentage: 3, count: Math.floor(totalReviews * 0.03) },
    { stars: 1, percentage: 2, count: Math.floor(totalReviews * 0.02) },
  ]

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      addToast({
        title: 'Please sign in',
        description: 'You need to be signed in to write a review',
        variant: 'destructive',
      })
      return
    }

    if (rating === 0) {
      addToast({
        title: 'Rating required',
        description: 'Please select a rating',
        variant: 'destructive',
      })
      return
    }

    // Here you would dispatch an action to submit the review
    addToast({
      title: 'Review submitted',
      description: 'Thank you for your review!',
      variant: 'success',
    })

    setRating(0)
    setComment('')
    setShowReviewForm(false)
  }

  const renderStars = (count: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
          >
            <Star
              className={`h-4 w-4 ${
                star <= (interactive ? (hoveredRating || rating) : count)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Customer Reviews Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Rating Overview */}
          <div className="md:w-1/3">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-2xl font-bold">{averageRating.toFixed(1)} out of 5</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {totalReviews.toLocaleString()} global ratings
            </p>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map((dist) => (
                <div key={dist.stars} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{dist.stars} star</span>
                  <div className="flex-1 h-5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-muted-foreground">
                    {dist.percentage}%
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Review this product</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Share your thoughts with other customers
              </p>
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                variant="outline"
                className="w-full"
              >
                Write a customer review
              </Button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="md:w-2/3 space-y-6">
            {showReviewForm && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Rating</label>
                    <div className="flex items-center gap-2">
                      {renderStars(rating, true)}
                      <span className="text-sm text-muted-foreground ml-2">
                        {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Your Review</label>
                    <Textarea
                      placeholder="What did you like or dislike? What did you use this product for?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={5}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">Submit Review</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowReviewForm(false)
                        setRating(0)
                        setComment('')
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Individual Reviews */}
            {mockReviews.map((review) => (
              <div key={review.id} className="border-b pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                    {review.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{review.userName}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm font-semibold">
                        {review.rating === 5
                          ? 'Excellent!'
                          : review.rating === 4
                          ? 'Very Good'
                          : review.rating === 3
                          ? 'Average'
                          : review.rating === 2
                          ? 'Below Average'
                          : 'Poor'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Reviewed on {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm leading-relaxed mb-3">{review.comment}</p>
                    <div className="flex items-center gap-4">
                      <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        Helpful ({review.helpful})
                      </button>
                      <button className="text-sm text-muted-foreground hover:text-foreground">
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {mockReviews.length < totalReviews && (
              <div className="text-center pt-4">
                <Button variant="outline">See all {totalReviews} reviews</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

