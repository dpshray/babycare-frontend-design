import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function VaccinePageSkeleton() {
    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl space-y-8">
                {/* Page Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="space-y-2">
                        <Skeleton className="h-7 w-72" />
                        <Skeleton className="h-4 w-96" />
                        </div>
                    </div>
                    <Skeleton className="h-px w-full" />
                </div>

                {/* Info Alert Skeleton */}
                <div className="p-6 rounded-lg border space-y-3">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>

                {/* Vaccine Cards Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} className="border-2">
                            <CardHeader className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>

                            <CardContent className="space-y-5">
                                {/* Vaccines */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <div className="flex gap-2 flex-wrap">
                                        <Skeleton className="h-5 w-14 rounded-full" />
                                        <Skeleton className="h-5 w-16 rounded-full" />
                                        <Skeleton className="h-5 w-12 rounded-full" />
                                    </div>
                                </div>

                                <Skeleton className="h-px w-full" />

                                {/* Injection Site */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-4 w-40 ml-6" />
                                </div>

                                <Skeleton className="h-px w-full" />

                                {/* Diseases */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <div className="flex gap-2 flex-wrap">
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                        <Skeleton className="h-5 w-24 rounded-full" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    )
}
