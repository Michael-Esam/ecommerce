
import { db } from '@/lib/db';
import { eq, count } from 'drizzle-orm';
import { cpSync, existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import { products, productImages, type InsertProductImage } from '@/lib/db/schema/products';
import { insertProductImageSchema } from '@/lib/db/schema/products';

const log = (...args: unknown[]) => console.log('[update-images]', ...args);
const err = (...args: unknown[]) => console.error('[update-images:error]', ...args);

async function updateImages() {
    try {
        log('Starting image update...');

        const allProducts = await db.select().from(products);
        log(`Found ${allProducts.length} products.`);

        const uploadsRoot = join(process.cwd(), 'static', 'uploads', 'shoes');
        if (!existsSync(uploadsRoot)) {
            mkdirSync(uploadsRoot, { recursive: true });
        }

        const sourceDir = join(process.cwd(), 'public', 'shoes');
        const sourceImages = [
            'shoe-1.jpg', 'shoe-2.webp', 'shoe-3.webp', 'shoe-4.webp', 'shoe-5.avif',
            'shoe-6.avif', 'shoe-7.avif', 'shoe-8.avif', 'shoe-9.avif', 'shoe-10.avif',
            'shoe-11.avif', 'shoe-12.avif', 'shoe-13.avif', 'shoe-14.avif', 'shoe-15.avif',
        ];

        for (const product of allProducts) {
            const existingImages = await db
                .select({ count: count() })
                .from(productImages)
                .where(eq(productImages.productId, product.id));

            const imageCount = existingImages[0]?.count || 0;

            if (imageCount < 4) {
                log(`Product ${product.name} (${product.id}) has ${imageCount} images. Adding more...`);

                // We need to know which "index" this product corresponds to in the sourceImages array 
                // to match the seed logic if possible, or just pick random ones.
                // Let's just pick based on a hash of the ID or random.
                // Or just loop through sourceImages based on product index if we had it.
                // Let's just pick 4 images starting from a random offset.

                const randomOffset = Math.floor(Math.random() * sourceImages.length);

                for (let j = imageCount; j < 4; j++) {
                    const pickName = sourceImages[(randomOffset + j) % sourceImages.length];
                    const src = join(sourceDir, pickName);
                    const destName = `${product.id}-${j}-${basename(pickName)}`;
                    const dest = join(uploadsRoot, destName);

                    try {
                        cpSync(src, dest);
                        const img: InsertProductImage = insertProductImageSchema.parse({
                            productId: product.id,
                            url: `/static/uploads/shoes/${destName}`,
                            sortOrder: j,
                            isPrimary: j === 0 && imageCount === 0, // Only primary if it was the first one and none existed
                        });
                        await db.insert(productImages).values(img);
                    } catch (e) {
                        err('Failed to copy/insert product image', { src, dest, e });
                    }
                }
            }
        }

        log('Image update complete.');
    } catch (e) {
        err(e);
        process.exitCode = 1;
    }
}

updateImages();
