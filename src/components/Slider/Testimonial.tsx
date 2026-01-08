import Image from "next/image";
import {ChevronLeft, ChevronRight, Star} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useState, useCallback} from "react";

const testimonials = [
    {
        id: 1,
        name: "Sonia Shakya",
        image: "/testo1.png",
        message:
            "As a new parent, this platform has been a life saver. From daily essentials to vaccination reminders and nearby healthcare centers, everything I need is in one place. It truly makes parenting easier and stress free.",
        rating: 5,
    },
    {
        id: 2,
        name: "Aarav Joshi",
        image: "/testo1.png",
        message:
            "The vaccination reminders and baby care tips are incredibly helpful. I feel more confident and organized as a parent thanks to this platform.",
        rating: 5,
    },
    {
        id: 3,
        name: "Nisha Karki",
        image: "/testo1.png",
        message:
            "Finding genuine baby products and nearby healthcare centers has never been easier. Everything is well explained and easy to use.",
        rating: 4,
    },
    {
        id: 4,
        name: "Rohit Adhikari",
        image: "/testo1.png",
        message:
            "This platform truly understands modern parenting needs. The expert guidance and health tools make a real difference.",
        rating: 5,
    },
    {
        id: 5,
        name: "Pooja Shrestha",
        image: "/testo1.png",
        message:
            "I love how everything is available in one place—from shopping to healthcare tracking. It saves so much time and effort.",
        rating: 4,
    },
];

export function TestimonialSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, []);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, []);

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        What Parents Say
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                        Trusted by thousands of parents across Nepal
                    </p>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
                        <div className="flex flex-col md:flex-row items-stretch">
                            <div className="md:w-1/2 relative h-64 md:h-auto min-h-[400px]">
                                <Image
                                    src={currentTestimonial.image}
                                    alt={currentTestimonial.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>

                            <div className="md:w-1/2 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                                <div className="flex justify-center md:justify-start gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={20}
                                            className={
                                                i < currentTestimonial.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "fill-gray-200 text-gray-200"
                                            }
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-8 min-h-[120px]">
                                    &#34;{currentTestimonial.message}&#34;
                                </p>

                                <div className="flex items-center justify-center md:justify-start gap-3 mb-8">
                                    <div className="w-12 h-0.5 bg-blue-500"/>
                                    <span className="font-bold text-gray-900 text-lg">
                                        {currentTestimonial.name}
                                    </span>
                                </div>

                                <div className="flex gap-2 justify-center md:justify-start">
                                    {testimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`h-2 rounded-full transition-all ${
                                                index === currentIndex
                                                    ? "w-8 bg-blue-500"
                                                    : "w-2 bg-gray-300 hover:bg-gray-400"
                                            }`}
                                            aria-label={`Go to testimonial ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                            <Button
                                size="icon"
                                variant="outline"
                                className="rounded-full bg-white hover:bg-blue-50 hover:border-blue-300 transition-all shadow-lg"
                                onClick={handlePrev}
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="h-5 w-5"/>
                            </Button>
                            <Button
                                size="icon"
                                variant="outline"
                                className="rounded-full bg-white hover:bg-blue-50 hover:border-blue-300 transition-all shadow-lg"
                                onClick={handleNext}
                                aria-label="Next testimonial"
                            >
                                <ChevronRight className="h-5 w-5"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}