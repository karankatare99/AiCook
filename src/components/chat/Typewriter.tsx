"use client"

import { useEffect } from "react";

export default function Typewriter({ status, user, messages, setMessages ,isStreaming, setIsStreaming, setStreamingText, seedMessage }) {
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
}
