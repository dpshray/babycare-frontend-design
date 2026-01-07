import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {useRouter} from "next/navigation"
import {useCallback} from "react"
import {Eye} from "lucide-react"

interface OrderItem {
    uuid: string
    order_code: string
    address: string
    previous_price: number
    promo_code: string | null
    price: number
    description: string | null
    payment_method: string
    payment_status: "UNPAID" | "PAID"
    order_status: "PENDING" | "COMPLETED" | "CANCELLED"
    created_at: string
}

interface OrderItemCardProps {
    order: OrderItem
    onOrderClick?: (order: OrderItem) => void
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

export default function OrderItemCard({order, onOrderClick}: OrderItemCardProps) {
    const router = useRouter()

    const handleOrderClick = useCallback(() => {
        router.push(`/order/${order.uuid}`)
        onOrderClick?.(order)
    }, [router, order, onOrderClick])

    return (
        <article
            className="flex h-full w-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all duration-200 hover:shadow-md">
            <div
                className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:p-5 lg:p-6">
                <div className="min-w-0 flex-1 space-y-1.5">
                    <h2 className="truncate text-base font-semibold leading-tight sm:text-lg">
                        Order #{order.order_code}
                    </h2>
                    <time
                        className="block text-xs text-muted-foreground sm:text-sm"
                        dateTime={order.created_at}
                    >
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </time>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                    <Badge variant={getStatusVariant(order.order_status)} className="text-xs">
                        {order.order_status}
                    </Badge>
                    <Badge variant={getStatusVariant(order.payment_status)} className="text-xs">
                        {order.payment_status}
                    </Badge>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4 sm:gap-4 sm:p-5 lg:p-6">
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    <div className="min-w-0 space-y-1">
                        <dt className="font-medium text-foreground">Delivery Address</dt>
                        <dd className="break-words text-muted-foreground">{order.address}</dd>
                    </div>
                    <div className="min-w-0 space-y-1">
                        <dt className="font-medium text-foreground">Payment Method</dt>
                        <dd className="truncate text-muted-foreground">{order.payment_method}</dd>
                    </div>
                </dl>

                {order.description && (
                    <div className="min-w-0 space-y-1 text-sm">
                        <dt className="font-medium text-foreground">Order Notes</dt>
                        <dd className="break-words text-muted-foreground">{order.description}</dd>
                    </div>
                )}

                <div className="mt-auto space-y-3">
                    <div
                        className="flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
                        {order.promo_code && (
                            <Badge variant="outline" className="w-fit text-xs">
                                Promo: {order.promo_code}
                            </Badge>
                        )}
                        <div className="flex flex-wrap items-baseline gap-2 sm:ml-auto">
                            {order.previous_price > order.price && (
                                <span className="text-sm text-muted-foreground line-through">
                                    NPR {order.previous_price.toLocaleString()}
                                </span>
                            )}
                            <span className="text-lg font-bold text-foreground sm:text-xl">
                                NPR {order.price.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleOrderClick}
                            size="sm"
                            className="w-full sm:w-auto"
                        >
                            <Eye className="mr-2 h-4 w-4" aria-hidden="true"/>
                            View Order
                        </Button>
                    </div>
                </div>
            </div>
        </article>
    )
}