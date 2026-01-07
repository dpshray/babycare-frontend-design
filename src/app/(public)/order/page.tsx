'use client'

import {useQuery} from "@tanstack/react-query"
import {useCallback, useEffect, useMemo, useState} from "react"
import orderService from "@/Service/order.service"
import CustomPagination from "@/components/Custom-Pagination"
import {Skeleton} from "@/components/ui/skeleton"
import {AlertCircle, Package} from "lucide-react"
import OrderItemCard from "@/app/(public)/order/OrderItemCard";

export interface OrderItem {
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

const ITEMS_PER_PAGE = 10


export default function OrderPage() {
    const [currentPage, setCurrentPage] = useState(1)

    const {data, isLoading, error} = useQuery({
        queryKey: ['orders', currentPage],
        queryFn: async () => {
            const params = {
                page: currentPage,
                limit: ITEMS_PER_PAGE
            }
            return await orderService.getAllOrder(params)
        },
        staleTime: 30000,
    })

    const orders: OrderItem[] = useMemo(() => data?.data?.items || [], [data])
    const totalPages = useMemo(() => data?.data?.total_page || 1, [data])


    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
        window.scrollTo({top: 0, behavior: 'smooth'})
    }, [])

    useEffect(() => {
        if (data?.data?.totalPages && currentPage > data.data.totalPages) {
            setCurrentPage(1)
        }
    }, [data?.data?.totalPages, currentPage])

    if (error) {
        return (
            <main className="container mx-auto px-4 py-6 sm:py-8 lg:py-10">
                <div className="rounded-lg border border-destructive bg-destructive/10 p-6 sm:p-8">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <AlertCircle className="h-12 w-12 text-destructive" aria-hidden="true"/>
                        <div>
                            <h2 className="text-lg font-semibold sm:text-xl">Failed to load orders</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {error instanceof Error ? error.message : 'An unexpected error occurred'}
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="container mx-auto px-4 py-6 sm:py-8 lg:py-10">
            <div className="mb-8 space-y-2 sm:mb-10">
                <div className="flex items-center gap-3">
                    <Package className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true"/>
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">My Orders</h1>
                </div>
                <p className="text-sm text-muted-foreground sm:text-base">
                    View and track all your orders in one place
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-4" role="status" aria-label="Loading orders">
                    {Array.from({length: 5}).map((_, i) => (
                        <div key={i} className="rounded-lg border bg-card p-4 shadow-sm sm:p-6">
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-40"/>
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-3/4"/>
                            </div>
                        </div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="rounded-lg border bg-card p-8 text-center shadow-sm sm:p-12">
                    <Package className="mx-auto h-16 w-16 text-muted-foreground" aria-hidden="true"/>
                    <h2 className="mt-4 text-lg font-semibold sm:text-xl">No orders found</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Your orders will appear here once you make a purchase
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Order list">
                        {orders.map((order) => (
                            <OrderItemCard key={order.uuid} order={order}/>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-8">
                            <CustomPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChangeAction={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}
        </main>
    )
}