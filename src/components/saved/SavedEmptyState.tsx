import React from "react";
import Link from "next/link";

interface SavedEmptyStateProps {
    hasRecipes: boolean;
    onClearFilters: () => void;
}

export function SavedEmptyState({ hasRecipes, onClearFilters }: SavedEmptyStateProps) {
    if (hasRecipes) {
        return (
            <div className="w-full mt-32 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
                <h2 className="font-serif italic text-3xl text-[#F5EDD6] mb-3">No recipes match that.</h2>
                <p className="text-[#F5EDD6]/45 text-sm max-w-[280px] mb-8">
                    Try a different search or clear your filters.
                </p>
                <button
                    onClick={onClearFilters}
                    className="px-6 py-2 rounded-full border border-[#F5EDD6]/20 text-[#F5EDD6]/80 font-mono text-xs tracking-widest uppercase hover:bg-[#F5EDD6]/5 hover:text-[#F5EDD6] transition-all"
                >
                    Clear filters
                </button>
            </div>
        );
    }

    return (
        <div className="w-full mt-24 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="relative w-[120px] h-[120px] mb-8 flex items-center justify-center">
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full absolute inset-0"
                    fill="none"
                    stroke="rgba(232,96,44,0.3)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path
                        strokeDasharray="300"
                        strokeDashoffset="300"
                        className="animate-[draw-stroke_1.5s_cubic-bezier(0.25,1,0.5,1)_forwards]"
                        d="M50 85 V20 M50 85 C35 85 15 75 15 75 V15 C15 15 35 25 50 25 C65 25 85 15 85 15 V75 C85 75 65 85 50 85 Z"
                    />
                    <path
                        className="animate-[fade-in_1s_ease_1s_forwards] opacity-0"
                        fill="#E8602C"
                        stroke="none"
                        d="M55 26 V50 L62 45 L69 50 V21 C64 22 59 24 55 26 Z"
                    />
                </svg>
            </div>

            <h2 className="font-serif italic text-3xl text-[#F5EDD6] mb-3">Your cookbook is empty.</h2>
            <p className="text-[#F5EDD6]/45 text-sm max-w-[280px] mb-8">
                Save recipes as you explore and they will live here.
            </p>

            <Link
                href="/chat"
                className="px-6 py-3 rounded-full bg-[#E8602C] text-[#F5EDD6] font-mono text-xs tracking-widest uppercase hover:bg-[#E8602C]/80 shadow-[0_0_20px_rgba(232,96,44,0.2)] transition-all"
            >
                Explore Recipes
            </Link>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes draw-stroke {
          to { stroke-dashoffset: 0; }
        }
      `}} />
        </div>
    );
}
