"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface RevealProps {
    children: React.ReactNode;
    variant?:
    | "fade-up"
    | "fade-down"
    | "fade-left"
    | "fade-right"
    | "scale-in"
    | "clip-up"
    | "blur-in"
    | "draw-line";
    delay?: number;
    className?: string;
    as?: React.ElementType;
}

export default function Reveal({
    children,
    variant = "fade-up",
    delay = 0,
    className = "",
    as: Component = "div",
}: RevealProps) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            // Just make it visible instantly
            gsap.set(el, { opacity: 1, visibility: 'visible', autoAlpha: 1 });
            return;
        }

        // Prepare initial state based on variant
        switch (variant) {
            case "fade-up":
                gsap.set(el, { y: 40, opacity: 0 });
                break;
            case "fade-down":
                gsap.set(el, { y: -40, opacity: 0 });
                break;
            case "fade-left":
                gsap.set(el, { x: 60, opacity: 0 });
                break;
            case "fade-right":
                gsap.set(el, { x: -60, opacity: 0 });
                break;
            case "scale-in":
                gsap.set(el, { scale: 0.88, opacity: 0 });
                break;
            case "clip-up":
                gsap.set(el, { clipPath: "inset(100% 0% 0% 0%)" });
                break;
            case "blur-in":
                gsap.set(el, { filter: "blur(12px)", opacity: 0 });
                break;
            case "draw-line":
                // This expects SVG children, assuming strokeDasharray is set usually
                // but we'll apply it directly if it's an SVG.
                gsap.set(el, { opacity: 0 });
                break;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Unobserve after firing
                        observer.unobserve(entry.target);

                        const tweenParams: Record<string, unknown> = {
                            opacity: 1,
                            delay: delay,
                            duration: 0.7,
                            ease: "power3.out",
                        };

                        switch (variant) {
                            case "fade-up":
                            case "fade-down":
                                tweenParams.y = 0;
                                break;
                            case "fade-left":
                            case "fade-right":
                                tweenParams.x = 0;
                                break;
                            case "scale-in":
                                tweenParams.scale = 1;
                                tweenParams.ease = "back.out(1.4)";
                                break;
                            case "clip-up":
                                tweenParams.clipPath = "inset(0% 0% 0% 0%)";
                                tweenParams.duration = 0.9;
                                break;
                            case "blur-in":
                                tweenParams.filter = "blur(0px)";
                                tweenParams.duration = 0.8;
                                break;
                            case "draw-line":
                                // Specific manual setup if SVG
                                tweenParams.opacity = 1;
                                break;
                        }

                        gsap.to(el, tweenParams);
                    }
                });
            },
            {
                threshold: 0.15,
            }
        );

        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, [variant, delay]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp = Component as any;

    return (
        <Comp ref={ref} className={className} data-reveal={variant}>
            {children}
        </Comp>
    );
}
