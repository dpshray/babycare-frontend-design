import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";

export function VendorCTASection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-[#43529A] via-indigo-400 to-[#43529A] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 mx-auto border border-white/30">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Start Selling on BabyCare
          </h2>
          
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of vendors reaching parents who trust BabyCare. 
            Grow your business with our trusted marketplace platform.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/vendor-register">
              <Button 
                size="lg" 
                className="cursor-pointer bg-white text-blue-600 hover:bg-blue-50 font-semibold py-4 text-lg h-auto"
              >
                Register as Vendor
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}