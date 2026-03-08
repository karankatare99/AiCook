"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function PageLoader() {
    const containerRef = useRef<HTMLDivElement>(null);
    const wordmarkRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                setComplete(true);
            }
        });

        // Phase 1 is just the black overlay being present (default CSS)

        // Phase 2: Brand Mark Reveal (400ms -> 1000ms)
        // Delay 0.4 starts at 400ms
        tl.to(wordmarkRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
        }, 0.4);

        // Phase 3: Loading Bar & Counter (1000ms -> 1800ms)
        tl.to(lineRef.current, {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.inOut",
        }, 1.0);

        const proxy = { pct: 0 };
        tl.to(proxy, {
            pct: 100,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => {
                if (counterRef.current) {
                    counterRef.current.innerText = `${Math.floor(proxy.pct)}%`;
                }
            }
        }, 1.0);

        // Phase 4: Shatter Reveal (1800ms -> 2200ms)
        // For shatter we use a generic staggered horizontal split or clip-path.
        // We'll use a GSAP clip-path wipe up to simplify the cinematic drop. 
        // Real "shatter" into strips would require mapping DOM nodes, but clip-up + move up works cleanly
        tl.to([wordmarkRef.current, lineRef.current, counterRef.current], {
            y: -40,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
        }, 1.8);

        tl.to(containerRef.current, {
            clipPath: "inset(0% 0% 100% 0%)", // sweep UP
            duration: 0.8,
            ease: "expo.inOut",
        }, 2.0);

    }, []);

    if (complete) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center pointer-events-none"
            style={{ clipPath: "inset(0% 0% 0% 0%)" }}
        >
            <div
                ref={wordmarkRef}
                className="text-accent text-5xl tracking-[0.3em] font-serif opacity-0 scale-[0.85]"
            >
                VOICEBITE
            </div>

            <div className="w-full max-w-sm px-8 mt-12 relative flex flex-col items-center">
                <div className="w-full h-[1px] bg-white/20 relative overflow-hidden">
                    <div
                        ref={lineRef}
                        className="absolute top-0 left-0 w-full h-full bg-accent origin-center scale-x-0"
                    />
                </div>
                <div
                    ref={counterRef}
                    className="mt-4 font-mono text-white/60 text-sm opacity-100"
                >
                    0%
                </div>
            </div>
        </div>
    );
}
