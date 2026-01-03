import { db } from "@/lib/db";
import { products, productImages } from "@/lib/db/schema/products";
import { productVariants } from "@/lib/db/schema/variants";
import { categories } from "@/lib/db/schema/categories";
import { brands } from "@/lib/db/schema/filters/brands";
import { genders } from "@/lib/db/schema/filters/genders";
import { colors } from "@/lib/db/schema/filters/colors";
import { sizes } from "@/lib/db/schema/filters/sizes";
import { FilterParams, buildProductQueryObject } from "@/lib/utils/query";
import { and, desc, eq, sql, asc, inArray, count, countDistinct } from "drizzle-orm";
import { reviews } from "@/lib/db/schema/reviews";

export async function getAllProducts(filters: FilterParams) {
    const { page = 1, limit = 12, sort } = filters;
    const offset = (page - 1) * limit;

    const conditions = buildProductQueryObject(filters);

    // Sorting logic
    let orderBy = desc(products.createdAt);
    if (sort === "price_asc") {
        orderBy = asc(productVariants.price);
    } else if (sort === "price_desc") {
        orderBy = desc(productVariants.price);
    } else if (sort === "latest") {
        orderBy = desc(products.createdAt);
    }

    const baseQuery = db
        .select({
            id: products.id,
            name: products.name,
            category: categories.name,
            price: sql<number>`min(${productVariants.price})`.mapWith(Number),
            image: sql<string>`
                COALESCE(
                    (SELECT url FROM ${productImages} 
                     WHERE ${productImages.productId} = ${products.id} 
                     AND ${productImages.isPrimary} = true 
                     LIMIT 1),
                    (SELECT url FROM ${productImages} 
                     WHERE ${productImages.productId} = ${products.id} 
                     LIMIT 1)
                )
            `,
            colorCount: countDistinct(productVariants.colorId).mapWith(Number),
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(genders, eq(products.genderId, genders.id))
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(productVariants, eq(products.id, productVariants.productId))
        .leftJoin(colors, eq(productVariants.colorId, colors.id))
        .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
        .where(conditions)
        .groupBy(products.id, categories.name)
        .limit(limit)
        .offset(offset);

    if (sort === "price_asc") {
        baseQuery.orderBy(sql`min(${productVariants.price}) asc`);
    } else if (sort === "price_desc") {
        baseQuery.orderBy(sql`min(${productVariants.price}) desc`);
    } else {
        baseQuery.orderBy(desc(products.createdAt));
    }

    const data = await baseQuery;

    const countQuery = db
        .select({ count: countDistinct(products.id) })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(genders, eq(products.genderId, genders.id))
        .leftJoin(brands, eq(products.brandId, brands.id))
        .leftJoin(productVariants, eq(products.id, productVariants.productId))
        .leftJoin(colors, eq(productVariants.colorId, colors.id))
        .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
        .where(conditions);

    const totalCountRes = await countQuery;
    const totalCount = totalCountRes[0]?.count || 0;

    return {
        products: data,
        totalCount,
    };
}

export async function getProduct(productId: string) {
    const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
        with: {
            category: true,
            brand: true,
            gender: true,
            variants: {
                with: {
                    color: true,
                    size: true,
                },
            },
            images: {
                orderBy: (images, { asc }) => [asc(images.sortOrder)],
            },
            collections: {
                with: {
                    collection: true
                }
            }
        },
    });

    return product;
}

export async function getProductReviews(productId: string) {
    const productReviews = await db.query.reviews.findMany({
        where: eq(reviews.productId, productId),
        with: {
            user: true,
        },
        orderBy: desc(reviews.createdAt),
        limit: 10,
    });

    return productReviews.map((review) => ({
        id: review.id,
        author: review.user.name || "Anonymous",
        rating: review.rating,
        content: review.comment || "",
        createdAt: review.createdAt.toISOString(),
    }));
}

export async function getRecommendedProducts(productId: string) {
    const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
        columns: {
            categoryId: true,
        },
    });

    if (!product?.categoryId) return [];

    const recommended = await db.query.products.findMany({
        where: and(
            eq(products.categoryId, product.categoryId),
            // ne(products.id, productId) // 'ne' is not imported, let's filter in JS or import it
        ),
        limit: 5,
        with: {
            images: {
                where: eq(productImages.isPrimary, true),
                limit: 1,
            },
            variants: {
                limit: 1,
            },
            category: true,
        },
    });

    return recommended
        .filter((p) => p.id !== productId)
        .map((p) => ({
            id: p.id,
            title: p.name,
            category: p.category?.name || "",
            price: Number(p.variants[0]?.price || 0),
            image: p.images[0]?.url || "/placeholder.png",
            colorCount: 0, // We can fetch this if needed, but keeping it simple for now
        }));
}
