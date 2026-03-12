"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Mic, Square } from "lucide-react";
import clsx from "clsx";

interface InputBarProps {
    onSend: (text: string) => void;
    onStop: () => void; // New prop for stopping the AI
    isVoiceMode: boolean;
    onToggleVoiceMode: () => void;
    autoFillText?: string;
    isStreaming?: boolean;
}

export default function InputBar({
    onSend,
    onStop,
    isVoiceMode,
    onToggleVoiceMode,
    autoFillText,
    isStreaming
}: InputBarProps) {
    const [text, setText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Handle auto fill text from voice mode completion
    useEffect(() => {
        if (autoFillText) {
            let currentIndex = 0;
            const interval = setInterval(() => {
                currentIndex++;
                setText(autoFillText.slice(0, currentIndex));
                if (currentIndex >= autoFillText.length) {
                    clearInterval(interval);
                    // Wait a bit, then auto-submit
                    setTimeout(() => {
                        onSend(autoFillText);
                        setText("");
                    }, 400);
                }
            }, 18); // 18ms per character
            return () => clearInterval(interval);
        }
    }, [autoFillText, onSend]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        
        // If streaming, the button acts as a stop trigger
        if (isStreaming) {
            onStop?.();
            return;
        }

        if (text.trim() && !isVoiceMode) {
            onSend(text);
            setText("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-[#0A0A0F]/85 backdrop-blur-[24px] border-t border-[#F5EDD6]/10 px-6 py-4 md:pl-28 md:pr-8">
            <div className="max-w-4xl mx-auto flex items-center relative">
                <form
                    onSubmit={handleSubmit}
                    className="flex-grow flex items-center h-[52px] bg-[#F5EDD6]/5 border border-[#F5EDD6]/10 rounded-[14px] px-4 transition-colors duration-200 focus-within:border-[#E8602C]/50 focus-within:shadow-[0_0_0_3px_rgba(232,96,44,0.08)] relative overflow-hidden"
                >
                    {isVoiceMode && (
                        <div className="absolute inset-0 border border-[#E8602C]/60 pointer-events-none rounded-[14px] z-10" />
                    )}

                    <AnimatePresence mode="popLayout">
                        {isVoiceMode ? (
                            <motion.div
                                key="voice-placeholder"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                className="absolute left-4 text-[#F5EDD6]/60 text-[15px] pointer-events-none"
                            >
                                Voice mode active — speak now
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    <input
                        ref={inputRef}
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isVoiceMode ? "" : "Ask anything about cooking…"}
                        disabled={isVoiceMode}
                        className={clsx(
                            "w-full h-full bg-transparent border-none outline-none text-[#F5EDD6] text-[15px] placeholder:text-[#F5EDD6]/40 transition-opacity duration-200",
                            isVoiceMode ? "opacity-0 pointer-events-none" : "opacity-100"
                        )}
                        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                    />

                    {/* Shimmer effect when auto filling */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[14px]">
                        {autoFillText && (
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "200%" }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#E8602C]/10 to-transparent skew-x-[-20deg]"
                            />
                        )}
                    </div>
                </form>

                <div className="flex items-center ml-2 relative">
                    <AnimatePresence mode="wait">
                        {!isVoiceMode && (
                            <motion.button
                                key={isStreaming ? "stop-btn" : "send-btn"}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.08, filter: "brightness(1.1)" }}
                                whileTap={{ scale: 0.92 }}
                                onClick={handleSubmit}
                                // Button is disabled only if there's no text AND we aren't streaming
                                disabled={!text.trim() && !isStreaming}
                                className={clsx(
                                    "w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0 ml-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                                    isStreaming ? "bg-[#F5EDD6]/10 border border-[#F5EDD6]/20" : "bg-[#E8602C]"
                                )}
                                data-cursor="link"
                            >
                                {isStreaming ? (
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    >
                                        <Square className="w-[14px] h-[14px] text-[#F5EDD6] fill-current" />
                                    </motion.div>
                                ) : (
                                    <ArrowUp className="w-[18px] h-[18px] text-white stroke-[2.5]" />
                                )}
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <motion.button
                        key="mic-btn"
                        onClick={onToggleVoiceMode}
                        whileHover={!isVoiceMode ? { borderColor: "#E8602C", color: "#E8602C" } : {}}
                        whileTap={{ scale: 0.92 }}
                        disabled={isStreaming}
                        className={clsx(
                            "w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0 ml-2 transition-colors relative z-10",
                            isVoiceMode
                                ? "bg-[#E8602C] text-white border-transparent"
                                : "bg-[#F5EDD6]/5 border border-[#F5EDD6]/15 text-[#F5EDD6]",
                            isStreaming && "opacity-30 cursor-not-allowed"
                        )}
                        data-cursor="link"
                    >
                        {isVoiceMode ? (
                            <Square className="w-[16px] h-[16px] fill-current" />
                        ) : (
                            <Mic className="w-[18px] h-[18px]" />
                        )}

                        {isVoiceMode && (
                            <motion.div
                                animate={{ boxShadow: ["0 0 0 0 rgba(232,96,44,0.6)", "0 0 0 12px rgba(232,96,44,0)"] }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="absolute inset-0 rounded-full"
                            />
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}