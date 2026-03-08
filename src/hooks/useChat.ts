"use client";

import { useState, useRef, useCallback } from "react";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  timestamp: string;
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey there! 👋 I'm VoiceBite, your personal cooking assistant. What are we making today?",
      isStreaming: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (overrideContent?: string) => {
      const content = (overrideContent ?? input).trim();
      if (!content || isLoading) return;

      // 1. Add user message instantly
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        isStreaming: false,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);

      // 2. Add empty AI bubble immediately
      const aiId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        {
          id: aiId,
          role: "assistant",
          content: "",
          isStreaming: true,
          timestamp: new Date().toISOString(),
        },
      ]);

      try {
        abortRef.current = new AbortController();

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: abortRef.current.signal,
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error ?? `Request failed with status ${res.status}`);
        }

        if (!res.body) throw new Error("No response body received");

        setIsLoading(false);

        // 3. Read stream chunk by chunk
        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiId
                ? { ...m, content: m.content + chunk }
                : m
            )
          );
        }

        // 4. Mark streaming complete
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiId
              ? { ...m, isStreaming: false }
              : m
          )
        );
      } catch (err: any) {
        // Ignore abort errors — user cancelled intentionally
        if (err?.name === "AbortError") return;

        console.error("[useChat]", err);
        setIsLoading(false);

        // Replace empty AI bubble with error message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiId
              ? {
                  ...m,
                  content: "Something went wrong. Please try again.",
                  isStreaming: false,
                }
              : m
          )
        );
      }
    },
    [input, messages, isLoading]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
    setMessages((prev) =>
      prev.map((m) =>
        m.isStreaming ? { ...m, isStreaming: false } : m
      )
    );
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Hey there! 👋 I'm VoiceBite, your personal cooking assistant. What are we making today?",
        isStreaming: false,
        timestamp: new Date().toISOString(),
      },
    ]);
    setInput("");
    setIsLoading(false);
  }, []);

  return {
    messages,
    input,
    setInput,
    isLoading,
    sendMessage,
    stopStreaming,
    clearMessages,
  };
}