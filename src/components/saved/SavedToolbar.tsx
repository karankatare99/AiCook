import React from "react";
import { motion } from "framer-motion";
import { Search, LayoutGrid, List } from "lucide-react";

interface SavedToolbarProps {
    search: string;
    onSearchChange: (val: string) => void;
    filters: string[];
    activeFilter: string;
    onFilterChange: (val: string) => void;
    viewMode: "grid" | "list";
    onViewModeChange: (val: "grid" | "list") => void;
}

export function SavedToolbar({
    search,
    onSearchChange,
    filters,
    activeFilter,
    onFilterChange,
    viewMode,
    onViewModeChange,
}: SavedToolbarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-8 bg-[#0A0A0F]/80 backdrop-blur-md border border-[#F5EDD6]/5 p-2 rounded-2xl sticky top-4 z-40"
        >
            <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide shrink-0">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => onFilterChange(filter)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap text-xs font-mono transition-colors ${activeFilter === filter
                                ? "bg-[#F5EDD6] text-[#0A0A0F]"
                                : "bg-[#141419] border border-[#F5EDD6]/10 text-[#F5EDD6]/60 hover:text-[#F5EDD6]"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="flex w-full lg:w-auto items-center gap-3">
                <div className="relative flex-1 lg:w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F5EDD6]/40" />
                    <input
                        type="text"
                        placeholder="Search cookbook..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-[#141419] border border-[#F5EDD6]/10 text-[#F5EDD6] text-sm rounded-full pl-9 pr-4 py-2 focus:outline-none focus:border-[#E8602C]/50 transition-colors font-sans placeholder:text-[#F5EDD6]/30"
                    />
                </div>

                <div className="flex bg-[#141419] border border-[#F5EDD6]/10 p-1 rounded-full shrink-0">
                    <button
                        onClick={() => onViewModeChange("grid")}
                        className={`p-1.5 rounded-full transition-colors ${viewMode === "grid" ? "bg-[#272730] text-[#E8602C]" : "text-[#F5EDD6]/40 hover:text-[#F5EDD6]/80"
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange("list")}
                        className={`p-1.5 rounded-full transition-colors ${viewMode === "list" ? "bg-[#272730] text-[#E8602C]" : "text-[#F5EDD6]/40 hover:text-[#F5EDD6]/80"
                            }`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
