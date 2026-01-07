"use client"

import {useCallback, useTransition} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {Loader2} from "lucide-react"
import {toast} from "sonner"
import TextInputField from "@/components/field/TextInputField"
import addressService from "@/Service/address.service"
import {useQueryClient} from "@tanstack/react-query"

const addressSchema = z.object({
    address: z.string().min(5, "Address must be at least 5 characters"),
    label: z.string().min(2, "Label must be at least 2 characters"),
    latitude: z.string().regex(/^-?\d+(\.\d+)?$/, "Invalid latitude format"),
    longitude: z.string().regex(/^-?\d+(\.\d+)?$/, "Invalid longitude format"),
})

type AddressFormValues = z.infer<typeof addressSchema>

interface AddressFormModalProps {
    isOpen: boolean
    onClose: () => void
    mode?: "create" | "update"
    addressId?: number
    initialData?: Partial<AddressFormValues>
}

export default function AddressFormModal({
                                             isOpen,
                                             onClose,
                                             mode = "create",
                                             addressId,
                                             initialData,
                                         }: AddressFormModalProps) {
    const [isPending, startTransition] = useTransition()
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: initialData || {
            address: "",
            label: "",
            latitude: "",
            longitude: "",
        },
    })

    const handleClose = useCallback(() => {
        if (!isPending) {
            reset()
            onClose()
        }
    }, [isPending, reset, onClose])

    const onSubmit = useCallback(
        (data: AddressFormValues) => {
            startTransition(async () => {
                try {
                    if (mode === "create") {
                        const response = await addressService.createAddress(data)
                        toast.success(response?.message || "Address created successfully")
                    } else {
                        const response = await addressService.updateAddress(data, Number(addressId))
                        toast.success(response?.message || "Address updated successfully")
                    }

                    await queryClient.invalidateQueries({queryKey: ["address"]})
                    handleClose()
                } catch (error: any) {
                    toast.error(error?.message || `Failed to ${mode} address`)
                }
            })
        },
        [mode, addressId, queryClient, handleClose]
    )

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl">
                        {mode === "create" ? "Add New Address" : "Update Address"}
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base">
                        {mode === "create"
                            ? "Fill in the details to add a new delivery address"
                            : "Update your delivery address information"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <TextInputField
                        label="Label"
                        placeholder="Home, Office, etc."
                        error={errors.label?.message}
                        disabled={isPending}
                        {...register("label")}
                    />

                    <TextInputField
                        label="Address"
                        placeholder="Street address, apartment, suite, etc."
                        textarea
                        error={errors.address?.message}
                        disabled={isPending}
                        {...register("address")}
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextInputField
                            label="Latitude"
                            placeholder="27.7172"
                            error={errors.latitude?.message}
                            disabled={isPending}
                            {...register("latitude")}
                        />

                        <TextInputField
                            label="Longitude"
                            placeholder="85.3240"
                            error={errors.longitude?.message}
                            disabled={isPending}
                            {...register("longitude")}
                        />
                    </div>

                    <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isPending}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full sm:w-auto"
                            aria-busy={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true"/>
                                    {mode === "create" ? "Adding..." : "Updating..."}
                                </>
                            ) : (
                                <>{mode === "create" ? "Add Address" : "Update Address"}</>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}