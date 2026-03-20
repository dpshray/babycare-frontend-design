'use client'

import InfantCalculatorForm from "@/components/baby/InfantCalculatorForm"
import InfantCalculatorHistory from "@/components/baby/InfantCalculatorHistory"
import { useParams } from "next/navigation"

export default function InfantCalculationPage() {
    const params = useParams()
    const infantId = Number(params.infantId)

    if (!infantId || isNaN(infantId)) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
                Invalid infant ID.
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Page header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Infant Growth Tracker</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Calculate and track your infant&apos;s growth metrics over time.
                    </p>
                </div>

                {/* Calculator form — full width */}
                <InfantCalculatorForm infantId={infantId} />

                {/* History — full width below */}
                <InfantCalculatorHistory infantId={infantId} />

            </div>
        </div>
    )
}