import type React from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  children: React.ReactNode
  className?: string
  spacing?: "sm" | "md" | "lg" | "xl"
}

export function Section({ children, className, spacing = "lg" }: SectionProps) {
  return (
    <section
      className={cn(
        {
          "py-8": spacing === "sm",
          "py-12": spacing === "md",
          "py-16": spacing === "lg",
          "py-24": spacing === "xl",
        },
        className,
      )}
    >
      {children}
    </section>
  )
}
