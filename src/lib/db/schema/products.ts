import { pgTable, text, uuid, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { categories } from "./categories";
import { genders } from "./filters/genders";
import { brands } from "./filters/brands";
import { productVariants } from "./variants";
import { productCollections } from "./collections";
import { reviews } from "./reviews";

export const products = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    categoryId: uuid("category_id").references(() => categories.id),
    genderId: uuid("gender_id").references(() => genders.id),
    brandId: uuid("brand_id").references(() => brands.id),
    isPublished: boolean("is_published").default(false),
    defaultVariantId: uuid("default_variant_id"), // Circular reference handled in relations or separate update
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productImages = pgTable("product_images", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
        .notNull()
        .references(() => products.id),
    variantId: uuid("variant_id"), // Can be null if image is general for product
    url: text("url").notNull(),
    sortOrder: integer("sort_order").default(0),
    isPrimary: boolean("is_primary").default(false),
});

export const productsRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    gender: one(genders, {
        fields: [products.genderId],
        references: [genders.id],
    }),
    brand: one(brands, {
        fields: [products.brandId],
        references: [brands.id],
    }),
    variants: many(productVariants),
    images: many(productImages),
    collections: many(productCollections),
    reviews: many(reviews),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
    product: one(products, {
        fields: [productImages.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [productImages.variantId],
        references: [productVariants.id],
    }),
}));

import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const insertProductSchema = createInsertSchema(products);
export const insertProductImageSchema = createInsertSchema(productImages);

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertProductImage = z.infer<typeof insertProductImageSchema>;
