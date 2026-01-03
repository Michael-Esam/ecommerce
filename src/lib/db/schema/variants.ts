import { pgTable, text, uuid, integer, numeric, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products } from "./products";
import { colors } from "./filters/colors";
import { sizes } from "./filters/sizes";

export const productVariants = pgTable("product_variants", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
        .notNull()
        .references(() => products.id),
    sku: text("sku").notNull().unique(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    salePrice: numeric("sale_price", { precision: 10, scale: 2 }),
    colorId: uuid("color_id").references(() => colors.id),
    sizeId: uuid("size_id").references(() => sizes.id),
    inStock: integer("in_stock").notNull().default(0),
    weight: numeric("weight"), // float in schema, but numeric is safer for db
    dimensions: jsonb("dimensions"), // { length, width, height }
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
    product: one(products, {
        fields: [productVariants.productId],
        references: [products.id],
    }),
    color: one(colors, {
        fields: [productVariants.colorId],
        references: [colors.id],
    }),
    size: one(sizes, {
        fields: [productVariants.sizeId],
        references: [sizes.id],
    }),
}));

import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const insertVariantSchema = createInsertSchema(productVariants);

export type InsertVariant = z.infer<typeof insertVariantSchema>;
