
"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/lib/actions/cart";
import { useCartStore } from "@/store/cart.store";

interface CartItemProps {
    item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
    const { updateItem, removeItem } = useCartStore();

    const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newQuantity = parseInt(e.target.value);
        updateItem(item.id, newQuantity);
    };

    return (
        <div className="flex gap-6 py-6 border-b border-light-200 last:border-0">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-light-200">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                    <div>
                        <h3 className="text-base font-medium text-dark-900">{item.name}</h3>
                        <p className="mt-1 text-sm text-dark-500">{item.color} / {item.size}</p>
                    </div>
                    <p className="text-base font-medium text-dark-900">${item.price.toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor={`quantity-${item.id}`} className="text-sm text-dark-500">
                                Quantity
                            </label>
                            <select
                                id={`quantity-${item.id}`}
                                value={item.quantity}
                                onChange={handleQuantityChange}
                                className="rounded-md border border-light-200 py-1 pl-2 pr-6 text-sm focus:border-dark-900 focus:outline-none"
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}
