import React from "react";
import { authClient } from "@/lib/auth-client";

export default function SocialProviders() {
    const handleSocialSignIn = async (provider: "google" | "apple") => {
        await authClient.signIn.social({
            provider,
            callbackURL: "/", // Redirect to home on success
        });
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <button
                type="button"
                onClick={() => handleSocialSignIn("google")}
                className="flex items-center justify-center gap-3 w-full h-[50px] border border-[#CCCCCC] rounded-md hover:bg-gray-50 transition-colors text-body font-medium cursor-pointer"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
            </button>
            <button
                type="button"
                onClick={() => handleSocialSignIn("apple")}
                className="flex items-center justify-center gap-3 w-full h-[50px] border border-[#CCCCCC] rounded-md hover:bg-gray-50 transition-colors text-body font-medium cursor-pointer"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24.02-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.26 4.12-1.26 1.65.06 3.08.83 3.87 2.05-3.48 1.81-2.75 6.62.98 8.06-.68 1.98-1.65 3.75-4.05 3.38zm-1.55-15.6c.62-1.48 2.61-2.4 4.05-2.36.46 1.88-1.1 4.07-3.61 4.24-.46-1.56.02-2.91-.44-1.88z" />
                </svg>
                Continue with Apple
            </button>
        </div>
    );
}
