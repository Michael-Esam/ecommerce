import { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Heart } from "lucide-react";

import ProductGallery from "@/components/ProductGallery";
import ColorSelector from "@/components/ColorSelector";
import ProductActions from "@/components/ProductActions";
import CollapsibleSection from "@/components/CollapsibleSection";
import Reviews from "@/components/Reviews";
import AlsoLike from "@/components/AlsoLike";
import { getProduct } from "@/lib/actions/product";

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const { color } = await searchParams;

    // Validate UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        notFound();
    }

    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    // Determine selected variant based on URL param or default to first
    const selectedVariant =
        product.variants && product.variants.length > 0
            ? product.variants.find((v) => v.color?.slug === color) || product.variants[0]
            : null;

    if (!selectedVariant) {
        // Handle case with no variants
        return <div>Product unavailable or variant not found</div>;
    }

    // Filter images by variantId
    const variantImages = product.images
        .filter(img => img.variantId === selectedVariant.id)
        .map(img => img.url);

    const displayImages = variantImages.length > 0 ? variantImages : product.images.map(img => img.url);

    // Map variants for ColorSelector
    const uniqueColorVariants = (product.variants || []).reduce((acc, v) => {
        if (v.color && !acc.find((cv: any) => cv.slug === v.color?.slug)) {
            acc.push({
                id: v.id,
                slug: v.color.slug,
                name: v.color.name,
                image: product.images.find(img => img.variantId === v.id)?.url || product.images[0]?.url || "/placeholder.png",
                images: []
            });
        }
        return acc;
    }, [] as any[]);

    // Map sizes
    const availableSizes = (product.variants || [])
        .filter(v => v.size)
        .map(v => v.size!.name);

    const uniqueSizes = Array.from(new Set(availableSizes));

    return (
        <div className="min-h-screen bg-white pb-20 pt-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                    {/* Left Column: Gallery */}
                    <div className="lg:col-span-8">
                        <ProductGallery
                            images={displayImages}
                            title={product.name}
                        />
                    </div>

                    {/* Right Column: Product Details */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-10 space-y-8">
                            {/* Header */}
                            <div>
                                <h1 className="text-2xl font-medium text-dark-900">
                                    {product.name}
                                </h1>
                                <p className="text-body text-dark-700">{product.category?.name}</p>
                                <div className="mt-4">
                                    <p className="text-xl font-medium text-dark-900">
                                        ${selectedVariant?.price || product.variants[0]?.price || 0}
                                    </p>
                                </div>
                            </div>

                            {/* Color Selector */}
                            <ColorSelector variants={uniqueColorVariants} />

                            {/* Product Actions (Size Picker + Add to Bag) */}
                            <ProductActions
                                product={product}
                                selectedColorSlug={selectedVariant?.color?.slug || ""}
                                uniqueSizes={uniqueSizes}
                            />

                            {/* Collapsible Sections */}
                            <div className="pt-4">
                                <CollapsibleSection title="Product Details" defaultOpen>
                                    <p className="mb-4">{product.description}</p>
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        {uniqueColorVariants.map((variant: any) => (
                                            <div key={variant.id} className="relative aspect-square overflow-hidden rounded-lg bg-light-200">
                                                <Image
                                                    src={variant.image}
                                                    alt={`${product.name} in ${variant.name}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 50vw, 25vw"
                                                />
                                                <div className="absolute bottom-2 left-2 rounded-md bg-white/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                                                    {variant.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CollapsibleSection>
                                <CollapsibleSection title="Shipping & Returns">
                                    <p>
                                        Free standard shipping on orders over $50. Returns accepted
                                        within 30 days.
                                    </p>
                                </CollapsibleSection>
                                <CollapsibleSection title="Reviews">
                                    <Suspense fallback={<div className="h-20 animate-pulse bg-light-200" />}>
                                        <Reviews productId={product.id} />
                                    </Suspense>
                                </CollapsibleSection>
                            </div>
                        </div>
                    </div>
                </div>

                {/* You Might Also Like */}
                <Suspense fallback={<div className="mt-20 h-96 animate-pulse bg-light-200" />}>
                    <AlsoLike productId={product.id} />
                </Suspense>
            </div>
        </div>
    );
}
