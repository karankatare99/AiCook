"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoiceInput } from "@/hooks/useVoiceInput";

type Props = {
    onDismiss: (transcript: string) => void;
}

export default function VoiceModeOverlay({ onDismiss } : Props) {
    const hasConfirmedRef = useRef(false);

    const { voiceState, transcript, interimTranscript, confirm, start, cancel } = useVoiceInput({
        onTranscript: (text) => onDismiss(text),
        onCancel: () => onDismiss(""),
    });

    useEffect(() => {
        start();
        hasConfirmedRef.current = false;
    }, [start]);

    useEffect(() => {
        if (voiceState === "done" && transcript.trim() && !hasConfirmedRef.current) {
            hasConfirmedRef.current = true;
            confirm();
        }
    }, [voiceState, transcript, confirm])

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") cancel();
        }
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [cancel])

    const statusText = {
        idle:       "",
        listening:  "Listening…",
        processing: "Got it. Sending…",
        done:       "Got it. Sending…",
    }[voiceState];

    const displayText = interimTranscript 
        ? transcript + " " + interimTranscript
        : transcript;
    
    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center pb-28 px-4"
        style={{ pointerEvents: "none" }}
        >
            <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 16, opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                style={{ pointerEvents: "all" }}
                className="w-full max-w-md bg-[#0A0A0F]/92 border border-[#E8602C]/30
                rounded-2xl backdrop-blur-3xl overflow-hidden
                shadow-[0_0_60px_rgba(232,96,44,0.12),0_20px_60px_rgba(0,0,0,0.5)]"
            >

            <div className="px-6 pt-5 pb-3 flex flex-col gap-1.5">
            {[
                { height: 4,  speed: "0.8s",  opacity: 0.3  },
                { height: 10, speed: "1.1s",  opacity: 1.0  },
                { height: 6,  speed: "1.4s",  opacity: 0.15 },
            ].map((line, i) => (
                <div key={i} className="w-full flex items-center gap-[3px]">
                {Array.from({ length: 40 }).map((_, j) => (
                    <motion.div
                    key={j}
                    className="flex-1 rounded-full bg-[#E8602C]"
                    style={{ opacity: line.opacity }}
                    animate={voiceState === "listening" ? {
                        height: [
                        2,
                        Math.random() * line.height + 2,
                        2,
                        ],
                    } : { height: 2 }}
                    transition={{
                        duration: parseFloat(line.speed),
                        repeat: Infinity,
                        delay: j * 0.04,
                        ease: "easeInOut",
                    }}
                    />
                ))}
                </div>
            ))}
            </div>

            <div className="px-6 pb-2 min-h-[40px]">
            <AnimatePresence mode="wait">
                {displayText ? (
                <motion.p
                    key="transcript"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-['Cormorant_Garamond'] italic text-lg
                    text-[#F5EDD6] text-center leading-snug"
                >
                    {displayText}
                    {/* Interim text slightly muted */}
                    {interimTranscript && (
                    <span className="text-[#F5EDD6]/40"> {interimTranscript}</span>
                    )}
                </motion.p>
                ) : (
                <motion.p
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[#F5EDD6]/30 text-sm text-center font-mono"
                >
                    Start speaking…
                </motion.p>
                )}
            </AnimatePresence>
            </div>

            <div className="px-6 pb-5 flex items-center justify-between mt-2">
            <AnimatePresence mode="wait">
                <motion.span
                key={statusText}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-[10px] font-mono uppercase tracking-widest
                    text-[#F5EDD6]/40"
                >
                {statusText}
                </motion.span>
            </AnimatePresence>

            <button
                onClick={cancel}
                className="text-[11px] font-mono uppercase tracking-widest
                text-[#F5EDD6]/30 hover:text-[#E8602C]
                border border-[#F5EDD6]/10 hover:border-[#E8602C]/40
                px-3 py-1.5 rounded-lg transition-all duration-150"
            >
                Cancel
            </button>
            </div>
        </motion.div>
    </motion.div>
  );
}