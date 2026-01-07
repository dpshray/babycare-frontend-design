"use client"

import {memo, useCallback, useTransition} from "react"
import {Loader2, Minus, Plus, Trash2} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {Button} from "@/components/ui/button"
import {Checkbox} from "@/components/ui/checkbox"
import {cn, formatPrice} from "@/lib/utils"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import cartService from "@/Service/cart.service"

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

interface CartItemProps {
    item: CartItem
    onUpdateQuantityAction?: (uuid: string, quantity: number) => void
    onRemoveAction?: (uuid: string) => void
    isSelected: boolean
    onSelectAction?: (uuid: string, selected: boolean) => void
}

const CartItemRow = memo(
    ({item, onUpdateQuantityAction, onRemoveAction, isSelected, onSelectAction}: CartItemProps) => {
        const queryClient = useQueryClient()
        const [isPending, startTransition] = useTransition()

        const removeItemMutation = useMutation({
            mutationFn: (uuid: string) => cartService.removeCartItems([uuid]),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ["cart"]})
            },
        })

        const updateCartItemMutation = useMutation({
            mutationFn: ({uuid, quantity}: { uuid: string; quantity: number }) =>
                cartService.updateCartItem(uuid, quantity),
            onSuccess: () => {
                queryClient.invalidateQueries({queryKey: ["cart"]})
            },
        })

        const handleUpdateQuantity = useCallback((quantity: number) => {
            if (onUpdateQuantityAction) {
                onUpdateQuantityAction(item.item_uuid, quantity)
            } else {
                startTransition(() => {
                    updateCartItemMutation.mutate({uuid: item.item_uuid, quantity})
                })
            }
        }, [item.item_uuid, onUpdateQuantityAction, updateCartItemMutation])

        const handleRemove = useCallback(() => {
            if (onRemoveAction) {
                onRemoveAction(item.item_uuid)
            } else {
                startTransition(() => {
                    removeItemMutation.mutate(item.item_uuid)
                })
            }
        }, [item.item_uuid, onRemoveAction, removeItemMutation])

        const handleDecrement = useCallback(() => {
            if (item.quantity > 1) {
                handleUpdateQuantity(item.quantity - 1)
            }
        }, [item.quantity, handleUpdateQuantity])

        const handleIncrement = useCallback(() => {
            handleUpdateQuantity(item.quantity + 1)
        }, [item.quantity, handleUpdateQuantity])

        const handleCheckboxChange = useCallback(
            (checked: boolean) => {
                if (onSelectAction) {
                    onSelectAction(item.item_uuid, checked)
                }
            },
            [item.item_uuid, onSelectAction]
        )

        const isLoading = isPending || removeItemMutation.isPending || updateCartItemMutation.isPending

        return (
            <article
                className={cn(
                    "flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 lg:p-5 bg-card rounded-lg border border-border hover:shadow-md transition-all duration-200",
                    isLoading && "opacity-60 pointer-events-none"
                )}
                aria-labelledby={`item-title-${item.item_uuid}`}
            >
                {onSelectAction && (
                    <div className="flex items-start pt-0.5 sm:pt-1 flex-shrink-0">
                        <Checkbox
                            id={`item-${item.item_uuid}`}
                            checked={isSelected}
                            onCheckedChange={handleCheckboxChange}
                            aria-label={`Select ${item.item_name}`}
                            disabled={isLoading}
                        />
                    </div>
                )}

                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                    <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.item_name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, 96px"
                        loading="lazy"
                        quality={75}
                    />
                    {isLoading && (
                        <div
                            className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-primary"/>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col gap-2 sm:gap-3 min-w-0">
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                            <Link
                                href={`/products/${item.item_slug}`}
                                id={`item-title-${item.item_uuid}`}
                                className="text-sm sm:text-base lg:text-lg font-semibold text-foreground hover:text-primary transition-colors duration-200 line-clamp-2 break-words block"
                            >
                                {item.item_name}
                            </Link>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-1">
                                {item.brand_name}{item.variant_name && ` • ${item.variant_name}`}
                            </p>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0 transition-colors"
                            onClick={handleRemove}
                            disabled={isLoading}
                            aria-label={`Remove ${item.item_name} from cart`}
                        >
                            {removeItemMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true"/>
                            ) : (
                                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true"/>
                            )}
                        </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto">
                        <div className="space-y-0.5 sm:space-y-1">
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs sm:text-sm text-muted-foreground">Price:</span>
                                <span className="text-sm sm:text-base font-semibold text-foreground tabular-nums">
                                    {formatPrice(item.price)}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xs sm:text-sm text-muted-foreground">Subtotal:</span>
                                <span className="text-base sm:text-lg font-bold text-foreground tabular-nums">
                                    {formatPrice(item.subtotal)}
                                </span>
                            </div>
                        </div>

                        <div
                            className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto"
                            role="group"
                            aria-label="Quantity controls"
                        >
                            <Button
                                variant="outline"
                                size="icon"
                                className={cn(
                                    "h-8 w-8 sm:h-9 sm:w-9 rounded-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all",
                                    item.quantity <= 1 && "opacity-40 cursor-not-allowed"
                                )}
                                onClick={handleDecrement}
                                disabled={item.quantity <= 1 || isLoading}
                                aria-label="Decrease quantity"
                            >
                                <Minus className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true"/>
                            </Button>

                            <div className="relative min-w-[2rem] sm:min-w-[2.5rem] px-1">
                                <span
                                    className="block text-center font-semibold text-sm sm:text-base tabular-nums"
                                    aria-live="polite"
                                    aria-atomic="true"
                                    role="status"
                                >
                                    {item.quantity}
                                </span>
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 sm:h-9 sm:w-9 rounded-full border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                                onClick={handleIncrement}
                                disabled={isLoading}
                                aria-label="Increase quantity"
                            >
                                <Plus className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </article>
        )
    }
)

CartItemRow.displayName = "CartItemRow"

export default CartItemRow