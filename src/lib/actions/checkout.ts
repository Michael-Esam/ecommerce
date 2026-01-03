"use server";

import { stripe } from "@/lib/stripe/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { carts, cartItems, guest } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { mergeGuestCartWithUserCart, getGuestSession } from "@/lib/auth/actions";

export async function createStripeCheckoutSession() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    let cart;
    let user = session?.user;

    if (user) {
        await mergeGuestCartWithUserCart();
        cart = await db.query.carts.findFirst({
            where: eq(carts.userId, user.id),
            with: {
                items: {
                    with: {
                        variant: {
                            with: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });
    } else {
        const guestSessionToken = await getGuestSession();
        if (guestSessionToken) {
            const guestRecord = await db.query.guest.findFirst({
                where: eq(guest.sessionToken, guestSessionToken),
            });

            if (guestRecord) {
                cart = await db.query.carts.findFirst({
                    where: eq(carts.guestId, guestRecord.id),
                    with: {
                        items: {
                            with: {
                                variant: {
                                    with: {
                                        product: true,
                                    },
                                },
                            },
                        },
                    },
                });
            }
        }
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        throw new Error("Cart is empty");
    }

    const lineItems = cart.items.map((item) => {
        const product = item.variant.product;
        const variant = item.variant;

        // Ensure price is in cents
        const unitAmount = Math.round(Number(variant.price) * 100);

        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.name,
                    description: product.description || undefined,
                    images: [], // Add images if available
                    metadata: {
                        productId: product.id,
                        variantId: variant.id,
                    }
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity,
        };
    });

    const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
        metadata: {
            cartId: cart.id,
            userId: user?.id || null,
        },
        customer_email: user?.email, // Pre-fill email if user is logged in
        shipping_address_collection: {
            allowed_countries: ["US", "CA", "GB"], // Add more as needed
        },
        billing_address_collection: "required",
    });

    if (!checkoutSession.url) {
        throw new Error("Failed to create checkout session");
    }

    return { url: checkoutSession.url };
}
