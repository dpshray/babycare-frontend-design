'use client'

import {Controller, FieldError, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useCallback, useState} from 'react'
import {Edit2, Star} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import TextInputField from '@/components/field/TextInputField'
import {productReviewSchema} from '@/lib/productSchema'
import productService from '@/Service/product.service'
import type {z} from 'zod'
import {toast} from "sonner";

type ReviewFormData = z.infer<typeof productReviewSchema>

interface Review {
    comment_uuid: string
    rating: number
    review: string
}

interface ReviewFormProps {
    mode?: 'create' | 'edit'
    review?: Review
    onSubmitAction?: () => void
    slug: string
}

const STAR_RATINGS = [1, 2, 3, 4, 5] as const

export default function ReviewForm({
                                       onSubmitAction,
                                       mode = 'create',
                                       review,
                                       slug
                                   }: ReviewFormProps) {
    const [open, setOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
        reset
    } = useForm<ReviewFormData>({
        resolver: zodResolver(productReviewSchema),
        defaultValues: {
            rating: review?.rating ?? 0,
            review: review?.review ?? ''
        }
    })

    const onSubmit = useCallback(
        async (data: ReviewFormData) => {
            try {
                setIsSubmitting(true)

                if (mode === 'create') {
                    await productService.createProductReview(slug, data).then((res) => {
                        toast.success(res?.message || 'Review submitted successfully')
                    }).catch((error) => {
                        toast.error(error?.message || 'Failed to submit review')
                    })
                } else if (review?.comment_uuid) {
                    await productService.updateProductReview(slug, review.comment_uuid, data)
                }

                reset()
                setOpen(false)
                onSubmitAction?.()
            } catch (error) {
                console.error('Error submitting review:', error)
            } finally {
                setIsSubmitting(false)
            }
        },
        [mode, slug, review?.comment_uuid, onSubmitAction, reset]
    )

    const handleRatingChange = useCallback(
        (rating: number, onChange: (value: number) => void) => {
            onChange(rating)
        },
        []
    )

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent, rating: number, onChange: (value: number) => void) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onChange(rating)
            }
        },
        []
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {mode === 'create' ? (
                    <Button>Write a Review</Button>
                ) : (
                    <Button variant="ghost" size="icon" aria-label="Edit review">
                        <Edit2 className="w-4 h-4 text-gray-600"/>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg" aria-describedby="review-form-description">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Submit Your Review' : 'Edit Your Review'}
                    </DialogTitle>
                </DialogHeader>
                <p id="review-form-description" className="sr-only">
                    {mode === 'create'
                        ? 'Fill out the form to submit your product review'
                        : 'Update your existing product review'}
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <label htmlFor="rating" className="text-sm font-medium">
                            Rating
                        </label>
                        <Controller
                            name="rating"
                            control={control}
                            render={({field}) => (
                                <div className="flex items-center gap-1" role="group" aria-label="Rating selection">
                                    {STAR_RATINGS.map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => handleRatingChange(star, field.onChange)}
                                            onKeyDown={(e) => handleKeyDown(e, star, field.onChange)}
                                            disabled={isSubmitting}
                                            className="transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                            aria-pressed={star <= field.value}
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors ${
                                                    star <= field.value
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                    {field.value > 0 && (
                                        <span className="ml-2 text-sm text-gray-600" aria-live="polite">
                      {field.value} star{field.value > 1 ? 's' : ''}
                    </span>
                                    )}
                                </div>
                            )}
                        />
                        {errors.rating && (
                            <p className="text-sm text-red-500" role="alert">
                                {(errors.rating as FieldError).message}
                            </p>
                        )}
                    </div>

                    <TextInputField
                        label="Review"
                        {...register('review')}
                        error={errors.review?.message}
                        disabled={isSubmitting}
                        aria-required="true"
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                        aria-label={isSubmitting ? 'Submitting review' : 'Submit review'}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}