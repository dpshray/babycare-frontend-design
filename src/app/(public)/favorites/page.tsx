'use client'

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {useCallback, useState} from 'react'
import {Heart, ShoppingCart, Star} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {toast} from 'sonner'
import {cn, formatPrice} from '@/lib/utils'
import productService from '@/Service/product.service'
import CustomPagination from '@/components/Custom-Pagination'
import {Button} from '@/components/ui/button'
import {Badge} from '@/components/ui/badge'
import {Skeleton} from '@/components/ui/skeleton'
import type {AxiosError} from 'axios'
import cartService from "@/Service/cart.service";

interface FavoriteProduct {
    name: string
    slug: string
    brand: string
    rating: number
    price: number
    previous_price: number
    feature_image: string
    discount_percent: number
    liked: boolean
    stock: number
}

interface FavoritesData {
    items: FavoriteProduct[]
    page: number
    total_page: number
    total_items: number
}

interface FavoritesResponse {
    status: boolean
    data: FavoritesData
    message: string
}

interface ErrorResponse {
    message: string
}

interface FavoriteToggleResponse {
    status: boolean
    data: { liked: boolean }
    message: string
}

const ITEMS_PER_PAGE = 12
const TOTAL_STARS = 5

const ProductCardSkeleton = () => (
    <div className="bg-white rounded-lg md:rounded-xl border shadow-sm overflow-hidden">
        <Skeleton className="aspect-square w-full"/>
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            <Skeleton className="h-4 w-3/4"/>
            <Skeleton className="h-4 w-1/2"/>
            <Skeleton className="h-8 w-full"/>
        </div>
    </div>
)

const LoadingState = () => (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {Array.from({length: 8}, (_, i) => (
            <ProductCardSkeleton key={i}/>
        ))}
    </div>
)

const EmptyState = () => (
    <div className="text-center py-12 sm:py-16 md:py-20">
        <div className="bg-white rounded-lg md:rounded-xl border shadow-sm p-8 sm:p-12 max-w-md mx-auto">
            <Heart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-gray-300"/>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Favorites Yet</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
                Start adding products to your favorites to see them here
            </p>
            <Button asChild>
                <Link href="/products">Browse Products</Link>
            </Button>
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

export default function FavoritesPage() {
    const queryClient = useQueryClient()
    const [currentPage, setCurrentPage] = useState(1)

    const {data, isLoading, error} = useQuery<FavoritesResponse>({
        queryKey: ['favorites', currentPage],
        queryFn: () =>
            productService.favouritesProduct({
                page: currentPage,
                per_page: ITEMS_PER_PAGE
            }),
        staleTime: 30000,
        retry: 2
    })

    const {mutate: toggleFavorite, isPending: isTogglePending} = useMutation<
        FavoriteToggleResponse,
        AxiosError<ErrorResponse>,
        string
    >({
        mutationFn: (slug: string) => productService.addToFavorite(slug),
        onSuccess: (response, slug) => {
            const message = response?.message || 'Removed from favorites'
            toast.success(message)

            queryClient.invalidateQueries({queryKey: ['favorites']})
            queryClient.invalidateQueries({queryKey: ['products']})
            queryClient.invalidateQueries({queryKey: ['product', slug]})
        },
        onError: (error) => {
            const message = getErrorMessage(error)
            toast.error(message)
        }
    })

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [])

    const handleToggleFavorite = useCallback(
        (slug: string) => {
            toggleFavorite(slug)
        },
        [toggleFavorite]
    )

    const handleAddToCart = useCallback(async (product: FavoriteProduct) => {
        const payload = {
            slug: product.slug,
            quantity: 1
        }
        await cartService.addToCart(payload).then((res) => {
            toast.success(res?.message || 'Product added to cart')
        }).catch((error) => {
            toast.error(error?.message || 'Failed to add product to cart')
        })
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-muted/30">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                    <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 mb-2"/>
                    <Skeleton className="h-4 sm:h-5 w-32 sm:w-40 mb-6 sm:mb-8"/>
                    <LoadingState/>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
                <div
                    className="text-center space-y-2 bg-white border rounded-lg md:rounded-xl p-6 sm:p-8 max-w-md mx-auto">
                    <h2 className="text-lg sm:text-xl font-semibold">Unable to Load Favorites</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">Please try again later</p>
                </div>
            </div>
        )
    }

    const favoriteProducts = data?.data?.items || []
    const totalPages = data?.data?.total_page || 1
    const totalItems = data?.data?.total_items || 0
    const hasFavorites = favoriteProducts.length > 0

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                <header className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
                        My Favorites
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        {totalItems} {totalItems === 1 ? 'product' : 'products'}
                    </p>
                </header>

                {!hasFavorites ? (
                    <EmptyState/>
                ) : (
                    <>
                        <div
                            className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                            role="list"
                            aria-label="Favorite products"
                        >
                            {favoriteProducts.map((product) => {
                                const hasDiscount = product.discount_percent > 0
                                const isInStock = product.stock > 0

                                return (
                                    <article
                                        key={product.slug}
                                        className="bg-white rounded-lg md:rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                        role="listitem"
                                    >
                                        <Link
                                            href={`/products/${product.slug}`}
                                            className="block relative aspect-square bg-muted"
                                        >
                                            <Image
                                                src={product.feature_image}
                                                alt={product.name}
                                                fill
                                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                                className="object-cover"
                                                loading="lazy"
                                            />
                                            {hasDiscount && (
                                                <Badge
                                                    className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-xs">
                                                    -{product.discount_percent}%
                                                </Badge>
                                            )}
                                            {!isInStock && (
                                                <div
                                                    className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                    <Badge variant="secondary" className="text-xs sm:text-sm">
                                                        Out of Stock
                                                    </Badge>
                                                </div>
                                            )}
                                        </Link>

                                        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase font-medium">
                                                    {product.brand}
                                                </p>
                                                <Link href={`/products/${product.slug}`}>
                                                    <h3 className="font-semibold text-sm sm:text-base line-clamp-2 hover:text-primary transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <div
                                                    className="flex items-center gap-1"
                                                    role="img"
                                                    aria-label={`Rated ${product.rating} out of ${TOTAL_STARS} stars`}
                                                >
                                                    {Array.from({length: TOTAL_STARS}, (_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={cn(
                                                                "h-3 w-3 sm:h-3.5 sm:w-3.5",
                                                                i < Math.floor(product.rating)
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "text-gray-300"
                                                            )}
                                                            aria-hidden="true"
                                                        />
                                                    ))}
                                                    <span className="text-xs text-muted-foreground ml-1">
                            {product.rating.toFixed(1)}
                          </span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-lg sm:text-xl font-bold">
                              {formatPrice(product.price)}
                          </span>
                                                    {hasDiscount && (
                                                        <span className="text-sm line-through text-muted-foreground">
                              ${product.previous_price.toFixed(2)}
                            </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 sm:gap-2 pt-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 text-xs sm:text-sm"
                                                    onClick={() => handleAddToCart(product)}
                                                    disabled={!isInStock}
                                                >
                                                    <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5"/>
                                                    {isInStock ? 'Add to Cart' : 'Out of Stock'}
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className={cn(
                                                        "h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0",
                                                        product.liked && "bg-red-50 hover:bg-red-100"
                                                    )}
                                                    onClick={() => handleToggleFavorite(product.slug)}
                                                    disabled={isTogglePending}
                                                    aria-label="Remove from favorites"
                                                    aria-pressed={product.liked}
                                                >
                                                    <Heart
                                                        className={cn(
                                                            "h-4 w-4 transition-all",
                                                            product.liked ? "fill-red-500 text-red-500" : "text-gray-600"
                                                        )}
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })}
                        </div>

                        {totalPages > 1 && (
                            <nav className="mt-8 sm:mt-12" aria-label="Pagination">
                                <CustomPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChangeAction={handlePageChange}
                                />
                            </nav>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}