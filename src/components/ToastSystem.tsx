// Mock Toast System since none was provided
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastOptions {
    label?: string;
    duration?: number;
    onUndo?: () => Promise<void> | void;
}

interface Toast {
    id: string;
    message: string;
    type: "info" | "error" | "success";
    options?: ToastOptions;
}

interface ToastContextType {
    showToast: (message: string, type?: Toast["type"], options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: Toast["type"] = "info", options?: ToastOptions) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type, options }]);

        if (options?.duration) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, options.duration);
        }
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-24 right-4 z-100 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[#1A1A24] border border-[#F5EDD6]/10 text-[#F5EDD6] px-4 py-3 rounded-xl shadow-2xl flex items-center gap-4 text-sm font-sans pointer-events-auto"
                        >
                            <span className="flex-1">{toast.message}</span>
                            {toast.options?.onUndo && (
                                <button
                                    onClick={async () => {
                                        await toast.options!.onUndo!();
                                        removeToast(toast.id);
                                    }}
                                    className="text-[#E8602C] font-semibold hover:text-[#E8602C]/80 transition-colors"
                                >
                                    {toast.options.label || "Undo"}
                                </button>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToastProvider");
    return context;
}
