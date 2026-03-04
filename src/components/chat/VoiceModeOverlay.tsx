"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceModeOverlayProps {
    onDismiss: (transcript: string) => void;
}

const linesConfig = [
    { freq: 0.1, amplitude: 4, speed: 0.04, color: "rgba(245, 237, 214, 0.3)" }, // top: fast, high freq
    { freq: 0.05, amplitude: 10, speed: 0.055, color: "#E8602C" },                // middle: medium, dominant, ember
    { freq: 0.02, amplitude: 6, speed: 0.08, color: "rgba(245, 237, 214, 0.15)" } // bottom: slow, wide waves
];

export default function VoiceModeOverlay({ onDismiss }: VoiceModeOverlayProps) {
    const [statusState, setStatusState] = useState(0);
    const [transcript, setTranscript] = useState("");
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const renderFrameRef = useRef<number>(0);

    const states = ["Listening…", "Hearing you…", "Got it. Thinking…"];

    useEffect(() => {
        // Dummy timed sequence
        const timer1 = setTimeout(() => {
            setStatusState(1);
        }, 1500);

        const timer2 = setTimeout(() => {
            setStatusState(2);
            // Wait a bit on thinking state, then dismiss with dummy transcript
            setTimeout(() => {
                onDismiss("Carbonara with pancetta and eggs");
            }, 1000);
        }, 2800);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onDismiss]);

    useEffect(() => {
        // Transcript builder effect based on states
        if (statusState === 1) {
            setTranscript("Carbonara with");
        } else if (statusState === 2) {
            setTranscript("Carbonara with pancetta and eggs");
        }
    }, [statusState]);

    // Waveform animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let time = 0;

        // Check for reduced motion
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const render = () => {
            // Resize support
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
            } else {
                ctx.clearRect(0, 0, rect.width, rect.height);
            }

            const w = rect.width;
            const h = rect.height;

            linesConfig.forEach((cfg, i) => {
                ctx.beginPath();
                const yOffset = h / 2 + (i - 1) * 8; // spread vertically

                ctx.strokeStyle = cfg.color;
                ctx.lineWidth = 2;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";

                const segments = 60;
                const segmentWidth = w / segments;

                for (let x = 0; x <= segments; x++) {
                    const xPos = x * segmentWidth;
                    // Add sine wave + some organic noise driven by x and time
                    const activeAmp = prefersReducedMotion ? 0 : cfg.amplitude;

                    const y = yOffset + Math.sin(x * cfg.freq + time * cfg.speed * 10) * activeAmp
                        + (Math.random() - 0.5) * (prefersReducedMotion ? 0 : 1);

                    if (x === 0) ctx.moveTo(xPos, y);
                    else ctx.lineTo(xPos, y);
                }
                ctx.stroke();
            });

            time += 1;
            renderFrameRef.current = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(renderFrameRef.current);
    }, []);

    return (
        <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="absolute bottom-[80px] left-1/2 -translate-x-1/2 w-[90%] md:w-[480px] min-h-[160px] bg-[#0A0A0F]/92 border border-[#E8602C]/30 rounded-[20px] backdrop-blur-[32px] flex flex-col items-center justify-between p-6 z-50 shadow-[0_0_60px_rgba(232,96,44,0.12),0_20px_60px_rgba(0,0,0,0.5)]"
        >
            <div className="flex-1 flex flex-col justify-end items-center mb-6 min-h-[40px] text-center w-full">
                <AnimatePresence mode="popLayout">
                    {transcript.split(" ").map((word, i) => (
                        <motion.span
                            key={i + word}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-cormorant italic text-[18px] text-[#F5EDD6] inline-block mr-1"
                        >
                            {word}
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>

            {/* Waveform Canvas */}
            <div className="w-full h-[40px] mb-4 relative">
                <canvas ref={canvasRef} className="w-full h-full block" />
            </div>

            <div className="h-4 relative w-full overflow-hidden">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={statusState}
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -16, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#F5EDD6]/50">
                            {states[statusState]}
                        </span>
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
