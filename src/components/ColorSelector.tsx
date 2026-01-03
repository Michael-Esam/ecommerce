"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Check } from "lucide-react";

interface Variant {
    id: string;
    slug: string;
    name: string;
    image: string; // Image for the swatch
}

interface ColorSelectorProps {
    variants: Variant[];
}

export default function ColorSelector({ variants }: ColorSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedColor = searchParams.get("color") || variants[0]?.slug;

    const handleColorSelect = (slug: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("color", slug);
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex gap-2">
            {variants.map((variant) => (
                <button
                    key={variant.id}
                    onClick={() => handleColorSelect(variant.slug)}
                    className={`relative h-16 w-16 overflow-hidden rounded-md border transition-all ${selectedColor === variant.slug
                            ? "border-dark-900 ring-1 ring-dark-900"
                            : "border-transparent hover:border-dark-300"
                        }`}
                    aria-label={`Select ${variant.name}`}
                >
                    <Image
                        src={variant.image}
                        alt={variant.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                    />
                    {selectedColor === variant.slug && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Check className="h-6 w-6 text-white drop-shadow-md" />
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
}
