import { useState, useEffect, useCallback } from "react";
import { Recipe } from "@/types/recipe";

export type SavedRecipe = Recipe & { savedAt: string };

export function useSavedRecipes() {
    const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSaved = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/saved");
            if (!res.ok) throw new Error("Failed to fetch saved recipes");
            const data = await res.json();
            setRecipes(data);
        } catch (err) {
            setError("Could not load your cookbook. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSaved();
    }, [fetchSaved]);

    const unsave = useCallback(
        async (recipeId: string): Promise<boolean> => {
            // Optimistic update — remove immediately from UI
            const previous = recipes;
            setRecipes((prev) => prev.filter((r) => r.id !== recipeId));

            try {
                const res = await fetch(`/api/saved/${recipeId}`, {
                    method: "DELETE",
                });
                if (!res.ok) throw new Error();
                return true;
            } catch {
                // Rollback on failure
                setRecipes(previous);
                return false;
            }
        },
        [recipes]
    );

    // Undo: re-fetch from server to restore (simplest correct approach)
    const undoUnsave = useCallback(async () => {
        await fetchSaved();
    }, [fetchSaved]);

    return { recipes, isLoading, error, unsave, undoUnsave, refetch: fetchSaved };
}
