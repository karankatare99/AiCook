import React from "react";

export function SavedSkeleton() {
    // We show 6 skeleton cards
    const skeletons = Array(6).fill(0);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 animate-in fade-in duration-200">
            {/* Header Skeleton */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <div className="w-48 h-[40px] bg-gradient-to-r from-[#F5EDD6]/[0.04] via-[#F5EDD6]/[0.10] to-[#F5EDD6]/[0.04] bg-[length:200%_100%] animate-[shimmer_1.6s_infinite_linear] rounded-md mb-2" />
                    <div className="w-32 h-[16px] bg-gradient-to-r from-[#F5EDD6]/[0.04] via-[#F5EDD6]/[0.10] to-[#F5EDD6]/[0.04] bg-[length:200%_100%] animate-[shimmer_1.6s_infinite_linear] rounded-sm" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skeletons.map((_, i) => (
                    <div key={i} className="w-full relative overflow-hidden bg-[#141419] border border-[#F5EDD6]/5 rounded-2xl flex flex-col pointer-events-none">
                        {/* Image Shimmer Area */}
                        <div className="w-full aspect-[-4/3] h-48 bg-gradient-to-r from-[#F5EDD6]/[0.04] via-[#F5EDD6]/[0.10] to-[#F5EDD6]/[0.04] bg-[length:200%_100%] animate-[shimmer_1.6s_infinite_linear]" />

                        <div className="flex flex-col p-5 gap-3">
                            {/* Box Title Bar */}
                            <div className="w-[70%] h-[20px] bg-gradient-to-r from-[#F5EDD6]/[0.04] via-[#F5EDD6]/[0.10] to-[#F5EDD6]/[0.04] bg-[length:200%_100%] animate-[shimmer_1.6s_infinite_linear] rounded" />
                            {/* Tags Bar */}
                            <div className="w-[45%] h-[16px] bg-gradient-to-r from-[#F5EDD6]/[0.04] via-[#F5EDD6]/[0.10] to-[#F5EDD6]/[0.04] bg-[length:200%_100%] animate-[shimmer_1.6s_infinite_linear] rounded" />
                            {/* Meta Bar */}
                            <div className="w-[55%] mt-2 h-[12px] bg-gradient-to-r from-[#F5EDD6]/[0.04] via-[#F5EDD6]/[0.10] to-[#F5EDD6]/[0.04] bg-[length:200%_100%] animate-[shimmer_1.6s_infinite_linear] rounded" />
                        </div>
                    </div>
                ))}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes shimmer {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }
      `}} />
        </div>
    );
}

export function SavedErrorState({ message, onRetry }: { message: string, onRetry: () => void }) {
    return (
        <div className="w-full mt-32 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
            <h2 className="font-serif italic text-3xl text-[#F5EDD6] mb-3">Could not load your cookbook.</h2>
            <p className="text-[#F5EDD6]/45 text-sm max-w-[280px] mb-8">{message}</p>
            <button
                onClick={onRetry}
                className="px-6 py-2 rounded-full border border-[#F5EDD6]/20 text-[#F5EDD6]/80 font-mono text-xs tracking-widest uppercase hover:bg-[#F5EDD6]/5 hover:text-[#F5EDD6] transition-all"
            >
                Try Again
            </button>
        </div>
    );
}
