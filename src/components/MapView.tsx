'use client'

// MapView.tsx
// Imported via dynamic() in HealthCenter.tsx — never rendered on the server.

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix broken default icon paths in Next.js / Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// ─── Types ────────────────────────────────────────────────────────────────────

interface Hospital {
    id: number
    name: string
    address: string
    phone: string
    open_hour: string
    latitude: number
    longitude: number
    distance_km: number
}

interface MapViewProps {
    userLocation: { lat: number; lng: number }
    hospitals: Hospital[]
    selectedHospital: Hospital | null
    onSelectHospital: (h: Hospital) => void
}

// ─── Custom marker icons ──────────────────────────────────────────────────────

const userDot = L.divIcon({
    className: "",
    html: `
        <div style="position:relative;width:20px;height:20px">
            <div style="
                position:absolute;inset:0;
                border-radius:50%;
                background:rgba(59,130,246,0.25);
                animation:ping 1.5s ease-in-out infinite;
            "></div>
            <div style="
                position:absolute;inset:3px;
                border-radius:50%;
                background:#3b82f6;
                border:2px solid white;
                box-shadow:0 1px 4px rgba(0,0,0,.3);
            "></div>
        </div>
        <style>
            @keyframes ping {
                0%,100%{transform:scale(1);opacity:.6}
                50%{transform:scale(1.8);opacity:0}
            }
        </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
})

function makeHospitalIcon(selected: boolean) {
    const bg = selected ? "#16a34a" : "#ef4444"
    const size = selected ? 36 : 30
    return L.divIcon({
        className: "",
        html: `
            <div style="
                width:${size}px;height:${size}px;
                background:${bg};
                border:2.5px solid white;
                border-radius:50% 50% 50% 0;
                transform:rotate(-45deg);
                box-shadow:0 2px 8px rgba(0,0,0,.35);
                transition:all .2s;
            "></div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
    })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MapView({ userLocation, hospitals, selectedHospital, onSelectHospital }: MapViewProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<L.Map | null>(null)
    const markersRef = useRef<Map<number, L.Marker>>(new Map())

    // ── Init map once ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!containerRef.current || mapRef.current) return

        const map = L.map(containerRef.current, {
            center: [userLocation.lat, userLocation.lng],
            zoom: 14,
            zoomControl: true,
        })

        // Clean, light tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(map)

        // User location
        L.marker([userLocation.lat, userLocation.lng], { icon: userDot, zIndexOffset: 1000 })
            .addTo(map)
            .bindPopup("<b>📍 Your Location</b>")

        // Radius circle
        L.circle([userLocation.lat, userLocation.lng], {
            radius: 5000,
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.04,
            weight: 1.5,
            dashArray: "6 4",
        }).addTo(map)

        mapRef.current = map
        return () => { map.remove(); mapRef.current = null }
    }, []) // intentionally empty — runs once

    // ── Re-draw hospital markers when list changes ────────────────────────────
    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        markersRef.current.forEach((m) => m.remove())
        markersRef.current.clear()

        hospitals.forEach((h) => {
            const isSelected = selectedHospital?.id === h.id
            const marker = L.marker([h.latitude, h.longitude], {
                icon: makeHospitalIcon(isSelected),
            })
                .addTo(map)
                .bindPopup(`
                    <div style="min-width:180px;font-family:system-ui,sans-serif">
                        <p style="font-weight:700;margin:0 0 4px">${h.name}</p>
                        <p style="font-size:12px;color:#555;margin:0 0 2px">${h.address}</p>
                        ${h.open_hour ? `<p style="font-size:11px;color:#666;margin:0 0 2px">🕐 ${h.open_hour}</p>` : ""}
                        ${h.phone ? `<p style="font-size:11px;color:#666;margin:0 0 6px">📞 ${h.phone}</p>` : ""}
                        <p style="font-size:12px;font-weight:600;color:${h.distance_km < 1 ? "#16a34a" : "#555"};margin:0">
                            ${h.distance_km < 1 ? `${Math.round(h.distance_km * 1000)} m away` : `${h.distance_km.toFixed(1)} km away`}
                        </p>
                    </div>
                `)

            marker.on("click", () => onSelectHospital(h))
            markersRef.current.set(h.id, marker)
        })
    }, [hospitals, selectedHospital, onSelectHospital])

    // ── Pan + highlight when selection changes ────────────────────────────────
    useEffect(() => {
        const map = mapRef.current
        if (!map || !selectedHospital) return

        map.flyTo([selectedHospital.latitude, selectedHospital.longitude], 16, { duration: 0.7 })

        markersRef.current.forEach((marker, id) => {
            marker.setIcon(makeHospitalIcon(id === selectedHospital.id))
            if (id === selectedHospital.id) marker.openPopup()
        })
    }, [selectedHospital])

    return <div ref={containerRef} className="w-full h-full" />
}