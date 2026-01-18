import {cn} from "@/lib/utils"
import Image from "next/image"

interface CheckOutItem {
    item_uuid: string
    item_type: "product" | "service" | string
    image: string
    variant_id: number
    quantity: number
    price: number
    subtotal: number
    item_name?: string
}

interface CheckOutItemProps {
    item: CheckOutItem
    className?: string
}

function CheckOutItemCard({item, className}: CheckOutItemProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NP', {
            style: 'currency',
            currency: 'NPR',
            minimumFractionDigits: 0
        }).format(price)
    }

    return (
        <div className={cn(
            "flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors",
            className
        )}>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-md overflow-hidden bg-background">
                <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.item_name || "Product"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 64px, 80px"
                />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
                <h3 className="font-medium text-sm sm:text-base line-clamp-2 text-foreground">
                    {item.item_name || "Product Name"}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                    {item.item_type}
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <span>Qty: {item.quantity}</span>
                    <span>•</span>
                    <span>{formatPrice(item.price)} each</span>
                </div>
            </div>

            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <p className="font-semibold text-sm sm:text-base text-foreground">
                    {formatPrice(item.subtotal)}
                </p>
            </div>
        </div>
    )
}

export default CheckOutItemCard