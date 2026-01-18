import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function CartPageSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-7xl space-y-8">

        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">

            {/* Select all */}
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-48" />
            </div>

            {/* Cart rows */}
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex gap-4">

                  {/* Image */}
                  <Skeleton className="h-20 w-20 rounded-md" />

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>

                  {/* Price & action */}
                  <div className="flex flex-col items-end gap-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <aside className="lg:col-span-4">
            <Card className="p-6 space-y-4">
              <Skeleton className="h-6 w-40" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>

              <Skeleton className="h-px w-full" />

              <Skeleton className="h-10 w-full rounded-md" />
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
}
