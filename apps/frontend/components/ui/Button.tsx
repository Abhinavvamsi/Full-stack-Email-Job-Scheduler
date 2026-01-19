import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",

                    // Variants
                    variant === 'primary' && "bg-foreground text-background hover:opacity-90",
                    variant === 'secondary' && "bg-background text-foreground border border-border hover:bg-muted/5",
                    variant === 'ghost' && "hover:bg-muted/10 hover:text-foreground text-muted-foreground",
                    variant === 'danger' && "bg-red-500 text-white hover:bg-red-600",

                    // Sizes
                    size === 'sm' && "h-8 px-3 text-xs",
                    size === 'md' && "h-9 px-4 py-2",
                    size === 'lg' && "h-10 px-8",
                    size === 'icon' && "h-9 w-9", // Square for icons

                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
