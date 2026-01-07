import {useQuery} from "@tanstack/react-query";

import {QUERY_STALE_TIME} from "@/config/app-constant";
import brandService from "@/Service/brand.service";

export interface Brand {
    slug: string;
    name: string;
    image?: string;
    is_featured?: number;
    is_popular?: number;
}

interface BrandResponse {
    status: boolean;
    data: Brand[];
    message: string;
}

interface UseBrandsOptions {
    page?: number;
    per_page?: number;
    search?: string;
}

export const useBrands = (params?: UseBrandsOptions) => {
    const { data, isLoading, error } = useQuery<BrandResponse>({
        queryKey: ["brands", params],
        queryFn: async () => {
            const response = await brandService.getAllBrands(params);
            console.log('Response from Brand', response);
            return response;
        },
        staleTime: QUERY_STALE_TIME
    });

    return {
        brands: data?.data || [],
        isLoading,
        error
    };
};
