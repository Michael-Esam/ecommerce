"use server";

import { db } from "@/lib/db";
import { wishlists } from "@/lib/db/schema/wishlists";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return { error: "Unauthorized" };
    }

    const userId = session.user.id;

    const existingWishlist = await db.query.wishlists.findFirst({
        where: and(
            eq(wishlists.userId, userId),
            eq(wishlists.productId, productId)
        ),
    });

    if (existingWishlist) {
        await db.delete(wishlists).where(eq(wishlists.id, existingWishlist.id));
        revalidatePath(`/products/${productId}`);
        return { isFavorite: false };
    } else {
        await db.insert(wishlists).values({
            userId,
            productId,
        });
        revalidatePath(`/products/${productId}`);
        return { isFavorite: true };
    }
}

export async function checkWishlistStatus(productId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return false;
    }

    const userId = session.user.id;

    const existingWishlist = await db.query.wishlists.findFirst({
        where: and(
            eq(wishlists.userId, userId),
            eq(wishlists.productId, productId)
        ),
    });

    return !!existingWishlist;
}

export async function getFavorites() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return [];
    }

    const userId = session.user.id;

    const userWishlist = await db.query.wishlists.findMany({
        where: eq(wishlists.userId, userId),
        with: {
            product: {
                with: {
                    images: true,
                    variants: true,
                },
            },
        },
        orderBy: (wishlists, { desc }) => [desc(wishlists.addedAt)],
    });

    return userWishlist.map((item) => item.product);
}
