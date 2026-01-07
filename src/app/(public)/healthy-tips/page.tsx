'use client'

import { useQuery } from "@tanstack/react-query"
import babyService from "@/Service/babay.service"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import CustomPagination from "@/components/Custom-Pagination"
import { AlertCircle, BookOpen, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { QUERY_STALE_TIME } from "@/config/app-constant"
import BlogSkeleton from "../vaccination-schedule/loading"
import { useDebounce } from "@/hooks/useDebounce"

interface BlogItem {
    title: string
    slug: string
    image: string
}

interface BlogResponseData {
    items: BlogItem[]
    page: number
    total_page: number
    total_items: number
}

interface BlogResponse {
    status: boolean
    data: BlogResponseData
    message: string
}

export default function HealthyTips() {
    const router = useRouter()
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const perPage = 9
    const debouncedSearch = useDebounce(search, 500)

    const { data, isLoading, error, refetch } = useQuery<BlogResponse>({
        queryKey: ["healthy-tips", currentPage, debouncedSearch],
        queryFn: async () => babyService.getHealthyTips({
            page: currentPage,
            per_page: perPage,
            search: debouncedSearch.trim(),
        }),
        staleTime: QUERY_STALE_TIME,
        retry: 2,
    })

    const healthyTips = useMemo(() => data?.data?.items || [], [data])
    const totalPages = useMemo(() => data?.data?.total_page || 0, [data])
    const totalItems = useMemo(() => data?.data?.total_items || 0, [data])

    useEffect(() => { if (debouncedSearch !== search) setCurrentPage(1) }, [debouncedSearch, search])

    const handlePageChange = useCallback((page: number) => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])
    const handleSearchKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') setCurrentPage(1) }, [])
    const handleTipClick = useCallback((slug: string) => router.push(`/healthy-tips/${slug}`), [router])
    const handleClearSearch = useCallback(() => { setSearch(""); setCurrentPage(1) }, [])

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-destructive/10 mb-4">
                        <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-destructive" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">Failed to Load Tips</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Unable to retrieve healthy tips at this time</p>
                    <Button size="lg" onClick={() => refetch()} className="w-full sm:w-auto">Try Again</Button>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl">
                <div className="mb-8 sm:mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
                            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Healthy Tips for Your Baby</h1>
                            <p className="text-sm sm:text-base text-muted-foreground mt-1">Expert advice and guidance for your child&#39;s health</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search healthy tips..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyPress={handleSearchKeyPress}
                                className="pl-10 h-11"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {!isLoading && totalItems > 0 && (
                        <p className="text-sm text-muted-foreground mt-4">
                            Showing {healthyTips.length} of {totalItems} tips
                        </p>
                    )}

                    <Separator className="mt-4" />
                </div>

                {isLoading ? (
                    <BlogSkeleton count={perPage} />
                ) : healthyTips.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {healthyTips.map((tip) => (
                                <article
                                    key={tip.slug}
                                    className="group bg-card border-2 border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer flex flex-col"
                                >
                                    <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-muted">
                                        <Image
                                            src={tip.image || "/placeholder.svg"}
                                            alt={tip.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            loading="lazy"
                                            quality={75}
                                        />
                                    </div>
                                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                                        <h3 className="text-base sm:text-lg font-semibold text-foreground line-clamp-3 group-hover:text-primary transition-colors mb-4">
                                            {tip.title}
                                        </h3>
                                        <Button className="w-full mt-auto" variant="outline" onClick={() => handleTipClick(tip.slug)}>
                                            Read More
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-8 sm:mt-10 flex justify-center">
                                <CustomPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChangeAction={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted mb-6">
                            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">No Tips Found</h2>
                        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-md px-4">
                            {search.trim() ? `No results found for "${search}". Try a different search term.` : "No healthy tips available at the moment."}
                        </p>
                        {search.trim() && <Button variant="outline" className="mt-6" onClick={handleClearSearch}>Clear Search</Button>}
                    </div>
                )}
            </div>
        </main>
    )
}
