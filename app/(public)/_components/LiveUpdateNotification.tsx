"use client"

import { useState, useEffect } from "react"
import { useLiveUpdates } from "@/hooks/use-live-updates"
import { Button } from "@/components/ui/button"
import { RefreshCw, X } from "lucide-react"

export function LiveUpdateNotification() {
  const { lastUpdate, isConnected } = useLiveUpdates()
  const [showNotification, setShowNotification] = useState(false)
  const [pendingUpdate, setPendingUpdate] = useState<any>(null)

  useEffect(() => {
    if (lastUpdate && lastUpdate.type !== "connected") {
      setPendingUpdate(lastUpdate)
      setShowNotification(true)
    }
  }, [lastUpdate])

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleDismiss = () => {
    setShowNotification(false)
    setPendingUpdate(null)
  }

  if (!showNotification || !pendingUpdate) return null

  const getNotificationText = () => {
    switch (pendingUpdate.type) {
      case "content:updated":
        return `"${pendingUpdate.data.title}" has been updated`
      case "content:published":
        return `New article published: "${pendingUpdate.data.title}"`
      case "content:unpublished":
        return `"${pendingUpdate.data.title}" has been unpublished`
      default:
        return "Content has been updated"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm font-medium text-gray-900">Live Update</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{getNotificationText()}</p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleRefresh} className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={handleDismiss}>
              Dismiss
            </Button>
          </div>
        </div>
        <Button size="sm" variant="ghost" onClick={handleDismiss} className="p-1 h-auto">
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
