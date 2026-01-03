"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, SlidersHorizontal } from "lucide-react";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils/client-query";

const filters = [
    {
        id: "gender",
        name: "Gender",
        options: [
            { label: "Men", value: "men" },
            { label: "Women", value: "women" },
            { label: "Unisex", value: "unisex" },
        ],
    },
    {
        id: "kids",
        name: "Kids",
        options: [
            { label: "Boys", value: "boys" },
            { label: "Girls", value: "girls" },
        ],
    },
    {
        id: "size",
        name: "Size",
        options: [
            { label: "S", value: "s" },
            { label: "M", value: "m" },
            { label: "L", value: "l" },
            { label: "XL", value: "xl" },
            { label: "XXL", value: "xxl" },
        ],
    },
    {
        id: "price",
        name: "Shop By Price",
        options: [
            { label: "$0 - $50", value: "0-50" },
            { label: "$50 - $100", value: "50-100" },
            { label: "$100 - $150", value: "100-150" },
            { label: "Over $150", value: "150-plus" },
        ],
    },
    {
        id: "color",
        name: "Color",
        options: [
            { label: "Black", value: "black" },
            { label: "Blue", value: "blue" },
            { label: "Brown", value: "brown" },
            { label: "Green", value: "green" },
            { label: "Grey", value: "grey" },
            { label: "Orange", value: "orange" },
            { label: "Pink", value: "pink" },
            { label: "Purple", value: "purple" },
            { label: "Red", value: "red" },
            { label: "White", value: "white" },
            { label: "Yellow", value: "yellow" },
        ],
    },
];

export default function Filters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Handle body scroll lock when mobile menu is open
    useEffect(() => {
        if (mobileFiltersOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mobileFiltersOpen]);

    const handleFilterChange = (key: string, value: string) => {
        let newUrl = "";
        const currentParams = searchParams.get(key);
        const currentValues = currentParams ? currentParams.split(",") : [];

        let newValues = [];
        if (currentValues.includes(value)) {
            newValues = currentValues.filter((v) => v !== value);
        } else {
            newValues = [...currentValues, value];
        }

        if (newValues.length > 0) {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key,
                value: newValues.join(","),
            });
        } else {
            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: [key],
            });
        }

        router.push(newUrl, { scroll: false });
    };

    const handleClearFilters = () => {
        router.push("/products", { scroll: false });
    };

    const FilterGroup = ({ section }: { section: typeof filters[0] }) => {
        const activeValues = searchParams.get(section.id)?.split(",") || [];
        const isGrid = section.id === "size" || section.id === "color";

        return (
            <div className="border-b border-light-300 py-6">
                <h3 className="mb-4 text-body font-medium text-dark-900">{section.name}</h3>
                <div className={isGrid ? "grid grid-cols-2 gap-4" : "space-y-3"}>
                    {section.options.map((option) => (
                        <div key={option.value} className="flex items-center">
                            <input
                                id={`${section.id}-${option.value}`}
                                name={`${section.id}[]`}
                                type="checkbox"
                                checked={activeValues.includes(option.value)}
                                onChange={() => handleFilterChange(section.id, option.value)}
                                className="h-5 w-5 rounded border-light-400 text-dark-900 focus:ring-dark-900"
                            />
                            <label
                                htmlFor={`${section.id}-${option.value}`}
                                className="ml-3 text-body text-dark-900 hover:text-dark-700 cursor-pointer"
                            >
                                {option.label}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Mobile Trigger */}
            <div className="flex items-center lg:hidden">
                <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="flex items-center gap-2 text-body font-medium text-dark-900"
                >
                    Filters
                    <SlidersHorizontal className="h-5 w-5" />
                </button>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden w-64 flex-none lg:block">
                <div className="mb-6">
                    <button
                        onClick={handleClearFilters}
                        className="text-body font-medium text-dark-700 hover:text-dark-900 underline"
                    >
                        Clear Filters
                    </button>
                </div>
                <div className="space-y-1">
                    {filters.map((section) => (
                        <FilterGroup key={section.id} section={section} />
                    ))}
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileFiltersOpen && (
                <div className="relative z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/25" onClick={() => setMobileFiltersOpen(false)} />
                    <div className="fixed inset-y-0 left-0 flex max-w-xs w-full flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                        <div className="flex items-center justify-between px-4 py-6 border-b border-light-300">
                            <h2 className="text-lg font-medium text-dark-900">Filters</h2>
                            <button
                                onClick={handleClearFilters}
                                className="text-sm font-medium text-dark-500 underline hover:text-dark-900"
                            >
                                Clear all
                            </button>
                        </div>

                        <div className="px-4">
                            {filters.map((section) => (
                                <FilterGroup key={section.id} section={section} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
