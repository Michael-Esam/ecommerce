
"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import SizePicker from "@/components/SizePicker";
import { useCartStore } from "@/store/cart.store";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import { toggleWishlist, checkWishlistStatus } from "@/lib/actions/wishlist";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
    product: any; // Using any for simplicity, but ideally should be typed
    selectedColorSlug: string;
    uniqueSizes: string[];
}

export default function ProductActions({ product, selectedColorSlug, uniqueSizes }: ProductActionsProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const { addItem } = useCartStore();
    const router = useRouter();
    const [isAdding, setIsAdding] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isFavLoading, setIsFavLoading] = useState(true);

    const { showToast } = useToast();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const status = await checkWishlistStatus(product.id);
                setIsFavorite(status);
            } catch (error) {
                console.error("Failed to check wishlist status", error);
            } finally {
                setIsFavLoading(false);
            }
        };
        checkStatus();
    }, [product.id]);

    const handleAddToBag = async () => {
        if (!selectedSize) {
            showToast("Please select a size", "error");
            return;
        }

        const variant = product.variants.find(
            (v: any) => v.color?.slug === selectedColorSlug && v.size?.name === selectedSize
        );

        if (!variant) {
            showToast("This variant is unavailable", "error");
            return;
        }

        setIsAdding(true);
        await addItem(variant.id, 1);
        setIsAdding(false);
        showToast("Added to bag", "success");
        router.push("/cart");
    };

    const handleToggleFavorite = async () => {
        setIsFavLoading(true);
        try {
            const result = await toggleWishlist(product.id);
            if (result.error) {
                showToast(result.error, "error");
                if (result.error === "Unauthorized") {
                    router.push("/sign-in");
                }
            } else {
                setIsFavorite(!!result.isFavorite);
                showToast(result.isFavorite ? "Added to favorites" : "Removed from favorites", "success");
            }
        } catch (error) {
            showToast("Failed to update favorites", "error");
        } finally {
            setIsFavLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <SizePicker
                sizes={uniqueSizes}
                selectedSize={selectedSize}
                onSelect={setSelectedSize}
            />

            <div className="space-y-4">
                <button
                    onClick={handleAddToBag}
                    disabled={isAdding}
                    className="flex w-full items-center justify-center rounded-full bg-dark-900 py-4 text-body font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                >
                    {isAdding ? "Adding..." : "Add to Bag"}
                </button>
                <button
                    onClick={handleToggleFavorite}
                    disabled={isFavLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-light-200 py-4 text-body font-medium text-dark-900 transition-colors hover:border-dark-900 disabled:opacity-70"
                >
                    <Heart className={cn("h-5 w-5 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "")} />
                    {isFavorite ? "Favorited" : "Favorite"}
                </button>
            </div>
        </div>
    );
}
