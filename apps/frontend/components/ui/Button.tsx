import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }>(
    ({ className, variant = 'primary', ...props }, ref) => {
        const variants = {
            primary: "bg-[#2383E2] text-white hover:bg-[#1a6bbd] shadow-sm border border-transparent",
            secondary: "bg-white text-[#37352f] border border-[#ECECEC] hover:bg-[#F7F7F5] shadow-sm",
            ghost: "bg-transparent text-[#37352f] hover:bg-[#EAEaea]"
        }

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50 h-8 px-3 py-2",
                    variants[variant],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
