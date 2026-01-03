
"use client";

import { useCartStore } from "@/store/cart.store";
import { useRouter } from "next/navigation";
import { createStripeCheckoutSession } from "@/lib/actions/checkout";

export default function CartSummary() {
    const { cart } = useCartStore();
    const router = useRouter();

    if (!cart) return null;

    return (
        <div className="rounded-lg bg-light-100 p-6">
            <h2 className="text-lg font-medium text-dark-900">Summary</h2>

            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-light-200 pb-4">
                    <span className="text-base text-dark-900">Subtotal</span>
                    <span className="text-base font-medium text-dark-900">
                        ${cart.subtotal.toFixed(2)}
                    </span>
                </div>
                <div className="flex items-center justify-between border-b border-light-200 pb-4">
                    <span className="text-base text-dark-900">Estimated Delivery & Handling</span>
                    <span className="text-base font-medium text-dark-900">Free</span>
                </div>
                <div className="flex items-center justify-between border-b border-light-200 pb-4">
                    <span className="text-base text-dark-900">Estimated Tax</span>
                    <span className="text-base font-medium text-dark-900">
                        ${cart.tax.toFixed(2)}
                    </span>
                </div>
                <div className="flex items-center justify-between pt-4">
                    <span className="text-lg font-medium text-dark-900">Total</span>
                    <span className="text-lg font-medium text-dark-900">
                        ${cart.total.toFixed(2)}
                    </span>
                </div>
            </div>

            <button
                className="mt-6 w-full rounded-full bg-dark-900 py-4 text-base font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={async () => {
                    try {
                        const { url } = await createStripeCheckoutSession();
                        if (url) router.push(url);
                    } catch (error) {
                        console.error("Checkout failed:", error);
                        // Ideally show a toast here
                    }
                }}
            >
                Checkout
            </button>
        </div>
    );
}
