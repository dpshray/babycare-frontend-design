import Image from "next/image"
import {ChevronLeft, ChevronRight, Star} from "lucide-react"
import {Button} from "@/components/ui/button"

export function TestimonialSection() {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <div
                    className="relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2">
                        <Image
                            src="/testo1.png"
                            alt="Happy baby"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="md:w-1/2 p-8 md:p-12 text-center md:text-left">
                        <div className="flex justify-center md:justify-start gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={18} className="fill-yellow-400 text-yellow-400"/>
                            ))}
                        </div>

                        <p className="text-gray-600 italic mb-6 leading-relaxed">
                            &#34;As a new parent, this platform has been a life saver. From daily essentials to
                            vaccination reminders and nearby healthcare centers, everything I need is in one place. It
                            truly makes parenting easier and stress free.&#34;
                        </p>

                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <div className="w-10 h-0.5 bg-gray-300"/>
                            <span className="font-bold text-gray-800">Sonia Shakya</span>
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button size="icon" variant="outline" className="rounded-full">
                            <ChevronLeft/>
                        </Button>
                        <Button size="icon" variant="outline" className="rounded-full">
                            <ChevronRight/>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
