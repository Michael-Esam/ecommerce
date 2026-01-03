"use client";

import { Ruler } from "lucide-react";

interface SizePickerProps {
    sizes: string[];
    selectedSize: string | null;
    onSelect: (size: string) => void;
}

export default function SizePicker({ sizes, selectedSize, onSelect }: SizePickerProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-body font-medium text-dark-900">Select Size</span>
                <button className="flex items-center gap-2 text-body font-medium text-dark-700 hover:text-dark-900">
                    <Ruler className="h-4 w-4" />
                    Size Guide
                </button>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {sizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => onSelect(size)}
                        className={`flex h-12 items-center justify-center rounded-lg border text-body font-medium transition-colors ${selectedSize === size
                            ? "border-dark-900 bg-dark-900 text-white"
                            : "border-light-200 bg-white text-dark-900 hover:border-dark-900"
                            }`}
                    >
                        {size}
                    </button>
                ))}
            </div>
        </div>
    );
}
