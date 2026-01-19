import * as React from "react"
import { cn } from "@/lib/utils"

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(
                    "text-xs font-semibold uppercase text-gray-500 tracking-wide mb-1.5 block",
                    className
                )}
                {...props}
            />
        )
    }
)
Label.displayName = "Label"

export { Label }
