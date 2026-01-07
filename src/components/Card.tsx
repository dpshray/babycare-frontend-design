import {
    Syringe,
    BellRing,
    BookOpenCheck,
    LineChart,
} from "lucide-react";
import React from "react";

export const cardData = [
    {
        title: "Vaccination Schedule",
        description: "Track your baby's vaccination schedule with ease.",
        icon: Syringe,
    },
    {
        title: "Auto Reminders & Notifications",
        description: "Get timely alerts before each vaccination date—never miss a dose again.",
        icon: BellRing,
    },
    {
        title: "Expert Advice for New Parents",
        description: "Get expert advice and tips for new parents.",
        icon: BookOpenCheck,
    },
    {
        title: "Growth Tracker",
        description: "Monitor your baby’s weight, height, and development milestones.",
        icon: LineChart,
    },
];

interface CardProps {
    title: string;
    description: string;
    icon: React.ElementType;
}

export function Card({ title, description, icon: Icon }: CardProps) {
    return (
        <div
            className="flex flex-col items-center text-center p-6 sm:p-6 md:p-8 w-full max-w-[300px] rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            role="region"
            aria-labelledby={`card-title-${title}`}
        >
            <div className="text-teal-600 mb-4" aria-hidden="true">
                <Icon size={40} strokeWidth={1.5} />
            </div>

            <h2
                id={`card-title-${title}`}
                className="font-openSans font-bold text-lg sm:text-xl text-[#0E5C63]"
            >
                {title}
            </h2>

            <p className="font-mulish text-gray-600 mt-2 text-sm sm:text-base">
                {description}
            </p>
        </div>
    );
}

