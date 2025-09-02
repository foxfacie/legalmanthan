import type React from "react"
import { cn } from "@/lib/utils"

interface ChipProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "accent"
  size?: "sm" | "md"
  className?: string
}

export function Chip({ children, variant = "default", size = "sm", className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors",
        {
          "bg-primary/10 text-primary hover:bg-primary/20": variant === "default",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "bg-accent text-accent-foreground hover:bg-accent/80": variant === "accent",
        },
        {
          "px-2 py-1 text-xs": size === "sm",
          "px-3 py-1.5 text-sm": size === "md",
        },
        className,
      )}
    >
      {children}
    </span>
  )
}
