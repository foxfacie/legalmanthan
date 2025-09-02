import { NextRequest } from "next/server"

// Store active connections
const connections = new Set<ReadableStreamDefaultController>()

// Broadcast function to send updates to all connected clients
export function broadcastUpdate(type: string, data: any) {
  const message = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`
  
  connections.forEach((controller) => {
    try {
      controller.enqueue(new TextEncoder().encode(message))
    } catch (error) {
      // Remove broken connections
      connections.delete(controller)
    }
  })
}

export async function GET(request: NextRequest) {
  // Set up Server-Sent Events headers
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  })

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Add this connection to our set
      connections.add(controller)

      // Send initial connection message
      const welcomeMessage = `event: connected\ndata: ${JSON.stringify({
        message: "Connected to live updates",
        timestamp: Date.now(),
      })}\n\n`
      
      controller.enqueue(new TextEncoder().encode(welcomeMessage))

      // Send periodic heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          const heartbeatMessage = `event: heartbeat\ndata: ${JSON.stringify({
            timestamp: Date.now(),
          })}\n\n`
          controller.enqueue(new TextEncoder().encode(heartbeatMessage))
        } catch (error) {
          clearInterval(heartbeat)
          connections.delete(controller)
        }
      }, 30000) // Every 30 seconds

      // Clean up when connection closes
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat)
        connections.delete(controller)
        try {
          controller.close()
        } catch (error) {
          // Connection already closed
        }
      })
    },
    cancel() {
      // Connection was cancelled
    },
  })

  return new Response(stream, { headers })
}