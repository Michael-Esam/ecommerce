"use client";

import Link from "next/link";
import SocialProviders from "@/components/SocialProviders";
import AuthInput from "@/components/AuthInput";
import { signUp } from "@/lib/auth/actions";
import { useState } from "react";

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const result = await signUp({ name, email, password });

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
        // If success, the server action will redirect
    };

    return (
        <div className="flex flex-col items-center w-full">
            <p className="text-dark-700 mb-2">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-dark-900 font-medium underline">
                    Sign In
                </Link>
            </p>

            <h1 className="text-[32px] font-bold text-dark-900 mb-2">Join Nike Today!</h1>
            <p className="text-dark-700 mb-8 text-center">Create your account to start your fitness journey</p>

            <SocialProviders />

            <div className="flex items-center gap-4 w-full my-8">
                <div className="h-[1px] bg-[#E5E5E5] flex-1"></div>
                <span className="text-dark-700 text-sm">Or sign up with</span>
                <div className="h-[1px] bg-[#E5E5E5] flex-1"></div>
            </div>

            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <AuthInput
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <AuthInput
                    label="Email"
                    type="email"
                    placeholder="johndoe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <AuthInput
                    label="Password"
                    type="password"
                    placeholder="minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <div className="text-red-500 text-sm">{error}</div>}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[50px] bg-[#111111] text-white rounded-full font-medium mt-4 hover:bg-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
            </form>

            <p className="text-xs text-dark-700 mt-6 text-center max-w-xs">
                By signing up, you agree to our{" "}
                <Link href="#" className="underline">Terms of Service</Link> and{" "}
                <Link href="#" className="underline">Privacy Policy</Link>
            </p>
        </div>
    );
}
