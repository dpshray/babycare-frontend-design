'use client'

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { AlertCircle, Clock, ExternalLink, LocateFixed, MapPin, Navigation, Phone, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"

export interface Hospital {
    id: number
    name: string
    address: string
    phone: string
    open_hour: string
    latitude: number
    longitude: number
    distance_km: number
    website?: string
}

interface UserLocation {
    lat: number
    lng: number
}

// ─── Haversine distance (km) ──────────────────────────────────────────────────

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ─── Overpass API – fetch real hospitals near coordinates ─────────────────────

async function fetchNearbyHospitals(lat: number, lng: number, radiusMeters = 5000): Promise<Hospital[]> {
    const query = `
        [out:json][timeout:25];
        (
            node["amenity"~"hospital|clinic|doctors|health_centre|pharmacy"](around:${radiusMeters},${lat},${lng});
            way["amenity"~"hospital|clinic|doctors|health_centre|pharmacy"](around:${radiusMeters},${lat},${lng});
        );
        out center tags;
    `
    const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: `data=${encodeURIComponent(query)}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    if (!res.ok) throw new Error("Overpass API error")

    const json = await res.json()

    return (json.elements as any[])
        .map((el): Hospital | null => {
            const elLat = el.lat ?? el.center?.lat
            const elLng = el.lon ?? el.center?.lon
            if (!elLat || !elLng) return null

            const tags = el.tags ?? {}
            const name = tags.name || tags["name:en"] || "Health Center"
            const street = tags["addr:street"] ?? ""
            const city = tags["addr:city"] ?? ""
            const address = [street, city].filter(Boolean).join(", ") || "Address not available"
            const phone = tags.phone || tags["contact:phone"] || ""
            const open_hour = tags.opening_hours || ""
            const website = tags.website || tags["contact:website"] || undefined
            const distance_km = haversine(lat, lng, elLat, elLng)

            return {
                id: el.id,
                name,
                address,
                phone,
                open_hour,
                latitude: elLat,
                longitude: elLng,
                distance_km,
                website,
            }
        })
        .filter((h): h is Hospital => h !== null)
        .sort((a, b) => a.distance_km - b.distance_km)
}

// ─── Dynamic map (SSR-safe) ───────────────────────────────────────────────────

const MapView = dynamic(() => import("@/components/MapView"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-muted/20">
            <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-9 h-9 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground">Loading map…</p>
            </div>
        </div>
    ),
})

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HealthCenter() {
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
    const [hospitals, setHospitals] = useState<Hospital[]>([])
    const [filtered, setFiltered] = useState<Hospital[]>([])
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null)
    const [search, setSearch] = useState("")
    const [isLocating, setIsLocating] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const sidebarRef = useRef<HTMLDivElement>(null)

    // ── Filter hospitals on search ────────────────────────────────────────────
    useEffect(() => {
        if (!search.trim()) { setFiltered(hospitals); return }
        const q = search.toLowerCase()
        setFiltered(
            hospitals.filter(h =>
                h.name.toLowerCase().includes(q) || h.address.toLowerCase().includes(q)
            )
        )
    }, [search, hospitals])

    // ── Scroll selected card into view ────────────────────────────────────────
    useEffect(() => {
        if (!selectedHospital || !sidebarRef.current) return
        const el = sidebarRef.current.querySelector(`[data-id="${selectedHospital.id}"]`)
        el?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, [selectedHospital])

    // ── Fetch hospitals from Overpass ─────────────────────────────────────────
    const loadHospitals = useCallback(async (loc: UserLocation) => {
        setIsFetching(true)
        setFetchError(null)
        try {
            const results = await fetchNearbyHospitals(loc.lat, loc.lng, 5000)
            setHospitals(results)
            setFiltered(results)
        } catch {
            setFetchError("Could not load nearby health centers. Please check your connection and try again.")
        } finally {
            setIsFetching(false)
        }
    }, [])

    // ── Request GPS ───────────────────────────────────────────────────────────
    const requestLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationError("Your browser doesn't support location services.")
            return
        }
        setIsLocating(true)
        setLocationError(null)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                setUserLocation(loc)
                setIsLocating(false)
                loadHospitals(loc)
            },
            (err) => {
                setIsLocating(false)
                if (err.code === err.PERMISSION_DENIED)
                    setLocationError("Location permission denied. Please allow access in your browser settings.")
                else
                    setLocationError("Unable to detect your location. Please try again.")
            },
            { enableHighAccuracy: true, timeout: 12000 }
        )
    }, [loadHospitals])

    useEffect(() => { requestLocation() }, [requestLocation])

    // ─────────────────────────────────────────────────────────────────────────
    // SCREEN: Location gate (permission not yet given or error)
    // ─────────────────────────────────────────────────────────────────────────
    if (!userLocation) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background px-4">
                <Card className="max-w-sm w-full shadow-xl border-0 ring-1 ring-border">
                    <CardContent className="pt-10 pb-8 text-center space-y-6">
                        {/* Animated icon */}
                        <div className="relative mx-auto w-20 h-20">
                            {isLocating && (
                                <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                            )}
                            <div className="relative w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                <LocateFixed className={`w-9 h-9 text-primary ${isLocating ? "animate-pulse" : ""}`} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <h1 className="text-2xl font-bold tracking-tight">
                                {isLocating ? "Detecting your location…" : "Find Health Centers Near You"}
                            </h1>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {isLocating
                                    ? "Hang tight, this only takes a moment."
                                    : "Allow location access so we can show hospitals and clinics closest to you."}
                            </p>
                        </div>

                        {locationError && (
                            <div className="flex items-start gap-2.5 bg-destructive/10 text-destructive rounded-lg p-3.5 text-sm text-left">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <p>{locationError}</p>
                            </div>
                        )}

                        {!isLocating && (
                            <Button onClick={requestLocation} className="w-full gap-2" size="lg">
                                <Navigation className="w-4 h-4" />
                                {locationError ? "Try Again" : "Share My Location"}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </main>
        )
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SCREEN: Main map + sidebar layout
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <main className="h-screen flex flex-col overflow-hidden bg-background">

            {/* Header */}
            <header className="shrink-0 h-14 px-5 border-b flex items-center justify-between gap-4 bg-background z-10">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div className="leading-tight">
                        <p className="font-semibold text-sm">Nearby Health Centers</p>
                        {!isFetching && (
                            <p className="text-xs text-muted-foreground">
                                {filtered.length} found within 5 km
                            </p>
                        )}
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={requestLocation} className="gap-1.5 h-8 text-xs">
                    <LocateFixed className="w-3.5 h-3.5" />
                    Relocate
                </Button>
            </header>

            {/* Map + Sidebar */}
            <div className="flex flex-1 overflow-hidden">

                {/* ── Map ── */}
                <div className="flex-1 relative">
                    <MapView
                        userLocation={userLocation}
                        hospitals={filtered}
                        selectedHospital={selectedHospital}
                        onSelectHospital={setSelectedHospital}
                    />

                    {isFetching && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-20">
                            <div className="bg-background rounded-xl shadow-lg border px-5 py-3 flex items-center gap-3">
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm font-medium">Finding health centers…</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Sidebar ── */}
                <aside className="w-80 xl:w-96 shrink-0 flex flex-col border-l bg-background">

                    {/* Search */}
                    <div className="p-3 border-b shrink-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or area…"
                                className="pl-9 pr-8 h-9 text-sm"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div ref={sidebarRef} className="flex-1 overflow-y-auto">
                        {isFetching ? (
                            <div className="p-3 space-y-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="p-3 rounded-lg border space-y-2">
                                        <Skeleton className="h-3.5 w-2/3" />
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-1/3" />
                                    </div>
                                ))}
                            </div>
                        ) : fetchError ? (
                            <div className="p-6 text-center space-y-3">
                                <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
                                <p className="text-sm text-muted-foreground">{fetchError}</p>
                                <Button size="sm" variant="outline" onClick={() => loadHospitals(userLocation)}>
                                    Retry
                                </Button>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="p-8 text-center space-y-2">
                                <MapPin className="w-8 h-8 text-muted-foreground mx-auto" />
                                <p className="text-sm font-medium">No results found</p>
                                <p className="text-xs text-muted-foreground">Try clearing the search or relocating.</p>
                            </div>
                        ) : (
                            <ul className="divide-y">
                                {filtered.map((hospital) => {
                                    const isSelected = selectedHospital?.id === hospital.id
                                    return (
                                        <li key={hospital.id} data-id={hospital.id}>
                                            <button
                                                onClick={() => setSelectedHospital(hospital)}
                                                className={`w-full text-left px-4 py-3.5 transition-colors hover:bg-muted/40
                                                    ${isSelected
                                                        ? "bg-primary/5 border-l-[3px] border-l-primary"
                                                        : "border-l-[3px] border-l-transparent"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h3 className="text-sm font-semibold leading-snug line-clamp-2">
                                                        {hospital.name}
                                                    </h3>
                                                    <Badge
                                                        variant={hospital.distance_km < 1 ? "default" : "secondary"}
                                                        className="shrink-0 text-[10px] px-1.5 py-0 leading-5"
                                                    >
                                                        {hospital.distance_km < 1
                                                            ? `${Math.round(hospital.distance_km * 1000)} m`
                                                            : `${hospital.distance_km.toFixed(1)} km`}
                                                    </Badge>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                                        <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                                                        <span className="line-clamp-1">{hospital.address}</span>
                                                    </div>
                                                    {hospital.open_hour && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Clock className="w-3 h-3 shrink-0" />
                                                            <span className="line-clamp-1">{hospital.open_hour}</span>
                                                        </div>
                                                    )}
                                                    {hospital.phone && (
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Phone className="w-3 h-3 shrink-0" />
                                                            <a
                                                                href={`tel:${hospital.phone}`}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="hover:text-primary transition-colors"
                                                            >
                                                                {hospital.phone}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>

                                                <a
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                                                >
                                                    Get directions <ExternalLink className="w-2.5 h-2.5" />
                                                </a>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>
                </aside>
            </div>
        </main>
    )
}