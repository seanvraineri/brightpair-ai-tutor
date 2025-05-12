import * as React from "react"
import { cn } from "@/lib/utils"

interface EdgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bubble'
  hoverEffect?: boolean
}

const Edge = React.forwardRef<HTMLDivElement, EdgeProps>(
  ({ className, variant = 'default', hoverEffect = true, ...props }, ref) => {
    const variantClasses = {
      default: "bg-white shadow-card rounded-xl border border-gray-100",
      glass: "glass-card",
      bubble: "bubble-card",
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          variantClasses[variant],
          hoverEffect && "hover:-translate-y-1 hover:shadow-lg",
          "transition-all duration-300",
          className
        )}
        {...props}
      />
    )
  }
)
Edge.displayName = "Edge"

export { Edge } 