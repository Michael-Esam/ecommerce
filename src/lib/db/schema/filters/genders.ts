import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const genders = pgTable("genders", {
    id: uuid("id").primaryKey().defaultRandom(),
    label: text("label").notNull(),
    slug: text("slug").notNull().unique(),
});

import { createInsertSchema } from "drizzle-zod";

export const insertGenderSchema = createInsertSchema(genders);
