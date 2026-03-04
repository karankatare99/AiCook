"use client";

import { useEffect, useRef } from "react";
import * as AnimeJS from "animejs";

export default function RainingLetters({ text = "Pasta primavera recipe" }: { text?: string }) {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const rootEl = containerRef.current;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        AnimeJS.createScope({ root: rootEl });

        const h2El = rootEl.querySelector('h2')!;
        AnimeJS.text.split(h2El, {
            chars: {
                class: 'char',
                clone: 'top',
                wrap: 'clip',
            },
        });

        const ease = AnimeJS.createSpring({ stiffness: 90, damping: 11 });

        const onEnter = () => {
            AnimeJS.createTimeline().add('.char > span', {
                y: '100%',
                composition: 'blend',
                ease,
            }, AnimeJS.stagger(10, { use: 'data-char', from: 'random' }));
        };

        const onLeave = () => {
            AnimeJS.createTimeline().add('.char > span', {
                y: '0%',
                composition: 'blend',
                ease,
            }, AnimeJS.stagger(10, { use: 'data-char', from: 'random' }));
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
            ref={containerRef}
            className="flex flex-col justify-center items-center min-h-50 p-5 rounded-[1cqw] bg-[#2A2A2A] text-[#D0D0D0] transition-colors duration-250 ease-out hover:bg-[#303030] hover:cursor-default"
        >
            <h2 className="text-center font-bold text-[clamp(20px,8cqw,30px)] will-change-transform">{text}</h2>
        </article>
    );
}
