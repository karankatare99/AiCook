"use client";

import { useEffect, useRef } from "react";
import * as AnimeJS from "animejs";

export default function SubtleHighlight({ text = "Chocolate cake recipe" }: { text?: string }) {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const rootEl = containerRef.current;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        AnimeJS.createScope({
            root: rootEl,
            defaults: { ease: 'out(3)', duration: 350, composition: 'blend' },
        });

        const h2El = rootEl.querySelector('h2')!;
        const { chars } = AnimeJS.text.split(h2El, { chars: true });

        AnimeJS.utils.set(chars, { opacity: .25 });

        const onEnter = () => {
            AnimeJS.createTimeline().add(chars, { opacity: 1, textShadow: '0 0 30px rgba(255,255,255,.9)' }, AnimeJS.stagger(12));
        };

        const onLeave = () => {
            AnimeJS.createTimeline().add(chars, { opacity: .25, textShadow: '0 0 0px rgba(255,255,255,0)' }, AnimeJS.stagger(12));
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
