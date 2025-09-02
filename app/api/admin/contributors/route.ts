import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { broadcastUpdate } from "@/app/api/events/route"
import { revalidatePath } from "next/cache"

export async function GET() {
  try {
    const authorsPath = path.join(process.cwd(), "content/meta/authors.json")

    if (!fs.existsSync(authorsPath)) {
      // Create empty authors file if it doesn't exist
      fs.writeFileSync(authorsPath, JSON.stringify([], null, 2))
      return NextResponse.json([])
    }

    const authorsData = fs.readFileSync(authorsPath, "utf-8")
    const authors = JSON.parse(authorsData)

    return NextResponse.json(authors)
  } catch (error) {
    console.error("Contributors fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch contributors" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const contributorData = await request.json()
    const authorsPath = path.join(process.cwd(), "content/meta/authors.json")

    // Read existing authors
    let authors = []
    if (fs.existsSync(authorsPath)) {
      const authorsData = fs.readFileSync(authorsPath, "utf-8")
      authors = JSON.parse(authorsData)
    }

    // Add new contributor
    authors.push(contributorData)

    // Write back to file
    fs.writeFileSync(authorsPath, JSON.stringify(authors, null, 2))

    // Emit real-time update event
    broadcastUpdate("content:updated", {
      type: "contributor",
      action: "created",
      data: contributorData,
      timestamp: new Date().toISOString()
    })

    // Revalidate relevant paths
    try {
      revalidatePath("/admin")
      revalidatePath("/")
    } catch (error) {
      console.log("Revalidation error:", error)
    }

    return NextResponse.json({
      success: true,
      message: "Contributor added successfully!"
    })
  } catch (error) {
    console.error("Contributor creation error:", error)
    return NextResponse.json({ error: "Failed to add contributor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const contributorData = await request.json()
    const authorsPath = path.join(process.cwd(), "content/meta/authors.json")

    // Read existing authors
    const authorsData = fs.readFileSync(authorsPath, "utf-8")
    let authors = JSON.parse(authorsData)

    // Update contributor
    const index = authors.findIndex((author: any) => author.id === contributorData.id)
    if (index !== -1) {
      authors[index] = contributorData
    }

    // Write back to file
    fs.writeFileSync(authorsPath, JSON.stringify(authors, null, 2))

    // Emit real-time update event
    broadcastUpdate("content:updated", {
      type: "contributor",
      action: "updated",
      data: contributorData,
      timestamp: new Date().toISOString()
    })

    // Revalidate relevant paths
    try {
      revalidatePath("/admin")
      revalidatePath("/")
    } catch (error) {
      console.log("Revalidation error:", error)
    }

    return NextResponse.json({
      success: true,
      message: "Contributor updated successfully!"
    })
  } catch (error) {
    console.error("Contributor update error:", error)
    return NextResponse.json({ error: "Failed to update contributor" }, { status: 500 })
  }
}