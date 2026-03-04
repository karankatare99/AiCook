"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSavedRecipes } from "@/hooks/useSavedRecipes";
import { SavedRecipeCard } from "@/components/saved/SavedRecipeCard";
import { SavedPageHeader } from "@/components/saved/SavedPageHeader";
import { SavedToolbar } from "@/components/saved/SavedToolbar";
import { SavedEmptyState } from "@/components/saved/SavedEmptyState";
import { SavedSkeleton, SavedErrorState } from "@/components/saved/SavedSkeleton";
import { ShareSheet } from "@/components/ShareSheet/ShareSheet";
import { useToast } from "@/components/ToastSystem";

const CUISINE_FILTERS = ["All", "Italian", "Asian", "Mediterranean", "Mexican", "Quick", "Vegetarian", "Desserts"];

export default function SavedPage() {
    const { recipes, isLoading, error, unsave, undoUnsave, refetch } = useSavedRecipes();
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [shareRecipe, setShareRecipe] = useState<string | null>(null);

    // Custom toast implementation
    const { showToast } = useToast();

    const filtered = useMemo(() => {
        return recipes.filter((r) => {
            const matchesSearch =
                search === "" ||
                r.title.toLowerCase().includes(search.toLowerCase()) ||
                r.cuisine.toLowerCase().includes(search.toLowerCase());

            const matchesFilter =
                activeFilter === "All" ||
                (activeFilter === "Quick" ? r.duration < 30 : r.cuisine === activeFilter);

            return matchesSearch && matchesFilter;
        });
    }, [recipes, search, activeFilter]);

    const handleUnsave = async (recipeId: string, recipeTitle: string) => {
        const success = await unsave(recipeId);
        if (success) {
            showToast(`Removed "${recipeTitle}" from your cookbook`, "info", {
                label: "Undo",
                duration: 4000,
                onUndo: async () => {
                    await undoUnsave();
                },
            });
        } else {
            showToast("Could not remove recipe. Try again.", "error");
        }
    };

    if (isLoading) return <SavedSkeleton />;
    if (error) return <SavedErrorState message={error} onRetry={refetch} />;

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-[#F5EDD6] p-4 md:p-8 md:pl-28 lg:pl-32 max-w-[1600px] mx-auto overflow-hidden">
            <SavedPageHeader count={recipes.length} />

            <SavedToolbar
                search={search}
                onSearchChange={setSearch}
                filters={CUISINE_FILTERS}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <SavedEmptyState
                            hasRecipes={recipes.length > 0}
                            onClearFilters={() => {
                                setSearch("");
                                setActiveFilter("All");
                            }}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key={viewMode}
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                : "flex flex-col gap-2 max-w-4xl"
                        }
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <AnimatePresence>
                            {filtered.map((recipe, i) => (
                                <SavedRecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    viewMode={viewMode}
                                    index={i}
                                    onUnsave={() => handleUnsave(recipe.id, recipe.title)}
                                    onShare={() => setShareRecipe(recipe.id)}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {shareRecipe && (
                    <ShareSheet
                        recipe={filtered.find((r) => r.id === shareRecipe)!}
                        onClose={() => setShareRecipe(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
