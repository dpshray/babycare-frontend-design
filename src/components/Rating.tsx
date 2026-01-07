'use client'

import {Star} from 'lucide-react'
import {cn} from '@/lib/utils'
import {memo} from 'react'

interface RatingDisplayProps {
    rating: number
    maxRating?: number
    showValue?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg'
    className?: string
    valueClassName?: string
}

const STAR_SIZES = {
    xs: 'h-2.5 w-2.5 sm:h-3 sm:w-3',
    sm: 'h-3 w-3 sm:h-3.5 sm:w-3.5',
    md: 'h-3.5 w-3.5 sm:h-4 sm:w-4',
    lg: 'h-4 w-4 sm:h-5 sm:w-5'
} as const

const VALUE_SIZES = {
    xs: 'text-xs',
    sm: 'text-xs sm:text-sm',
    md: 'text-sm',
    lg: 'text-sm sm:text-base'
} as const

function RatingDisplay({
                           rating,
                           maxRating = 5,
                           showValue = true,
                           size = 'sm',
                           className,
                           valueClassName
                       }: RatingDisplayProps) {
    const normalizedRating = Math.max(0, Math.min(maxRating, rating))
    const filledStars = Math.floor(normalizedRating)

    return (
        <div
            className={cn('flex items-center gap-1', className)}
            role="img"
            aria-label={`Rated ${normalizedRating.toFixed(1)} out of ${maxRating} stars`}
        >
            {Array.from({length: maxRating}, (_, index) => (
                <Star
                    key={index}
                    className={cn(
                        STAR_SIZES[size],
                        'transition-colors',
                        index < filledStars
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-transparent text-gray-300'
                    )}
                    aria-hidden="true"
                />
            ))}
            {showValue && (
                <span
                    className={cn(
                        VALUE_SIZES[size],
                        'text-muted-foreground font-medium ml-0.5',
                        valueClassName
                    )}
                >
          {normalizedRating.toFixed(1)}
        </span>
            )}
        </div>
    )
}

export default memo(RatingDisplay)