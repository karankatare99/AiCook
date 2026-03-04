"use client";

import { motion } from "framer-motion";
import { Recipe } from "@/types/recipe";
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ShareSheetProps {
    recipe: Recipe;
    onClose: () => void;
}

export function ShareSheet({ recipe, onClose }: ShareSheetProps) {
    const [copied, setCopied] = useState(false);
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/app/recipe/${recipe.id}` : "";

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[200] flex animate-in fade-in duration-200 fade-in-0 flex-col justify-end sm:justify-center sm:items-center bg-[#0A0A0F]/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#141419] border border-[#F5EDD6]/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-[#F5EDD6]/60 hover:text-[#F5EDD6] transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="font-serif text-2xl text-[#F5EDD6] mb-2">Share Recipe</h3>
                <p className="text-[#F5EDD6]/60 text-sm mb-6 max-w-[90%]">Send &quot;{recipe.title}&quot; to a friend or save the link for later.</p>

                <div className="flex bg-[#0A0A0F] border border-[#F5EDD6]/10 rounded-xl p-2 items-center gap-2">
                    <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="bg-transparent border-none text-[#F5EDD6] text-sm w-full outline-none px-2 font-mono"
                        style={{ fontFamily: "var(--font-mono, monospace)" }}
                    />
                    <button
                        onClick={handleCopy}
                        className="bg-[#E8602C] text-[#F5EDD6] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#E8602C]/80 transition-colors flex items-center gap-2"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
