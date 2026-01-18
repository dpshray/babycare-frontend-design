'use client'

import { useQuery } from "@tanstack/react-query"
import { Loader2, MapPin, Phone, Clock, ExternalLink } from "lucide-react"
import { useCallback, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import babyService from "@/Service/babay.service"
import { QUERY_STALE_TIME } from "@/config/app-constant"
import CustomPagination from "@/components/Custom-Pagination"
import { HospitalCardSkeleton } from "@/components/skeleton/HospitalCardSkeleton"

interface Hospital {
    id: number
    name: string
    address: string
    phone: string
    map_url: string
    open_hour: string
}

interface PaginatedHospitalResponse {
    data: Hospital[]
    current_page: number
    last_page: number
    total: number
}

export default function HealthCenter() {
    const [currentPage, setCurrentPage] = useState(1)

    const { data, isLoading, error } = useQuery<PaginatedHospitalResponse>({
        queryKey: ['health-center', currentPage],
        queryFn: async () => {
            const params = { page: currentPage, per_page: 10 }
            const res = await babyService.getAllHospital(params)
            return res.data
        },
        staleTime: QUERY_STALE_TIME,
        retry: 2,
    })

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="max-w-md w-full text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10">
                        <MapPin className="w-10 h-10 text-destructive" />
                    </div>
                    <h1 className="text-2xl font-bold">Failed to Load Health Centers</h1>
                    <p className="text-muted-foreground">
                        Unable to retrieve health centers. Please try again later.
                    </p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </main>
        )
    }

    const hospitals = data?.data ?? []
    const totalPages = data?.last_page ?? 1

    return (
        <main className="min-h-screen bg-background">
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <header className="mb-10">
                    <h1 className="text-4xl font-bold mb-3">Health Centers</h1>
                    <p className="text-muted-foreground">
                        Find nearby hospitals and health centers for maternal and child care
                    </p>
                    {data?.total && (
                        <p className="mt-2 text-muted-foreground">
                            <span className="font-semibold text-primary">{data.total}</span> health centers available
                        </p>
                    )}
                </header>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <HospitalCardSkeleton key={i} />
                        ))}
                    </div>
                ) : hospitals.length === 0 ? (
                    <div className="flex flex-col items-center py-16 text-center">
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                            <MapPin className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No Health Centers Found</h2>
                        <p className="text-muted-foreground">
                            There are no health centers available at the moment.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                            {hospitals.map((hospital) => (
                                <Card
                                    key={hospital.id}
                                    className="hover:shadow-lg transition-all"
                                >
                                    <CardHeader>
                                        <h3 className="text-xl font-bold line-clamp-2">
                                            {hospital.name}
                                        </h3>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                                <p className="text-sm">{hospital.address}</p>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Phone className="w-5 h-5 text-primary mt-0.5" />
                                                <a
                                                    href={`tel:${hospital.phone}`}
                                                    className="text-sm hover:text-primary"
                                                >
                                                    {hospital.phone}
                                                </a>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <Clock className="w-5 h-5 text-primary mt-0.5" />
                                                <p className="text-sm">{hospital.open_hour}</p>
                                            </div>
                                        </div>

                                        <Separator />

                                        <Button asChild variant="outline" size="sm" className="w-full gap-2">
                                            <Link
                                                href={hospital.map_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <MapPin className="w-4 h-4" />
                                                View on Map
                                                <ExternalLink className="w-3 h-3 ml-auto" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center">
                                <CustomPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChangeAction={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    )
}
