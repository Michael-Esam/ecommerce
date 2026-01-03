
"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart.store";
import CartItem from "@/components/CartItem";
import CartSummary from "@/components/CartSummary";
import Link from "next/link";

export default function CartPage() {
    const { cart, isLoading, fetchCart } = useCartStore();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    if (isLoading && !cart) {
        return (
            <div className="min-h-screen bg-white pb-20 pt-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-medium text-dark-900">Bag</h1>
                    <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
                        <div className="lg:col-span-8">
                            <div className="h-24 w-full animate-pulse rounded-md bg-light-200" />
                            <div className="mt-4 h-24 w-full animate-pulse rounded-md bg-light-200" />
                        </div>
                        <div className="lg:col-span-4">
                            <div className="h-64 w-full animate-pulse rounded-md bg-light-200" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-white pb-20 pt-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-medium text-dark-900">Bag</h1>
                    <div className="mt-20 text-center">
                        <p className="text-lg text-dark-700">Your bag is empty.</p>
                        <Link
                            href="/"
                            className="mt-4 inline-block rounded-full bg-dark-900 px-8 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20 pt-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-medium text-dark-900">Bag</h1>

                <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-8">
                        <div className="space-y-0">
                            {cart.items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-10">
                            <CartSummary />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
