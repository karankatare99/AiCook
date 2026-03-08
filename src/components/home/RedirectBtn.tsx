"use client";

import { useRouter } from "next/navigation";

export default function RedirectBtn() {
    const router = useRouter();
    return (
        <button
            onClick={() => router.push("/chat")}
            className="group flex items-center gap-3 px-6 py-3.5 bg-[#E8602C]/10 border border-[#E8602C]/35 rounded-[14px] backdrop-blur-md cursor-pointer w-fit mx-auto transition-all duration-200 hover:bg-[#E8602C]/20 hover:border-[#E8602C]/65 hover:-translate-y-0.5 not-visited:active:translate-y-0 active:scale-[0.98]"
        >
            <span className="text-[#E8602C] shrink-0">
            {/* Microphone SVG — 20px */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
            </span>
            <span className="font-(family-name:--font-cormorant) text-[18px] font-medium text-[#F5EDD6] tracking-[0.01em] whitespace-nowrap">
            Chat with VoiceBite
            </span>
            <span className="text-[#F5EDD6]/45 shrink-0 ml-auto transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#E8602C]">
            {/* Arrow right SVG — 16px */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            </span>
        </button>
    )
}