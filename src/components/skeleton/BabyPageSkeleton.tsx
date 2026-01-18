'use client'

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function BabyPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>

          <Skeleton className="h-11 w-full sm:w-40 rounded-md" />
        </div>

        {/* Baby Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4 space-y-4">
                
                {/* Image */}
                <Skeleton className="h-40 w-full rounded-lg" />

                {/* Name */}
                <Skeleton className="h-5 w-2/3" />

                {/* DOB */}
                <Skeleton className="h-4 w-1/2" />

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-9 w-full rounded-md" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
