import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Hidden on mobile */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#111111] p-12 text-white">
                <div>
                    <Link href="/">
                        <div className="bg-white p-2 rounded-xl w-fit">
                            <Image
                                src="/logo.svg"
                                alt="Nike Logo"
                                width={40}
                                height={40}
                                className="h-[40px] w-[40px] object-contain invert"
                            />
                        </div>
                    </Link>
                </div>

                <div className="mb-20">
                    <h1 className="text-[72px] font-bold leading-[1.1] mb-6">Just Do It</h1>
                    <p className="text-[24px] font-medium leading-[1.4] text-[#757575] max-w-md">
                        Join millions of athletes and fitness enthusiasts who trust Nike for their performance needs.
                    </p>

                    <div className="flex gap-2 mt-8">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        <div className="w-2 h-2 rounded-full bg-[#333333]"></div>
                        <div className="w-2 h-2 rounded-full bg-[#333333]"></div>
                    </div>
                </div>

                <div className="text-[#757575] text-sm">
                    © 2024 Nike. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 bg-white">
                <div className="w-full max-w-[480px]">
                    {children}
                </div>
            </div>
        </div>
    );
}
