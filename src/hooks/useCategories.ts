import {useQuery} from "@tanstack/react-query";

import {QUERY_STALE_TIME} from "@/config/app-constant";
import categoriesService from "@/Service/category.service";

export interface Category {
    slug: string;
    name: string;
    menu_order: string;
    image: string;
}

interface CategoryResponse {
    status: boolean;
    data: Category[];
    message: string;
}

interface UseCategoriesOptions {
    page?: number;
    per_page?: number;
    search?: string;
}

export const useCategories = (params?: UseCategoriesOptions) => {
    const {data, isLoading, error} = useQuery<CategoryResponse>({
        queryKey: ["categories", params],
        queryFn: async () => {
            return await categoriesService.getAllCategories(params).then((res) =>{
                console.log('Response', res)
                return res
            })
        },
        staleTime: QUERY_STALE_TIME
    });

    return {
        categories: data?.data || [],
        isLoading,
        error
    };
};
