"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Mic, Square, Timer, X, Play, RotateCcw, BellOff } from "lucide-react";
import clsx from "clsx";

interface InputBarProps {
    onSend: (text: string) => void;
    onStop: () => void;
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
    const [isTimerOpen, setIsTimerOpen] = useState(false);
    
    // Timer Logic State
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [totalDuration, setTotalDuration] = useState<number>(0);
    const [isActive, setIsActive] = useState(false);
    const [isAlarmRinging, setIsAlarmRinging] = useState(false);
    const [inputMins, setInputMins] = useState("");
    const [inputSecs, setInputSecs] = useState("");
    
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const progress = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;

    // Handle auto fill text
    useEffect(() => {
        if (autoFillText) {
            let currentIndex = 0;
            const interval = setInterval(() => {
                currentIndex++;
                setText(autoFillText.slice(0, currentIndex));
                if (currentIndex >= autoFillText.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        onSend(autoFillText);
                        setText("");
                    }, 400);
                }
            }, 18);
            return () => clearInterval(interval);
        }
    }, [autoFillText, onSend]);

    // Timer Tick Logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerIntervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            handleTimerComplete();
        }
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, [isActive, timeLeft]);

    const handleTimerComplete = () => {
        setIsActive(false);
        setIsAlarmRinging(true);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        
        // Start repeating alarm
        playAlarm(); // Play immediately
        alarmIntervalRef.current = setInterval(() => {
            playAlarm();
        }, 2000); // Repeat every 2 seconds
    };

    const stopAlarm = () => {
        setIsAlarmRinging(false);
        if (alarmIntervalRef.current) {
            clearInterval(alarmIntervalRef.current);
            alarmIntervalRef.current = null;
        }
        setTimeLeft(0);
    };

    const playAlarm = () => {
        try {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.type = "sine";
            oscillator.frequency.setValueAtTime(880, context.currentTime); 
            gain.gain.setValueAtTime(0, context.currentTime);
            gain.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1.2);
            oscillator.start();
            oscillator.stop(context.currentTime + 1.2);
        } catch (e) {
            console.error("Audio failed", e);
        }
    };

    const startTimer = () => {
        const mins = parseInt(inputMins || "0");
        const secs = parseInt(inputSecs || "0");
        const total = (mins * 60) + secs;
        if (total > 0) {
            setTotalDuration(total);
            setTimeLeft(total);
            setIsActive(true);
            setIsAlarmRinging(false);
            setInputMins("");
            setInputSecs("");
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (isStreaming) {
            onStop?.();
            return;
        }
        if (text.trim() && !isVoiceMode) {
            onSend(text);
            setText("");
        }
    };

    return (
        <div className="fixed bottom-0 left-0 w-full z-40 bg-[#0A0A0F]/85 backdrop-blur-[24px] border-t border-[#F5EDD6]/10 px-6 py-4 md:pl-28 md:pr-8">
            
            <AnimatePresence>
                {isTimerOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-24 right-6 w-72 bg-[#12121A]/95 border border-[#F5EDD6]/15 rounded-[24px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl z-50"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 bg-[#E8602C]/10 rounded-lg">
                                    <Timer className={clsx("w-4 h-4 text-[#E8602C]", isAlarmRinging && "animate-bounce")} />
                                </div>
                                <h3 className="text-[#F5EDD6] text-sm font-semibold tracking-wide">
                                    {isAlarmRinging ? "TIME'S UP!" : "KITCHEN TIMER"}
                                </h3>
                            </div>
                            <button onClick={() => setIsTimerOpen(false)} className="text-[#F5EDD6]/30 hover:text-[#F5EDD6] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {isActive || isAlarmRinging || timeLeft > 0 ? (
                            <div className="flex flex-col items-center">
                                <motion.div 
                                    animate={isAlarmRinging ? { x: [-2, 2, -2, 2, 0] } : {}}
                                    transition={{ repeat: Infinity, duration: 0.4 }}
                                    className="relative w-32 h-32 flex items-center justify-center mb-6"
                                >
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-[#F5EDD6]/5" />
                                        {!isAlarmRinging && (
                                            <motion.circle 
                                                cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="4" fill="transparent" 
                                                strokeDasharray="364.4"
                                                animate={{ strokeDashoffset: 364.4 - (364.4 * progress) / 100 }}
                                                className="text-[#E8602C]"
                                                strokeLinecap="round"
                                            />
                                        )}
                                        {isAlarmRinging && (
                                            <circle cx="64" cy="64" r="58" stroke="#E8602C" strokeWidth="4" fill="transparent" className="animate-pulse" />
                                        )}
                                    </svg>
                                    <div className={clsx(
                                        "absolute text-3xl font-light tabular-nums",
                                        isAlarmRinging ? "text-[#E8602C] font-bold" : "text-[#F5EDD6]"
                                    )}>
                                        {formatTime(timeLeft)}
                                    </div>
                                </motion.div>

                                {isAlarmRinging ? (
                                    <button 
                                        onClick={stopAlarm}
                                        className="w-full flex items-center justify-center gap-2 bg-[#E8602C] text-white py-4 rounded-xl hover:brightness-110 transition-all text-sm font-bold shadow-[0_0_20px_rgba(232,96,44,0.4)]"
                                    >
                                        <BellOff className="w-4 h-4" /> STOP ALARM
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => { setIsActive(false); setTimeLeft(0); }}
                                        className="w-full flex items-center justify-center gap-2 bg-[#F5EDD6]/5 border border-[#F5EDD6]/10 text-[#F5EDD6]/80 py-3 rounded-xl hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all duration-200 text-sm font-medium"
                                    >
                                        <RotateCcw className="w-4 h-4" /> Cancel Timer
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-5">
                                <div className="flex gap-3">
                                    <div className="flex-1 space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-[#F5EDD6]/40 font-bold ml-1">Min</label>
                                        <input
                                            type="number"
                                            placeholder="00"
                                            value={inputMins}
                                            onChange={(e) => setInputMins(e.target.value.slice(0, 2))}
                                            className="w-full bg-[#F5EDD6]/5 border border-[#F5EDD6]/10 rounded-xl px-4 py-3 text-[#F5EDD6] text-center text-lg outline-none focus:border-[#E8602C]/50 transition-all"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <label className="text-[10px] uppercase tracking-widest text-[#F5EDD6]/40 font-bold ml-1">Sec</label>
                                        <input
                                            type="number"
                                            placeholder="00"
                                            value={inputSecs}
                                            onChange={(e) => setInputSecs(e.target.value.slice(0, 2))}
                                            className="w-full bg-[#F5EDD6]/5 border border-[#F5EDD6]/10 rounded-xl px-4 py-3 text-[#F5EDD6] text-center text-lg outline-none focus:border-[#E8602C]/50 transition-all"
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={startTimer}
                                    className="w-full bg-[#E8602C] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(232,96,44,0.3)]"
                                >
                                    <Play className="w-4 h-4 fill-current" /> START
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto flex items-center relative">
                <form
                    onSubmit={handleSubmit}
                    className="flex-grow flex items-center h-[52px] bg-[#F5EDD6]/5 border border-[#F5EDD6]/10 rounded-[14px] px-4 transition-colors duration-200 focus-within:border-[#E8602C]/50 focus-within:shadow-[0_0_0_3px_rgba(232,96,44,0.08)] relative overflow-hidden"
                >
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
                        placeholder={isVoiceMode ? "" : "Ask anything about cooking…"}
                        disabled={isVoiceMode}
                        className={clsx(
                            "w-full h-full bg-transparent border-none outline-none text-[#F5EDD6] text-[15px] placeholder:text-[#F5EDD6]/40",
                            isVoiceMode ? "opacity-0 pointer-events-none" : "opacity-100"
                        )}
                    />
                </form>

                <div className="flex items-center ml-2 relative">
                    <motion.button
                        onClick={() => setIsTimerOpen(!isTimerOpen)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        className={clsx(
                            "w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0 ml-2 transition-all relative border",
                            (isActive || isAlarmRinging) 
                                ? "bg-[#E8602C] border-transparent text-white shadow-[0_0_15px_rgba(232,96,44,0.4)]" 
                                : "bg-[#F5EDD6]/5 border-[#F5EDD6]/15 text-[#F5EDD6] hover:border-[#E8602C]/50"
                        )}
                    >
                        <Timer className={clsx("w-[18px] h-[18px]", (isActive || isAlarmRinging) && "animate-[pulse_1.5s_infinite]")} />
                        {(isActive || isAlarmRinging) && (
                            <span className={clsx(
                                "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0A0A0F]",
                                isAlarmRinging ? "bg-red-500 animate-ping" : "bg-red-500"
                            )} />
                        )}
                    </motion.button>

                    <AnimatePresence mode="wait">
                        {!isVoiceMode && (
                            <motion.button
                                key={isStreaming ? "stop-btn" : "send-btn"}
                                onClick={handleSubmit}
                                className={clsx(
                                    "w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0 ml-2 transition-all duration-300",
                                    isStreaming ? "bg-[#F5EDD6]/10 border border-[#F5EDD6]/20" : "bg-[#E8602C]"
                                )}
                            >
                                {isStreaming ? <Square className="w-[14px] h-[14px] text-[#F5EDD6] fill-current" /> : <ArrowUp className="w-[18px] h-[18px] text-white stroke-[2.5]" />}
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <motion.button
                        onClick={onToggleVoiceMode}
                        className={clsx(
                            "w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0 ml-2 transition-colors relative z-10",
                            isVoiceMode ? "bg-[#E8602C] text-white" : "bg-[#F5EDD6]/5 border border-[#F5EDD6]/15 text-[#F5EDD6]"
                        )}
                    >
                        {isVoiceMode ? <Square className="w-[16px] h-[16px] fill-current" /> : <Mic className="w-[18px] h-[18px]" />}
                    </motion.button>
                </div>
            </div>
        </div>
    );
}