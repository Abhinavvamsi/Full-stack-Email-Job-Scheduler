'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    PlusCircle,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    X
} from 'lucide-react';
import { motion } from 'framer-motion';

const sidebarItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
    { name: 'Schedule Email', icon: PlusCircle, href: '/schedule' },
    { name: 'Settings', icon: Settings, href: '/settings' },
];

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (val: boolean) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (val: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Sidebar Container */}
            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed ? 64 : 240,
                    x: isMobileOpen ? 0 : -240, // We'll handle mobile visibility via classes mostly effectively
                }}
                // Override for desktop
                style={{ x: 0 }}
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen bg-[#F7F7F5] border-r border-[#ECECEC] flex flex-col transition-all duration-300 ease-in-out font-sans",
                    // Mobile: hidden by default (via translate), shown if Open
                    // Desktop: always shown, width varies. 
                    // We need to override the motion style 'x' on desktop? Motion handles it. 
                    // Actually, motion 'x' prop will conflict with class 'translate'. 
                    // Let's rely on motion for width, and classes for mobile visibility wrapper?
                    // To be safe: Use motion for everything.
                    // On desktop (md): x should be 0.
                    "hidden md:flex", // Only use flex on desktop here? No, we want mobile generic.
                    // Let's use a simpler approach: 
                    // Mobile: fixed inset-y-0 left-0 z-40 transform transition-transform duration-300
                )}
                // Let's re-do the motion logic to be cleaner for responsive
                variants={{
                    mobileClosed: { x: "-100%", width: 240 },
                    mobileOpen: { x: 0, width: 240 },
                    desktopCollapsed: { x: 0, width: 64 },
                    desktopOpen: { x: 0, width: 240 }
                }}
            // We need to know if we are on mobile to select variant? 
            // CSS md: is easier.
            >
                {/* We will rely on the previous implementation but fixing the props. */}
            </motion.aside>

            {/* 
         Actually, let's write the CLEANEST implementation. 
         Responsive sidebar is tricky with just one motion element.
         We'll use a standard implementation:
      */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 bg-[#F7F7F5] border-r border-[#ECECEC] flex flex-col transition-all duration-300 ease-in-out",
                    // Mobile:
                    isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64",
                    // Desktop:
                    "md:translate-x-0",
                    isCollapsed ? "md:w-16" : "md:w-64"
                )}
            >
                {/* Header / Collapse Toggle */}
                <div className={cn("flex items-center h-14 border-b border-[#ECECEC] px-4", isCollapsed ? "justify-center" : "justify-between")}>
                    {(!isCollapsed || isMobileOpen) && (
                        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                            <div className="w-5 h-5 rounded bg-black flex items-center justify-center text-white text-xs font-bold">
                                S
                            </div>
                            <span className="font-medium text-[#37352f] text-sm">Scheduler </span>
                        </div>
                    )}

                    {/* Desktop Collapse */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex p-1 hover:bg-[#EAEaea] rounded-sm transition-colors text-gray-500"
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>

                    {/* Mobile Close */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden p-1 hover:bg-[#EAEaea] rounded-sm text-gray-500"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-sm transition-colors text-sm group",
                                    isActive
                                        ? "bg-[#EAEaea] text-[#37352f] font-medium"
                                        : "text-gray-500 hover:bg-[#EAEaea] hover:text-[#37352f]"
                                )}
                                title={isCollapsed ? item.name : undefined}
                                onClick={() => setIsMobileOpen(false)} // Close on navigate (mobile)
                            >
                                <item.icon className={cn("min-w-[18px] min-h-[18px]", isActive ? "text-[#37352f]" : "text-gray-400 group-hover:text-gray-600")} size={18} />
                                {(!isCollapsed || isMobileOpen) && (
                                    <span className="whitespace-nowrap overflow-hidden">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User / Footer */}
                <div className="p-2 border-t border-[#ECECEC]">
                    <button className={cn(
                        "flex items-center gap-3 px-3 py-2 w-full rounded-sm transition-colors text-sm text-gray-500 hover:bg-[#EAEaea] hover:text-[#37352f]",
                        isCollapsed && "justify-center"
                    )}>
                        <LogOut size={18} />
                        {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
}
