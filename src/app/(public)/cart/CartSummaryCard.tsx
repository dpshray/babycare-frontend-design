import {Loader2} from 'lucide-react'
import Link from 'next/link'
import {memo} from 'react'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Separator} from '@/components/ui/separator'

interface OrderSummary {
    subtotal: number
    shipping?: number
    tax?: number
    discount?: number
    total: number
    itemCount: number
}

interface CartSummaryCardProps {
    summary: OrderSummary
    selectedItems: Set<string>
    promoCode?: string
    isPending: boolean
    onPromoCodeChange?: (code: string) => void
    onApplyPromoAction?: () => void
    onCheckoutAction?: () => void
    formatPrice: (amount: number) => string
}

export const CartSummaryCard = memo(function CartSummaryCard({
                                                                 summary,
                                                                 selectedItems,
                                                                 promoCode = "",
                                                                 isPending,
                                                                 onPromoCodeChange,
                                                                 onApplyPromoAction,
                                                                 onCheckoutAction,
                                                                 formatPrice,
                                                             }: CartSummaryCardProps) {
    const hasItems = selectedItems.size > 0
    const shipping = summary.shipping ?? 0
    const tax = summary.tax ?? 0
    const qualifiesForFreeShipping = summary.subtotal >= 5000
    const amountUntilFreeShipping = Math.max(0, 5000 - summary.subtotal)

    return (
        <aside
            className="sticky top-4 bg-card rounded-lg border border-border p-4 sm:p-6 space-y-4 shadow-sm"
            aria-label="Order summary"
        >
            <h2 className="text-lg sm:text-xl font-bold text-foreground">Order Summary</h2>

            <Separator className="bg-border"/>

            <dl className="space-y-3 text-sm sm:text-base">
                <div className="flex justify-between items-center gap-4">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-semibold text-foreground tabular-nums">
                        {formatPrice(summary.subtotal)}
                    </dd>
                </div>
                <div className="flex justify-between items-center gap-4">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd className="font-semibold text-foreground tabular-nums">
                        {shipping === 0 ? (
                            <span className="text-green-600 dark:text-green-500">Free</span>
                        ) : (
                            formatPrice(shipping)
                        )}
                    </dd>
                </div>
                {tax > 0 && (
                    <div className="flex justify-between items-center gap-4">
                        <dt className="text-muted-foreground">Tax (13%)</dt>
                        <dd className="font-semibold text-foreground tabular-nums">
                            {formatPrice(tax)}
                        </dd>
                    </div>
                )}
                {summary.discount && summary.discount > 0 && (
                    <div className="flex justify-between items-center gap-4">
                        <dt className="text-muted-foreground">Discount</dt>
                        <dd className="font-semibold text-green-600 dark:text-green-500 tabular-nums">
                            -{formatPrice(summary.discount)}
                        </dd>
                    </div>
                )}
            </dl>

            <Separator className="bg-border"/>

            <div className="flex justify-between items-center pt-2 gap-4">
                <span className="text-base sm:text-lg font-bold text-foreground">Total</span>
                <span className="text-xl sm:text-2xl font-bold text-primary tabular-nums">
                    {formatPrice(summary.total)}
                </span>
            </div>

            {onPromoCodeChange && onApplyPromoAction && (
                <div className="space-y-2 pt-2">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            onApplyPromoAction()
                        }}
                        className="flex gap-2"
                    >
                        <Input
                            type="text"
                            placeholder="Promo code"
                            value={promoCode}
                            onChange={(e) => onPromoCodeChange(e.target.value.toUpperCase())}
                            maxLength={20}
                            className="flex-1 h-10 text-sm"
                            aria-label="Enter promo code"
                            disabled={isPending}
                        />
                        <Button
                            type="submit"
                            variant="outline"
                            className="h-10 px-3 sm:px-4 text-sm whitespace-nowrap"
                            disabled={!promoCode.trim() || isPending}
                            aria-label="Apply promo code"
                        >
                            Apply
                        </Button>
                    </form>
                </div>
            )}

            <div className="space-y-3 pt-2">
                <Button
                    className="w-full h-11 text-sm sm:text-base font-semibold"
                    size="lg"
                    onClick={onCheckoutAction}
                    disabled={!hasItems || isPending}
                    aria-label={`Proceed to checkout with ${summary.itemCount} ${summary.itemCount === 1 ? 'item' : 'items'}`}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true"/>
                            Processing...
                        </>
                    ) : (
                        `Checkout (${summary.itemCount} ${summary.itemCount === 1 ? 'item' : 'items'})`
                    )}
                </Button>

                <Button
                    variant="outline"
                    className="w-full h-10 text-sm"
                    asChild
                    disabled={isPending}
                >
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </div>

            {shipping === 0 && hasItems && (
                <div
                    className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800"
                    role="status"
                    aria-live="polite"
                >
                    <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 font-medium text-center">
                        <span aria-hidden="true">🎉 </span>
                        You qualify for free shipping!
                    </p>
                </div>
            )}

            {summary.subtotal > 0 && !qualifiesForFreeShipping && hasItems && (
                <div
                    className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800"
                    role="status"
                    aria-live="polite"
                >
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-400 font-medium text-center">
                        Add {formatPrice(amountUntilFreeShipping)} more for free shipping
                    </p>
                </div>
            )}
        </aside>
    )
})