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

    const scrollRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const hasSentRef = useRef(false);
    const hasAutoPromptRef = useRef(false);

    if (typeof window !== "undefined" && sessionStorage.getItem("autoPrompt")) {
        hasAutoPromptRef.current = true;
    }

    useEffect(() => {
        const autoPrompt = sessionStorage.getItem("autoPrompt");
        if (autoPrompt && status === "authenticated") {
            sessionStorage.removeItem("autoPrompt");
            hasAutoPromptRef.current = true;  // ✅ set ref before welcome fires
            const timer = setTimeout(() => {
                handleSend(autoPrompt);
            }, 500);  // ✅ reduced to 500ms — no welcome message to wait for
            return () => clearTimeout(timer);
        }
    }, [status]);

    // Welcome message typewriter on mount
    useEffect(() => {
        console.log("[welcome]", { status, user, hasAutoPrompt: hasAutoPromptRef.current, messagesLength: messages.length, isStreaming });
        if (status !== "authenticated") return;
        if (!user) return;
        if (hasAutoPromptRef.current) return;
        if (messages.length > 0) return;

        setIsStreaming(true);
        let currentText = "";
        let i = 0;

        const customGreeting = seedMessage.replace("there", user.name.split(" ")[0] || "there");

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
            }, 14);
            return () => clearInterval(interval);
        }, 300);

        return () => clearTimeout(startTimer);

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

    const handleSend = async (text: string) => {
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

        try {
            // 2. Call API
            const res = await axios.post("/api/chat", { prompt: text });
            const fullResponse: string = res.data.response;

            // 3. Hide typing indicator, begin typewriter
            setIsTyping(false);
            setIsStreaming(true);

            let i = 0;
            let currentText = "";

            intervalRef.current = setInterval(() => {
                currentText += fullResponse.charAt(i);
                setStreamingText(currentText);
                i++;

            // 4. All characters done
            if (i >= fullResponse.length) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                setIsStreaming(false);
                setStreamingText("");

                // 5. Commit to messages
                setMessages(prev => [...prev, {
                    id: Date.now().toString() + "_ai",
                    role: "assistant",
                    content: fullResponse,
                    timestamp: new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                }]);
            }
        }, 12);

    } catch (e) {
        setIsTyping(false);
        setIsStreaming(false);
        setStreamingText("");

        setMessages(prev => [...prev, {
            id: Date.now().toString() + "_err",
            role: "assistant",
            content: "Something went wrong. Please try again.",
            timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            })
        }]);
    }
    };

    const handleStop = () => {
    // Stop the typewriter interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setIsStreaming(false);

        // Commit whatever text was streamed so far as a complete message
        setMessages(prev => {
            if (!streamingText.trim()) return prev;
            return [...prev, {
                id: Date.now().toString() + "_ai",
                role: "assistant" as const,
                content: streamingText + "…", // ← trailing ellipsis shows it was cut short
                timestamp: new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }];
        });

        setStreamingText("");
    };

    const handleDismissVoiceMode = (transcript: string) => {
        setIsVoiceMode(false);
        setAutoFillText("");

        if (transcript.trim()) {
            hasSentRef.current = true;
            handleSend(transcript);   // fires directly, skips input bar
        }

        setTimeout(() => {
            hasSentRef.current = false;
        }, 1000);
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
                        userImage={user?.image ?? undefined}
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
                onStop={handleStop}
                isVoiceMode={isVoiceMode}
                onToggleVoiceMode={handleToggleVoiceMode}
                autoFillText={autoFillText}
                isStreaming={isStreaming}
            />
        </main>
    );
}
