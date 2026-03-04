import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await auth(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const savedRecipes = await prisma.savedRecipe.findMany({
        where: { userId: user.id },
        include: { recipe: true },
        orderBy: { savedAt: "desc" },
    });

    return NextResponse.json(
        savedRecipes.map((s: { recipe: object; savedAt: Date }) => ({
            ...s.recipe,
            savedAt: s.savedAt,
        }))
    );
}
