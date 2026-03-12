"use client";

import { useEffect, useRef } from "react";
import * as AnimeJS from "animejs";
import { useRouter } from "next/navigation";

export default function Words3D({ text = "Salad bowl recipe" }: { text?: string }) {
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

        AnimeJS.createScope({
            root: rootEl,
            defaults: { ease: 'outQuad', }
        });

        const h2El = rootEl.querySelector('h2')!;

        // Using string template splitting
        AnimeJS.text.split(h2El, {
            words: `<span class="word-3d word-{i} inline-block" style="perspective:1000px;position:relative;transform-style:preserve-3d;transform-origin:50% 50% 1rem;">
      <em class="face face-top absolute left-0 opacity-0" style="bottom:100%;transform-origin:50% 100%;transform:rotateX(-90deg);">{value}</em>
      <em class="face-front opacity-100">{value}</em>
      <em class="face face-bottom absolute left-0 opacity-0" style="top:100%;transform-origin:50% 0%;transform:rotateX(90deg);">{value}</em>
      <em class="face face-back absolute left-0 opacity-0" style="top:0;transform-origin:50% 50%;transform:translateZ(2.5rem) rotateX(-180deg);">{value}</em>
    </span>`,
        });

        const wordStagger = AnimeJS.stagger(50, { use: 'data-word', start: 0 });

        const rotateAnim = AnimeJS.createTimeline({
            autoplay: false,
            defaults: { ease: 'inOut(2)', duration: 750 }
        })
            .add('.word-3d', { rotateX: -180 }, wordStagger)
            .add('.word-3d .face-top', { opacity: [0, 0, 0] }, wordStagger)
            .add('.word-3d .face-front', { opacity: [1, 0, 0] }, wordStagger)
            .add('.word-3d .face-bottom', { opacity: [0, 1, 0] }, wordStagger)
            .add('.word-3d .face-back', { opacity: [0, 0, 1] }, wordStagger);

        const onEnter = () => AnimeJS.animate(rotateAnim, { progress: 1 });
        const onLeave = () => AnimeJS.animate(rotateAnim, { progress: 0 });

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
            <h2 className="text-center font-bold text-[clamp(20px,8cqw,30px)] will-change-transform font-['Noto_Sans_JP']">{text}</h2>
        </article>
    );
}
