
import { db } from "../lib/db";
import { products } from "../lib/db/schema/products";

async function main() {
    const product = await db.select().from(products).limit(1);
    console.log("Product ID:", product[0]?.id);
    process.exit(0);
}

main();
