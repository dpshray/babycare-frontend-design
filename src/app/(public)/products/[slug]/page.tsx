'use client'

import {useParams} from 'next/navigation'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {Clock, Heart, Shield, ShoppingCart, Star, Truck} from 'lucide-react'
import Image from 'next/image'
import productService from '@/Service/product.service'
import ProductReview from '@/components/product/ProductReview'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Skeleton} from '@/components/ui/skeleton'
import {toast} from 'sonner'
import {cn} from '@/lib/utils'
import type {AxiosError} from 'axios'

export interface Category {
    name: string
    slug: string
}

export interface Tag {
    name: string
    slug: string
}

export interface ProductData {
    name: string
    slug: string
    price: number
    previous_price: number
    discount_percent: number
    age_group_year_from: number
    age_group_year_to: number
    size: string
    brand: string
    description: string
    added_date: string
    rating: number
    tags: Tag[]
    categories: Category[]
    featured_image: string
    gallery_images: string[]
    liked: boolean
    stock: number
}

export interface ProductDetailsResponse {
    status: boolean
    data: ProductData
    message: string
}

interface ErrorResponse {
    message: string
}

interface FavoriteResponse {
    status: boolean
    data: { liked: boolean }
    message: string
}

const TOTAL_STARS = 5
const MIN_QUANTITY = 1

const LoadingSkeleton = () => (
    <div className="min-h-screen bg-muted/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 lg:py-10 space-y-6 sm:space-y-8">
            <div className="bg-white rounded-lg md:rounded-xl border shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 p-3 sm:p-4 md:p-6 lg:p-8">
                    <div className="space-y-3 sm:space-y-4">
                        <Skeleton className="aspect-square w-full rounded-lg md:rounded-xl"/>
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({length: 5}, (_, i) => (
                                <Skeleton key={i} className="aspect-square rounded-lg"/>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                        <Skeleton className="h-6 sm:h-8 w-3/4"/>
                        <Skeleton className="h-10 sm:h-12 w-1/2"/>
                        <Skeleton className="h-24 sm:h-32 w-full"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
)

const ErrorState = () => (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-2 bg-white border rounded-lg md:rounded-xl p-6 sm:p-8 max-w-md mx-auto">
            <h2 className="text-lg sm:text-xl font-semibold">Product Not Found</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Unable to load product details</p>
        </div>
    </div>
)

const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosError<ErrorResponse>
        return axiosError.response?.data?.message || 'An error occurred'
    }
    return 'An unexpected error occurred'
}

export default function ProductDetail() {
    const params = useParams()
    const queryClient = useQueryClient()
    const slug = typeof params.slug === 'string' ? params.slug : undefined

    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(MIN_QUANTITY)

    const {data, isLoading, error} = useQuery<ProductDetailsResponse>({
        queryKey: ['product', slug],
        queryFn: () => productService.getProduct(slug as string),
        enabled: !!slug,
        staleTime: 60000,
        retry: 2
    })

    const product = data?.data

    useEffect(() => {
        if (product) {
            setQuantity(MIN_QUANTITY)
        }
    }, [product])

    const {mutate: toggleFavorite, isPending: isFavoritePending} = useMutation<
        FavoriteResponse,
        AxiosError<ErrorResponse>,
        string
    >({
        mutationFn: (productSlug: string) => productService.addToFavorite(productSlug),
        onSuccess: (response) => {
            const message = response?.message || 'Favorite updated successfully'
            toast.success(message)

            queryClient.invalidateQueries({queryKey: ['product', slug]})
            queryClient.invalidateQueries({queryKey: ['products']})
            queryClient.invalidateQueries({queryKey: ['favorites']})
        },
        onError: (error) => {
            const message = getErrorMessage(error)
            toast.error(message)
        }
    })

    const images = useMemo(
        () => (product ? [product.featured_image, ...product.gallery_images] : []),
        [product]
    )

    const discountAmount = useMemo(
        () => (product ? product.previous_price - product.price : 0),
        [product]
    )

    const handleFavoriteClick = useCallback(() => {
        if (slug) {
            toggleFavorite(slug)
        }
    }, [slug, toggleFavorite])

    const handleQuantityDecrease = useCallback(() => {
        setQuantity((prev) => Math.max(MIN_QUANTITY, prev - 1))
    }, [])

    const handleQuantityIncrease = useCallback(() => {
        if (product) {
            setQuantity((prev) => Math.min(product.stock, prev + 1))
        }
    }, [product])

    const handleImageSelect = useCallback((index: number) => {
        setSelectedImage(index)
    }, [])

    const handleAddToCart = useCallback(() => {
        toast.success(`Added ${quantity} item(s) to cart`)
    }, [quantity])

    if (isLoading) return <LoadingSkeleton/>
    if (error || !product) return <ErrorState/>

    const isInStock = product.stock > 0
    const hasDiscount = product.discount_percent > 0
    const isLowStock = product.stock > 0 && product.stock <= 10

    return (
        <div className="min-h-screen bg-muted/30">
            <div
                className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 space-y-6 sm:space-y-8">
                <article className="bg-white rounded-lg md:rounded-xl border shadow-sm">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-10 p-3 sm:p-4 md:p-6 lg:p-8">
                        <section className="space-y-3 sm:space-y-4" aria-label="Product images">
                            <div className="relative aspect-square rounded-lg md:rounded-xl overflow-hidden bg-muted">
                                <Image
                                    src={images[selectedImage]}
                                    alt={`${product.name} - View ${selectedImage + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                                    className="object-cover"
                                    priority={selectedImage === 0}
                                />
                                {hasDiscount && (
                                    <Badge
                                        className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 hover:bg-red-600 text-xs sm:text-sm">
                                        -{product.discount_percent}%
                                    </Badge>
                                )}
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className={cn(
                                        "absolute top-2 right-2 sm:top-3 sm:right-3 shadow-md h-8 w-8 sm:h-10 sm:w-10 transition-colors",
                                        product.liked && "bg-red-50 hover:bg-red-100"
                                    )}
                                    onClick={handleFavoriteClick}
                                    disabled={isFavoritePending}
                                    aria-label={product.liked ? 'Remove from favorites' : 'Add to favorites'}
                                    aria-pressed={product.liked}
                                >
                                    <Heart
                                        className={cn(
                                            "h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all",
                                            product.liked ? "fill-red-500 text-red-500" : "text-gray-600"
                                        )}
                                    />
                                </Button>
                            </div>

                            <div className="grid grid-cols-5 gap-1.5 sm:gap-2" role="list"
                                 aria-label="Product image gallery">
                                {images.map((img, idx) => (
                                    <button
                                        key={`${img}-${idx}`}
                                        onClick={() => handleImageSelect(idx)}
                                        className={cn(
                                            "aspect-square rounded-md md:rounded-lg overflow-hidden border-2 transition-all",
                                            selectedImage === idx
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "border-border hover:border-primary/50"
                                        )}
                                        aria-label={`View image ${idx + 1} of ${images.length}`}
                                        aria-current={selectedImage === idx}
                                        role="listitem"
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} thumbnail ${idx + 1}`}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4 sm:space-y-6" aria-label="Product information">
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
                                    <span className="font-semibold text-primary uppercase">{product.brand}</span>
                                    <span className="text-muted-foreground">|</span>
                                    {product.categories.map((cat, idx) => (
                                        <span key={cat.slug} className="text-muted-foreground">
                      {cat.name}
                                            {idx < product.categories.length - 1 && ', '}
                    </span>
                                    ))}
                                </div>

                                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                                    {product.name}
                                </h1>

                                <div className="flex items-center gap-2">
                                    <div
                                        className="flex items-center gap-0.5"
                                        role="img"
                                        aria-label={`Rated ${product.rating.toFixed(1)} out of ${TOTAL_STARS} stars`}
                                    >
                                        {Array.from({length: TOTAL_STARS}, (_, i) => (
                                            <Star
                                                key={i}
                                                className={cn(
                                                    "h-3.5 w-3.5 sm:h-4 sm:w-4",
                                                    i < Math.floor(product.rating)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-muted-foreground"
                                                )}
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium">{product.rating.toFixed(1)}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                                {product.previous_price > product.price && (
                                    <>
                    <span className="text-lg sm:text-xl line-through text-muted-foreground">
                      ${product.previous_price.toFixed(2)}
                    </span>
                                        <Badge variant="secondary"
                                               className="bg-green-100 text-green-700 text-xs sm:text-sm">
                                            Save ${discountAmount.toFixed(2)}
                                        </Badge>
                                    </>
                                )}
                            </div>

                            <div className="border-t border-b py-3 sm:py-4 space-y-3">
                                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Age Range: </span>
                                        <span className="font-semibold">
                      {product.age_group_year_from}-{product.age_group_year_to} years
                    </span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Size: </span>
                                        <span className="font-semibold">{product.size}</span>
                                    </div>
                                </div>
                                <div className="text-xs sm:text-sm">
                                    <span className="text-muted-foreground">Stock: </span>
                                    <span
                                        className={cn(
                                            "font-semibold",
                                            isInStock
                                                ? isLowStock
                                                    ? "text-orange-600"
                                                    : "text-green-600"
                                                : "text-red-600"
                                        )}
                                    >
                    {isInStock ? `${product.stock} available` : 'Out of stock'}
                  </span>
                                </div>
                            </div>

                            <div>
                                <h2 className="font-semibold mb-2 text-sm sm:text-base">Description</h2>
                                <div
                                    className="prose prose-sm max-w-none text-muted-foreground text-xs sm:text-sm"
                                    dangerouslySetInnerHTML={{__html: product.description}}
                                />
                            </div>

                            {product.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 sm:gap-2" role="list" aria-label="Product tags">
                                    {product.tags.map((tag) => (
                                        <Badge key={tag.slug} variant="outline" className="text-xs" role="listitem">
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <div
                                className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3 pt-2">
                                <div
                                    className="flex items-center border rounded-lg overflow-hidden"
                                    role="group"
                                    aria-label="Quantity selector"
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleQuantityDecrease}
                                        disabled={quantity <= MIN_QUANTITY}
                                        aria-label="Decrease quantity"
                                        className={cn(
                                            "h-9 w-9 sm:h-10 sm:w-10 rounded-none hover:bg-muted",
                                            quantity <= MIN_QUANTITY && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <span className="text-lg font-medium">−</span>
                                    </Button>
                                    <span
                                        className="px-4 sm:px-6 font-semibold border-x text-sm sm:text-base min-w-[3rem] sm:min-w-[4rem] text-center"
                                        aria-live="polite"
                                        aria-label={`Quantity: ${quantity}`}
                                    >
                    {quantity}
                  </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={handleQuantityIncrease}
                                        disabled={quantity >= product.stock}
                                        aria-label="Increase quantity"
                                        className={cn(
                                            "h-9 w-9 sm:h-10 sm:w-10 rounded-none hover:bg-muted",
                                            quantity >= product.stock && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <span className="text-lg font-medium">+</span>
                                    </Button>
                                </div>

                                <Button
                                    className={cn(
                                        "flex-1 h-9 sm:h-10 lg:h-11 text-sm sm:text-base",
                                        !isInStock && "opacity-60"
                                    )}
                                    onClick={handleAddToCart}
                                    disabled={!isInStock}
                                    aria-label={isInStock ? 'Add to cart' : 'Out of stock'}
                                >
                                    <ShoppingCart className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4"/>
                                    {isInStock ? 'Add to Cart' : 'Out of Stock'}
                                </Button>
                            </div>

                            <div
                                className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 pt-3 sm:pt-4"
                                role="list"
                                aria-label="Product features"
                            >
                                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-lg"
                                     role="listitem">
                                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0"
                                           aria-hidden="true"/>
                                    <div>
                                        <p className="font-semibold text-xs sm:text-sm">Free Delivery</p>
                                        <p className="text-xs text-muted-foreground">Orders over $50</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-lg"
                                     role="listitem">
                                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0"
                                            aria-hidden="true"/>
                                    <div>
                                        <p className="font-semibold text-xs sm:text-sm">Secure Payment</p>
                                        <p className="text-xs text-muted-foreground">100% protected</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-muted/50 rounded-lg"
                                     role="listitem">
                                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0"
                                           aria-hidden="true"/>
                                    <div>
                                        <p className="font-semibold text-xs sm:text-sm">Easy Returns</p>
                                        <p className="text-xs text-muted-foreground">30-day policy</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </article>

                <ProductReview slug={slug as string}/>
            </div>
        </div>
    )
}