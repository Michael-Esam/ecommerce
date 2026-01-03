"use client";

import { useCartStore } from "@/store/cart.store";
import Link from "next/link";

interface OrderSummaryProps {
    hideCheckoutButton?: boolean;
}

export default function OrderSummary({ hideCheckoutButton = false }: OrderSummaryProps) {
    const { cart } = useCartStore();

    if (!cart) return null;

    return (
        <div className="rounded-lg bg-light-100 p-6">
            <h2 className="text-lg font-medium text-dark-900">Summary</h2>
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-light-200 pb-4">
                    <dt className="text-base text-dark-700">Subtotal</dt>
                    <dd className="text-base font-medium text-dark-900">${cart.subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between border-b border-light-200 pb-4">
                    <dt className="text-base text-dark-700">Estimated Delivery & Handling</dt>
                    <dd className="text-base font-medium text-dark-900">Free</dd>
                </div>
                <div className="flex items-center justify-between border-b border-light-200 pb-4">
                    <dt className="text-base text-dark-700">Estimated Tax</dt>
                    <dd className="text-base font-medium text-dark-900">${cart.tax.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between pt-4">
                    <dt className="text-lg font-medium text-dark-900">Total</dt>
                    <dd className="text-lg font-medium text-dark-900">${cart.total.toFixed(2)}</dd>
                </div>
            </div>

            {!hideCheckoutButton && (
                <div className="mt-6">
                    <Link
                        href="/checkout"
                        className="flex w-full items-center justify-center rounded-full bg-dark-900 py-4 text-base font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Checkout
                    </Link>
                </div>
            )}
        </div>
    );
}
