'use client'

import {CheckCircle, Edit2, Star, Trash2, UserCircle2} from 'lucide-react'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Button} from '@/components/ui/button'
import {memo, useCallback, useState} from 'react'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {toast} from 'sonner'
import ReviewForm from '@/components/product/ReviewForm'
import ActionModal from '@/components/ActionModal'
import productService from '@/Service/product.service'
import type {AxiosError} from 'axios'

export interface UserType {
    user_type: number
    label: string
}

export interface ReviewItem {
    image: string
    comment_uuid: string
    user_name: string
    user_email: string
    review: string
    rating: number
    user_type: UserType
    review_date: string
    is_review_edited: boolean
}

interface ReviewCardProps {
    review: ReviewItem
    onEditAction?: () => void
    showActions?: boolean
    slug: string
}

interface ErrorResponse {
    message: string
}

interface DeleteResponse {
    status: boolean
    message: string
}

const TOTAL_STARS = 5

interface RatingStarProps {
    filled: boolean
}

const RatingStar = memo(({filled}: RatingStarProps) => (
    <Star
        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
            filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
        aria-hidden="true"
    />
))

RatingStar.displayName = 'RatingStar'

const formatReviewDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const getUserInitials = (name: string): string => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError<ErrorResponse>
        return axiosError.response?.data?.message || 'Failed to delete review'
    }
    return 'An unexpected error occurred'
}

function ReviewCard({
                        review,
                        onEditAction,
                        showActions = true,
                        slug
                    }: ReviewCardProps) {
    const queryClient = useQueryClient()
    const [openDeleteModal, setOpenDeleteModal] = useState(false)

    const {mutate: deleteReview, isPending: isDeleting} = useMutation<
        DeleteResponse,
        AxiosError<ErrorResponse>,
        string
    >({
        mutationFn: (uuid: string) => productService.deleteProductReview(slug, uuid),
        onSuccess: (response) => {
            const message = response?.message || 'Review deleted successfully'
            toast.success(message)

            queryClient.invalidateQueries({
                queryKey: ['product-reviews', slug],
                exact: false
            })

            setOpenDeleteModal(false)
        },
        onError: (error) => {
            const message = getErrorMessage(error)
            toast.error(message)
            setOpenDeleteModal(false)
        }
    })

    const handleConfirmDelete = useCallback(() => {
        if (review.comment_uuid) {
            deleteReview(review.comment_uuid)
        }
    }, [deleteReview, review.comment_uuid])

    const handleOpenDeleteModal = useCallback(() => {
        setOpenDeleteModal(true)
    }, [])

    const handleCloseDeleteModal = useCallback((open: boolean) => {
        if (!isDeleting) {
            setOpenDeleteModal(open)
        }
    }, [isDeleting])

    return (
        <>
            <article
                className="border border-gray-200 rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 hover:border-gray-300 hover:shadow-sm transition-all"
                aria-label={`Review by ${review.user_name}`}
            >
                <div className="flex gap-2 sm:gap-3 md:gap-4">
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 flex-shrink-0">
                        <AvatarImage
                            src={review.image}
                            alt={`${review.user_name}'s avatar`}
                            loading="lazy"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500">
                            {review.image ? (
                                <UserCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white"/>
                            ) : (
                                <span className="text-white text-xs sm:text-sm font-medium">
                  {getUserInitials(review.user_name)}
                </span>
                            )}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
                                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                                        {review.user_name}
                                    </h4>
                                    {review.user_type && (
                                        <span
                                            className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                      <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true"/>
                      <span>{review.user_type.label}</span>
                    </span>
                                    )}
                                    {review.is_review_edited && (
                                        <span
                                            className="inline-flex items-center gap-1 text-gray-500 text-xs whitespace-nowrap">
                      <Edit2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true"/>
                      <span>Edited</span>
                    </span>
                                    )}
                                </div>
                                <time
                                    className="text-xs text-gray-500 block"
                                    dateTime={review.review_date}
                                >
                                    {formatReviewDate(review.review_date)}
                                </time>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                                <div
                                    className="flex items-center gap-0.5"
                                    role="img"
                                    aria-label={`${review.rating} out of ${TOTAL_STARS} stars`}
                                >
                                    {Array.from({length: TOTAL_STARS}, (_, index) => (
                                        <RatingStar key={index} filled={index < review.rating}/>
                                    ))}
                                </div>
                                {showActions && (
                                    <div className="flex items-center gap-0.5 sm:gap-1">
                                        {onEditAction && (
                                            <ReviewForm
                                                slug={slug}
                                                mode="edit"
                                                review={review}
                                                onSubmitAction={onEditAction}
                                            />
                                        )}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 sm:h-8 sm:w-8"
                                            onClick={handleOpenDeleteModal}
                                            disabled={isDeleting}
                                            aria-label={`Delete review by ${review.user_name}`}
                                        >
                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600"/>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {review.review}
                        </p>
                    </div>
                </div>
            </article>

            <ActionModal
                open={openDeleteModal}
                setOpen={handleCloseDeleteModal}
                title="Delete Review"
                description="Are you sure you want to delete this review? This action cannot be undone."
                confirmLabel="Delete"
                confirmVariant="destructive"
                loading={isDeleting}
                onConfirm={handleConfirmDelete}
            />
        </>
    )
}

export default memo(ReviewCard)