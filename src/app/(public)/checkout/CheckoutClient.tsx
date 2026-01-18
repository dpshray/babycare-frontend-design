"use client"

import {useCallback, useEffect, useMemo, useState, useTransition} from "react"
import {useRouter, useSearchParams} from "next/navigation"
import {useQuery} from "@tanstack/react-query"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {Loader2, Plus} from "lucide-react"
import {toast} from "sonner"
import cartService from "@/Service/cart.service"
import addressService from "@/Service/address.service"
import orderService from "@/Service/order.service"
import {CartItem} from "@/components/cart/CartItem"
import CheckOutItemCard from "@/components/checkout/CheckOutitem"
import AddressFormModal from "@/app/(public)/checkout/AddressFormPage"
import TextInputField from "@/components/field/TextInputField"
import SummaryCard from "@/components/checkout/SummaryCard"
import {AddressCard} from "@/components/address/AddressCard"
import { CartPageSkeleton } from "@/components/skeleton/CartPageSkeleton"

interface Address {
    id: string
    label: string
    address: string
    city: string
    province: string
    postal_code?: string
    latitude?: string
    longitude?: string
}

const billingSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    code: z.string().optional(),
})

type BillingFormValues = z.infer<typeof billingSchema>

export default function CheckoutPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [checkoutItemUuids, setCheckoutItemUuids] = useState<string[]>([])
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
    const quantity = searchParams.get("quantity")
    const isBuyNow = Boolean(quantity);

    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm<BillingFormValues>({
        resolver: zodResolver(billingSchema),
        defaultValues: {
            name: "",
            mobile: "",
            email: "",
            address: "",
            latitude: "",
            longitude: "",
            code: "",
        },
    })

    useEffect(() => {
        const paramItems = searchParams.getAll("items")
        if (paramItems.length === 0) {
            toast.error("No items selected for checkout")
            router.back()
            return
        }
        setCheckoutItemUuids(paramItems)
    }, [searchParams, router])

    // const {data, isLoading} = useQuery({
    //     queryKey: ["checkout-items", checkoutItemUuids],
    //     queryFn: () => cartService.getCartDetails(checkoutItemUuids),
    //     enabled: checkoutItemUuids.length > 0,
    // })
    // const { data, isLoading } = useQuery({
    //     queryKey: ["checkout-items", checkoutItemUuids, quantity],
    //     queryFn: () => {
    //         const payload = checkoutItemUuids.map((uuid) => ({
    //             uuid,
    //             quantity: Number(quantity) ?? 1, 
    //         }));

    //         return cartService.getCartDetails(payload);
    //     },
    //     enabled: checkoutItemUuids.length > 0,
    // });

    const { data, isLoading } = useQuery({
        queryKey: ["checkout-items", checkoutItemUuids, quantity],
        queryFn: () => {
            
            if (!isBuyNow) {
                return cartService.getCartDetails(checkoutItemUuids);
            }

            const payload = checkoutItemUuids.map((uuid) => ({
                uuid,
                quantity: Number(quantity) || 1,
            }));

            return cartService.getCartDetails(payload);
        },
        enabled: checkoutItemUuids.length > 0,
    });

    const {data: addressData, isLoading: addressLoading} = useQuery({
        queryKey: ["address"],
        queryFn: () => addressService.getAllAddress(),
    })

    const addresses = useMemo(() => addressData?.data || [], [addressData])
    const orderItems = useMemo(() => data?.data?.cart_items || [], [data])

    useEffect(() => {
        if (selectedAddress) {
            setValue("address", selectedAddress.address)
            setValue("latitude", selectedAddress.latitude)
            setValue("longitude", selectedAddress.longitude)

        }
    }, [selectedAddress, setValue])

    const orderSummary = useMemo(() => {
        const subtotal = orderItems.reduce((sum: number, item: CartItem) => {
            return sum + (item.price ?? 0) * (item.quantity ?? 1)
        }, 0)
        const shipping = 0
        const total = subtotal + shipping
        return {subtotal, shipping, total}
    }, [orderItems])

    const handleAddressSelect = useCallback((address: Address) => {
        setSelectedAddress(address)
    }, [])

    const handleOpenAddressModal = useCallback(() => {
        setIsAddressModalOpen(true)
    }, [])

    const handleCloseAddressModal = useCallback(() => {
        setIsAddressModalOpen(false)
    }, [])

    const onSubmit = useCallback((data: BillingFormValues) => {
        if (!orderItems || orderItems.length === 0) {
            toast.error("No items to checkout")
            return
        }

        startTransition(async () => {
            const products = orderItems.map((item: CartItem) => ({
                product_slug: item.item_slug,
                quantity: item.quantity,
            }))

            await orderService.createOrder({
                ...data,
                products,
                payment_method: "Cash on Delivery",
            }).then((response) => {
                toast.success(response?.message || "Order placed successfully")
                router.push("/order/order-success")
            }).catch((error) => {
                toast.error(error?.message || "Order failed")
            })
        })
    }, [orderItems, router])

    if (isLoading) {
        return <CartPageSkeleton />
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:py-8">
                <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">Checkout</h1>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-8">
                        <section className="space-y-4 sm:space-y-6 lg:col-span-7">
                            <article className="space-y-4 rounded-lg bg-card p-4 shadow-sm sm:p-6">
                                <h2 className="text-lg font-semibold sm:text-xl">Order Items</h2>
                                <Separator/>
                                <div className="space-y-3">
                                    {orderItems.map((item: CartItem) => (
                                        <CheckOutItemCard key={item.item_uuid} item={item}/>
                                    ))}
                                </div>
                            </article>

                            <article className="space-y-4 rounded-lg bg-card p-4 shadow-sm sm:p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold sm:text-xl">Delivery Address</h2>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleOpenAddressModal}
                                        className="gap-2"
                                        aria-label="Add new address"
                                    >
                                        <Plus className="h-4 w-4" aria-hidden="true"/>
                                        <span className="hidden sm:inline">Add New</span>
                                    </Button>
                                </div>
                                <Separator/>

                                {addressLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
                                    </div>
                                ) : addresses.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <p className="text-sm text-muted-foreground mb-4">
                                            No saved addresses found
                                        </p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleOpenAddressModal}
                                        >
                                            Add Your First Address
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                                        {addresses.map((address: Address) => (
                                            <AddressCard
                                                key={address.id}
                                                address={address}
                                                isSelected={selectedAddress?.id === address.id}
                                                onSelectAction={handleAddressSelect}
                                            />
                                        ))}
                                    </div>
                                )}
                            </article>

                            <article className="space-y-4 rounded-lg bg-card p-4 shadow-sm sm:p-6">
                                <h2 className="text-lg font-semibold sm:text-xl">Billing Details</h2>
                                <Separator/>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <TextInputField
                                        label="Full Name"
                                        placeholder="John Doe"
                                        error={errors.name?.message}
                                        {...register("name")}
                                    />

                                    <TextInputField
                                        label="Mobile Number"
                                        placeholder="9876543210"
                                        error={errors.mobile?.message}
                                        {...register("mobile")}
                                    />

                                    <div className="sm:col-span-2">
                                        <TextInputField
                                            label="Email"
                                            placeholder="john@example.com"
                                            type="email"
                                            error={errors.email?.message}
                                            {...register("email")}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <TextInputField
                                            label="Address"
                                            placeholder="Street address, apartment, suite, unit, etc."
                                            textarea
                                            error={errors.address?.message}
                                            {...register("address")}
                                        />
                                    </div>

                                    <TextInputField
                                        label="Latitude (Optional)"
                                        placeholder="27.7172"
                                        error={errors.latitude?.message}
                                        {...register("latitude")}
                                    />

                                    <TextInputField
                                        label="Longitude (Optional)"
                                        placeholder="85.3240"
                                        error={errors.longitude?.message}
                                        {...register("longitude")}
                                    />

                                    <div className="sm:col-span-2">
                                        <TextInputField
                                            label="Promo Code "
                                            placeholder="Promo or reference code"
                                            error={errors.code?.message}
                                            {...register("code")}
                                        />
                                    </div>
                                </div>
                            </article>

                            <Button
                                type="submit"
                                className="w-full lg:hidden"
                                size="lg"
                                disabled={isPending || orderItems.length === 0}
                                aria-busy={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Placing Order...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </Button>
                        </section>

                        <aside className="lg:col-span-5">
                            <SummaryCard
                                orderItems={orderItems}
                                shipping={orderSummary.shipping}
                                isPending={isPending}
                                onPlaceOrder={handleSubmit(onSubmit)}
                            />
                        </aside>
                    </div>
                </form>
            </div>

            <AddressFormModal
                mode="create"
                isOpen={isAddressModalOpen}
                onClose={handleCloseAddressModal}
            />
        </main>
    )
}