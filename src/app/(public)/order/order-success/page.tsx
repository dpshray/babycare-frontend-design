'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Package, ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function OrderSuccessPage() {
    const router = useRouter()

    return (
        <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
            <div className="w-full max-w-2xl text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mb-6 flex justify-center"
                >
                    <div className="relative">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 rounded-full bg-green-400"
                        />
                        <CheckCircle2 className="relative h-20 w-20 text-green-500 sm:h-24 sm:w-24" aria-hidden="true" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="relative inline-block">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                            Order Placed Successfully!
                        </h1>
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute -right-8 -top-2 sm:-right-12"
                        >
                            <Sparkles className="h-6 w-6 text-yellow-500 sm:h-8 sm:w-8" aria-hidden="true" />
                        </motion.div>
                    </div>
                    <p className="mx-auto max-w-lg text-base text-muted-foreground sm:text-lg">
                        Thank you for your order. We&#39;ve received your order and will start processing it right away.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 rounded-lg border bg-card p-6 shadow-lg sm:p-8"
                >
                    <div className="mb-6 flex items-center justify-center gap-3">
                        <Package className="h-6 w-6 text-primary" aria-hidden="true" />
                        <h2 className="text-lg font-semibold sm:text-xl">What&#39;s Next?</h2>
                    </div>
                    <ul className="space-y-4 text-left text-sm sm:text-base">
                        {[
                            "You'll receive an email confirmation shortly with your order details",
                            "We'll notify you when your order is being prepared for delivery",
                            "Track your order status anytime from your orders page"
                        ].map((text, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="flex items-start gap-3"
                            >
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                    {index + 1}
                                </span>
                                <span className="text-muted-foreground">{text}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
                >
                    <Button
                        onClick={() => router.push('/order')}
                        size="lg"
                        className="w-full sm:w-auto"
                    >
                        <Package className="mr-2 h-5 w-5" aria-hidden="true" />
                        View My Orders
                    </Button>
                    <Button
                        onClick={() => router.push('/products')}
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto"
                    >
                        Continue Shopping
                        <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                    </Button>
                </motion.div>
            </div>
        </main>
    )
}