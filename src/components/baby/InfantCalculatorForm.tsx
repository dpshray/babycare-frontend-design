'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Calculator, AlertCircle, TrendingUp, Ruler, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useInfantCalculator } from "@/hooks/useInfant"
import { CalculatorResult, MetricResult } from "@/types/infant.type"

const calculatorSchema = z.object({
    weight: z
        .string()
        .min(1, "Weight is required")
        .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Enter a valid weight"),
    height: z
        .string()
        .min(1, "Height is required")
        .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Enter a valid height"),
    head_circumference: z
        .string()
        .min(1, "Head circumference is required")
        .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Enter a valid measurement"),
})

type CalculatorFormValues = z.infer<typeof calculatorSchema>

function MetricCard({
    label,
    icon: Icon,
    metric,
    raw,
}: {
    label: string
    icon: React.ElementType
    metric: MetricResult
    raw?: string
}) {
    const color = metric.color_code ?? "#6b7280"

    return (
        <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: color + "40" }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: color + "15" }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{label}</span>
                </div>
                {raw && (
                    <span className="text-xs text-muted-foreground font-medium">{raw}</span>
                )}
            </div>

            <div className="flex items-center justify-between gap-2">
                <div>
                    <p className="text-2xl font-bold" style={{ color }}>
                        {metric.percentile}
                        <span className="text-sm font-normal text-muted-foreground ml-1">%ile</span>
                    </p>
                    {metric.alert_level && (
                        <p className="text-xs font-medium mt-0.5" style={{ color }}>
                            {metric.alert_level}
                        </p>
                    )}
                </div>
                {metric.action_required && (
                    <Badge
                        className="text-[10px] px-2 py-0.5 shrink-0"
                        style={{ background: color + "15", color, border: `1px solid ${color}40` }}
                    >
                        Action Required
                    </Badge>
                )}
            </div>

            {metric.app_action && (
                <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-2.5">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{metric.app_action}</p>
                </div>
            )}
        </div>
    )
}

interface InfantCalculatorFormProps {
    infantId: number
}

export default function InfantCalculatorForm({ infantId }: InfantCalculatorFormProps) {
    const [submitted, setSubmitted] = useState<CalculatorFormValues | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CalculatorFormValues>({
        resolver: zodResolver(calculatorSchema),
    })

    const { data, isLoading, isError } = useInfantCalculator(
        submitted
            ? {
                  infant_id: infantId,
                  weight: Number(submitted.weight),
                  height: Number(submitted.height),
                  head_circumference: Number(submitted.head_circumference),
              }
            : { infant_id: 0, weight: 0, height: 0, head_circumference: 0 }
    )

    const result = data as CalculatorResult | undefined

    const onSubmit = (values: CalculatorFormValues) => {
        setSubmitted(values)
    }

    return (
        <div className="space-y-6">
            {/* Form */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Calculator className="w-4 h-4 text-primary" />
                        Growth Calculator
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Weight */}
                            <div className="space-y-1.5">
                                <Label htmlFor="weight" className="text-sm font-medium">
                                    Weight <span className="text-muted-foreground font-normal">(kg)</span>
                                </Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 8.5"
                                    {...register("weight")}
                                    className={errors.weight ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {errors.weight && (
                                    <p className="text-xs text-destructive flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.weight.message}
                                    </p>
                                )}
                            </div>

                            {/* Height */}
                            <div className="space-y-1.5">
                                <Label htmlFor="height" className="text-sm font-medium">
                                    Height <span className="text-muted-foreground font-normal">(cm)</span>
                                </Label>
                                <Input
                                    id="height"
                                    type="number"
                                    step="0.1"
                                    placeholder="e.g. 70"
                                    {...register("height")}
                                    className={errors.height ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {errors.height && (
                                    <p className="text-xs text-destructive flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.height.message}
                                    </p>
                                )}
                            </div>

                            {/* Head Circumference */}
                            <div className="space-y-1.5">
                                <Label htmlFor="head_circumference" className="text-sm font-medium">
                                    Head Circ. <span className="text-muted-foreground font-normal">(cm)</span>
                                </Label>
                                <Input
                                    id="head_circumference"
                                    type="number"
                                    step="0.1"
                                    placeholder="e.g. 41"
                                    {...register("head_circumference")}
                                    className={errors.head_circumference ? "border-destructive focus-visible:ring-destructive" : ""}
                                />
                                {errors.head_circumference && (
                                    <p className="text-xs text-destructive flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.head_circumference.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Calculating…
                                </>
                            ) : (
                                <>
                                    <Calculator className="w-4 h-4 mr-2" />
                                    Calculate
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Results */}
            {isError && (
                <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Failed to calculate. Please try again.
                </div>
            )}

            {result && (
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Results</CardTitle>
                            <Badge variant={result.less_than_5_years ? "default" : "secondary"} className="text-xs">
                                {result.less_than_5_years ? "Under 5 Years" : "Over 5 Years"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <MetricCard label="Weight for Age" icon={TrendingUp} metric={result.weight} />
                        <MetricCard label="Height for Age" icon={Ruler} metric={result.height} />
                        <MetricCard label="Head Circumference" icon={Brain} metric={result.head} />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}