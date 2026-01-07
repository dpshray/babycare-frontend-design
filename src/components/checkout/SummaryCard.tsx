"use client"

import { FC, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { CartItem } from "@/components/cart/CartItem"

interface SummaryCardProps {
    orderItems: CartItem[]
    shipping?: number
    isPending?: boolean
    onPlaceOrder?: () => void
}

const SummaryCard: FC<SummaryCardProps> = ({
                                               orderItems,
                                               shipping = 0,
                                               isPending = false,
                                               onPlaceOrder,
                                           }) => {
    const subtotal = useMemo(
        () => orderItems.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 1), 0),
        [orderItems]
    )

    const total = useMemo(() => subtotal + shipping, [subtotal, shipping])

    return (
        <div className="space-y-4 rounded-lg bg-card p-4 shadow-sm sm:p-6 lg:sticky lg:top-6">
            <h2 className="text-lg font-semibold sm:text-xl">Order Summary</h2>
            <Separator />
            <ul className="max-h-60 space-y-2 overflow-y-auto text-sm">
                {orderItems.map((item) => (
                    <li key={item.item_uuid} className="flex justify-between gap-2">
                        <span className="truncate">
                            {item.item_name ?? "Item"} × {item.quantity ?? 1}
                        </span>
                        <span className="whitespace-nowrap font-medium">
                            NPR {((item.price ?? 0) * (item.quantity ?? 1)).toFixed(0)}
                        </span>
                    </li>
                ))}
            </ul>
            <Separator />
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">NPR {subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "Free" : `NPR ${shipping.toFixed(0)}`}</span>
                </div>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold sm:text-lg">
                <span>Total</span>
                <span className="text-primary">NPR {total.toFixed(0)}</span>
            </div>
            <Button
                type="button"
                className="mt-4 w-full"
                size="lg"
                disabled={isPending || orderItems.length === 0}
                aria-busy={isPending}
                onClick={onPlaceOrder}
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        Placing Order...
                    </>
                ) : (
                    "Place Order"
                )}
            </Button>
        </div>
    )
}

export default SummaryCard