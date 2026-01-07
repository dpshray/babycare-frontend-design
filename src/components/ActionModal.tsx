'use client'

import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import {Button} from '@/components/ui/button'
import {Loader2} from 'lucide-react'
import {cn} from '@/lib/utils'
import {useCallback} from 'react'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'

interface ActionModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
    confirmVariant?: ButtonVariant
    onConfirm: () => void
    onCancel?: () => void
    buttonClassName?: string
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl'
} as const

export default function ActionModal({
                                        open,
                                        setOpen,
                                        title,
                                        description,
                                        confirmLabel = 'Confirm',
                                        cancelLabel = 'Cancel',
                                        loading = false,
                                        confirmVariant = 'destructive',
                                        onConfirm,
                                        onCancel,
                                        buttonClassName,
                                        maxWidth = 'md'
                                    }: ActionModalProps) {
    const handleCancel = useCallback(() => {
        if (!loading) {
            onCancel?.()
            setOpen(false)
        }
    }, [loading, onCancel, setOpen])

    const handleConfirm = useCallback(() => {
        if (!loading) {
            onConfirm()
        }
    }, [loading, onConfirm])

    const handleOpenChange = useCallback(
        (newOpen: boolean) => {
            if (!loading) {
                setOpen(newOpen)
            }
        },
        [loading, setOpen]
    )

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className={cn(
                    'w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] mx-auto',
                    maxWidthClasses[maxWidth]
                )}
                aria-describedby="action-modal-description"
            >
                <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg font-semibold">
                        {title}
                    </DialogTitle>
                    <DialogDescription
                        id="action-modal-description"
                        className="text-sm sm:text-base text-gray-600"
                    >
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                        className="w-full sm:w-auto"
                        aria-label={cancelLabel}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        type="button"
                        variant={confirmVariant}
                        onClick={handleConfirm}
                        disabled={loading}
                        className={cn(
                            'w-full sm:w-auto',
                            loading && 'cursor-not-allowed',
                            buttonClassName
                        )}
                        aria-label={loading ? 'Processing' : confirmLabel}
                    >
                        {loading && (
                            <Loader2
                                className="h-4 w-4 animate-spin mr-2"
                                aria-hidden="true"
                            />
                        )}
                        {loading ? 'Processing...' : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}