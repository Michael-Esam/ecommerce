"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { formUrlQuery } from "@/lib/utils/client-query";

const sortOptions = [
    { name: "Featured", value: "featured" },
    { name: "Newest", value: "newest" },
    { name: "Price: High-Low", value: "price_desc" },
    { name: "Price: Low-High", value: "price_asc" },
];

export default function Sort() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);

    const activeSort = searchParams.get("sort") || "featured";
    const activeLabel = sortOptions.find((opt) => opt.value === activeSort)?.name || "Sort By";

    const handleSort = (value: string) => {
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "sort",
            value,
        });

        router.push(newUrl, { scroll: false });
        setOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 text-body font-medium text-dark-900 hover:text-dark-700"
            >
                {activeLabel}
                <ChevronDown className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-lg bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5">
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSort(option.value)}
                            className={`block w-full rounded-md px-4 py-2 text-left text-body hover:bg-light-200 ${activeSort === option.value ? "font-medium text-dark-900" : "text-dark-700"
                                }`}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
