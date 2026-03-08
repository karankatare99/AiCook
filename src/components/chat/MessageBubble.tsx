"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";

export type MessageRole = "user" | "assistant";

export interface MessageType {
    id: string;
    role: MessageRole;
    content: string;
    timestamp?: string;
}

interface MessageBubbleProps {
    message: MessageType;
    userImage?: string;
    streaming?: boolean;
}

const AssistantAvatar = () => (
    <div className="w-[28px] h-[28px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFA78A,#E8602C)] shadow-[0_0_10px_rgba(232,96,44,0.5)] shrink-0 self-end mb-1 animate-[orbPulse_3s_ease-in-out_infinite]" />
);

const UserAvatar = ({ src }: { src?: string }) => (
    <div className="w-[28px] h-[28px] rounded-full border border-[#E8602C]/40 overflow-hidden shrink-0 self-end mb-1 relative bg-surface/20">
        {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="User" className="w-full h-full object-cover" />
        ) : (
            <div className="w-full h-full bg-[#E8602C]/20" />
        )}
    </div>
);

function MessageBubble({ message, userImage, streaming }: MessageBubbleProps) {
    const isUser = message.role === "user";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: isUser ? 40 : -30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                duration: isUser ? 0.22 : 0.25
            }}
            className={clsx(
                "flex w-full mb-6",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div className={clsx(
                "flex gap-3 max-w-[85%] md:max-w-[75%]",
                isUser && "flex-row-reverse"
            )}>
                {/* Avatar */}
                {isUser ? <UserAvatar src={userImage} /> : <AssistantAvatar />}

                {/* Bubble & Timestamp */}
                <div className={clsx("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
                    <div
                        className={clsx(
                            "text-[#F5EDD6] text-[15px] font-sans break-words",
                            isUser
                                ? "bg-[#E8602C]/10 border border-[#E8602C]/25 backdrop-blur-[12px] rounded-[18px_18px_4px_18px] py-[14px] px-[18px]"
                                : "bg-[#F5EDD6]/5 border border-[#F5EDD6]/10 backdrop-blur-[16px] rounded-[18px_18px_18px_4px] py-[16px] px-[20px]"
                        )}
                        style={{
                            lineHeight: isUser ? 1.6 : 1.75
                        }}
                    >
                        {message.content}
                        {streaming && (
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                                className="inline-block ml-1 w-[2px] h-[1em] bg-[#E8602C] align-middle"
                            />
                        )}
                    </div>

                    {message.timestamp && (
                        <span className="font-mono text-[10px] text-[#F5EDD6]/40 px-1">
                            {message.timestamp}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default memo(MessageBubble);
