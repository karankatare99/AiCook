"use client";

import { useCallback, useRef, useState } from "react";

type VoiceState = "idle" | "listening" | "processing" | "done";

type UseVoiceInputProps = {
    onTranscript: (text: string) => void;
    onCancel: () => void;
}

export function useVoiceInput({ onTranscript, onCancel } : UseVoiceInputProps) {
    const [voiceState, setVoiceState] = useState<VoiceState>("idle");
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const autoSendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cancelledRef = useRef(false);

    const start = useCallback(() => {
        if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
            alert("Your browser does not support voice input. Try Chrome.");
            return;
        }

        cancelledRef.current = false;
        setTranscript("");
        setInterimTranscript("");
        setVoiceState("listening");
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            let interim = "";
            let final = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    final += result[0].transcript;
                } else {
                    interim += result[0].transcript;
                }
            }

            if (final) {
                setTranscript((prev) => (prev + " " + final).trim());
                setInterimTranscript("");

                if (autoSendTimerRef.current) {
                    clearTimeout(autoSendTimerRef.current)
                }
                
                autoSendTimerRef.current = setTimeout(() => {
                    if (!cancelledRef.current) {
                        recognition.stop();
                        setVoiceState("processing");
                    }
                }, 2000);
            } else {
                setInterimTranscript(interim)
            }
        };

    recognition.onend = () => {
        if (cancelledRef.current) {
            setVoiceState("idle");
            setTranscript("");
            setInterimTranscript("");
            return;
        }

        setVoiceState("done");
    };

    recognition.onerror = (event) => {
        console.error("[useVoiceInput]", event.error);

        if (event.error === "no-speech") {
            setVoiceState("idle");
            return;
        }

        setVoiceState("idle");
        setTranscript("");
        setInterimTranscript("");
    };

    recognition.start();
    }, [])

    const confirm = useCallback(() => {
        if (!transcript.trim()) return;
        setVoiceState("idle");
        setTranscript("");
        setInterimTranscript("");
        onTranscript(transcript.trim());
    }, [transcript, onTranscript]);

    const cancel = useCallback(() => {
        cancelledRef.current = true;

        if (autoSendTimerRef.current) {
            clearTimeout(autoSendTimerRef.current);
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        setVoiceState("idle");
        setTranscript("");
        setInterimTranscript("");
        onCancel?.();
    }, [onCancel])

    return {
        voiceState,     // "idle" | "listening" | "processing" | "done"
        transcript,     // confirmed words so far
        interimTranscript, // words still being spoken (live preview)
        start,
        confirm,
        cancel,
    };
}