import { pgTable, text, uuid, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user";
import { guest } from "./guest";
import { productVariants } from "./variants";

export const carts = pgTable("carts", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => user.id),
    guestId: uuid("guest_id").references(() => guest.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cartItems = pgTable("cart_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    cartId: uuid("cart_id")
        .notNull()
        .references(() => carts.id),
    productVariantId: uuid("product_variant_id")
        .notNull()
        .references(() => productVariants.id),
    quantity: integer("quantity").notNull(),
});

export const cartsRelations = relations(carts, ({ one, many }) => ({
    user: one(user, {
        fields: [carts.userId],
        references: [user.id],
    }),
    guest: one(guest, {
        fields: [carts.guestId],
        references: [guest.id],
    }),
    items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
    cart: one(carts, {
        fields: [cartItems.cartId],
        references: [carts.id],
    }),
    variant: one(productVariants, {
        fields: [cartItems.productVariantId],
        references: [productVariants.id],
    }),
}));
