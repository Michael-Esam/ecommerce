import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products } from "./products";
import { user } from "./user";

export const wishlists = pgTable("wishlists", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
    productId: uuid("product_id")
        .notNull()
        .references(() => products.id),
    addedAt: timestamp("added_at").notNull().defaultNow(),
});

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
    user: one(user, {
        fields: [wishlists.userId],
        references: [user.id],
    }),
    product: one(products, {
        fields: [wishlists.productId],
        references: [products.id],
    }),
}));
