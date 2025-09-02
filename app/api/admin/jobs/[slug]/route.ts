import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { revalidatePath } from "next/cache"
import { broadcastUpdate } from "@/app/api/events/route"
import { getJobBySlug } from "@/lib/content/loader"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const JOBS_DIR = path.join(process.cwd(), "content/jobs")

function updateContentIndex() {
  try {
    const { saveContentIndex, clearContentCache } = require("@/lib/content/loader")
    clearContentCache()
    saveContentIndex()
  } catch (error) {
    console.error("Index update error:", error)
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const job = getJobBySlug(params.slug)
    if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(job)
  } catch (error) {
    console.error("Job fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const filePath = path.join(JOBS_DIR, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    fs.unlinkSync(filePath)
    updateContentIndex()

    try {
      revalidatePath("/jobs")
      revalidatePath(`/jobs/${slug}`)
      revalidatePath("/api/admin/content")
    } catch {}

    try {
      broadcastUpdate("content:updated", { type: "job", slug, action: "deleted" })
    } catch {}

    return NextResponse.json({ success: true, deleted: slug })
  } catch (error) {
    console.error("Job deletion error:", error)
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 })
  }
}

