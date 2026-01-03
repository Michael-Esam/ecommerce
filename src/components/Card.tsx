import Image from "next/image";
import Link from "next/link";

interface CardProps {
    id: string;
    title: string;
    category: string;
    price: number;
    image: string;
}

export default function Card({
    id,
    title,
    category,
    price,
    image,
    tag,
    colorCount,
}: CardProps & { tag?: string; colorCount?: number }) {
    return (
        <Link href={`/products/${id}`} className="group block">
            <div className="relative aspect-square w-full overflow-hidden rounded-[30px] bg-light-200">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {tag && (
                    <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-footnote font-medium ${tag === "Best Seller" ? "bg-light-100 text-orange" : "bg-light-100 text-green"
                        }`}>
                        {tag}
                    </span>
                )}
            </div>
            <div className="mt-4 flex justify-between items-start">
                <div>
                    <h3 className="text-body font-medium text-dark-900">{title}</h3>
                    <p className="text-body text-dark-700">{category}</p>
                    {colorCount && (
                        <p className="text-body text-dark-700">{colorCount} Colour</p>
                    )}
                </div>
                <p className="text-body font-medium text-dark-900">
                    ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
            </div>
        </Link>
    );
}
