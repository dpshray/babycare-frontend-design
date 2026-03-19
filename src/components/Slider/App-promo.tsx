import Image from "next/image";
import { Apple, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BABY_CARE_APP_STORE_URL,
  BABY_CARE_PLAY_STORE_URL,
} from "@/config/app-constant";

export function AppPromo() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-900 mb-4 md:mb-6 leading-tight">
              Download our App
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Parenting made easier. Download our app for safe baby products,
              timely vaccination reminders, healthcare access, and trusted
              guidance — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 justify-center lg:justify-start">
              <a
                className="bg-primary hover:bg-primary/90 text-white px-5 py-3 md:px-6 md:py-3.5 rounded-xl flex items-center justify-center gap-3 cursor-pointer  transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                href={BABY_CARE_PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on Google Play"
              >
                <PlayCircle size={28} className="shrink-0" />
                <div className="flex flex-col items-start">
                  <span className="text-[10px] md:text-xs uppercase tracking-wide">
                    Get it on
                  </span>
                  <span className="text-base md:text-lg font-bold leading-none">
                    Google Play
                  </span>
                </div>
              </a>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-[2.5rem] blur-2xl opacity-20 transform scale-95"></div>
              <Image
                src="/app-promo.png"
                alt="Baby Care App Interface"
                width={400}
                height={800}
                className={cn(
                  "relative z-10 w-full h-auto object-cover drop-shadow-2xl",
                  "rounded-[2rem] md:rounded-[2.5rem]",
                )}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
