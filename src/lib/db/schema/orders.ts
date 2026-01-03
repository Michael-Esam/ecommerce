import { pgTable, text, uuid, integer, numeric, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./user";
import { addresses } from "./addresses";
import { productVariants } from "./variants";

export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "shipped", "delivered", "cancelled"]);

export const orders = pgTable("orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .references(() => user.id),
    stripeSessionId: text("stripe_session_id").unique(),
    email: text("email"),
    status: orderStatusEnum("status").notNull().default("pending"),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    shippingAddressId: uuid("shipping_address_id")
        .notNull()
        .references(() => addresses.id),
    billingAddressId: uuid("billing_address_id")
        .notNull()
        .references(() => addresses.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
        .notNull()
        .references(() => orders.id),
    productVariantId: uuid("product_variant_id")
        .notNull()
        .references(() => productVariants.id),
    quantity: integer("quantity").notNull(),
    priceAtPurchase: numeric("price_at_purchase", { precision: 10, scale: 2 }).notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(user, {
        fields: [orders.userId],
        references: [user.id],
    }),
    shippingAddress: one(addresses, {
        fields: [orders.shippingAddressId],
        references: [addresses.id],
        relationName: "shipping_address",
    }),
    billingAddress: one(addresses, {
        fields: [orders.billingAddressId],
        references: [addresses.id],
        relationName: "billing_address",
    }),
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    variant: one(productVariants, {
        fields: [orderItems.productVariantId],
        references: [productVariants.id],
    }),
}));
