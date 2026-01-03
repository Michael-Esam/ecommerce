
import { getAllProducts } from "@/lib/actions/product";

async function main() {
    try {
        console.log("Fetching products...");
        const { products, totalCount } = await getAllProducts({ limit: 3 });
        console.log("Products fetched successfully:", products.length);
        console.log("Total count:", totalCount);
        console.log("First product:", products[0]);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

main();
