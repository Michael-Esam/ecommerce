"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
    title: string;
    children?: React.ReactNode;
    defaultOpen?: boolean;
}

export default function CollapsibleSection({
    title,
    children,
    defaultOpen = false,
}: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-t border-light-200 py-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between text-left"
            >
                <span className="text-body font-medium text-dark-900">{title}</span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-dark-900" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-dark-900" />
                )}
            </button>
            {isOpen && <div className="mt-4 text-body text-dark-700">{children}</div>}
        </div>
    );
}
