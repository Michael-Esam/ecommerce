
import Card from "@/components/Card";
import { getRecommendedProducts } from "@/lib/actions/product";

interface AlsoLikeProps {
    productId: string;
}

export default async function AlsoLike({ productId }: AlsoLikeProps) {
    const relatedProducts = await getRecommendedProducts(productId);

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <div className="mt-20">
            <h2 className="mb-8 text-xl font-medium text-dark-900">You Might Also Like</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((item) => (
                    <Card
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        category={item.category}
                        price={item.price}
                        image={item.image}
                        colorCount={item.colorCount}
                    />
                ))}
            </div>
        </div>
    );
}
