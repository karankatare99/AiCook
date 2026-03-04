"use client";

import { motion } from "framer-motion";

const dotVariants = {
    initial: { y: 0 },
    animate: { y: -6 },
};

export default function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="flex justify-start mb-6"
        >
            <div className="flex gap-3 max-w-[85%]">
                {/* Assistant Avatar placeholder to align with messages */}
                <div className="w-[28px] h-[28px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFA78A,#E8602C)] shadow-[0_0_10px_rgba(232,96,44,0.5)] shrink-0 self-end mb-1" />

                <div className="bg-[#F5EDD6]/5 border border-[#F5EDD6]/10 backdrop-blur-[16px] rounded-[18px_18px_18px_4px] py-[16px] px-[20px] flex items-center justify-center h-[56px]">
                    <div className="flex gap-[4px] items-center" aria-label="VoiceBite is thinking" role="status">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                variants={dotVariants}
                                initial="initial"
                                animate="animate"
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatType: "mirror",
                                    ease: "easeInOut",
                                    delay: i * 0.15,
                                }}
                                className="w-[6px] h-[6px] rounded-full bg-[#E8602C]"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
