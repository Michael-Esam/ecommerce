import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Suspense } from "react";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Suspense fallback={<div className="h-[60px] bg-light-100" />}>
                <Navbar />
            </Suspense>
            <main className="min-h-screen pt-[60px]">{children}</main>
            <Footer />
        </>
    );
}
