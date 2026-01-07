"use client";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactNode, useState} from "react";
import {GC_TIME, QUERY_STALE_TIME} from "@/config/app-constant";

export default function ReactQueryProvider({
                                               children
                                           }: {
    children: ReactNode
}) {
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: QUERY_STALE_TIME,
                    gcTime: GC_TIME,
                    retry: 2,
                    refetchOnWindowFocus: true,
                },
            },
        })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
