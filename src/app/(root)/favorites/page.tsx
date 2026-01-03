import { getFavorites } from "@/lib/actions/wishlist";
import Card from "@/components/Card";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata = {
    title: "Favorites | Nike",
    description: "Your favorite items",
};

export default async function FavoritesPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    const favorites = await getFavorites();

    return (
        <div className="min-h-screen bg-white pb-20 pt-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-medium text-dark-900">Favorites</h1>

                {favorites.length === 0 ? (
                    <div className="mt-20 text-center">
                        <p className="text-lg text-dark-700">You haven't saved any items yet.</p>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                        {favorites.map((product: any) => (
                            <Card
                                key={product.id}
                                id={product.id}
                                title={product.name}
                                category="Shoes"
                                price={Number(product.price)}
                                image={product.images?.[0]?.url || "/placeholder.png"}
                                colorCount={product.variants?.length}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
