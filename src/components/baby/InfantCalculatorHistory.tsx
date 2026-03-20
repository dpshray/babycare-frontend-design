'use client'

import { useCallback, useState } from "react"
import {
    History, AlertCircle, ChevronDown, ChevronUp, User,
    Activity, CheckCircle2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useGetInfantCalculatorHistory } from "@/hooks/useInfant"
import { HistoryRecord, InfantInfo, MetricResult } from "@/types/infant.type"
import CustomPagination from "@/components/Custom-Pagination"
import Image from "next/image"


function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

function formatTime(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function MetricPill({ metric, label }: { metric: MetricResult; label: string }) {
    const color = metric.color_code ?? "#6b7280"
    const isOk = !metric.action_required

    return (
        <div
            className="flex-1 min-w-0 rounded-xl p-3 space-y-1.5 transition-all"
            style={{ background: color + "0d", border: `1px solid ${color}25` }}
        >
            <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</span>
                {isOk
                    ? <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                    : <AlertCircle className="w-3 h-3 shrink-0" style={{ color }} />
                }
            </div>
            <p className="text-xl font-bold leading-none" style={{ color }}>
                {metric.percentile}
                <span className="text-xs font-medium ml-0.5" style={{ color: color + "aa" }}>%ile</span>
            </p>
            {metric.raw && (
                <p className="text-[11px] text-gray-400 font-medium">{metric.raw}</p>
            )}
            {metric.alert_level && (
                <p className="text-[10px] font-semibold leading-tight" style={{ color }}>
                    {metric.alert_level}
                </p>
            )}
            {metric.app_action && metric.action_required && (
                <p className="text-[10px] text-gray-500 leading-tight line-clamp-2">
                    {metric.app_action}
                </p>
            )}
        </div>
    )
}

function HistoryRecordCard({ record, index }: { record: HistoryRecord; index: number }) {
    const [expanded, setExpanded] = useState(false)

    const urgentCount = [
        record.weight_for_age,
        record.height_for_age,
        record.head_circumference_for_age,
    ].filter(m => m.action_required).length

    const statusColor = urgentCount === 0 ? "#10b981" : urgentCount === 1 ? "#f59e0b" : "#ef4444"
    const statusLabel = urgentCount === 0 ? "All Clear" : urgentCount === 1 ? "1 Alert" : `${urgentCount} Alerts`

    return (
        <div
            className="rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md"
            style={{
                border: `1px solid ${statusColor}20`,
                background: "white",
                animationDelay: `${index * 60}ms`
            }}
        >
            {/* Card header — always visible */}
            <button
                onClick={() => setExpanded(p => !p)}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors"
            >
                <div className="flex items-center gap-3 min-w-0">
                    {/* Status dot */}
                    <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: statusColor, boxShadow: `0 0 0 3px ${statusColor}20` }}
                    />

                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-900">
                                {formatDate(record.recorded_at)}
                            </span>
                            <span className="text-xs text-gray-400">
                                {formatTime(record.recorded_at)}
                            </span>
                            <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{ background: "#6366f115", color: "#6366f1" }}
                            >
                                {record.age_months}mo old
                            </span>
                        </div>

                        {/* Quick metric summary */}
                        <div className="flex items-center gap-3 mt-1">
                            {[
                                { label: "Wt", v: record.weight_for_age },
                                { label: "Ht", v: record.height_for_age },
                                { label: "HC", v: record.head_circumference_for_age },
                            ].map(({ label, v }) => (
                                <span key={label} className="text-[11px] text-gray-500">
                                    <span className="font-medium text-gray-400">{label} </span>
                                    <span className="font-bold" style={{ color: v.color_code ?? "#6b7280" }}>
                                        {v.raw ?? `${v.percentile}%`}
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <span
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: statusColor + "15", color: statusColor }}
                    >
                        {statusLabel}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                        {expanded
                            ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                            : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                        }
                    </div>
                </div>
            </button>

            {/* Expanded metrics */}
            {expanded && (
                <div className="px-5 pb-5 pt-1 border-t border-gray-50">
                    <div className="flex gap-3 mt-3">
                        <MetricPill metric={record.weight_for_age} label="Weight" />
                        <MetricPill metric={record.height_for_age} label="Height" />
                        <MetricPill metric={record.head_circumference_for_age} label="Head Circ." />
                    </div>
                </div>
            )}
        </div>
    )
}

function HistorySkeletons() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 p-5 space-y-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-2.5 h-2.5 rounded-full" />
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-4 w-16 ml-auto" />
                    </div>
                    <div className="flex gap-4 pl-5">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
            ))}
        </div>
    )
}

function InfantBanner({ infant, totalItems }: { infant: InfantInfo; totalItems: number }) {
    const gradient = {
        MALE: "from-sky-400 to-blue-500",
        FEMALE: "from-pink-400 to-rose-500",
        OTHER: "from-violet-400 to-purple-500",
    }[infant.gender]

    const genderBg = {
        MALE: "#0ea5e915",
        FEMALE: "#f43f5e15",
        OTHER: "#8b5cf615",
    }[infant.gender]

    const genderColor = {
        MALE: "#0284c7",
        FEMALE: "#e11d48",
        OTHER: "#7c3aed",
    }[infant.gender]

    return (
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            {/* Gradient top strip */}
            <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

            <div className="px-5 py-4 flex items-center gap-4 bg-white">
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 overflow-hidden shadow-md`}>
                    {infant.media
                        ? <Image src={infant.media} alt={infant.name} width={56} height={56} className="w-full h-full object-cover" />
                        : <User className="w-7 h-7 text-white" />
                    }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-gray-900 truncate">{infant.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Born {infant.dob}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{totalItems}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Records</p>
                    </div>
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: genderBg }}
                    >
                        <Activity className="w-4 h-4" style={{ color: genderColor }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

interface InfantCalculatorHistoryProps {
    infantId: number
}

export default function InfantCalculatorHistory({ infantId }: InfantCalculatorHistoryProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const PER_PAGE = 5

    const { data: response, isLoading, isError, refetch } = useGetInfantCalculatorHistory(infantId, {
        page: currentPage,
        per_page: PER_PAGE,
    })

    const historyData = (response as any)?.data as {
        items: HistoryRecord[]
        infant: InfantInfo
        total_items: number
        total_page: number
        page: number
    } | undefined

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [])

    return (
        <div className="space-y-5">

            {/* Section heading */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <History className="w-4 h-4 text-indigo-500" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-gray-900">Calculation History</h2>
                        {historyData?.total_items != null && (
                            <p className="text-xs text-gray-400">{historyData.total_items} total records</p>
                        )}
                    </div>
                </div>

                {historyData?.total_items != null && (
                    <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 text-xs">
                        Page {currentPage} of {historyData.total_page}
                    </Badge>
                )}
            </div>

            {/* Infant banner */}
            {historyData?.infant && (
                <InfantBanner infant={historyData.infant} totalItems={historyData.total_items} />
            )}

            {/* Content */}
            {isLoading ? (
                <HistorySkeletons />
            ) : isError ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-8 flex flex-col items-center gap-3 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Failed to load history</p>
                        <p className="text-xs text-gray-500 mt-0.5">Please check your connection and try again.</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => refetch()} className="mt-1">
                        Retry
                    </Button>
                </div>
            ) : !historyData?.items?.length ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center gap-3 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <History className="w-7 h-7 text-gray-300" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700">No records yet</p>
                        <p className="text-xs text-gray-400 mt-1">Use the calculator above to log your first measurement.</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {historyData.items.map((record, i) => (
                            <HistoryRecordCard key={record.record_id} record={record} index={i} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {historyData.total_page > 1 && (
                        <div className="pt-2">
                            <CustomPagination
                                currentPage={currentPage}
                                totalPages={historyData.total_page}
                                onPageChangeAction={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}