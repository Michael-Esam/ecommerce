"use client";

import Link from "next/link";
import SocialProviders from "@/components/SocialProviders";
import AuthInput from "@/components/AuthInput";
import { signIn } from "@/lib/auth/actions";
import { useState } from "react";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const result = await signIn({ email, password });

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
        // If success, the server action will redirect, so we don't need to do anything here
    };

    return (
        <div className="flex flex-col items-center w-full">
            <h1 className="text-[32px] font-bold text-dark-900 mb-8 text-center">Your Account for Everything Nike</h1>

            <SocialProviders />

            <div className="flex items-center gap-4 w-full my-8">
                <div className="h-[1px] bg-[#E5E5E5] flex-1"></div>
                <span className="text-dark-700 text-sm">Or</span>
                <div className="h-[1px] bg-[#E5E5E5] flex-1"></div>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <AuthInput
                    label="Email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <AuthInput
                    label="Password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="keep-signed-in" className="rounded border-gray-300 cursor-pointer" />
                        <label htmlFor="keep-signed-in" className="text-sm text-dark-700 cursor-pointer">Keep me signed in</label>
                    </div>
                    <Link href="#" className="text-sm text-dark-700 hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[50px] bg-[#111111] text-white rounded-full font-medium mt-6 hover:bg-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Signing In..." : "Sign In"}
                </button>
            </form>

            <p className="text-dark-700 mt-8 text-center">
                Not a Member?{" "}
                <Link href="/sign-up" className="text-dark-900 font-medium underline">
                    Join Us
                </Link>
            </p>
        </div>
    );
}
