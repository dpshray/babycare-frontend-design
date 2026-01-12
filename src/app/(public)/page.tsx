'use client'
import {HeroSection} from "@/components/header/HeroSection";
import {CategoryList} from "@/components/category/CategoryList";
import ProductCard from "@/components/product/ProductCard";
import {TestimonialSection} from "@/components/Slider/Testimonial";
import {AppPromo} from "@/components/Slider/App-promo";
import {useProducts} from "@/hooks/useProduct";
import {FeaturesSection} from "@/components/header/features-section";
import { VendorCTASection } from "@/components/header/VendorCTASection";

export default function Page() {
    const {products, isLoading, totalPages} = useProducts({
        page: 1,
        per_page: 8,

    })
    return (
        <main className="min-h-screen">
            <HeroSection/>
            <CategoryList/>
            <section className="py-16 bg-[#fcfcfc]">
                <div className="container mx-auto px-4">
                    <h2 className="text-center text-2xl font-bold mb-10 uppercase">
                        Latest <span className="text-blue-500">In Store</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.map((items, i) => (
                            <ProductCard product={items} key={i}/>
                        ))}
                    </div>
                </div>
            </section>
            <TestimonialSection/>
            <FeaturesSection/>
            <AppPromo/>
            <VendorCTASection />
        </main>
    )
}