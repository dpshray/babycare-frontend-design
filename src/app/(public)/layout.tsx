"use client";

import React from "react";
import {Footer} from "@/components/footer/Footer";
import NavigationBar from "@/components/header/Navigation";




export default function PublicLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header with navigation */}
            <header role="banner">
                <NavigationBar  />
            </header>

            {/* Main content area - flex-1 ensures it takes available space */}
            <main
                id="main-content"
                role="main"
                className="flex-1 w-full min-h-0"
            >
                {children}
            </main>

            {/* Footer section */}
            <footer role="contentinfo">
                <Footer/>
            </footer>
        </div>
    );
}
