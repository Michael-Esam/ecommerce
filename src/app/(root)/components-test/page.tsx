import Card from "@/components/Card";

export default function ComponentsTestPage() {
    return (
        <div className="min-h-screen bg-light-200">
            <main className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12">
                <h1 className="mb-8 text-heading-2 font-bold text-dark-900">Component Test</h1>

                <section className="mb-12">
                    <h2 className="mb-6 text-heading-3 font-medium text-dark-900">Product Cards</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Card
                            id="1"
                            title="Nike Air Max Dn"
                            category="Men's Shoes"
                            price={160}
                            image="/shoes/shoe-1.jpg"
                        />
                        <Card
                            id="2"
                            title="Nike Dunk Low Retro"
                            category="Men's Shoes"
                            price={115}
                            image="/shoes/shoe-2.webp"
                        />
                        <Card
                            id="3"
                            title="Nike Air Force 1 '07"
                            category="Women's Shoes"
                            price={115}
                            image="/shoes/shoe-3.webp"
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}
