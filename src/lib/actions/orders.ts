"use server";

import { db } from "@/lib/db";
import { orders, orderItems, addresses, cartItems, carts } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe/client";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

import Stripe from "stripe";

export async function createOrder(stripeSessionId: string) {
    // 1. Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
        expand: ["line_items", "line_items.data.price.product"],
    }) as any;

    if (!session) {
        throw new Error("Session not found");
    }

    // Check if order already exists
    const existingOrder = await db.query.orders.findFirst({
        where: eq(orders.stripeSessionId, session.id),
    });

    if (existingOrder) {
        return existingOrder.id;
    }

    const { metadata, customer_details, shipping_details } = session;
    const cartId = metadata?.cartId;
    const userId = metadata?.userId === "null" ? null : metadata?.userId;

    if (!cartId) {
        throw new Error("Cart ID missing in session metadata");
    }

    // 2. Save Addresses
    // Helper to save address
    const saveAddress = async (details: any, type: "billing" | "shipping") => {
        const addressData = {
            userId: userId, // Can be null
            type,
            line1: details.address.line1,
            line2: details.address.line2,
            city: details.address.city,
            state: details.address.state,
            country: details.address.country,
            postalCode: details.address.postal_code,
            isDefault: false,
        };
        const [savedAddress] = await db.insert(addresses).values(addressData).returning();
        return savedAddress.id;
    };

    const shippingAddressId = await saveAddress(shipping_details || customer_details, "shipping");
    const billingAddressId = await saveAddress(customer_details, "billing"); // Fallback to customer details if billing not separate

    // 3. Create Order
    const totalAmount = session.amount_total ? (session.amount_total / 100).toString() : "0";

    const [newOrder] = await db.insert(orders).values({
        userId: userId,
        stripeSessionId: session.id,
        email: customer_details?.email,
        status: "paid", // Assuming checkout.session.completed means paid
        totalAmount,
        shippingAddressId,
        billingAddressId,
    }).returning();

    // 4. Create Order Items
    // We can use the cart items or the session line items. 
    // Using cart items ensures we link to our internal product variants correctly if we trust the cartId.
    // But session line items are what was actually paid for.
    // Let's use cart items for now as it's easier to link to variants.

    const cartItemsData = await db.query.cartItems.findMany({
        where: eq(cartItems.cartId, cartId),
        with: {
            variant: true,
        }
    });

    for (const item of cartItemsData) {
        await db.insert(orderItems).values({
            orderId: newOrder.id,
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            priceAtPurchase: item.variant.price, // Or use session item price
        });
    }

    // 5. Clear Cart
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    // Optionally delete cart
    // await db.delete(carts).where(eq(carts.id, cartId));

    return newOrder.id;
}

export async function getOrder(orderId: string) {
    const order = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
        with: {
            items: {
                with: {
                    variant: {
                        with: {
                            product: true,
                        }
                    }
                }
            },
            shippingAddress: true,
            billingAddress: true,
        }
    });

    return order;
}
