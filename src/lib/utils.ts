import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export const formatPrice = (price: number | null | undefined, currency = "NPR") => {
    if (price == null) return "-";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(price);
};

export const formatDate = (
    date: string | Date | null | undefined,
    options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
): string => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-US", options);
};
