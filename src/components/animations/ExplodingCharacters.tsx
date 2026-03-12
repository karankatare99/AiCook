"use client";

import { useEffect, useRef } from "react";
import * as AnimeJS from "animejs";
import { useRouter } from "next/navigation";

export default function ExplodingCharacters({ text = "Chicken curry recipe" }: { text?: string }) {
    const containerRef = useRef<HTMLElement>(null);
    const router = useRouter();

    const handleClick = () => {
        // Store the prompt so chat page can pick it up on mount
        sessionStorage.setItem("autoPrompt", text);
        router.push("/chat");
    };

    useEffect(() => {
        if (!containerRef.current) return;
        const rootEl = containerRef.current;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        AnimeJS.createScope({ root: rootEl });

        const h2El = rootEl.querySelector('h2')!;
        const { chars } = AnimeJS.text.split(h2El, { chars: true });

        const onEnter = () => {
            AnimeJS.createTimeline().add(chars, {
                x: {
                    to: () => AnimeJS.utils.random(-3, 3) + 'rem',
                    duration: () => AnimeJS.utils.random(150, 500),
                },
                y: () => AnimeJS.utils.random(-5, 5) + 'rem',
                rotate: () => AnimeJS.utils.random(-180, 180),
                duration: () => AnimeJS.utils.random(200, 750),
                ease: 'outCirc', composition: 'blend',
            }, AnimeJS.stagger(5, { from: 'random' }));
        };

        const onLeave = () => {
            AnimeJS.createTimeline().add(chars, {
                x: { to: 0, delay: 75 },
                y: 0,
                duration: () => AnimeJS.utils.random(200, 400),
                rotate: {
                    to: 0,
                    delay: 150,
                    duration: () => AnimeJS.utils.random(300, 400),
                },
                ease: 'inOut(2)', composition: 'blend',
            }, AnimeJS.stagger(10, { from: 'random' }));
        };

        rootEl.addEventListener('pointerenter', onEnter);
        rootEl.addEventListener('pointerleave', onLeave);

        return () => {
            rootEl.removeEventListener('pointerenter', onEnter);
            rootEl.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    return (
        <article
            onClick={handleClick}
            ref={containerRef}
            className="flex flex-col justify-center items-center min-h-50 p-5 rounded-[1cqw] bg-[#2A2A2A] text-[#D0D0D0] transition-colors duration-250 ease-out hover:bg-[#303030] hover:cursor-pointer"
        >
            <h2 className="text-center font-bold text-[clamp(20px,8cqw,30px)] will-change-transform inline-block">{text}</h2>
        </article>
    );
}
