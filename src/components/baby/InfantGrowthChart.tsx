'use client'

import {
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp } from "lucide-react"
import { useState } from "react"
import { useGetInfantChart } from "@/hooks/useInfant"

type Indicator = "weight" | "height" | "head_circumference"

interface ChartDataPoint {
    age_months: number
    [key: string]: number | undefined
}

interface WhoLines {
    p3: { age_months: number; value: number }[]
    p50: { age_months: number; value: number }[]
    p97: { age_months: number; value: number }[]
}

interface InfantChartData {
    has_data: boolean
    indicator: string
    baby: { age_months: number; raw: number; percentile: number }[]
    who_lines: WhoLines
}

interface Props {
    infantId: number
}

const INDICATORS: { value: Indicator; label: string; unit: string }[] = [
    { value: "weight",             label: "Weight",             unit: "kg" },
    { value: "height",             label: "Height",             unit: "cm" },
    { value: "head_circumference", label: "Head Circumference", unit: "cm" },
]

const CustomTooltip = ({ active, payload, label, unit }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-3 text-xs space-y-1.5 min-w-[180px]">
            <p className="font-semibold text-gray-900 mb-2">Age: {label} months</p>
            {payload.map((entry: any) => (
                <div key={entry.name} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                        <span className="text-gray-600">{entry.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{entry.value.toFixed(2)} {unit}</span>
                </div>
            ))}
        </div>
    )
}

export default function InfantGrowthChart({ infantId }: Props) {
    const [activeIndicator, setActiveIndicator] = useState<Indicator>("weight")

    const { data: response, isLoading, isFetching } = useGetInfantChart(infantId, activeIndicator)
    const data = response?.data as InfantChartData | undefined

    const currentMeta = INDICATORS.find(i => i.value === activeIndicator)!

    let chartData: ChartDataPoint[] = []
    let latestBaby = null

    if (data?.has_data) {
        const allAges = Array.from(
            new Set([
                ...data.who_lines.p3.map(d => typeof d.age_months === 'string' ? parseInt(d.age_months) : d.age_months),
                ...data.who_lines.p50.map(d => typeof d.age_months === 'string' ? parseInt(d.age_months) : d.age_months),
                ...data.who_lines.p97.map(d => typeof d.age_months === 'string' ? parseInt(d.age_months) : d.age_months),
                ...data.baby.map(d => d.age_months),
            ])
        ).sort((a, b) => a - b)

        chartData = allAges.map(age => {
            const babyPoint = data.baby.find(d => d.age_months === age)
            const p3  = data.who_lines.p3.find(d => (typeof d.age_months === 'string' ? parseInt(d.age_months) : d.age_months) === age)
            const p50 = data.who_lines.p50.find(d => (typeof d.age_months === 'string' ? parseInt(d.age_months) : d.age_months) === age)
            const p97 = data.who_lines.p97.find(d => (typeof d.age_months === 'string' ? parseInt(d.age_months) : d.age_months) === age)
            return {
                age_months: age,
                ...(babyPoint && { Baby: babyPoint.raw }),
                ...(p3  && { "WHO P3":  p3.value }),
                ...(p50 && { "WHO P50": p50.value }),
                ...(p97 && { "WHO P97": p97.value }),
            }
        })

        latestBaby = data.baby.at(-1)
    }

    return (
        <Card className="shadow-md border border-gray-200 rounded-2xl bg-white">
            <CardHeader className="pb-3 border-b border-gray-100">
                <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
                            <TrendingUp className="h-5 w-5 text-violet-600" />
                            Growth Chart
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500 mt-0.5">
                            Compared against WHO standard growth percentile lines
                        </CardDescription>
                    </div>
                    {latestBaby && !isFetching && (
                        <div className="flex flex-col items-end gap-1.5">
                            <Badge 
                                variant="outline" 
                                className="text-violet-700 border-violet-300 bg-violet-50 text-xs font-semibold whitespace-nowrap"
                            >
                                Latest: {latestBaby.raw.toFixed(2)} {currentMeta.unit}
                            </Badge>
                            <Badge 
                                variant="outline" 
                                className="text-amber-700 border-amber-300 bg-amber-50 text-xs font-semibold whitespace-nowrap"
                            >
                                {latestBaby.percentile}th percentile
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Indicator filter tabs */}
                <div className="mt-4">
                    <Tabs value={activeIndicator} onValueChange={v => setActiveIndicator(v as Indicator)}>
                        <TabsList className="h-8 bg-gray-100 p-0.5 rounded-lg inline-flex">
                            {INDICATORS.map(ind => (
                                <TabsTrigger
                                    key={ind.value}
                                    value={ind.value}
                                    disabled={isFetching}
                                    className="h-7 px-3 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-violet-700 data-[state=active]:shadow-sm disabled:opacity-50 transition-all"
                                >
                                    {ind.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>

            <CardContent className="pt-4">
                {(isLoading || isFetching) ? (
                    <div className="h-80 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3 text-gray-400">
                            <div className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                            <span className="text-xs font-medium">Loading chart data…</span>
                        </div>
                    </div>
                ) : !data?.has_data ? (
                    <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-center">
                            <TrendingUp className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm font-semibold text-gray-700">No growth data yet</p>
                            <p className="text-xs text-gray-500 mt-1">Add a measurement to see the growth chart</p>
                        </div>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={380}>
                        <ComposedChart 
                            data={chartData} 
                            margin={{ top: 12, right: 20, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="babyGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.1} />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid 
                                strokeDasharray="4 4" 
                                stroke="#e5e7eb" 
                                vertical={false}
                                opacity={0.6}
                            />
                            <XAxis
                                dataKey="age_months"
                                label={{ value: "Age (months)", position: "insideBottomRight", offset: -4, fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                                height={50}
                                type="number"
                                domain={["dataMin - 1", "dataMax + 1"]}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: "#6b7280" }}
                                label={{ value: currentMeta.unit, angle: -90, position: "insideLeft", offset: 10, fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
                                width={45}
                                domain={["dataMin - 0.5", "dataMax + 0.5"]}
                            />
                            <Tooltip content={<CustomTooltip unit={currentMeta.unit} />} />
                            <Legend
                                wrapperStyle={{ fontSize: "12px", paddingTop: "16px", color: "#6b7280" }}
                                iconType="circle"
                                iconSize={8}
                                verticalAlign="bottom"
                                height={32}
                            />

                            <Line dataKey="WHO P97" stroke="#475569" strokeWidth={2} dot={false} isAnimationActive={false} />
                            <Line dataKey="WHO P50" stroke="#64748b" strokeWidth={2} dot={false} isAnimationActive={false} />
                            <Line dataKey="WHO P3"  stroke="#94a3b8" strokeWidth={2} dot={false} isAnimationActive={false} />

                            <Line
                                dataKey="Baby"
                                stroke="#8b5cf6"
                                strokeWidth={2.5}
                                dot={{ r: 5, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
                                activeDot={{ r: 7, strokeWidth: 2 }}
                                isAnimationActive={true}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}