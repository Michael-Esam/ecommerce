"use server";

import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

export const addressSchema = z.object({
    type: z.enum(["billing", "shipping"]),
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    country: z.string().min(1, "Country is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    isDefault: z.boolean().default(false),
});

export async function getAddresses() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return [];
    }

    return db.query.addresses.findMany({
        where: eq(addresses.userId, session.user.id),
    });
}

export async function createAddress(data: z.infer<typeof addressSchema>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const validated = addressSchema.parse(data);

    if (validated.isDefault) {
        // Unset other defaults for this type
        await db
            .update(addresses)
            .set({ isDefault: false })
            .where(
                and(
                    eq(addresses.userId, session.user.id),
                    eq(addresses.type, validated.type)
                )
            );
    }

    const [newAddress] = await db.insert(addresses).values({
        ...validated,
        userId: session.user.id,
    }).returning();

    return newAddress;
}

export async function deleteAddress(addressId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    await db.delete(addresses).where(
        and(
            eq(addresses.id, addressId),
            eq(addresses.userId, session.user.id)
        )
    );
}
