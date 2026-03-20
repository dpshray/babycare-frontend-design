// ─── Infant Calculator Types ──────────────────────────────────────────────────

export interface MetricResult {
    percentile: number
    alert_level: string | null
    app_action: string | null
    color_code: string | null
    action_required: boolean | null
    raw?: string
}

export interface CalculatorResult {
    less_than_5_years: boolean
    weight: MetricResult
    height: MetricResult
    head: MetricResult
}

export interface HistoryRecord {
    record_id: number
    recorded_at: string
    age_months: number
    weight_for_age: MetricResult
    height_for_age: MetricResult
    head_circumference_for_age: MetricResult
}

export interface InfantInfo {
    id: number
    name: string
    dob: string
    gender: "MALE" | "FEMALE" | "OTHER"
    media: string | null
}

export interface HistoryResponse {
    items: HistoryRecord[]
    page: number
    total_page: number
    total_items: number
    infant: InfantInfo
}