import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // Import cache clearing function
    const { clearContentCache } = require("@/lib/content/loader")
    
    // Clear content cache
    clearContentCache()
    
    // Revalidate all relevant paths
    const paths = [
      "/",
      "/blog",
      "/notes", 
      "/acts",
      "/jobs",
      "/admin",
      "/api/admin/content"
    ]
    
    for (const path of paths) {
      try {
        revalidatePath(path)
      } catch (error) {
        console.log(`Revalidation error for ${path}:`, error)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Cache cleared and content refreshed",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Refresh error:", error)
    return NextResponse.json({ error: "Failed to refresh content" }, { status: 500 })
  }
}