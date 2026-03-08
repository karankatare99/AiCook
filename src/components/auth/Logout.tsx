"use client";

import { useRouter } from "next/navigation"

export default function Logout() {
    const router = useRouter();
    return (
        <button 
            onClick={() => router.push("/")} 
            className="px-4 py-2 rounded-full bg-surface/10 hover:bg-surface/20 border border-white/10 hover:border-white/30 text-sm backdrop-blur-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-white/5 text-white" 
            data-cursor="link"
        >
            Log Out
        </button>
    )
}