import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function HospitalCardSkeleton() {
    return (
        <Card className="animate-pulse">
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-full" />
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Open hours */}
                <div className="flex items-start gap-3">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

                {/* Divider */}
                <Skeleton className="h-px w-full" />

                {/* Button */}
                <Skeleton className="h-9 w-full rounded-md" />
            </CardContent>
        </Card>
    )
}
