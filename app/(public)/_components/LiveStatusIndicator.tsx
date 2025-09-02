"use client"

import { useLiveUpdates } from "@/hooks/use-live-updates"

export function LiveStatusIndicator() {
  const { isConnected, updates } = useLiveUpdates()

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">
      <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
      <span>{isConnected ? "Live" : "Offline"}</span>
      {updates.length > 0 && (
        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{updates.length} updates</span>
      )}
    </div>
  )
}
