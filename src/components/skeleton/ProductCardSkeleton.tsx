import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
    return (
        <div className="rounded-lg border bg-white p-3 space-y-3">
        {/* Image */}
        <Skeleton className="h-40 w-full rounded-md" />

        {/* Title */}
        <Skeleton className="h-4 w-3/4" />

        {/* Price */}
        <Skeleton className="h-4 w-1/2" />

        {/* Button */}
        <Skeleton className="h-9 w-full rounded-md" />
        </div>
    );
}
