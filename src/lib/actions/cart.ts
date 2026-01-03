"use server";

import { db } from "@/lib/db";
import { carts, cartItems, guest } from "@/lib/db/schema";
import { productVariants } from "@/lib/db/schema/variants";
import { products } from "@/lib/db/schema/products";
import { productImages } from "@/lib/db/schema/products";
import { eq, and } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getGuestSession, createGuestSession } from "@/lib/auth/actions";

export type CartItem = {
    id: string;
    variantId: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    color: string;
    size: string;
    quantity: number;
    maxStock: number;
};

export type Cart = {
    id: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
};

async function getCartId(createGuest = false) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user) {
        // User cart
        let cart = await db.query.carts.findFirst({
            where: eq(carts.userId, session.user.id),
        });

        if (!cart) {
            [cart] = await db.insert(carts).values({ userId: session.user.id }).returning();
        }
        return cart.id;
    } else {
        // Guest cart
        let guestToken = await getGuestSession();

        if (!guestToken) {
            if (createGuest) {
                guestToken = await createGuestSession();
            } else {
                return null;
            }
        }

        const guestRecord = await db.query.guest.findFirst({
            where: eq(guest.sessionToken, guestToken!),
        });

        if (!guestRecord) return null;

        let cart = await db.query.carts.findFirst({
            where: eq(carts.guestId, guestRecord.id),
        });

        if (!cart) {
            [cart] = await db.insert(carts).values({ guestId: guestRecord.id }).returning();
        }
        return cart.id;
    }
}

export async function getCart(): Promise<Cart | null> {
    const cartId = await getCartId();
    if (!cartId) return null;

    const items = await db.query.cartItems.findMany({
        where: eq(cartItems.cartId, cartId),
        with: {
            variant: {
                with: {
                    product: {
                        with: {
                            images: true,
                        },
                    },
                    color: true,
                    size: true,
                },
            },
        },
    });

    const formattedItems: CartItem[] = items.map((item) => {
        const variant = item.variant;
        if (!variant) return null; // Should not happen due to FK, but safe

        const product = variant.product;
        if (!product) return null;

        const image = product.images.find((img) => img.variantId === variant.id)?.url || product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url || "/placeholder.png";

        return {
            id: item.id,
            variantId: variant.id,
            productId: product.id,
            name: product.name,
            price: Number(variant.price),
            image,
            color: variant.color?.name || "Default",
            size: variant.size?.name || "Default",
            quantity: item.quantity,
            maxStock: variant.inStock,
        };
    }).filter((item): item is CartItem => item !== null);

    const subtotal = formattedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.1; // 10% tax for example
    const total = subtotal + tax;

    return {
        id: cartId,
        items: formattedItems,
        subtotal,
        tax,
        total,
    };
}

export async function addCartItem(variantId: string, quantity: number) {
    const cartId = await getCartId(true);
    if (!cartId) throw new Error("Could not retrieve cart");

    const existingItem = await db.query.cartItems.findFirst({
        where: and(
            eq(cartItems.cartId, cartId),
            eq(cartItems.productVariantId, variantId)
        ),
    });

    if (existingItem) {
        await db
            .update(cartItems)
            .set({ quantity: existingItem.quantity + quantity })
            .where(eq(cartItems.id, existingItem.id));
    } else {
        await db.insert(cartItems).values({
            cartId,
            productVariantId: variantId,
            quantity,
        });
    }

    return getCart();
}

export async function updateCartItem(itemId: string, quantity: number) {
    if (quantity <= 0) {
        return removeCartItem(itemId);
    }

    await db
        .update(cartItems)
        .set({ quantity })
        .where(eq(cartItems.id, itemId));

    return getCart();
}

export async function removeCartItem(itemId: string) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
    return getCart();
}

export async function clearCart() {
    const cartId = await getCartId();
    if (!cartId) return null;

    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    return getCart();
}
