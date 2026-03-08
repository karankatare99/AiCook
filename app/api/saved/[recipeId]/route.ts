import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { recipeId: string } }
) {
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

    try {
        await prisma.savedRecipe.delete({
            where: {
                userId_recipeId: {
                    userId: user.id,
                    recipeId: params.recipeId,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json(
            { error: "Recipe not found in saved list" },
            { status: 404 }
        );
    }
}