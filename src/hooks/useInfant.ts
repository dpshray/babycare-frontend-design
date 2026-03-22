import { PageParams, QUERY_STALE_TIME } from "@/config/app-constant";
import babyService from "@/Service/baby.service";
import { useQuery } from "@tanstack/react-query";

interface InfantCalculatorParams {
    head_circumference: number
    weight: number
    height: number
    infant_id: number
}

export function useGetInfantCalculatorHistory(infantId: number, params?: PageParams) {
    return useQuery({
        queryKey: ["infant-history-calculation", infantId, params],
        queryFn : () => babyService.getInfantCalculatorHistory(infantId, params)
    })
}

export function useInfantCalculator(params: InfantCalculatorParams) {
    return useQuery({
        queryKey: ["infant-calculator", params.infant_id, params.weight, params.height, params.head_circumference],
        queryFn: async () => {
            try {
                const res = await babyService.infantCalculator(params)
                return res.data
            } catch (error: any) {
                const message = error?.message ?? "Calculation failed. Please try again."
                throw new Error(message)
            }
        },
        enabled: !!params.infant_id && !!params.weight && !!params.height && !!params.head_circumference,
        staleTime: QUERY_STALE_TIME,
        retry: 2,
    })
}