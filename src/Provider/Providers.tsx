"use client";

import { ReactNode } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ReactQueryProvider from "@/Provider/ReactQueryProvider";
import { Toaster } from "sonner";
import { GOOGLE_CLIENT_ID } from "@/config/app-constant";

export default function RootProviders({ children }: { children: ReactNode }) {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <ReactQueryProvider>
                <Toaster richColors position="bottom-right" duration={5000} />
                {children}
            </ReactQueryProvider>
        </GoogleOAuthProvider>
    );
}
