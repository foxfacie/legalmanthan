"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GradientBorderProps {
  children: React.ReactNode
  className?: string
  borderWidth?: number
  animated?: boolean
}

export function GradientBorder({ 
  children, 
  className, 
  borderWidth = 2,
  animated = true 
}: GradientBorderProps) {
  return (
    <div className={cn("relative group", className)}>
      <div 
        className="absolute inset-0 rounded-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(45deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))`,
          padding: `${borderWidth}px`,
        }}
      >
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              background: `conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        )}
      </div>
      <div className="relative bg-background rounded-lg">
        {children}
      </div>
    </div>
  )
}