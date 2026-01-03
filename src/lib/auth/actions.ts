"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signUpSchema, signInSchema } from "./schema";
import { z } from "zod";
import { db } from "@/lib/db";
import { guest } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";
import { carts, cartItems } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function signUp(data: z.infer<typeof signUpSchema>) {
    const result = signUpSchema.safeParse(data);
    if (!result.success) {
        return { error: "Invalid input" };
    }

    const { name, email, password } = result.data;

    try {
        await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
            },
        });

        // Migrate guest cart logic here
        await mergeGuestCartWithUserCart();
    } catch (error) {
        return { error: "Failed to sign up" };
    }
    redirect("/");
}

export async function signIn(data: z.infer<typeof signInSchema>) {
    const result = signInSchema.safeParse(data);
    if (!result.success) {
        return { error: "Invalid input" };
    }

    const { email, password } = result.data;

    try {
        await auth.api.signInEmail({
            body: {
                email,
                password,
            },
        });

        // Migrate guest cart logic here
        await mergeGuestCartWithUserCart();
    } catch (error) {
        return { error: "Failed to sign in" };
    }
    redirect("/");
}

export async function signOut() {
    await auth.api.signOut({
        headers: await headers()
    });
    redirect("/");
}

export async function createGuestSession() {
    const sessionToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    await db.insert(guest).values({
        sessionToken,
        expiresAt,
    });

    (await cookies()).set("guest_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: expiresAt,
    });

    return sessionToken;
}

export async function getGuestSession() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("guest_session")?.value;
    return sessionToken;
}

export async function mergeGuestCartWithUserCart() {
    const guestSessionToken = await getGuestSession();
    if (!guestSessionToken) return;

    const guestRecord = await db.query.guest.findFirst({
        where: eq(guest.sessionToken, guestSessionToken),
    });

    if (!guestRecord) return;

    const guestCart = await db.query.carts.findFirst({
        where: eq(carts.guestId, guestRecord.id),
        with: {
            items: true,
        },
    });

    if (!guestCart || guestCart.items.length === 0) {
        (await cookies()).delete("guest_session");
        return;
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) return;

    let userCart = await db.query.carts.findFirst({
        where: eq(carts.userId, session.user.id),
    });

    if (!userCart) {
        [userCart] = await db.insert(carts).values({ userId: session.user.id }).returning();
    }

    for (const item of guestCart.items) {
        const existingItem = await db.query.cartItems.findFirst({
            where: and(
                eq(cartItems.cartId, userCart.id),
                eq(cartItems.productVariantId, item.productVariantId)
            ),
        });

        if (existingItem) {
            await db
                .update(cartItems)
                .set({ quantity: existingItem.quantity + item.quantity })
                .where(eq(cartItems.id, existingItem.id));
        } else {
            await db.insert(cartItems).values({
                cartId: userCart.id,
                productVariantId: item.productVariantId,
                quantity: item.quantity,
            });
        }
    }

    // Clean up guest cart and items
    await db.delete(cartItems).where(eq(cartItems.cartId, guestCart.id));
    await db.delete(carts).where(eq(carts.id, guestCart.id));
    // Guest record cleanup could be done here or by a cron job

    (await cookies()).delete("guest_session");
}
