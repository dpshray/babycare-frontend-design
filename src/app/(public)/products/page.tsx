"use client"

import {Suspense, useCallback, useMemo, useState} from "react"
import {useProducts} from "@/hooks/useProduct"
import {useCategories} from "@/hooks/useCategories"
import {useBrands} from "@/hooks/useBrand"
import {Button} from "@/components/ui/button"
import {Filter, Search, X} from "lucide-react"
import {Input} from "@/components/ui/input"
import {Checkbox} from "@/components/ui/checkbox"
import {Label} from "@/components/ui/label"
import {Skeleton} from "@/components/ui/skeleton"
import CustomPagination from "@/components/Custom-Pagination"
import ProductCard from "@/components/product/ProductCard"
import {cn} from "@/lib/utils"
import {useSearchParams} from "next/navigation"

const FilterSkeleton = ({count = 4}: { count?: number }) => (
    <div className="space-y-3">
        {Array.from({length: count}).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded"/>
                <Skeleton className="h-4 flex-1"/>
            </div>
        ))}
    </div>
)

const ProductSkeleton = () => (
    <div className="bg-white rounded-xl border overflow-hidden">
        <Skeleton className="w-full aspect-square"/>
        <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-3/4"/>
            <Skeleton className="h-3 w-1/2"/>
            <Skeleton className="h-5 w-1/3 mt-2"/>
        </div>
    </div>
)

function ProductList() {
    const [page, setPage] = useState(1)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const searchParams = useSearchParams()

    const query = searchParams.get("q") || ""
    const [search, setSearch] = useState(query)

    const {products, isLoading, totalPages} = useProducts({
        page,
        per_page: 12,
        search,
        category_slug: selectedCategory || undefined,
        brand_slug: selectedBrand || undefined,
    })

    const {categories, isLoading: isLoadingCats} = useCategories()
    const {brands, isLoading: isLoadingBrands} = useBrands()

    const hasActiveFilters = useMemo(
        () => !!(selectedCategory || selectedBrand || search),
        [selectedCategory, selectedBrand, search]
    )

    const handleReset = useCallback(() => {
        setSelectedCategory(null)
        setSelectedBrand(null)
        setSearch("")
        setPage(1)
    }, [])

    const handleCategoryChange = useCallback((categoryName: string) => {
        setSelectedCategory((prev) => (prev === categoryName ? null : categoryName))
        setPage(1)
    }, [])

    const handleBrandChange = useCallback((brandName: string) => {
        setSelectedBrand((prev) => (prev === brandName ? null : brandName))
        setPage(1)
    }, [])

    const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
                        onClick={closeSidebar}
                    />
                )}

                <aside
                    className={cn(
                        "lg:w-64 xl:w-72 fixed lg:sticky lg:top-4 z-50 h-full lg:h-[calc(100vh-2rem)] top-0 left-0 w-80 transition-transform duration-300",
                        "bg-white lg:bg-transparent shadow-xl lg:shadow-none",
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    )}
                >
                    <div className="h-full overflow-y-auto p-6 lg:p-0 space-y-6">
                        <div className="flex justify-between items-center lg:hidden mb-4">
                            <h2 className="font-bold text-lg">Filters</h2>
                            <Button variant="ghost" size="icon" onClick={closeSidebar}>
                                <X className="h-5 w-5"/>
                            </Button>
                        </div>

                        <section className="bg-white lg:bg-transparent p-4 lg:p-0 rounded-xl border lg:border-0">
                            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-4">
                                Categories
                            </h3>
                            {isLoadingCats ? (
                                <FilterSkeleton/>
                            ) : (
                                <div className="space-y-3">
                                    {categories.map((cat: any) => (
                                        <div key={cat.slug} className="flex items-center gap-3 group">
                                            <Checkbox
                                                id={`cat-${cat.slug}`}
                                                checked={selectedCategory === cat.name}
                                                onCheckedChange={() => handleCategoryChange(cat.name)}
                                                className={'border-primary hover:border-primary/50'}
                                            />
                                            <Label
                                                htmlFor={`cat-${cat.slug}`}
                                                className="text-sm cursor-pointer group-hover:text-primary transition-colors"
                                            >
                                                {cat.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="bg-white lg:bg-transparent p-4 lg:p-0 rounded-xl border lg:border-0">
                            <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-4">
                                Brands
                            </h3>
                            {isLoadingBrands ? (
                                <FilterSkeleton count={3}/>
                            ) : (
                                <div className="space-y-3">
                                    {brands.map((brand: any) => (
                                        <div key={brand.slug} className="flex items-center gap-3 group">
                                            <Checkbox
                                                id={`brand-${brand.slug}`}
                                                checked={selectedBrand === brand.name}
                                                onCheckedChange={() => handleBrandChange(brand.name)}
                                            />
                                            <Label
                                                htmlFor={`brand-${brand.slug}`}
                                                className="text-sm cursor-pointer group-hover:text-primary transition-colors"
                                            >
                                                {brand.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                                onClick={handleReset}
                            >
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                </aside>

                <div className="flex-1 space-y-6">
                    <div
                        className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                            <Input
                                placeholder="Search products..."
                                className="pl-10 bg-muted/50 border-0"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    setPage(1)
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                className="lg:hidden"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Filter className="mr-2 h-4 w-4"/>
                                Filters
                            </Button>
                            <div className="px-4 py-2 bg-muted/50 rounded-lg">
                                <span className="text-sm font-medium">
                                    {isLoading ? "..." : products.length} Products
                                </span>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div
                            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {Array.from({length: 12}).map((_, i) => (
                                <ProductSkeleton key={i}/>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div
                                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <ProductCard key={product.slug} product={product}/>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <CustomPagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChangeAction={setPage}
                                />
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border">
                            <div
                                className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-8 w-8 text-muted-foreground"/>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                            <p className="text-muted-foreground text-sm mb-4">
                                Try adjusting your search or filters
                            </p>
                            {hasActiveFilters && (
                                <Button onClick={handleReset} variant="link">
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}

export default function ProductPage() {
    return (
        <div className="min-h-screen bg-muted/30">
            <Suspense
                fallback={
                    <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary mx-auto"/>
                    </div>
                }
            >
                <ProductList/>
            </Suspense>
        </div>
    )
}