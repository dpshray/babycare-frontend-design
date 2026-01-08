import type {Metadata} from "next";
import {Mulish, Open_Sans} from "next/font/google";
import "./globals.css";
import React from "react";
import RootProviders from "@/Provider/Providers";

const openSans = Open_Sans({
    subsets: ["latin"],
    variable: "--font-open-sans",
    display: "swap",
});

const mulish = Mulish({
    subsets: ["latin"],
    variable: "--font-mulish",
    display: "swap",
});

export const metadata: Metadata = {
    title: "BabyCare MarketPlace",
    description: "Your trusted marketplace for baby products and parenting essentials.",
    keywords: "baby, babycare, marketplace, parenting, products, wellness",
    authors: [{name: "BabyCare Team"}],
    creator: "BabyCare Team",
    openGraph: {
        title: "BabyCare MarketPlace",
        description: "Your trusted marketplace for baby products and parenting essentials.",
        url: "https://babycare-frontend-design.vercel.app",
        siteName: "BabyCare",
        images: [
            {
                url: "https://babycare-frontend-design.vercel.app/og-image.png",
                width: 1200,
                height: 630,
                alt: "BabyCare MarketPlace",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "BabyCare MarketPlace",
        description: "Your trusted marketplace for baby products and parenting essentials.",
        images: ["https://babycare-frontend-design.vercel.app/og-image.png"],
        creator: "@babycare",
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${openSans.variable} ${mulish.variable} antialiased`}>
        <RootProviders>{children}</RootProviders>
        </body>
        </html>
    );
}
