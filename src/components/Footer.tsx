import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const footerLinks = {
        featured: [
            { name: "Air Force 1", href: "#" },
            { name: "Huarache", href: "#" },
            { name: "Air Max 90", href: "#" },
            { name: "Air Max 95", href: "#" },
        ],
        shoes: [
            { name: "All Shoes", href: "#" },
            { name: "Custom Shoes", href: "#" },
            { name: "Jordan Shoes", href: "#" },
            { name: "Running Shoes", href: "#" },
        ],
        clothing: [
            { name: "All Clothing", href: "#" },
            { name: "Modest Wear", href: "#" },
            { name: "Hoodies & Pullovers", href: "#" },
            { name: "Shirts & Tops", href: "#" },
        ],
        kids: [
            { name: "Infant & Toddler Shoes", href: "#" },
            { name: "Kids' Shoes", href: "#" },
            { name: "Kids' Jordan Shoes", href: "#" },
            { name: "Kids' Basketball Shoes", href: "#" },
        ],
    };

    return (
        <footer className="bg-dark-900 pt-16 pb-8 font-jost text-light-100 ">
            <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
                <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-start ">
                    {/* Logo */}
                    <div className="shrink-0">
                        <Link href="/">
                            <Image
                                src="/logo.svg"
                                alt="Nike Logo"
                                width={60}
                                height={60}
                                className="h-[24px] w-auto object-contain invert-0"
                            />
                        </Link>
                    </div>

                    {/* Links Columns */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
                        {/* Featured Column */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-body font-bold text-light-100">
                                Featured
                            </h4>
                            <div className="flex flex-col gap-3">
                                {footerLinks.featured.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-footnote text-dark-700 hover:text-light-100"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Shoes Column */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-body font-bold text-light-100">
                                Shoes
                            </h4>
                            <div className="flex flex-col gap-3">
                                {footerLinks.shoes.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-footnote text-dark-700 hover:text-light-100"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Clothing Column */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-body font-bold text-light-100">
                                Clothing
                            </h4>
                            <div className="flex flex-col gap-3">
                                {footerLinks.clothing.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-footnote text-dark-700 hover:text-light-100"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Kids Column */}
                        <div className="flex flex-col gap-4">
                            <h4 className="text-body font-bold text-light-100">
                                Kids'
                            </h4>
                            <div className="flex flex-col gap-3">
                                {footerLinks.kids.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-footnote text-dark-700 hover:text-light-100"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-4 shrink-0">
                        <Link href="#" className="rounded-full bg-light-100 p-2 hover:bg-dark-700 transition-colors group">
                            <Image src="/x.svg" alt="Twitter" width={20} height={20} className="group-hover:invert" />
                        </Link>
                        <Link href="#" className="rounded-full bg-light-100 p-2 hover:bg-dark-700 transition-colors group">
                            <Image src="/facebook.svg" alt="Facebook" width={20} height={20} className="group-hover:invert" />
                        </Link>
                        <Link href="#" className="rounded-full bg-light-100 p-2 hover:bg-dark-700 transition-colors group">
                            <Image src="/instagram.svg" alt="Instagram" width={20} height={20} className="group-hover:invert" />
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 flex flex-col items-start justify-between gap-4 pt-8 lg:flex-row lg:items-center">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 text-light-100">
                            <Image src="/globe.svg" alt="Location" width={18} height={18} className="invert-0" />
                            <span className="text-footnote font-bold">United States</span>
                        </div>
                        <span className="text-footnote text-dark-700">
                            © 2024 Nike, Inc. All Rights Reserved
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <Link href="#" className="text-footnote text-dark-700 hover:text-light-100">Guides</Link>
                        <Link href="#" className="text-footnote text-dark-700 hover:text-light-100">Terms of Sale</Link>
                        <Link href="#" className="text-footnote text-dark-700 hover:text-light-100">Terms of Use</Link>
                        <Link href="#" className="text-footnote text-dark-700 hover:text-light-100">Nike Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
