
import { Star } from "lucide-react";
import { getProductReviews } from "@/lib/actions/product";

interface ReviewsProps {
    productId: string;
}

export default async function Reviews({ productId }: ReviewsProps) {
    const reviews = await getProductReviews(productId);

    if (reviews.length === 0) {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-light-400" />
                ))}
                <span className="ml-2 text-sm text-dark-700">0 Stars</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-medium text-dark-900">Reviews ({reviews.length})</h3>
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b border-light-200 pb-4 last:border-0">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-dark-900">{review.author}</span>
                            <span className="text-xs text-dark-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="mt-1 flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < review.rating ? "fill-dark-900 text-dark-900" : "text-light-400"
                                        }`}
                                />
                            ))}
                        </div>
                        {review.content && (
                            <p className="mt-2 text-sm text-dark-700">{review.content}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
