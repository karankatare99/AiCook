import React, { useRef, useState, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SavedRecipe } from "@/hooks/useSavedRecipes";
import { BookmarkMinus, Share, Eye, Clock, Users } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";

export interface SavedRecipeCardProps {
    recipe: SavedRecipe;
    viewMode: "grid" | "list";
    index: number;
    onUnsave: () => void;
    onShare: () => void;
}

export function SavedRecipeCard({
    recipe,
    viewMode,
    index,
    onUnsave,
    onShare,
}: SavedRecipeCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const highlightRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (viewMode !== "grid" || !cardRef.current) return;

        // Check prefers-reduced-motion
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top; // y position within the element.

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        gsap.to(cardRef.current, {
            rotateX,
            rotateY,
            duration: 0.1,
            ease: "power2.out",
        });

        if (highlightRef.current) {
            const highlightX = (x / rect.width) * 100;
            const highlightY = (y / rect.height) * 100;
            gsap.to(highlightRef.current, {
                background: `radial-gradient(circle at ${highlightX}% ${highlightY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
                duration: 0.1,
            });
        }
    };

    const handleMouseLeave = () => {
        if (viewMode !== "grid" || !cardRef.current) return;

        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;

        // GSAP spring back
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 1,
            ease: "elastic.out(1, 0.3)", // approximate stiffness 200 damping 20
        });

        if (highlightRef.current) {
            gsap.to(highlightRef.current, {
                background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 60%)`,
                duration: 0.5,
            });
        }
    };

    const difficultyColor =
        recipe.difficulty === "Easy" ? "bg-green-500/20 text-green-400" :
            recipe.difficulty === "Medium" ? "bg-amber-500/20 text-amber-400" :
                "bg-red-500/20 text-red-400";

    // Animation variants
    const entranceDelay = Math.min(index, 8) * 0.05;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, height: 0, marginTop: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, delay: entranceDelay }}
            style={{ perspective: "800px" }}
            className={viewMode === "grid" ? "w-full" : "w-full mb-2"}
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`group relative overflow-hidden bg-[#141419] border border-[#F5EDD6]/10 rounded-2xl flex transition-all duration-300 ${viewMode === "grid" ? "flex-col" : "flex-row items-center p-3 gap-4 hover:bg-[#1A1A24]"
                    }`}
            >
                <div ref={highlightRef} className="pointer-events-none absolute inset-0 z-10 transition-colors duration-300" />

                {/* Image Area */}
                <div className={`relative overflow-hidden shrink-0 ${viewMode === "grid" ? "w-full aspect-[-4/3] h-48" : "w-[72px] h-[72px] rounded-lg"}`}>
                    <img
                        src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop"}
                        alt={recipe.title}
                        className={`w-full h-full object-cover transition-transform duration-400 ${viewMode === "grid" ? "group-hover:scale-[1.07]" : ""}`}
                    />
                    {viewMode === "grid" && (
                        <div className="absolute top-3 left-3 flex gap-2 z-20">
                            <span className="bg-[#E8602C] text-[#F5EDD6] text-xs px-2 py-1 rounded-full font-mono font-medium shadow-md">
                                {recipe.cuisine}
                            </span>
                            <span className={`${difficultyColor} backdrop-blur-md text-xs px-2 py-1 rounded-full font-mono font-medium shadow-md`}>
                                {recipe.difficulty}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className={`flex flex-col flex-1 ${viewMode === "grid" ? "p-5" : ""}`}>
                    <h3 className={`font-serif text-[#F5EDD6] transition-colors duration-150 group-hover:text-[#E8602C] ${viewMode === "grid" ? "text-[22px] mb-3" : "text-[17px] mb-1 leading-tight"}`}>
                        {recipe.title}
                    </h3>

                    <div className="flex items-center gap-3 text-[#A1A1AA] text-[11px] font-mono tracking-wider">
                        {viewMode === "list" && (
                            <span className="bg-[#E8602C]/10 text-[#E8602C] px-1.5 py-0.5 rounded-sm">
                                {recipe.cuisine}
                            </span>
                        )}
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.duration} min</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {recipe.servings} srv</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={`z-20 flex gap-2 ${viewMode === "grid" ? "absolute bottom-5 right-5 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300" : "flex shrink-0 opacity-0 group-hover:opacity-100 transition-opacity pr-2"}`}>
                    <button onClick={onUnsave} className="bg-[#1A1A24]/90 backdrop-blur border border-[#F5EDD6]/10 p-2 rounded-full text-[#F5EDD6]/70 hover:text-[#E8602C] hover:border-[#E8602C]/50 transition-all" title="Remove from cookbook">
                        <BookmarkMinus className="w-4 h-4" />
                    </button>
                    <button onClick={onShare} className="bg-[#1A1A24]/90 backdrop-blur border border-[#F5EDD6]/10 p-2 rounded-full text-[#F5EDD6]/70 hover:text-[#F5EDD6] hover:border-[#F5EDD6]/50 transition-all" title="Share recipe">
                        <Share className="w-4 h-4" />
                    </button>
                    {viewMode === "grid" && (
                        <Link href={`/app/recipe/${recipe.id}`} className="bg-[#E8602C] p-2 rounded-full text-[#F5EDD6] hover:bg-[#E8602C]/80 transition-all shadow-[0_0_10px_rgba(232,96,44,0.3)]">
                            <Eye className="w-4 h-4" />
                        </Link>
                    )}
                </div>

                {/* Full card link for list mode */}
                {viewMode === "list" && (
                    <Link href={`/app/recipe/${recipe.id}`} className="absolute inset-0 z-0" aria-label={`View ${recipe.title}`} />
                )}
            </div>
        </motion.div>
    );
}
