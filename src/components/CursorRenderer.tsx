"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CursorRenderer() {
    const cursorDot = useRef<HTMLDivElement>(null);
    const cursorRing = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // We can still use the custom cursor but with zero lag if reduced motion,
        // or arguably just disable the custom cursor entirely.
        // Let's implement the dual cursor with GSAP quickTo.
        if (!cursorDot.current || !cursorRing.current) return;

        const xDotSetter = gsap.quickSetter(cursorDot.current, "x", "px");
        const yDotSetter = gsap.quickSetter(cursorDot.current, "y", "px");

        // quickTo for lerp / lag
        const xRingTo = gsap.quickTo(cursorRing.current, "x", { duration: 0.15, ease: "power2.out" });
        const yRingTo = gsap.quickTo(cursorRing.current, "y", { duration: 0.15, ease: "power2.out" });

        let isHoveringInteractive = false;

        const pointerMove = (e: MouseEvent) => {
            xDotSetter(e.clientX);
            yDotSetter(e.clientY);

            if (prefersReducedMotion) {
                gsap.set(cursorRing.current, { x: e.clientX, y: e.clientY });
            } else {
                xRingTo(e.clientX);
                yRingTo(e.clientY);
            }
        };

        const pointerDown = () => {
            gsap.to(cursorDot.current, { scale: 0.6, duration: 0.12 });
            if (!isHoveringInteractive) {
                gsap.to(cursorRing.current, { scale: 0.9, duration: 0.12 });
            }
        };

        const pointerUp = () => {
            gsap.to(cursorDot.current, { scale: 1, duration: 0.12 });
            if (!isHoveringInteractive) {
                gsap.to(cursorRing.current, { scale: 1, duration: 0.12 });
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactiveEl = target.closest('a, button, input, [role="button"], [data-cursor]');

            if (interactiveEl) {
                isHoveringInteractive = true;
                const cursorType = interactiveEl.getAttribute('data-cursor');

                document.body.classList.add('cursor-hovering');

                switch (cursorType) {
                    default:
                        gsap.to(cursorRing.current, { width: 56, height: 56, xPercent: -50, yPercent: -50, backgroundColor: 'rgba(232, 96, 44, 0.2)', borderColor: 'rgba(232, 96, 44, 0.6)', duration: 0.3 });
                        gsap.to(cursorDot.current, { opacity: 0, duration: 0.2 });
                        break;
                }
            } else {
                isHoveringInteractive = false;
                document.body.classList.remove('cursor-hovering');
                gsap.to(cursorRing.current, { width: 36, height: 36, xPercent: -50, yPercent: -50, backgroundColor: 'transparent', borderColor: 'rgba(232, 96, 44, 0.6)', duration: 0.3 });
                gsap.to(cursorDot.current, { opacity: 1, duration: 0.2 });
            }
        };

        window.addEventListener("mousemove", pointerMove);
        window.addEventListener("mousedown", pointerDown);
        window.addEventListener("mouseup", pointerUp);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", pointerMove);
            window.removeEventListener("mousedown", pointerDown);
            window.removeEventListener("mouseup", pointerUp);
            window.removeEventListener("mouseover", handleMouseOver);
            document.body.classList.remove('cursor-hovering');
        };
    }, []);

    return (
        <>
            <div
                ref={cursorRing}
                className="fixed top-0 left-0 w-9 h-9 rounded-full border-[1.5px] border-accent/60 opacity-60 pointer-events-none z-10000 -translate-x-1/2 -translate-y-1/2 will-change-transform"
            />
            <div
                ref={cursorDot}
                className="fixed top-0 left-0 w-2 h-2 bg-accent rounded-full pointer-events-none z-10001 -translate-x-1/2 -translate-y-1/2 will-change-transform"
            />
        </>
    );
}
