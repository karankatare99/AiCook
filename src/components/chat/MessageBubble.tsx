"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
                "flex w-full mb-8", // Increased bottom margin between messages
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div className={clsx(
                "flex gap-4 max-w-[90%] md:max-w-[80%]", // Slightly wider for better readability
                isUser && "flex-row-reverse"
            )}>
                {/* Avatar */}
                {isUser ? <UserAvatar src={userImage} /> : <AssistantAvatar />}

                {/* Bubble & Timestamp */}
                <div className={clsx("flex flex-col gap-2", isUser ? "items-end" : "items-start")}>
                    <div
                        className={clsx(
                            "text-[#F5EDD6] font-sans break-words shadow-sm",
                            isUser
                                ? "bg-[#E8602C]/10 border border-[#E8602C]/25 backdrop-blur-[12px] rounded-[20px_20px_4px_20px] py-[16px] px-[20px]"
                                : "bg-[#F5EDD6]/5 border border-[#F5EDD6]/10 backdrop-blur-[16px] rounded-[20px_20px_20px_4px] py-[18px] px-[24px]"
                        )}
                    >
                        <div className="prose prose-invert max-w-none 
                                        text-[15.5px] leading-[1.8]
                                        selection:bg-[#E8602C]/30
                                        prose-headings:font-['Cormorant_Garamond'] prose-headings:text-[#F5EDD6] 
                                        prose-headings:font-semibold prose-headings:mt-6 prose-headings:mb-4
                                        prose-p:text-[#F5EDD6]/90 prose-p:mb-5 last:prose-p:mb-0
                                        prose-strong:text-[#E8602C] prose-strong:font-bold
                                        prose-li:text-[#F5EDD6]/90 prose-li:my-2
                                        prose-code:text-[#E8602C] prose-code:bg-[#E8602C]/10 
                                        prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                                        prose-code:before:content-none prose-code:after:content-none
                                        prose-blockquote:border-l-[#E8602C] prose-blockquote:bg-white/5 
                                        prose-blockquote:text-[#F5EDD6]/70 prose-blockquote:italic
                                        prose-hr:border-[#F5EDD6]/10">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                            </ReactMarkdown>
                        </div>
                        {streaming && (
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                                className="inline-block ml-1 w-[2px] h-[1.1em] bg-[#E8602C] align-middle"
                            />
                        )}
                    </div>

                    {message.timestamp && (
                        <span className="font-mono text-[11px] text-[#F5EDD6]/30 px-2">
                            {message.timestamp}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default memo(MessageBubble);