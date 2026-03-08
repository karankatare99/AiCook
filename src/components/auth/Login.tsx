"use client";

import { useRouter } from "next/navigation"

export default function Login() {
    const router = useRouter();
    return (
        <button 
            onClick={() => router.push("/api/auth/signin")} 
            className="px-4 py-2 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/30 hover:border-primary/60 text-white text-sm backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/20" 
            data-cursor="link"
        >
            Log In
        </button>
    )
}