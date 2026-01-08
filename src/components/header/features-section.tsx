import {Shield, TruckIcon, BellRing} from "lucide-react";

export function FeaturesSection() {
    const features = [
        {
            icon: Shield,
            title: "Genuine Products",
            description: "Carefully sourced genuine products you can trust.",
        },
        {
            icon: TruckIcon,
            title: "Home Delivery",
            description: "Safe, timely delivery of baby essentials to your home.",
        },
        {
            icon: BellRing,
            title: "Vaccine Schedules",
            description: "Timely reminders for vaccination schedules.",
        },
    ];

    return (
        <section className="w-full bg-gradient-to-br from-[#43529A] via-indigo-400 to-[#43529A] py-16 md:py-20 lg:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNEgxNHYxNGgxNHYtMTR6bTAtNDBoMTR2MTRIMzZ2LTE0em0tMTggMEgydjE0aDE0di0xNHptMC00MGgxNHYxNEgydi0xNHptMzYgMGgxNHYxNEgzOHYtMTR6bS0xOCAxOGgxNHYxNEgyMHYtMTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="mb-5 md:mb-6 rounded-2xl bg-white/10 backdrop-blur-sm p-5 md:p-6 border border-white/20 shadow-xl group-hover:bg-white/20 group-hover:scale-105 transition-all duration-300">
                                    <Icon className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 text-white stroke-[1.5]"/>
                                </div>
                                <h3 className="mb-3 text-xl md:text-2xl font-bold text-white tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-sm md:text-base text-blue-100 leading-relaxed max-w-xs">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}