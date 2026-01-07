'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { useCallback, useState, useMemo } from 'react'
import productService from '@/Service/product.service'
import { Skeleton } from '@/components/ui/skeleton'
import CustomPagination from '@/components/Custom-Pagination'
import SelectInputField from '@/components/field/SelectInput'
import { toast } from 'sonner'
import ReviewCard from '@/components/product/ReviewCard'
import ReviewForm from '@/components/product/ReviewForm'

export interface UserType {
    user_type: number
    label: string
}

export interface ReviewItem {
    comment_uuid: string
    rating: number
    review: string
    user_name: string
    user_email: string
    image: string
    user_type: UserType
    review_date: string
    is_review_edited: boolean
}

export interface ReviewData {
    items: ReviewItem[]
    page: number
    total_page: number
    total_items: number
}

export interface ReviewResponse {
    status: boolean
    data: ReviewData
    message: string
}

export interface ProductReview {
    rating: number
    review: string
}

interface ProductReviewProps {
    slug: string
    className?: string
}

interface RatingDistribution {
    star: number
    count: number
    percentage: number
}

const REVIEW_SELECT_OPTIONS = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'highest', label: 'Highest Rated' },
    { value: 'lowest', label: 'Lowest Rated' }
] as const

const RATING_STARS = [5, 4, 3, 2, 1] as const
const TOTAL_STARS = 5
const SKELETON_COUNT = 3

const ReviewSkeleton = () => (
    <div className="space-y-6" role="status" aria-label="Loading reviews">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 sm:p-6 space-y-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
                <Skeleton className="h-20 w-full" />
            </div>
        ))}
    </div>
)

const calculateAverageRating = (reviews: ReviewItem[]): number => {
    if (reviews.length === 0) return 0
    const total = reviews.reduce((acc, review) => acc + review.rating, 0)
    return total / reviews.length
}

const calculateRatingDistribution = (reviews: ReviewItem[]): RatingDistribution[] => {
    return RATING_STARS.map((star) => {
        const count = reviews.filter((review) => review.rating === star).length
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
        return { star, count, percentage }
    })
}

export default function ProductReview({ slug, className = '' }: ProductReviewProps) {
    const queryClient = useQueryClient()
    const [currentPage, setCurrentPage] = useState(1)
    const [sortBy, setSortBy] = useState('recent')

    const {
        data: productReviews,
        isLoading,
        error
    } = useQuery<ReviewResponse>({
        queryKey: ['product-reviews', slug, currentPage, sortBy],
        queryFn: () => productService.getProductReviews(slug, { page: currentPage, sort_by: sortBy }),
        enabled: !!slug,
        staleTime: 30000
    })



    const reviewData = productReviews?.data

    const averageRating = useMemo(
        () => (reviewData?.items ? calculateAverageRating(reviewData.items) : 0),
        [reviewData?.items]
    )

    const ratingDistribution = useMemo(
        () => (reviewData?.items ? calculateRatingDistribution(reviewData.items) : []),
        [reviewData?.items]
    )

    const handleSortChange = useCallback((value: string | number) => {
        setSortBy(String(value))
        setCurrentPage(1)
    }, [])

    const handleReviewSubmitSuccess = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['product-reviews', slug] })
        setCurrentPage(1)
    }, [queryClient, slug])



    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    if (isLoading) {
        return (
            <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
                <Skeleton className="h-9 w-56 mb-6" />
                <ReviewSkeleton />
            </div>
        )
    }

    if (error || !reviewData) {
        return (
            <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
                <div className="text-center py-16 bg-gray-50 rounded-xl" role="alert">
                    <p className="text-gray-500 text-lg">Unable to load reviews</p>
                </div>
            </div>
        )
    }

    const hasReviews = reviewData.items.length > 0
    const totalReviews = reviewData.total_items

    return (
        <section
            className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 ${className}`}
            aria-labelledby="reviews-heading"
        >
            <header className="mb-8">
                <h2 id="reviews-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    Customer Reviews
                </h2>
                <p className="text-sm text-gray-600">
                    {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 mb-8">
                <div
                    className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6"
                    role="region"
                    aria-label="Average rating summary"
                >
                    <div className="text-center">
                        <div className="text-5xl font-bold text-gray-900 mb-2" aria-label={`Average rating: ${averageRating.toFixed(1)} out of ${TOTAL_STARS}`}>
                            {averageRating.toFixed(1)}
                        </div>
                        <div
                            className="flex items-center justify-center gap-1 mb-2"
                            role="img"
                            aria-label={`${averageRating.toFixed(1)} out of ${TOTAL_STARS} stars`}
                        >
                            {Array.from({ length: TOTAL_STARS }, (_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                        i < Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                    aria-hidden="true"
                                />
                            ))}
                        </div>
                        <p className="text-gray-600 text-xs">
                            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-2" role="region" aria-label="Rating distribution">
                    {ratingDistribution.map(({ star, count, percentage }) => (
                        <div key={star} className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 w-14 flex-shrink-0">
                {star} {star === 1 ? 'star' : 'stars'}
              </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="bg-yellow-400 h-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                    role="progressbar"
                                    aria-valuenow={Math.round(percentage)}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-label={`${Math.round(percentage)}% of reviews are ${star} ${star === 1 ? 'star' : 'stars'}`}
                                />
                            </div>
                            <span className="text-sm text-gray-600 w-10 text-right flex-shrink-0">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    All Reviews ({reviewData.items.length})
                </h3>
                <div className="flex items-center gap-2">
                    <ReviewForm mode="create" slug={slug} onSubmitAction={handleReviewSubmitSuccess} />
                    <SelectInputField
                        placeholder="Sort by"
                        options={REVIEW_SELECT_OPTIONS}
                        onChangeAction={handleSortChange}
                        aria-label="Sort reviews by"
                    />
                </div>
            </div>

            {!hasReviews ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl" role="status">
                    <p className="text-gray-500 text-lg">No reviews yet. Be the first to review!</p>
                </div>
            ) : (
                <div className="space-y-4" role="list" aria-label="Customer reviews">
                    {reviewData.items.map((review) => (
                        <ReviewCard
                            key={review.comment_uuid}
                            review={review}
                            onEditAction={handleReviewSubmitSuccess}
                            slug={slug}
                            showActions={true}
                        />
                    ))}
                </div>
            )}

            {reviewData.total_page > 1 && (
                <nav className="mt-8" aria-label="Reviews pagination">
                    <CustomPagination
                        currentPage={currentPage}
                        totalPages={reviewData.total_page}
                        onPageChangeAction={handlePageChange}
                    />
                </nav>
            )}
        </section>
    )
}