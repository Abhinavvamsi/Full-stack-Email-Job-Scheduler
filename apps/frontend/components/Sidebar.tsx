'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
import { createClient } from '@/utils/supabase/client';
import { ModeToggle } from './ModeToggle';

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
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push('/login');
    };

    return (
        <>
            {/* Sidebar Container */}
            <motion.aside
                initial={false}
                animate={{
                    width: isCollapsed ? 64 : 240,
                    x: isMobileOpen ? 0 : -240,
                }}
                // Override for desktop
                style={{ x: 0 }}
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen bg-sidebar border-r border-border flex flex-col transition-all duration-300 ease-in-out font-sans",
                    // Mobile: hidden by default (via translate), shown if Open
                    // Desktop: always shown, width varies. 
                    "hidden md:flex",
                )}
                variants={{
                    mobileClosed: { x: "-100%", width: 240 },
                    mobileOpen: { x: 0, width: 240 },
                    desktopCollapsed: { x: 0, width: 64 },
                    desktopOpen: { x: 0, width: 240 }
                }}
            >
                {/* We will rely on the previous implementation but fixing the props. */}
            </motion.aside>

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 bg-sidebar border-r border-border flex flex-col transition-all duration-300 ease-in-out",
                    // Mobile:
                    isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64",
                    // Desktop:
                    "md:translate-x-0",
                    isCollapsed ? "md:w-16" : "md:w-64"
                )}
            >
                {/* Header / Collapse Toggle */}
                <div className={cn("flex items-center h-14 border-b border-border px-4", isCollapsed ? "justify-center" : "justify-between")}>
                    {(!isCollapsed || isMobileOpen) && (
                        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                            <div className="w-5 h-5 rounded bg-foreground flex items-center justify-center text-background text-xs font-bold">
                                S
                            </div>
                            <span className="font-medium text-foreground text-sm">Scheduler </span>
                        </div>
                    )}

                    {/* Desktop Collapse */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex p-1 hover:bg-muted/10 rounded-sm transition-colors text-muted-foreground"
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>

                    {/* Mobile Close */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden p-1 hover:bg-muted/10 rounded-sm text-muted-foreground"
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
                                        ? "bg-muted/10 text-foreground font-medium"
                                        : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
                                )}
                                title={isCollapsed ? item.name : undefined}
                                onClick={() => setIsMobileOpen(false)} // Close on navigate (mobile)
                            >
                                <item.icon className={cn("min-w-[18px] min-h-[18px]", isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")} size={18} />
                                {(!isCollapsed || isMobileOpen) && (
                                    <span className="whitespace-nowrap overflow-hidden">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-2 border-t border-border space-y-1">
                    {(!isCollapsed || isMobileOpen) && (
                        <div className="px-3 py-2">
                            <ModeToggle />
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 w-full rounded-sm transition-colors text-sm text-muted-foreground hover:bg-muted/10 hover:text-foreground",
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
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
}
