export interface RecipeIngredient {
    name: string;
    quantity: string;
}

export interface RecipeStep {
    instruction: string;
    timerMinutes?: number;
}

export interface Recipe {
    id: string;
    title: string;
    cuisine: string;
    duration: number; // minutes
    difficulty: "Easy" | "Medium" | "Hard" | string;
    servings: number;
    imageUrl: string;
    ingredients: RecipeIngredient[];
    steps: RecipeStep[];
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
