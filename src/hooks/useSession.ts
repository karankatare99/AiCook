"use client";

import { useEffect, useState } from "react";

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

// Dummy session for VoiceBite
export function useSession(): Session {
    const [status, setStatus] = useState<Session["status"]>("loading");
    const [user, setUser] = useState<SessionUser | null>(null);

    useEffect(() => {
        // Simulate network delay to check loading states
        const timer = setTimeout(() => {
            setStatus("authenticated");
            setUser({
                id: "usr_123",
                name: "Chef",
                email: "chef@example.com",
                // Standard dummy photo from Pravatar
                image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            });
        }, 400);

        return () => clearTimeout(timer);
    }, []);

    return { user, status };
}
