import { SQL, and, eq, gte, lte, ilike, desc, asc, inArray, sql } from "drizzle-orm";
import { products } from "@/lib/db/schema/products";
import { productVariants } from "@/lib/db/schema/variants";
import { categories } from "@/lib/db/schema/categories";
import { brands } from "@/lib/db/schema/filters/brands";
import { genders } from "@/lib/db/schema/filters/genders";
import { colors } from "@/lib/db/schema/filters/colors";
import { sizes } from "@/lib/db/schema/filters/sizes";

export interface FilterParams {
    search?: string;
    category?: string;
    brand?: string[];
    gender?: string[];
    color?: string[];
    size?: string[];
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
}

export const parseFilterParams = (
    searchParams: Record<string, string | string[] | undefined>
): FilterParams => {
    const params: FilterParams = {
        page: Number(searchParams.page) || 1,
        limit: Number(searchParams.limit) || 12,
    };

    if (typeof searchParams.search === "string") params.search = searchParams.search;
    if (typeof searchParams.category === "string") params.category = searchParams.category;
    if (typeof searchParams.sort === "string") params.sort = searchParams.sort;

    // Helper to parse array or comma-separated string
    const parseArray = (value: string | string[] | undefined): string[] | undefined => {
        if (!value) return undefined;
        if (Array.isArray(value)) return value;
        return value.split(",");
    };

    params.brand = parseArray(searchParams.brand);
    params.color = parseArray(searchParams.color);
    params.size = parseArray(searchParams.size);

    const genders = parseArray(searchParams.gender) || [];
    const kids = parseArray(searchParams.kids);
    if (kids) {
        genders.push(...kids);
    }
    if (genders.length > 0) {
        params.gender = genders;
    }

    if (typeof searchParams.price === "string") {
        const [min, max] = searchParams.price.split("-");
        params.minPrice = Number(min);
        if (max !== "plus") {
            params.maxPrice = Number(max);
        }
    } else {
        if (typeof searchParams.minPrice === "string")
            params.minPrice = Number(searchParams.minPrice);
        if (typeof searchParams.maxPrice === "string")
            params.maxPrice = Number(searchParams.maxPrice);
    }

    return params;
};

export const buildProductQueryObject = (filters: FilterParams) => {
    const conditions: SQL[] = [eq(products.isPublished, true)];

    if (filters.search) {
        conditions.push(ilike(products.name, `%${filters.search}%`));
    }

    if (filters.category) {
        conditions.push(eq(categories.slug, filters.category));
    }

    if (filters.gender && filters.gender.length > 0) {
        conditions.push(inArray(genders.slug, filters.gender));
    }

    if (filters.brand && filters.brand.length > 0) {
        conditions.push(inArray(brands.slug, filters.brand));
    }

    if (filters.minPrice !== undefined) {
        conditions.push(gte(productVariants.price, filters.minPrice.toString()));
    }

    if (filters.maxPrice !== undefined) {
        conditions.push(lte(productVariants.price, filters.maxPrice.toString()));
    }

    if (filters.color && filters.color.length > 0) {
        conditions.push(inArray(colors.slug, filters.color));
    }

    if (filters.size && filters.size.length > 0) {
        conditions.push(inArray(sizes.slug, filters.size));
    }

    return and(...conditions);
};
