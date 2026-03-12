"use client";

import { useEffect, useRef } from "react";
import * as AnimeJS from "animejs";
import { useRouter } from "next/navigation";

export default function WavyText({ text = "Dal tadka recipe" }: { text?: string }) {
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

        const scopeParams = {
            root: rootEl,
            defaults: { ease: 'inOut(3)', duration: 350 },
        };

        const scope = AnimeJS.createScope(scopeParams);

        const h2El = rootEl.querySelector('h2')!;
        const params = {
            split: AnimeJS.text.split(h2El, { chars: true }),
            strength: 0,
        };

        const waveAnim = AnimeJS.createTimeline().add(params.split.chars, {
            y: [`-50%`, `50%`],
            duration: 500,
            loop: true,
            alternate: true,
            ease: 'inOut(2)',
            autoplay: false,
            modifier: (v: number) => v * params.strength,
        }, AnimeJS.stagger(50)).seek(1000);

        const onEnter = () => AnimeJS.animate(params, {
            strength: 1,
            onBegin: () => waveAnim.play(),
        });

        const onLeave = () => AnimeJS.animate(params, {
            strength: 0,
            onComplete: () => waveAnim.pause(),
        });

        rootEl.addEventListener('pointerenter', onEnter);
        rootEl.addEventListener('pointerleave', onLeave);

        return () => {
            rootEl.removeEventListener('pointerenter', onEnter);
            rootEl.removeEventListener('pointerleave', onLeave);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const scopeAny = scope as any;
            if (typeof scopeAny.destroy === 'function') {
                scopeAny.destroy();
            }
        };
    }, []);

    return (
        <article
            onClick={handleClick}
            ref={containerRef}
            className="flex flex-col justify-center items-center min-h-50 p-5 rounded-[1cqw] bg-[#2A2A2A] text-[#D0D0D0] transition-colors duration-250 ease-out hover:bg-[#303030] hover:cursor-pointer"
        >
            <h2 className="text-center font-bold text-[clamp(20px,8cqw,30px)] will-change-transform">{text}</h2>
        </article>
    );
}
