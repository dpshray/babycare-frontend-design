'use client'

import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, ArrowLeft, Package, MapPin, CreditCard, Calendar } from "lucide-react"
import Image from "next/image"
import orderService from "@/Service/order.service"

export interface OrderDetails {
    order_code: string
    address: string
    description: string | null
    price: number
    previous_price: number
    promo_code: string | null
    payment_method: string
    payment_status: "UNPAID" | "PAID"
    status: "PENDING" | "COMPLETED" | "CANCELLED"
    created_at: string
    ordered_items: OrderedItem[]
}

export interface OrderedItem {
    order_item_id: string
    status: "PENDING" | "COMPLETED" | "CANCELLED"
    image: string
    item_name: string
    item_slug: string
    variant_size: string
    quantity: number
    price: number
    subtotal: number
    type: "product" | "service"
    my_reviews: Review[]
}

export interface Review {
    id?: string
    rating?: number
    comment?: string
}

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const variants = {
        PAID: "default" as const,
        UNPAID: "secondary" as const,
        COMPLETED: "default" as const,
        PENDING: "secondary" as const,
        CANCELLED: "destructive" as const,
    }
    return variants[status as keyof typeof variants] || "outline"
}

export default function OrderDetailPage() {
    const { slug } = useParams()
    const router = useRouter()

    const { data, isLoading, error } = useQuery({
        queryKey: ['order', slug],
        queryFn: async () => {
            return await orderService.getOrder(slug as string)
        },
        staleTime: 30000,
        enabled: !!slug,
    })

    const orderDetails: OrderDetails | null = useMemo(() => data?.data || null, [data])

    if (error) {
        return (
            <main className="container mx-auto px-4 py-6 sm:py-8 lg:py-10">
                <div className="rounded-lg border border-destructive bg-destructive/10 p-6 sm:p-8">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <AlertCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
                        <div>
                            <h2 className="text-lg font-semibold sm:text-xl">Failed to load order</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {error instanceof Error ? error.message : 'An unexpected error occurred'}
                            </p>
                        </div>
                        <Button onClick={() => router.back()} variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                            Go Back
                        </Button>
                    </div>
                </div>
            </main>
        )
    }

    if (isLoading) {
        return (
            <main className="container mx-auto px-4 py-6 sm:py-8 lg:py-10">
                <Skeleton className="mb-6 h-8 w-48" />
                <div className="space-y-6">
                    <div className="rounded-lg border bg-card p-4 sm:p-6">
                        <Skeleton className="mb-4 h-6 w-32" />
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 sm:p-6">
                        <Skeleton className="mb-4 h-6 w-32" />
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-24 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (!orderDetails) {
        return (
            <main className="container mx-auto px-4 py-6 sm:py-8 lg:py-10">
                <div className="rounded-lg border bg-card p-8 text-center">
                    <Package className="mx-auto h-16 w-16 text-muted-foreground" aria-hidden="true" />
                    <h2 className="mt-4 text-lg font-semibold sm:text-xl">Order not found</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        The order you&#39;re looking for doesn&#39;t exist
                    </p>
                    <Button onClick={() => router.back()} variant="outline" className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                        Go Back
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-6 sm:py-8 lg:py-10">
            <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                    <Button onClick={() => router.back()} variant="ghost" size="sm" className="mb-2 -ml-2">
                        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                        Back to Orders
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                        Order #{orderDetails.order_code}
                    </h1>
                    <p className="text-sm text-muted-foreground sm:text-base">
                        View complete order details and items
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Badge variant={getStatusVariant(orderDetails.status)} className="text-xs">
                        {orderDetails.status}
                    </Badge>
                    <Badge variant={getStatusVariant(orderDetails.payment_status)} className="text-xs">
                        {orderDetails.payment_status}
                    </Badge>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <section className="rounded-lg  bg-card p-4 sm:p-6">
                        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                            <Package className="h-5 w-5" aria-hidden="true" />
                            Ordered Items
                        </h2>
                        <div className="space-y-4">
                            {orderDetails.ordered_items.map((item) => (
                                <article key={item.order_item_id} className="flex gap-4 rounded-lg border p-3 transition-colors hover:bg-accent/50 sm:p-4">
                                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-24">
                                        <Image
                                            src={item.image}
                                            alt={item.item_name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 80px, 96px"
                                        />
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                                        <div className="space-y-1">
                                            <h3 className="font-medium leading-tight sm:text-lg">{item.item_name}</h3>
                                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground sm:text-sm">
                                                <span>Size: {item.variant_size}</span>
                                                <span>•</span>
                                                <span>Qty: {item.quantity}</span>
                                                <span>•</span>
                                                <Badge variant="outline" className="text-xs">
                                                    {item.type}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Badge variant={getStatusVariant(item.status)} className="text-xs">
                                                {item.status}
                                            </Badge>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="text-xs text-muted-foreground">
                                                    NPR {item.price.toLocaleString()} × {item.quantity}
                                                </span>
                                                <span className="font-semibold">
                                                    NPR {item.subtotal.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-lg border bg-card p-4 sm:p-6">
                        <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                                <div className="min-w-0 flex-1">
                                    <dt className="font-medium">Order Date</dt>
                                    <dd className="text-muted-foreground">
                                        {new Date(orderDetails.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </dd>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                                <div className="min-w-0 flex-1">
                                    <dt className="font-medium">Delivery Address</dt>
                                    <dd className="break-words text-muted-foreground">{orderDetails.address}</dd>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                                <div className="min-w-0 flex-1">
                                    <dt className="font-medium">Payment Method</dt>
                                    <dd className="text-muted-foreground">{orderDetails.payment_method}</dd>
                                </div>
                            </div>
                            {orderDetails.description && (
                                <>
                                    <Separator />
                                    <div className="min-w-0">
                                        <dt className="font-medium">Order Notes</dt>
                                        <dd className="mt-1 break-words text-muted-foreground">{orderDetails.description}</dd>
                                    </div>
                                </>
                            )}
                        </dl>
                    </section>

                    <section className="rounded-lg border bg-card p-4 sm:p-6">
                        <h2 className="mb-4 text-lg font-semibold">Payment Details</h2>
                        <dl className="space-y-3 text-sm">
                            {orderDetails.promo_code && (
                                <>
                                    <div className="flex justify-between">
                                        <dt>Original Price</dt>
                                        <dd className="text-muted-foreground line-through">
                                            NPR {orderDetails.previous_price.toLocaleString()}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt>Promo Code</dt>
                                        <dd>
                                            <Badge variant="outline" className="text-xs">
                                                {orderDetails.promo_code}
                                            </Badge>
                                        </dd>
                                    </div>
                                    <Separator />
                                </>
                            )}
                            <div className="flex justify-between text-base font-bold">
                                <dt>Total Amount</dt>
                                <dd className="text-lg">NPR {orderDetails.price.toLocaleString()}</dd>
                            </div>
                        </dl>
                    </section>
                </div>
            </div>
        </main>
    )
}