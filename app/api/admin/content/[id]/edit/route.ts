import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const found = findFileBySlug(id)
    
    if (!found) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 })
    }

    const { filePath, type } = found
    const fileContent = fs.readFileSync(filePath, "utf-8")
    const { data: frontmatter, content } = matter(fileContent)

    // Transform the data based on content type
    let editData: any = {
      type,
      title: frontmatter.title || "",
      slug: frontmatter.slug || id,
      content: content || "",
      categories: frontmatter.categories || [],
      tags: frontmatter.tags || [],
      isFeatured: frontmatter.isFeatured || false,
      isEditorPick: frontmatter.isEditorPick || false,
      status: frontmatter.status || "draft",
      coverImage: frontmatter.coverImage || "",
    }

    // Type-specific fields
    if (type === "post" || type === "act") {
      editData.excerpt = frontmatter.excerpt || ""
      editData.author = Array.isArray(frontmatter.authors) ? frontmatter.authors[0] : frontmatter.authors || ""
    } else if (type === "note") {
      editData.excerpt = frontmatter.summary || ""
      editData.author = frontmatter.author || ""
      editData.seriesId = frontmatter.seriesId || ""
      editData.orderInSeries = frontmatter.orderInSeries || 0
      editData.references = frontmatter.references || []
      editData.attachments = frontmatter.attachments || []
    } else if (type === "job") {
      editData.excerpt = frontmatter.summary || ""
      editData.author = frontmatter.companyName || ""
      editData.location = frontmatter.location || ""
      editData.workMode = frontmatter.workMode || "on-site"
      editData.salaryMin = frontmatter.salaryMin || ""
      editData.salaryMax = frontmatter.salaryMax || ""
      editData.practiceAreas = frontmatter.practiceAreas || []
      editData.companyWebsite = frontmatter.companyWebsite || ""
      editData.applyUrl = frontmatter.applyUrl || ""
      editData.applyEmail = frontmatter.applyEmail || ""
      editData.deadlineAt = frontmatter.deadlineAt || ""
    }

    return NextResponse.json({
      success: true,
      data: editData
    })
  } catch (error) {
    console.error("Content load error:", error)
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 })
  }
}