import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { getAllJobs } from "@/lib/content/loader"
import { revalidatePath } from "next/cache"
import { broadcastUpdate } from "@/app/api/events/route"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const JOBS_DIR = path.join(process.cwd(), "content/jobs")

function ensureJobsDir() {
  if (!fs.existsSync(JOBS_DIR)) fs.mkdirSync(JOBS_DIR, { recursive: true })
}

function updateContentIndex() {
  try {
    const { saveContentIndex, clearContentCache } = require("@/lib/content/loader")
    clearContentCache()
    saveContentIndex()
  } catch (error) {
    console.error("Index update error:", error)
  }
}

export async function GET() {
  try {
    const jobs = await getAllJobs()
    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Jobs fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      title,
      slug,
      companyName,
      companyWebsite,
      location,
      workMode,
      experienceMin,
      experienceMax,
      salaryMin,
      salaryMax,
      practiceAreas,
      description,
      applyUrl,
      applyEmail,
      deadlineAt,
      postedAt,
      isFeatured,
      status,
    } = data

    if (!title || !slug || !companyName || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    ensureJobsDir()
    const filePath = path.join(JOBS_DIR, `${slug}.mdx`)

    const frontmatter = {
      title,
      slug,
      companyName,
      companyWebsite: companyWebsite || undefined,
      location,
      workMode: workMode || "hybrid",
      experienceMin: typeof experienceMin === "number" ? experienceMin : undefined,
      experienceMax: typeof experienceMax === "number" ? experienceMax : undefined,
      salaryMin: typeof salaryMin === "number" ? salaryMin : undefined,
      salaryMax: typeof salaryMax === "number" ? salaryMax : undefined,
      practiceAreas: Array.isArray(practiceAreas) ? practiceAreas : [],
      applyUrl: applyUrl || undefined,
      applyEmail: applyEmail || undefined,
      deadlineAt: deadlineAt || undefined,
      postedAt: postedAt || new Date().toISOString(),
      isFeatured: !!isFeatured,
      status: status || "published",
    }

    const body = description || ""
    const fileContent = matter.stringify(body, frontmatter)
    fs.writeFileSync(filePath, fileContent, "utf-8")

    updateContentIndex()
    try {
      revalidatePath("/jobs")
      revalidatePath(`/jobs/${slug}`)
      revalidatePath("/api/admin/content")
    } catch (e) {
      console.log("Revalidate error (non-critical):", e)
    }

    try {
      broadcastUpdate("content:updated", { type: "job", slug, status: frontmatter.status })
    } catch {}

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error("Job creation error:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { slug } = data
    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 })

    ensureJobsDir()
    const filePath = path.join(JOBS_DIR, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    // Load existing file to preserve unspecified fields
    const existing = matter.read(filePath)
    const existingFM = existing.data || {}

    const updatedFM = {
      ...existingFM,
      title: data.title ?? existingFM.title,
      slug: slug,
      companyName: data.companyName ?? existingFM.companyName,
      companyWebsite: data.companyWebsite ?? existingFM.companyWebsite,
      location: data.location ?? existingFM.location,
      workMode: data.workMode ?? existingFM.workMode ?? "hybrid",
      experienceMin: typeof data.experienceMin === "number" ? data.experienceMin : existingFM.experienceMin,
      experienceMax: typeof data.experienceMax === "number" ? data.experienceMax : existingFM.experienceMax,
      salaryMin: typeof data.salaryMin === "number" ? data.salaryMin : existingFM.salaryMin,
      salaryMax: typeof data.salaryMax === "number" ? data.salaryMax : existingFM.salaryMax,
      practiceAreas: Array.isArray(data.practiceAreas) ? data.practiceAreas : existingFM.practiceAreas || [],
      applyUrl: data.applyUrl ?? existingFM.applyUrl,
      applyEmail: data.applyEmail ?? existingFM.applyEmail,
      deadlineAt: data.deadlineAt ?? existingFM.deadlineAt,
      postedAt: existingFM.postedAt || new Date().toISOString(),
      isFeatured: typeof data.isFeatured === "boolean" ? data.isFeatured : !!existingFM.isFeatured,
      status: data.status ?? existingFM.status ?? "published",
    }

    const body = data.description ?? existing.content
    const fileContent = matter.stringify(body, updatedFM)
    fs.writeFileSync(filePath, fileContent, "utf-8")

    updateContentIndex()
    try {
      revalidatePath("/jobs")
      revalidatePath(`/jobs/${slug}`)
      revalidatePath("/api/admin/content")
    } catch {}

    try {
      broadcastUpdate("content:updated", { type: "job", slug, status: updatedFM.status, action: "updated" })
    } catch {}

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error("Job update error:", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}
