'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Hide Sidebar on Login Page
    if (pathname === '/login') {
        return (
            <main className="min-h-screen bg-white">
                {children}
            </main>
        )
    }

    return (
        <div className="flex min-h-screen bg-white">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#ECECEC] z-30 flex items-center px-4">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-md"
                >
                    <Menu size={20} className="text-gray-600" />
                </button>
                <span className="ml-3 font-medium text-gray-700">Email Scheduler</span>
            </div>

            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <main
                className={cn(
                    "flex-1 transition-all duration-300 ease-in-out pt-14 md:pt-0 min-h-screen",
                    // During SSR / Hydration, assume default expanded state logic or mounted check
                    mounted && isCollapsed ? "md:ml-[64px]" : "md:ml-[240px]"
                )}
            >
                <div className="max-w-5xl mx-auto p-8 md:py-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
