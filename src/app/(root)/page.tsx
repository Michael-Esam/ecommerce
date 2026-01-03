import Link from "next/link";
import Image from "next/image";
import Card from "@/components/Card";
import { getAllProducts } from "@/lib/actions/product";

export default async function Home() {
  const { products } = await getAllProducts({ limit: 3 });

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full bg-[#F5F5F5] overflow-hidden">
        {/* Background Image */}
        <Image
          src="/hero-bg.png"
          alt="Background"
          fill
          className="object-cover opacity-100"
          priority
        />

        <div className="container mx-auto h-full px-6 relative z-10">
          <div className="flex h-full items-center">
            <div className="max-w-xl pt-20">
              <span className="text-orange font-bold mb-4 block tracking-wide uppercase text-sm">Bold & Sporty</span>
              <h1 className="text-5xl lg:text-6xl font-black text-dark-900 mb-6 leading-[1.1] tracking-tight">
                Style That Moves<br />With You.
              </h1>
              <p className="text-dark-700 text-lg mb-10 max-w-md leading-relaxed">
                Not just style. Not just comfort. Footwear that effortlessly moves with your every step.
              </p>
              <Link
                href="/products"
                className="inline-block bg-dark-900 text-white px-10 py-4 rounded-full font-medium hover:bg-dark-700 transition-transform hover:scale-105 active:scale-95"
              >
                Find Your Shoe
              </Link>
            </div>

            {/* Hero Shoe & Text */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-[55%] pointer-events-none hidden lg:block">
              <div className="relative w-full h-full">
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[150px] font-black text-orange/10 whitespace-nowrap z-0 select-none">
                  AIR JORDAN
                </span>
                <Image
                  src="/hero-shoe.png"
                  alt="Hero Shoe"
                  fill
                  className="object-contain z-10 drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best of Air Max */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-dark-900">Best of Air Max</h2>
          <Link href="/products" className="text-dark-900 font-medium hover:underline">Shop All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card
              key={product.id}
              id={product.id}
              title={product.name}
              category={product.category || "Shoes"}
              price={Number(product.price)}
              image={product.image || "/placeholder.png"}
              tag={index === 0 ? "Best Seller" : index === 1 ? "Extra 20% off" : undefined}
              colorCount={product.colorCount}
            />
          ))}
        </div>
      </section>

      {/* Trending Now */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-dark-900 mb-10">Trending Now</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-auto lg:h-[500px]">
          {/* Large Item */}
          <div className="relative rounded-[30px] overflow-hidden group h-[400px] lg:h-full w-full">
            <Image
              src="/trending-1.png"
              alt="React Presto"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12 text-white max-w-md">
              <h3 className="text-4xl lg:text-5xl font-bold mb-4">REACT PRESTO</h3>
              <p className="mb-8 text-lg text-white/90">With React foam for the most comfortable Presto ever.</p>
              <Link
                href="/products"
                className="inline-block bg-white text-dark-900 px-8 py-3 rounded-full font-medium hover:bg-light-100 transition-transform hover:scale-105 active:scale-95"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8 h-full">
            <div className="relative flex-1 rounded-[30px] overflow-hidden group min-h-[280px]">
              <Image
                src="/trending-2.png"
                alt="Air Max Dia"
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold">Summer Must-Haves: Air Max Dia</h3>
              </div>
            </div>
            <div className="relative flex-1 rounded-[30px] overflow-hidden group min-h-[280px]">
              <Image
                src="/trending-3.png"
                alt="Air Jordan 11"
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold">Air Jordan 11 Retro Low LE</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="container mx-auto px-6 py-16 mb-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 lg:max-w-xl">
            <span className="text-orange font-bold mb-4 block tracking-wide uppercase text-sm">Bold & Sporty</span>
            <h2 className="text-4xl lg:text-5xl font-black text-dark-900 mb-8 leading-[1.1] tracking-tight uppercase">
              NIKE REACT<br />PRESTO BY YOU
            </h2>
            <p className="text-dark-700 text-lg mb-10 leading-relaxed">
              Take advantage of brand new, proprietary cushioning technology with a fresh pair of Nike react shoes.
            </p>
            <Link
              href="/products"
              className="inline-block bg-dark-900 text-white px-10 py-4 rounded-full font-medium hover:bg-dark-700 transition-transform hover:scale-105 active:scale-95"
            >
              Shop Now
            </Link>
          </div>
          <div className="flex-1 relative h-[350px] lg:h-[500px] w-full">
            {/* Abstract background shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange/10 -rotate-12 transform -z-10 rounded-[100px]" />
            <Image
              src="/feature.png"
              alt="Feature Shoe"
              fill
              className="object-contain drop-shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-700"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
