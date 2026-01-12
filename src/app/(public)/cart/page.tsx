"use client"

import {Button} from "@/components/ui/button"
import {Loader2, ShoppingCart} from "lucide-react"
import {useCallback, useMemo, useState, useTransition} from "react"
import Link from "next/link"
import {useRouter} from "next/navigation"
import {Checkbox} from "@/components/ui/checkbox"
import CartItemRow from "@/components/cart/CartItem"
import {Label} from "@/components/ui/label"
import {useQuery, useQueryClient} from "@tanstack/react-query"
import cartService from "@/Service/cart.service"
import {formatPrice} from "@/lib/utils"
import {toast} from "sonner"
import {QUERY_STALE_TIME} from "@/config/app-constant"
import {CartSummaryCard} from "@/app/(public)/cart/CartSummaryCard"

export interface CartItem {
    item_uuid: string
    item_type: "product" | "service" | string
    item_name: string
    item_slug: string
    brand_name: string
    variant_name: string
    image: string
    variant_id: number
    quantity: number
    price: number
    subtotal: number
}

export default function CartPage() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
    const queryClient = useQueryClient()

    const {data, isLoading, error} = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const response = await cartService.getMyCart()
            if (response?.data?.cart_items) {
                toast.success("Cart loaded successfully")
            }
            return response
        },
        refetchOnWindowFocus: true,
        refetchOnMount:true,
        retry: 2,
    })

    const cartItems = useMemo<CartItem[]>(() => data?.data?.cart_items || [], [data])

    const handleSelectItem = useCallback((uuid: string, selected: boolean) => {
        setSelectedItems((prev) => {
            const updated = new Set(prev)
            if (selected) {
                updated.add(uuid)
            } else {
                updated.delete(uuid)
            }
            return updated
        })
    }, [])

    const handleSelectAll = useCallback(
        (selected: boolean) => {
            if (selected) {
                setSelectedItems(new Set(cartItems.map((item) => item.item_uuid)))
            } else {
                setSelectedItems(new Set())
            }
        },
        [cartItems]
    )

    const allSelected = cartItems.length > 0 && selectedItems.size === cartItems.length

    const summary = useMemo(() => {
        const selectedItemsList = cartItems.filter(
            (item) => selectedItems.has(item.item_uuid)
        )

        const subtotal = selectedItemsList.reduce(
            (sum, item) => sum + item.subtotal,
            0
        )

        const total = subtotal

        return {
            subtotal,
            total,
            itemCount: selectedItemsList.length
        }
    }, [cartItems, selectedItems])


    const handleCheckout = useCallback(() => {
        if (selectedItems.size === 0) {
            toast.error("Please select items to checkout")
            return
        }

        startTransition(() => {
            const checkoutItemUuids = cartItems
                .filter((item) => selectedItems.has(item.item_uuid))
                .map((item) => item.item_uuid)

            if (checkoutItemUuids.length === 0) {
                toast.error("No valid items selected")
                return
            }

            queryClient.setQueryData(["checkout-items"], checkoutItemUuids)

            const searchParams = new URLSearchParams()
            checkoutItemUuids.forEach((uuid) => searchParams.append("items", uuid))

            router.push(`/checkout?${searchParams.toString()}`)
        })
    }, [cartItems, selectedItems, queryClient, router])

    // const handleApplyPromo = useCallback(() => {
    //     const code = promoCode.trim()
    //     if (!code) {
    //         toast.error("Please enter a promo code")
    //         return
    //     }
    //
    //     toast.info("Promo code feature coming soon")
    // }, [promoCode])


    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center px-4 bg-background">
                <div className="text-center space-y-4">
                    <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-primary mx-auto"
                             aria-hidden="true"/>
                    <p className="text-base sm:text-lg text-muted-foreground">Loading your cart...</p>
                </div>
            </main>
        )
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center px-4 bg-background">
                <div className="max-w-md w-full text-center space-y-6">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-destructive/10 mb-4">
                        <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" aria-hidden="true"/>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        Failed to load cart
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Unable to retrieve your cart. Please try again.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild size="lg" variant="default">
                            <Link href="/products">Browse Products</Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            </main>
        )
    }

    if (cartItems.length === 0) {
        return (
            <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-background">
                <div className="max-w-md w-full text-center py-8 sm:py-12">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted mb-6">
                        <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" aria-hidden="true"/>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3">
                        Your cart is empty
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground mb-8">
                        Discover amazing products and add them to your cart
                    </p>
                    <Button asChild size="lg" className="min-w-[180px] sm:min-w-[200px]">
                        <Link href="/products">Browse Products</Link>
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl">
                <header className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                        Shopping Cart
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    <div className="lg:col-span-8 space-y-4">
                        <div className="flex items-center gap-3 p-3 sm:p-4 bg-card rounded-lg border border-border">
                            <Checkbox
                                id="select-all"
                                checked={allSelected}
                                onCheckedChange={(checked) => handleSelectAll(checked === true)}
                                aria-label="Select all items in cart"
                            />
                            <Label
                                htmlFor="select-all"
                                className="text-sm sm:text-base font-medium text-foreground cursor-pointer select-none flex-1"
                            >
                                {selectedItems.size > 0
                                    ? `${selectedItems.size} of ${cartItems.length} selected`
                                    : "Select All"}
                            </Label>
                        </div>

                        <div className="space-y-3" role="list" aria-label="Cart items">
                            {cartItems.map((item) => (
                                <CartItemRow
                                    key={item.item_uuid}
                                    item={item}
                                    isSelected={selectedItems.has(item.item_uuid)}
                                    onSelectAction={handleSelectItem}
                                />
                            ))}
                        </div>
                    </div>

                    <aside className="lg:col-span-4">
                        <CartSummaryCard
                            summary={summary}
                            selectedItems={selectedItems}
                            isPending={isPending}
                            onCheckoutAction={handleCheckout}
                            formatPrice={formatPrice}
                        />
                    </aside>
                </div>
            </div>
        </main>
    )
}