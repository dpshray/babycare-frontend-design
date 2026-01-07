'use client'

export default function BlogSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-pulse">
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className="bg-card border-2 border-border rounded-lg overflow-hidden"
                >
                    <div className="w-full h-48 sm:h-56 bg-muted" />
                    <div className="p-4 sm:p-5">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}
