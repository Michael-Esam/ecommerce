"use client";

import React, { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function AuthInput({ label, error, className = "", type = "text", ...props }: AuthInputProps) {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-body font-medium text-dark-900">{label}</label>
            <div className="relative">
                <input
                    type={isPassword && showPassword ? "text" : type}
                    className={`w-full h-[50px] px-4 border rounded-md outline-none transition-colors text-body
            ${error ? "border-red-500 focus:border-red-500" : "border-[#CCCCCC] focus:border-dark-900"}
            ${className}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-700 hover:text-dark-900"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
}
