"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart.store";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Search, X, ShoppingBag, Menu, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cart, fetchCart } = useCartStore();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("search", searchQuery);
            router.push(`/products?${params.toString()}`);
            setIsSearchOpen(false);
        }
    };

    const cartCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

    const navLinks = [
        { name: "Men", href: "/products?gender=men" },
        { name: "Women", href: "/products?gender=women" },
        { name: "Kids", href: "/products?kids=boys,girls" },
        { name: "Collections", href: "/products" },
        { name: "Contact", href: "#" },
    ];

    return (
        <nav className="relative z-50 w-full bg-light-100 font-jost">
            <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-6 lg:px-12">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.svg"
                        alt="Nike Logo"
                        width={80}
                        height={29}
                        className="h-[24px] w-auto object-contain invert"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 lg:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-body font-medium text-dark-900 transition-colors hover:text-dark-700"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="hidden items-center gap-6 lg:flex">
                    <div className={cn(
                        "flex items-center overflow-hidden transition-all duration-300 ease-in-out",
                        isSearchOpen ? "w-64" : "w-8"
                    )}>
                        {isSearchOpen ? (
                            <form onSubmit={handleSearch} className="relative flex w-full items-center">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full rounded-full border border-light-300 bg-light-100 py-1.5 pl-4 pr-8 text-sm outline-none focus:border-dark-900"
                                    autoFocus
                                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setIsSearchOpen(false);
                                    }}
                                    className="absolute right-2 text-dark-500 hover:text-dark-900"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="text-dark-900 hover:text-dark-700"
                            >
                                <Search className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    <Link href="/favorites" className="text-dark-900 hover:text-dark-700">
                        <Heart className="h-5 w-5" />
                    </Link>

                    <Link href="/cart" className="flex items-center gap-2 text-body font-medium text-dark-900 hover:text-dark-700">
                        <ShoppingBag className="h-5 w-5" />
                        <span>({cartCount})</span>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="block p-2 lg:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <Menu className="h-6 w-6 text-dark-900" />
                </button>
            </div>


            {/* Mobile Menu Drawer */}
            {
                isMenuOpen && (
                    <div className="absolute left-0 top-full h-screen w-full bg-light-100 px-6 py-4 lg:hidden">
                        <div className="flex flex-col gap-6">
                            <form onSubmit={handleSearch} className="relative w-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full border-b border-dark-900 bg-transparent py-2 text-lg outline-none placeholder:text-dark-500"
                                />
                                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2">
                                    <Search className="h-5 w-5 text-dark-900" />
                                </button>
                            </form>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-lead font-medium text-dark-900"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )
            }
        </nav >
    );
}
