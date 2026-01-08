"use client"

import type React from "react"

import Image from "next/image"
import { useCategories } from "@/hooks/useCategories"
import { useRouter } from "next/navigation"
import { useCallback, useRef, useEffect } from "react"
import { motion } from "framer-motion"

export function CategoryList() {
    const { categories, isLoading: isLoadingCats } = useCategories()
    const router = useRouter()
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const animationFrameRef = useRef<number | null>(null)
    const isHoveredRef = useRef(false)
    const scrollSpeedRef = useRef(0.8)

    const handleClick = useCallback(
        (slug: string) => {
            router.push(`/products?category=${slug}`)
        },
        [router],
    )

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent, slug: string) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleClick(slug)
            }
        },
        [handleClick],
    )

    const duplicatedCategories = categories.length > 0 ? [...categories, ...categories, ...categories] : []

    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container || isLoadingCats || categories.length === 0) return

        let isScrolling = false

        const startAutoScroll = () => {
            let lastTime = performance.now()

            const animate = (currentTime: number) => {
                if (isHoveredRef.current) {
                    lastTime = currentTime
                    animationFrameRef.current = requestAnimationFrame(animate)
                    return
                }

                const deltaTime = (currentTime - lastTime) / 16.67 // Normalize to 60fps
                lastTime = currentTime

                container.scrollLeft += scrollSpeedRef.current * deltaTime

                // Calculate reset point based on single category set width
                const singleSetWidth = container.scrollWidth / 3
                if (container.scrollLeft >= singleSetWidth) {
                    container.scrollLeft = 0
                }

                animationFrameRef.current = requestAnimationFrame(animate)
            }

            animationFrameRef.current = requestAnimationFrame(animate)
        }

        const handleMouseEnter = () => {
            isHoveredRef.current = true
        }

        const handleMouseLeave = () => {
            isHoveredRef.current = false
        }

        container.addEventListener("mouseenter", handleMouseEnter)
        container.addEventListener("mouseleave", handleMouseLeave)

        // Start scroll after initial animation completes
        const timeout = setTimeout(() => {
            isScrolling = true
            startAutoScroll()
        }, 1500)

        return () => {
            clearTimeout(timeout)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            container.removeEventListener("mouseenter", handleMouseEnter)
            container.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [isLoadingCats, categories.length])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.06,
                delayChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.85 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
            },
        },
    }

    return (
        <section
            className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white"
            aria-labelledby="category-heading"
        >
            <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
                <motion.h2
                    id="category-heading"
                    className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-10 md:mb-12 tracking-tight"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <span className="text-blue-900">SHOP</span> <span className="text-gray-800">BY CATEGORY</span>
                </motion.h2>

                {isLoadingCats ? (
                    <div
                        className="flex gap-3 sm:gap-4 md:gap-6 lg:gap-8 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-2 sm:px-4"
                        role="status"
                        aria-label="Loading categories"
                    >
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 sm:gap-3 animate-pulse flex-shrink-0 snap-start">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-gray-200" />
                                <div className="w-16 h-3 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : categories.length === 0 ? (
                    <motion.p
                        className="text-center text-gray-500 text-base sm:text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        No categories available
                    </motion.p>
                ) : (
                    <>
                        <motion.div
                            ref={scrollContainerRef}
                            className="flex gap-3 sm:gap-4 md:gap-6 lg:gap-8 overflow-x-auto pb-4 sm:pb-6 scrollbar-hide px-2 sm:px-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {duplicatedCategories.map((cat, index) => (
                                <motion.div
                                    key={`${cat.slug}-${index}`}
                                    data-category-item
                                    className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3 cursor-pointer group flex-shrink-0"
                                    onClick={() => handleClick(cat.slug)}
                                    onKeyDown={(e) => handleKeyDown(e, cat.slug)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Browse ${cat.name} products`}
                                    variants={itemVariants as any}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.93 }}
                                >
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-2 border-gray-200 group-hover:border-blue-400 group-focus:border-blue-500 group-focus:ring-4 group-focus:ring-blue-200 transition-all duration-300 p-1 sm:p-1.5 flex-shrink-0 bg-white shadow-md group-hover:shadow-lg">
                                        <Image
                                            src={cat.image || "/placeholder.svg"}
                                            alt=""
                                            width={112}
                                            height={112}
                                            className="rounded-full object-cover w-full h-full"
                                            loading="lazy"
                                            quality={85}
                                            sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                                        />
                                    </div>
                                    <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-700 group-hover:text-blue-900 text-center max-w-[90px] sm:max-w-[110px] md:max-w-[130px] leading-tight line-clamp-2 transition-colors duration-200">
                    {cat.name}
                  </span>
                                </motion.div>
                            ))}
                        </motion.div>

                        <div className="flex justify-center mt-3 md:hidden">
                            <motion.div
                                className="text-xs text-gray-400 flex items-center gap-1"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                                <span>←</span> Scroll to explore <span>→</span>
                            </motion.div>
                        </div>
                    </>
                )}
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    )
}
