"use client";

import { useSession as useNextAuthSession } from "next-auth/react";

export type SessionUser = {
    id: string;
    name: string;
    email: string;
    image: string;
};

export type Session = {
    user: SessionUser | null;
    status: "loading" | "authenticated" | "unauthenticated";
};

export function useSession(): Session {
    const { data: session, status } = useNextAuthSession();

    if (status === "loading") {
        return { user: null, status: "loading" };
    }

    if (status === "unauthenticated" || !session?.user) {
        return { user: null, status: "unauthenticated" };
    }

    return {
        status: "authenticated",
        user: {
            id: session.user.id ?? "",
            name: session.user.name ?? "",
            email: session.user.email ?? "",
            image: session.user.image ?? "",
        },
    };
}