
import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative bg-white overflow-hidden py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-10">
                <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center md:justify-start">
                    <Image
                        src="/mother-holding-baby.jpg"
                        alt="Mother holding baby"
                        width={400}
                        height={400}
                        className="rounded-full border-8 border-white shadow-xl"
                        priority
                    />
                </div>

                <div className="md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right">
                    <div className="relative">
                        <div className="flex gap-4 mb-6">
                            <Image src="/baby-formula-can.jpg" alt="Baby formula" width={80} height={120} />
                            <Image src="/baby-oil-bottle.jpg" alt="Baby oil" width={80} height={120} />
                            <Image src="/baby-powder-bottle.jpg" alt="Baby powder" width={80} height={120} />
                        </div>
                        <div className="absolute -top-10 -right-10 opacity-20 hidden lg:block">
                            <Image src="/palm-leaf.jpg" alt="" width={150} height={150} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute top-10 left-10 opacity-10 animate-bounce">
                <Image src="/yellow-duck-icon.jpg" alt="" width={60} height={60} />
            </div>
            <div className="absolute bottom-20 right-20 opacity-10 animate-pulse">
                <Image src="/blue-star-icon.png" alt="" width={60} height={60} />
            </div>
        </section>
    );
}
