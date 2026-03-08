"use client";

import { useEffect, useRef } from "react";
import * as AnimeJS from "animejs";

export default function HorizontalSplit({ text = "Vegan stir-fry recipe" }: { text?: string }) {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // We use a dynamic class or ID to avoid collision if multiple appear
        const rootEl = containerRef.current;

        // Disable in reduced motion
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        const scope = AnimeJS.createScope({
            root: rootEl,
            defaults: {
                ease: 'outQuad',
                duration: 500,
            }
        });

        AnimeJS.text.split(rootEl.querySelector('h2')!, {
            chars: {
                class: 'char',
                clone: 'left',
                wrap: 'clip',
            },
        });

        const rotateAnim = AnimeJS.createTimeline({
            autoplay: false,
            defaults: { ease: 'inOutQuad', duration: 400, }
        })
            .add('.char > span', { x: '100%' }, AnimeJS.stagger(5, { use: 'data-char' }));

        const onEnter = () => AnimeJS.animate(rotateAnim, { progress: 1 });
        const onLeave = () => AnimeJS.animate(rotateAnim, { progress: 0 });

        rootEl.addEventListener('pointerenter', onEnter);
        rootEl.addEventListener('pointerleave', onLeave);

        return () => {
            rootEl.removeEventListener('pointerenter', onEnter);
            rootEl.removeEventListener('pointerleave', onLeave);
            // Anime.js scope cleanup if available
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const scopeAny = scope as any;
            if (typeof scopeAny.destroy === 'function') {
                scopeAny.destroy();
            }
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
