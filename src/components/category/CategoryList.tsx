import Image from "next/image";
import {useCategories} from "@/hooks/useCategories";


export function CategoryList() {

    const {categories, isLoading: isLoadingCats} = useCategories()
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-center text-2xl font-bold mb-10">
                    <span className="text-blue-900">SHOP</span> BY CATEGORY
                </h2>

                <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                    {categories.map((cat) => (
                        <div
                            key={cat.name}
                            className="flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
                        >
                            <div
                                className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-gray-100 hover:border-blue-300 transition-all p-1">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    width={96}
                                    height={96}
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 text-center">
                {cat.name}
              </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
