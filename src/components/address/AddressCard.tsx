"use client"

import {Edit, MapPin, Trash} from "lucide-react"
import {memo, useState} from "react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {toast} from "sonner"
import addressService from "@/Service/address.service"
import AddressFormModal from "@/app/(public)/checkout/AddressFormPage"
import ActionModal from "@/components/ActionModal"

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

interface AddressCardProps {
    address: Address
    isSelected: boolean
    onSelectAction: (address: Address) => void
}

export const AddressCard = memo(function AddressCard({
                                                         address,
                                                         isSelected,
                                                         onSelectAction,
                                                     }: AddressCardProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: () => addressService.deleteAddress(Number(address.id)),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["address"]})
            toast.success("Address deleted successfully")
            setIsDeleteModalOpen(false)
        },
        onError: (error: any) => {
            toast.error(error?.message || "Failed to delete address")
        },
    })

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsEditModalOpen(true)
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = () => {
        deleteMutation.mutate()
    }

    return (
        <>
            <button
                type="button"
                onClick={() => onSelectAction(address)}
                className={cn(
                    "group relative rounded-lg p-4 text-left transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full",
                    isSelected
                        ? "bg-primary/10 shadow-md ring-2 ring-primary"
                        : "bg-muted hover:bg-muted/80"
                )}
                aria-pressed={isSelected}
                aria-label={`Select ${address.label} address`}
            >
                <div className="flex items-start gap-3">
                    <MapPin
                        className={cn(
                            "mt-0.5 h-5 w-5 flex-shrink-0",
                            isSelected ? "text-primary" : "text-muted-foreground"
                        )}
                        aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1 pr-16 sm:pr-20">
                        <p className="mb-1 truncate text-sm font-semibold sm:text-base">
                            {address.label}
                        </p>
                        <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                            {address.address}
                        </p>
                        {(address.city || address.province || address.postal_code) && (
                            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                                {[address.city, address.province, address.postal_code]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>
                        )}
                    </div>

                    <div className="absolute right-2 top-2 flex gap-1 sm:right-3 sm:top-3 sm:gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 sm:h-9 sm:w-9"
                            onClick={handleEdit}
                            aria-label={`Edit ${address.label} address`}
                        >
                            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground"/>
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 sm:h-9 sm:w-9"
                            onClick={handleDelete}
                            aria-label={`Delete ${address.label} address`}
                        >
                            <Trash className="h-4 w-4 text-destructive hover:text-destructive/80"/>
                        </Button>
                    </div>
                </div>
            </button>

            <AddressFormModal
                mode="update"
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                addressId={Number(address.id)}
                initialData={{
                    label: address.label,
                    address: address.address,
                    latitude: address.latitude || "",
                    longitude: address.longitude || "",
                }}
            />

            <ActionModal
                open={isDeleteModalOpen}
                setOpen={setIsDeleteModalOpen}
                title="Delete Address"
                description="Are you sure you want to delete this address? This action cannot be undone."
                confirmLabel="Delete"
                confirmVariant="destructive"
                loading={deleteMutation.isPending}
                onConfirm={handleConfirmDelete}
            />
        </>
    )
})