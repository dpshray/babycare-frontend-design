'use client';

import Image from "next/image";
import {Button} from "@/components/ui/button";
import React, {useCallback, useState} from "react";
import {cn} from "@/lib/utils";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import cartService from "@/Service/cart.service";
import {useRouter} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Heart, Minus, Plus, ShoppingCart, Store} from "lucide-react";
import {toast} from "sonner";
import productService from "@/Service/product.service";
import RatingDisplay from "@/components/Rating";

interface Product {
    name: string;
    slug: string;
    brand: string;
    rating: number;
    price: number;
    previous_price: number;
    feature_image: string;
    discount_percent: number;
    liked: boolean;
    stock: number;
    store_name: string;
}

interface ProductCardProps {
    product: Product;
    className?: string;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({product, className}) => {
    const {name, price, previous_price, feature_image, slug, stock, liked, rating, store_name} = product;
    const queryClient = useQueryClient();
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [isLiked, setIsLiked] = useState(liked);

    const {mutate: addToCart, isPending} = useMutation({
        mutationFn: (payload: { slug: string; quantity: number }) =>
            cartService.addToCart(payload).then((res) => {
                toast.success(res.message || "Product added to cart");
            }),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["cart"]}),
        onError: (error) => {
            toast.error(error?.message || "Please try again");
        },
    });

    const {mutate: toggleFavorite, isPending: isFavoritePending} = useMutation({
        mutationFn: () => productService.addToFavorite(slug).then((res) => {
            toast.success(res.message || "Product added to favorite");
        }),
        onSuccess: () => {
            setIsLiked((prev) => !prev);
            queryClient.invalidateQueries({queryKey: ["products"]});
            queryClient.invalidateQueries({queryKey: ["favorites"]});
        },
        onError: (error) => {
            toast.error(error?.message || "Please try again");
        },
    });

    const handleAddToCart = useCallback(() => {
        if (quantity > 0 && quantity <= stock) {
            addToCart({slug, quantity});
        }
    }, [addToCart, slug, quantity, stock]);

    const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite();
    }, [toggleFavorite]);

    const handleProductClick = useCallback(() => router.push(`/products/${slug}`), [router, slug]);

    const incrementQuantity = useCallback(() => setQuantity((prev) => Math.min(prev + 1, stock)), [stock]);
    const decrementQuantity = useCallback(() => setQuantity((prev) => Math.max(prev - 1, 1)), []);
    const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 1;
        setQuantity(Math.max(1, Math.min(value, stock)));
    }, [stock]);

    const isOutOfStock = stock === 0;

    return (
        <div className={cn(
            "bg-white border border-gray-200 rounded-lg p-3 sm:p-4 flex flex-col hover:shadow-lg hover:border-blue-300 transition-all duration-200 h-full relative",
            className
        )}>
            <div
                className="aspect-square relative mb-3 flex items-center justify-center overflow-hidden rounded-md bg-gray-50 cursor-pointer"
                onClick={handleProductClick}
            >
                <Image
                    src={feature_image}
                    alt={name}
                    width={200}
                    height={200}
                    className="object-contain hover:scale-105 transition-transform duration-300 w-full h-full"
                    loading="lazy"
                />
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-xs sm:text-sm font-bold px-3 py-1 bg-red-600 rounded-full">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-grow min-h-0">
                <h3
                    className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2 leading-snug cursor-pointer hover:text-blue-600 transition-colors mb-2"
                    onClick={handleProductClick}
                >
                    {name}
                </h3>

                {store_name && (
                    <div className="flex items-center gap-1.5 mb-2">
                        <Store className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600 truncate">
                            {store_name}
                        </span>
                    </div>
                )}

                <RatingDisplay rating={rating} maxRating={5} size="sm"/>

                <div className="mt-auto space-y-3 pt-2">
                    <div className="flex items-baseline gap-2">
                        <p className="text-base sm:text-lg font-bold text-blue-600">
                            Rs. {price.toFixed(2)}
                        </p>
                        {previous_price > price && (
                            <p className="text-xs sm:text-sm text-gray-400 line-through">
                                Rs. {previous_price.toFixed(2)}
                            </p>
                        )}
                    </div>


                    <div className="flex items-center border w-fit border-gray-300 rounded-full overflow-hidden">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-none hover:bg-gray-100"
                            onClick={decrementQuantity}
                            disabled={quantity <= 1 || isOutOfStock}
                        >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4"/>
                        </Button>
                        <Input
                            type="number"
                            value={quantity}
                            min={1}
                            max={stock}
                            className="w-10 sm:w-12 h-7 sm:h-8 text-center border-0 text-xs sm:text-sm p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-0"
                            onChange={handleQuantityChange}
                            disabled={isOutOfStock}
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-none hover:bg-gray-100"
                            onClick={incrementQuantity}
                            disabled={quantity >= stock || isOutOfStock}
                        >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4"/>
                        </Button>
                    </div>
                    <div className="flex   gap-1.5 sm:gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs sm:text-sm h-7 sm:h-8"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock || isPending}
                        >
                            <ShoppingCart className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5"/>
                            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </Button>

                        <Button
                            size="icon"
                            variant="ghost"
                            className={cn(
                                "h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0",
                                isLiked && "bg-red-50 hover:bg-red-100"
                            )}
                            onClick={handleToggleFavorite}
                            disabled={isFavoritePending}
                            aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                            aria-pressed={isLiked}
                        >
                            <Heart
                                className={cn(
                                    "h-4 w-4 transition-all",
                                    isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                                )}
                            />
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;