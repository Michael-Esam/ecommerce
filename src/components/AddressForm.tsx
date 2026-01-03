"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, createAddress } from "@/lib/actions/address";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
    onSuccess?: () => void;
}

export default function AddressForm({ onSuccess }: AddressFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema) as any,
        defaultValues: {
            type: "shipping",
            isDefault: true,
            line1: "",
            line2: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
        } as AddressFormData,
    });

    const onSubmit = async (data: AddressFormData) => {
        setIsSubmitting(true);
        try {
            await createAddress(data);
            reset();
            router.refresh();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Failed to create address:", error);
            alert("Failed to save address. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-dark-700">Type</label>
                    <select
                        {...register("type")}
                        className="mt-1 block w-full rounded-md border-light-200 bg-light-100 px-4 py-2 text-dark-900 focus:border-dark-900 focus:ring-dark-900"
                    >
                        <option value="shipping">Shipping</option>
                        <option value="billing">Billing</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-dark-700">Address Line 1</label>
                <input
                    type="text"
                    {...register("line1")}
                    className="mt-1 block w-full rounded-md border-light-200 bg-light-100 px-4 py-2 text-dark-900 focus:border-dark-900 focus:ring-dark-900"
                />
                {errors.line1 && <p className="mt-1 text-sm text-red-500">{errors.line1.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-dark-700">Address Line 2 (Optional)</label>
                <input
                    type="text"
                    {...register("line2")}
                    className="mt-1 block w-full rounded-md border-light-200 bg-light-100 px-4 py-2 text-dark-900 focus:border-dark-900 focus:ring-dark-900"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-dark-700">City</label>
                    <input
                        type="text"
                        {...register("city")}
                        className="mt-1 block w-full rounded-md border-light-200 bg-light-100 px-4 py-2 text-dark-900 focus:border-dark-900 focus:ring-dark-900"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-dark-700">State</label>
                    <input
                        type="text"
                        {...register("state")}
                        className="mt-1 block w-full rounded-md border-light-200 bg-light-100 px-4 py-2 text-dark-900 focus:border-dark-900 focus:ring-dark-900"
                    />
                    {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-dark-700">Country</label>
                    <input
                        type="text"
                        {...register("country")}
                        className="mt-1 block w-full rounded-md border-light-200 bg-light-100 px-4 py-2 text-dark-900 focus:border-dark-900 focus:ring-dark-900"
                    />
                    {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-dark-700">Postal Code</label>
                    <input
                        type="text"
                        {...register("postalCode")}
                        className="mt-1 block w-full rounded-md border-light-200 bg-light-100 px-4 py-2 text-dark-900 focus:border-dark-900 focus:ring-dark-900"
                    />
                    {errors.postalCode && <p className="mt-1 text-sm text-red-500">{errors.postalCode.message}</p>}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    {...register("isDefault")}
                    id="isDefault"
                    className="h-4 w-4 rounded border-light-200 text-dark-900 focus:ring-dark-900"
                />
                <label htmlFor="isDefault" className="text-sm text-dark-700">
                    Set as default address
                </label>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-dark-900 py-3 text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
            >
                {isSubmitting ? "Saving..." : "Save Address"}
            </button>
        </form>
    );
}
