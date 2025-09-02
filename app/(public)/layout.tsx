import type React from "react"
import { Header } from "./_components/Header"
import { Footer } from "./_components/Footer"
import { LiveUpdateNotification } from "./_components/LiveUpdateNotification"
import { LiveStatusIndicator } from "./_components/LiveStatusIndicator"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <LiveUpdateNotification />
      <div className="fixed bottom-4 right-4 z-40">
        <LiveStatusIndicator />
      </div>
    </div>
  )
}
