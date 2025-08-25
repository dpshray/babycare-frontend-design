"use client";

import * as React from "react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

export const AppleLogo = ({className}: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={cn("w-5 h-5 text-white", className)}
        aria-hidden="true"
    >
        <path
            d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
);

export const GooglePlayLogo = ({className}: { className?: string }) => (
    <svg
        viewBox="0 0 512 512"
        fill="currentColor"
        className={cn("w-5 h-5 text-white", className)}
        aria-hidden="true"
    >
        <path
            d="M325.3 234.3L104.8 39.9C99 35.2 92 32 84.3 32c-13.3 0-24 10.7-24 24v400c0 13.3 10.7 24 24 24 7.7 0 14.7-3.2 20.5-7.9l220.5-194.5-57.6-49.3 57.6-49.2zM372 278.5L127.7 472.4l244.3-213.9zM372 233.5L127.7 39.6 372 233.5z"/>
    </svg>
);

interface StoreButtonProps {
    href: string;
    logo: React.ReactNode;
    label: string;
    storeName: string;
    className?: string;
}

export const StoreButton = ({
                                href,
                                logo,
                                label,
                                storeName,
                                className,
                            }: StoreButtonProps) => {
    return (
        <Button
            asChild
            variant="ghost"
            className={cn(
                "!bg-black/85 !text-white border border-gray-700 rounded-lg px-4 py-2 h-auto shadow-sm",
                "hover:bg-gray-900 transition-colors duration-200 ease-in-out",
                "focus:ring-2 focus:ring-offset-2 focus:ring-white/30",
                className
            )}
        >
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
                aria-label={`Download on the ${storeName}`}
            >
                {logo}
                <div className="flex flex-col items-start leading-snug">
                    <span className="text-xs text-gray-300">{label}</span>
                    <span className="text-sm font-semibold">{storeName}</span>
                </div>
            </a>
        </Button>
    );
};
