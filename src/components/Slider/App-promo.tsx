import Image from "next/image"
import { Apple, PlayCircle } from "lucide-react"
import {cn} from "@/lib/utils";

export function AppPromo() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 max-h-[600px]">
                <div className="md:w-1/2">
                    <h2 className="text-6xl font-extrabold text-blue-900 mb-6">Download our App</h2>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md">
                        Parenting made easier. Download our app for safe baby products, timely vaccination reminders, healthcare
                        access, and trusted guidance — all in one place.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-900 transition-colors">
                            <PlayCircle size={24} />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase">Get it on</span>
                                <span className="text-sm font-bold leading-none">Google Play</span>
                            </div>
                        </div>
                        <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-gray-900 transition-colors">
                            <Apple size={24} />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase">Download on the</span>
                                <span className="text-sm font-bold leading-none">App Store</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="md:w-1/2 relative">
                    <div className="relative w-full h-full z-10 flex gap-4 justify-center">
                        <Image
                            src="/app-promo.png"
                            alt="App Screen 1"
                            width={250}
                            height={500}
                            className={cn('w-full h-full object-cover ')}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
