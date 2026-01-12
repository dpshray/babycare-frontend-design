import {useQuery} from "@tanstack/react-query";

import {QUERY_STALE_TIME} from "@/config/app-constant";
import productService from "@/Service/product.service";

export interface Product {
    name: string;
    slug: string;
    brand: string;
    rating: number;
    price: number;
    previous_price: number;
    feature_image: string;
    discount_percent: number;
    liked: boolean;
    stock: number;
    store_name: string;
}

export interface ProductResponse {
    status: boolean;
    data: {
        items: Product[];
        page: number;
        total_page: number;
        total_items: number;
    };
    message: string;
}

interface UseProductsParams {
    page?: number;
    per_page?: number;
    search?: string | null;
    brand_slug?: string | null;
    category_slug?: string | null;
    list_type?: string | null;
}

export const useProducts = (params: UseProductsParams = {}) => {
    const {data, isLoading, error} = useQuery<ProductResponse>({
        queryKey: ["products", params],
        queryFn: () => productService.getAllProducts(params),
        staleTime: QUERY_STALE_TIME,
    });

    return {
        products: data?.data.items || [],
        currentPage: data?.data.page || 1,
        totalPages: data?.data.total_page || 1,
        totalItems: data?.data.total_items || 0,
        isLoading,
        error,
    };
};
