"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Bookmark } from "lucide-react";
import clsx from "clsx";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Chat", href: "/chat", icon: MessageSquare },
        { name: "Cookbook", href: "/app/saved", icon: Bookmark },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex fixed left-0 top-0 h-screen w-20 flex-col items-center py-8 bg-[#0A0A0F]/50 backdrop-blur-xl border-r border-[#F5EDD6]/10 z-50">
                <Link href="/" className="w-10 h-10 rounded-xl bg-[#E8602C]/20 border border-[#E8602C]/50 flex items-center justify-center mb-12 shadow-[0_0_15px_rgba(232,96,44,0.3)] focus:outline-none" data-cursor="link">
                    <div className="w-5 h-5 bg-[#F5EDD6] rounded-sm rotate-45" />
                </Link>

                <div className="flex flex-col gap-6 w-full px-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative group flex flex-col items-center w-full focus:outline-none"
                                data-cursor="link"
                            >
                                {/* Left accent bar */}
                                <div className={clsx(
                                    "absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300",
                                    isActive ? "h-8 bg-[#E8602C]" : "h-0 bg-transparent group-hover:h-4 group-hover:bg-[#E8602C]/50"
                                )} />

                                <div className={clsx(
                                    "p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1",
                                    isActive
                                        ? "text-[#E8602C]" // Ember fill icon 
                                        : "text-[#F5EDD6]/60 hover:text-[#F5EDD6] hover:bg-[#F5EDD6]/5"
                                )}>
                                    <item.icon className="w-6 h-6" fill={isActive ? "currentColor" : "none"} />
                                    <span className={clsx(
                                        "text-[10px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4",
                                        isActive && "text-[#E8602C]"
                                    )}>
                                        {item.name}
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Mobile Bottom Tab Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 bg-[#0A0A0F]/80 backdrop-blur-xl border-t border-[#F5EDD6]/10 z-[100] flex justify-around items-center px-4 pb-4 pt-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center w-16 focus:outline-none"
                        >
                            {/* Top accent bar for mobile */}
                            <div className={clsx(
                                "absolute -top-2 left-1/2 -translate-x-1/2 h-1 rounded-b-full transition-all duration-300",
                                isActive ? "w-8 bg-[#E8602C]" : "w-0 bg-transparent"
                            )} />
                            <div className={clsx(
                                "p-2 rounded-xl transition-all duration-300",
                                isActive ? "text-[#E8602C]" : "text-[#F5EDD6]/60"
                            )}>
                                <item.icon className="w-6 h-6" fill={isActive ? "currentColor" : "none"} />
                            </div>
                            <span className={clsx(
                                "text-[10px] font-mono tracking-wider",
                                isActive ? "text-[#E8602C]" : "text-[#F5EDD6]/60"
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
