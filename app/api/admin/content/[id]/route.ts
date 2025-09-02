import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { revalidatePath } from "next/cache"
import { broadcastUpdate } from "@/app/api/events/route"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const CONTENT_DIRS = [
  { type: "post", dir: "content/posts" },
  { type: "note", dir: "content/notes" },
  { type: "act", dir: "content/acts" },
  { type: "job", dir: "content/jobs" },
] as const

type ContentType = (typeof CONTENT_DIRS)[number]["type"]

function findFileBySlug(slug: string): null | { filePath: string; type: ContentType } {
  for (const { type, dir } of CONTENT_DIRS) {
    const absDir = path.join(process.cwd(), dir)
    if (!fs.existsSync(absDir)) continue
    const candidate = path.join(absDir, `${slug}.mdx`)
    if (fs.existsSync(candidate)) return { filePath: candidate, type }
  }
  return null
}

function updateIndexAndRevalidate(type: ContentType, slug: string) {
  try {
    const { saveContentIndex, clearContentCache } = require("@/lib/content/loader")
    clearContentCache()
    saveContentIndex()
  } catch (e) {
    console.log("Index update error (non-critical):", e)
  }
  try {
    revalidatePath("/")
    revalidatePath("/api/admin/content")
    if (type === "post") revalidatePath(`/blog/${slug}`)
    if (type === "note") revalidatePath(`/notes`)
    if (type === "act") revalidatePath(`/acts/${slug}`)
    if (type === "job") revalidatePath(`/jobs/${slug}`)
  } catch (e) {
    console.log("Revalidate error (non-critical):", e)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json()
    const { id } = params
    
    // Extract slug from ID (remove type prefix if present)
    const slug = id.replace(/^(post|note|act|job)-/, '')

    const found = findFileBySlug(slug)
    if (!found) return NextResponse.json({ error: "Content not found" }, { status: 404 })

    const { filePath, type } = found

    if (action === "delete") {
      fs.unlinkSync(filePath)
      updateIndexAndRevalidate(type, slug)
      try { broadcastUpdate("content:updated", { type, slug, action: "deleted" }) } catch {}
      return NextResponse.json({ success: true, action, id })
    }

    // Load and modify frontmatter
    const file = matter.read(filePath)
    const fm = file.data || {}

    switch (action) {
      case "publish":
        if (type === "post" || type === "act" || type === "job") fm.status = "published"
        break
      case "unpublish":
        if (type === "post" || type === "act" || type === "job") fm.status = "draft"
        break
      case "feature":
        if (type === "post" || type === "act" || type === "job") fm.isFeatured = true
        break
      case "unfeature":
        if (type === "post" || type === "act" || type === "job") fm.isFeatured = false
        break
      case "edit":
      case "view":
        // No-op for now
        return NextResponse.json({ success: true, action, id })
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const updated = matter.stringify(file.content, fm)
    fs.writeFileSync(filePath, updated, "utf-8")

    updateIndexAndRevalidate(type, slug)
    try { broadcastUpdate("content:updated", { type, slug, action }) } catch {}

    return NextResponse.json({ success: true, action, id })
  } catch (error) {
    console.error("Content action error:", error)
    return NextResponse.json({ error: "Action failed" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const found = findFileBySlug(id)
    if (!found) return NextResponse.json({ error: "Content not found" }, { status: 404 })
    fs.unlinkSync(found.filePath)
    updateIndexAndRevalidate(found.type, id)
    try { broadcastUpdate("content:updated", { type: found.type, slug: id, action: "deleted" }) } catch {}
    return NextResponse.json({ success: true, deleted: id })
  } catch (error) {
    console.error("Content deletion error:", error)
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 })
  }
}
