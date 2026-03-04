"use client";

import { useState, useEffect } from "react";

/**
 * Streams text character by character to simulate an AI response.
 */
export function useTypewriter(text: string, intervalMs: number = 14) {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Reset state when text changes
        setDisplayedText("");
        setIsComplete(false);

        if (!text) {
            setIsComplete(true);
            return;
        }

        let currentIndex = 0;

        // Check for prefers-reduced-motion to skip typing animation
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            setDisplayedText(text);
            setIsComplete(true);
            return;
        }

        const interval = setInterval(() => {
            currentIndex++;
            setDisplayedText((prev) => text.slice(0, currentIndex));

            if (currentIndex >= text.length) {
                clearInterval(interval);
                setIsComplete(true);
            }
        }, intervalMs);

        return () => clearInterval(interval);
    }, [text, intervalMs]);

    return { displayedText, isComplete };
}
