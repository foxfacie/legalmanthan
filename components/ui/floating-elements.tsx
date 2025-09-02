"use client"

import { motion } from "framer-motion"

export function FloatingElements() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-3/4 right-1/4 w-24 h-24 bg-accent/10 rounded-full blur-xl"
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute top-1/2 right-1/3 w-16 h-16 bg-muted/20 rounded-full blur-lg"
        animate={{
          y: [-15, 15, -15],
          x: [-5, 5, -5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent opacity-50" />
    </div>
  )
}