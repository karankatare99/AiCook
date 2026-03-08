import React from "react";
import { motion } from "framer-motion";

export function SavedPageHeader({ count }: { count: number }) {
    return (
        <div className="relative pt-12 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
                <motion.h1
                    className="font-serif text-5xl md:text-6xl text-[#F5EDD6] flex items-center gap-4"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                    >
                        Your
                    </motion.span>
                    <motion.span
                        className="italic text-[#E8602C]"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
                    >
                        Cookbook
                    </motion.span>
                </motion.h1>
            </div>

            <motion.div
                initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
                animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-2 bg-[#1A1A24] border border-[#F5EDD6]/10 px-4 py-2 rounded-full h-fit w-fit"
            >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8602C] animate-pulse" />
                <span className="font-mono text-xs text-[#F5EDD6]/80 tracking-widest uppercase">
                    {count} Saved Recipe{count !== 1 && "s"}
                </span>
            </motion.div>

            {/* Decorative timeline rule */}
            <svg className="absolute top-[80px] -left-8 md:-left-20 w-0 h-0 hidden md:block overflow-visible" aria-hidden="true">
                <motion.path
                    d="M 0 0 L 100 0"
                    stroke="rgba(232,96,44,0.3)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                />
            </svg>
        </div>
    );
}
