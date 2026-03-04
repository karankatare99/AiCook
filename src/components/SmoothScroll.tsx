"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { usePathname, useSearchParams } from "next/navigation";

export default function SmoothScroll({
    children,
}: {
    children: React.ReactNode;
}) {
    const lenisRef = useRef<Lenis>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) return;

        const lenis = new Lenis({
            lerp: 0.08,
            wheelMultiplier: 1,
            autoRaf: true,
        });
        lenisRef.current = lenis;

        return () => {
            lenis.destroy();
        };
    }, []);

    // Reset scroll on navigation
    useEffect(() => {
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { immediate: true });
        }
    }, [pathname, searchParams]);

    return <>{children}</>;
}
