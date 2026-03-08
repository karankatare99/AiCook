"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble, { MessageType } from "@/components/chat/MessageBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import InputBar from "@/components/chat/InputBar";
import VoiceModeOverlay from "@/components/chat/VoiceModeOverlay";
import axios from "axios";

const seedMessage = "Hey there 👋 I'm VoiceBite, your hands-free cooking assistant. Ask me anything — recipes, substitutions, timers, techniques. What are we making today?";

const dummyResponses = [
    "Great choice! Carbonara is all about technique. You'll need guanciale, Pecorino Romano, eggs, and black pepper. The key is to keep the heat low when you add the egg mixture — you want silky, not scrambled. Want me to walk you through it step by step?",
    "For a vegetarian swap, replace guanciale with smoked mushrooms or sun-dried tomatoes. They bring that savory depth without the meat. The rest of the technique stays the same.",
    "I'd suggest starting the pasta water now — you'll want it at a rolling boil. While that heats up, dice your guanciale into small cubes and render it in a cold pan, no oil needed. Should I set a timer for the pasta?",
    "Perfect! Setting a timer for 9 minutes for the spaghetti. I'll let you know when it's time to pull it. Meanwhile, whisk 3 egg yolks with a whole egg and a generous handful of Pecorino."
];

export default function ChatPage() {
    const { status, user } = useSession();
    const router = useRouter();

    const [messages, setMessages] = useState<MessageType[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [autoFillText, setAutoFillText] = useState("");

    // Streaming state
    const [streamingText, setStreamingText] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);

    const [responseIndex, setResponseIndex] = useState(0);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Welcome message typewriter on mount
    useEffect(() => {
        if (status === "authenticated" && user) {
            if (messages.length === 0 && !isStreaming) {
                // Delay 300ms from load as per prompt "3. (300ms) Welcome message..."
                // In reality, actual component mount delay + status load delay.
                setIsStreaming(true);
                let currentText = "";
                let i = 0;

                let customGreeting = seedMessage.replace("there", user.name.split(" ")[0] || "there");

                // Wait 300ms before starting stream
                const startTimer = setTimeout(() => {
                    const interval = setInterval(() => {
                        currentText += customGreeting.charAt(i);
                        setStreamingText(currentText);
                        i++;
                        if (i >= customGreeting.length) {
                            clearInterval(interval);
                            setIsStreaming(false);
                            setMessages([{
                                id: "seed-1",
                                role: "assistant",
                                content: customGreeting,
                                timestamp: "Just now"
                            }]);
                            setStreamingText("");
                        }
                    }, 14); // 14ms per char
                    return () => clearInterval(interval);
                }, 300);
                return () => clearTimeout(startTimer);
            }
        }
    }, [status, user]);

    // Auto scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages, streamingText, isTyping]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    const handleSend = (text: string) => {
        if (!text.trim() || isStreaming) return;

        // Append user message
        const newUserMsg: MessageType = {
            id: Date.now().toString(),
            role: "user",
            content: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, newUserMsg]);
        setIsTyping(true);

        // AI Response Sequence
        setTimeout(async () => {
            setIsTyping(false);
            setIsStreaming(true);

            const res = await axios.post("http://localhost:3000/api/chat", { prompt: text })
            const currentText = res.data.response;
            setResponseIndex(prev => prev + 1);

            const interval = setInterval(() => {
                setStreamingText(currentText);
                clearInterval(interval);
                setIsStreaming(false);
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + "_ai",
                    role: "assistant",
                    content: currentText,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
                setStreamingText("");
            }, 12);
        }, 1400); // Dummy delay 1.4s
    };

    const handleDismissVoiceMode = (transcript: string) => {
        setIsVoiceMode(false);
        setAutoFillText(transcript);
    };

    const handleToggleVoiceMode = () => {
        if (!isVoiceMode) {
            setIsVoiceMode(true);
            setAutoFillText(""); // clear any leftover
        } else {
            // Manual Cancel
            setIsVoiceMode(false);
        }
    };

    if (status === "loading" || status === "unauthenticated") {
        return (
            <div className="flex items-center justify-center h-screen w-full relative z-20">
                <div className="w-8 h-8 set-loader border-2 border-[#E8602C] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(232,96,44,0.4)]" />
            </div>
        );
    }

    return (
        <main className="flex flex-col h-dvh pt-6 md:pt-12 max-w-4xl mx-auto w-full relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="flex-1 overflow-y-auto pb-32 px-4 md:px-8 scrollbar-hide relative z-10 w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                ref={scrollRef}
                aria-live="polite"
                role="log"
            >
                <div className="w-full flex justify-center py-4 mb-4">
                    <span className="px-3 py-1 bg-[#F5EDD6]/5 border border-[#F5EDD6]/10 rounded-full text-[#F5EDD6]/50 text-xs font-mono tracking-widest backdrop-blur-md">
                        SESSION SECURED
                    </span>
                </div>

                {messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        userImage={user?.image}
                    />
                ))}

                {isTyping && (
                    <TypingIndicator />
                )}

                {isStreaming && streamingText && (
                    <MessageBubble
                        message={{
                            id: "streaming",
                            role: "assistant",
                            content: streamingText,
                        }}
                        streaming={true}
                    />
                )}
            </motion.div>

            <AnimatePresence>
                {isVoiceMode && (
                    <VoiceModeOverlay onDismiss={handleDismissVoiceMode} />
                )}
            </AnimatePresence>

            <InputBar
                onSend={handleSend}
                isVoiceMode={isVoiceMode}
                onToggleVoiceMode={handleToggleVoiceMode}
                autoFillText={autoFillText}
                isStreaming={isStreaming}
            />
        </main>
    );
}
