import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import Card from "@/components/Card";
import { getAllProducts } from "@/lib/actions/product";
import { parseFilterParams } from "@/lib/utils/query";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function ProductsPage(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams;
    const filters = parseFilterParams(searchParams);

    const { products, totalCount } = await getAllProducts(filters);

    return (
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-baseline justify-between border-b border-light-300 pb-6">
                <h1 className="text-heading-3 font-medium text-dark-900">
                    All Products ({totalCount})
                </h1>
                <div className="flex items-center">
                    <Sort />
                </div>
            </div>

            <section className="pt-6 pb-24">
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                    {/* Filters */}
                    <Filters />

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                                {products.map((product) => (
                                    <Card
                                        key={product.id}
                                        id={product.id}
                                        title={product.name}
                                        category={product.category || "Uncategorized"}
                                        price={product.price || 0}
                                        image={product.image || "/placeholder.png"}
                                        colorCount={product.colorCount}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-96 flex-col items-center justify-center text-center">
                                <p className="text-body text-dark-700">
                                    No products found matching your filters.
                                </p>
                                <a
                                    href="/products"
                                    className="mt-4 text-body font-medium text-dark-900 underline hover:text-dark-700"
                                >
                                    Clear all filters
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
