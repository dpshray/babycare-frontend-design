import {useQuery} from "@tanstack/react-query";
import {authService} from "@/Service/auth.service";

export interface LoggedInUser {
    id: number
    uuid: string
    name: string
    email: string
    phone?: string
    address?: string
    media?: string
    cart_item_count: number
    favourate_item_count: number
}

export interface LoggedInUserResponse {
    status: boolean;
    data: LoggedInUser;
    message: string;
}

export const useAuth = () => {
    const {data, isLoading, error ,refetch} = useQuery<LoggedInUserResponse, Error>({
        queryKey: ["auth", "me"],
        queryFn: async () => {
            try {
                return await authService.getLoggedInUser();
            } catch (error: any) {
                if (error?.status === 401) {
                    return Promise.reject(new Error("Not authenticated"));
                }
                throw error;
            }
        },
        retry: false,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
    });

    return {
        user: data?.data,
        isLoading,
        error: error?.message || error,
        isAuthenticated: !!data?.data,
        refetchAuth: refetch,

    };
};
