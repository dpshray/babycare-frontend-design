import { Card, CardContent, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export default function InfantGrowthChartSkeleton() {
    return (
        <Card className="shadow-md border border-gray-200 rounded-2xl">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between flex-wrap gap-2">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5 rounded-md" />
                            <Skeleton className="h-5 w-40" />
                        </div>
                        <Skeleton className="h-3 w-64" />
                    </div>
                    <Skeleton className="h-6 w-44 rounded-full" />
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                {/* Y-axis + chart area */}
                <div className="flex gap-2 h-[320px]">
                    {/* Y-axis labels */}
                    <div className="flex flex-col justify-between py-2 w-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-3 w-6" />
                        ))}
                    </div>
                    {/* Chart lines skeleton */}
                    <div className="flex-1 relative">
                        <div className="absolute inset-0 flex flex-col justify-between py-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className="h-px w-full opacity-40" />
                            ))}
                        </div>
                    </div>
                </div>
                {/* X-axis labels */}
                <div className="flex justify-between mt-2 pl-10 pr-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} className="h-3 w-4" />
                    ))}
                </div>
                {/* Legend */}
                <div className="flex gap-4 mt-4 justify-center">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                            <Skeleton className="w-2 h-2 rounded-full" />
                            <Skeleton className="h-3 w-12" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}