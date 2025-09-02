"use client"

import { useEffect, useState, useCallback } from "react"

interface LiveUpdate {
  type: "content:updated" | "content:published" | "content:unpublished" | "connected"
  data: any
  timestamp: number
}

export function useLiveUpdates() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<LiveUpdate | null>(null)
  const [updates, setUpdates] = useState<LiveUpdate[]>([])

  const connect = useCallback(() => {
    const eventSource = new EventSource("/api/events")

    eventSource.onopen = () => {
      setIsConnected(true)
    }

    eventSource.onerror = () => {
      setIsConnected(false)
    }

    eventSource.addEventListener("connected", (event) => {
      const data = JSON.parse(event.data)
      const update: LiveUpdate = {
        type: "connected",
        data,
        timestamp: Date.now(),
      }
      setLastUpdate(update)
    })

    eventSource.addEventListener("content:updated", (event) => {
      const data = JSON.parse(event.data)
      const update: LiveUpdate = {
        type: "content:updated",
        data,
        timestamp: Date.now(),
      }
      setLastUpdate(update)
      setUpdates((prev) => [update, ...prev.slice(0, 9)]) // Keep last 10 updates
    })

    eventSource.addEventListener("content:published", (event) => {
      const data = JSON.parse(event.data)
      const update: LiveUpdate = {
        type: "content:published",
        data,
        timestamp: Date.now(),
      }
      setLastUpdate(update)
      setUpdates((prev) => [update, ...prev.slice(0, 9)])
    })

    eventSource.addEventListener("content:unpublished", (event) => {
      const data = JSON.parse(event.data)
      const update: LiveUpdate = {
        type: "content:unpublished",
        data,
        timestamp: Date.now(),
      }
      setLastUpdate(update)
      setUpdates((prev) => [update, ...prev.slice(0, 9)])
    })

    return eventSource
  }, [])

  useEffect(() => {
    const eventSource = connect()

    return () => {
      eventSource.close()
      setIsConnected(false)
    }
  }, [connect])

  return {
    isConnected,
    lastUpdate,
    updates,
    reconnect: connect,
  }
}
