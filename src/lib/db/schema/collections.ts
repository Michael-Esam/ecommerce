import { pgTable, text, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products } from "./products";

export const collections = pgTable("collections", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productCollections = pgTable("product_collections", {
    productId: uuid("product_id")
        .notNull()
        .references(() => products.id),
    collectionId: uuid("collection_id")
        .notNull()
        .references(() => collections.id),
}, (t) => ({
    pk: primaryKey({ columns: [t.productId, t.collectionId] }),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
    products: many(productCollections),
}));

export const productCollectionsRelations = relations(productCollections, ({ one }) => ({
    product: one(products, {
        fields: [productCollections.productId],
        references: [products.id],
    }),
    collection: one(collections, {
        fields: [productCollections.collectionId],
        references: [collections.id],
    }),
}));

import { createInsertSchema } from "drizzle-zod";

export const insertCollectionSchema = createInsertSchema(collections);
