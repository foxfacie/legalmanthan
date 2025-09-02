import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { revalidatePath } from "next/cache"
import { broadcastUpdate } from "@/app/api/events/route"
import { PostFrontmatterSchema, NoteFrontmatterSchema, JobFrontmatterSchema, ActFrontmatterSchema } from "@/lib/content/schemas"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      type,
      title,
      slug,
      excerpt,
      content,
      coverImage,
      categories,
      tags,
      author,
      isFeatured,
      isEditorPick,
      status,
      isEdit,
      originalSlug,
    } = data

    // Basic required field validation
    if (!type || !title || !slug) {
      return NextResponse.json({ error: "Missing required fields: type, title, slug" }, { status: 400 })
    }

    // Content type specific validation
    if (type === "post" || type === "act") {
      if (!excerpt || excerpt.trim() === "") {
        return NextResponse.json({ error: "Excerpt is required for posts and acts" }, { status: 400 })
      }
      if (excerpt.length > 200) {
        return NextResponse.json({ error: "Excerpt must be under 200 characters" }, { status: 400 })
      }
    }
    
    if (type === "note") {
      if (!excerpt || excerpt.trim() === "") {
        return NextResponse.json({ error: "Summary is required for notes" }, { status: 400 })
      }
    }
    
    if (type === "job") {
      if (!data.location || data.location.trim() === "") {
        return NextResponse.json({ error: "Location is required for job postings" }, { status: 400 })
      }
    }

    // Determine content directory based on type
    let contentDir = "content/posts"
    if (type === "note") contentDir = "content/notes"
    if (type === "job") contentDir = "content/jobs"
    if (type === "act") contentDir = "content/acts"

    const filePath = path.join(process.cwd(), contentDir, `${slug}.mdx`)
    
    // Handle editing - if slug changed, delete old file
    if (isEdit && originalSlug && originalSlug !== slug) {
      const oldFilePath = path.join(process.cwd(), contentDir, `${originalSlug}.mdx`)
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath)
      }
    }

    // Ensure directory exists
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Create frontmatter based on content type
    let frontmatter: any

    if (type === "job") {
      // Build a Job document matching JobFrontmatterSchema
      const salaryRange = (data.salary || "").toString()
      const salaryNumbers = salaryRange
        .replace(/[^0-9\.-]/g, " ")
        .trim()
        .split(/\s|-/)
        .filter(Boolean)
      const salaryMinParsed = salaryNumbers[0]
        ? Math.round(Number(salaryNumbers[0]) * (salaryRange.toLowerCase().includes("l") ? 100000 : 1))
        : undefined
      const salaryMaxParsed = salaryNumbers[1]
        ? Math.round(Number(salaryNumbers[1]) * (salaryRange.toLowerCase().includes("l") ? 100000 : 1))
        : undefined

      // Determine work mode based on data
      let workMode = "on-site" // default
      if (data.remote === true || data.location?.toLowerCase().includes("remote")) {
        workMode = "remote"
      } else if (data.location?.toLowerCase().includes("hybrid")) {
        workMode = "hybrid"
      }

      // Build frontmatter object without undefined values
      frontmatter = {
        title,
        slug,
        companyName: author || "Company",
        location: data.location.trim(),
        workMode: workMode as "on-site" | "hybrid" | "remote",
        practiceAreas: Array.isArray(categories) ? categories : [],
        postedAt: new Date(),
        isFeatured: !!isFeatured,
        status: (status === "published" ? "published" : "draft") as "draft" | "published" | "expired",
      }
      
      // Add optional fields only if they have values
      if (data.companyWebsite) frontmatter.companyWebsite = data.companyWebsite
      if (salaryMinParsed !== undefined) frontmatter.salaryMin = salaryMinParsed
      if (salaryMaxParsed !== undefined) frontmatter.salaryMax = salaryMaxParsed
      if (data.applyUrl) frontmatter.applyUrl = data.applyUrl
      if (data.applyEmail) frontmatter.applyEmail = data.applyEmail
      if (data.deadlineAt) frontmatter.deadlineAt = new Date(data.deadlineAt)
      // For jobs, the MDX body is treated as the job description
    } else if (type === "note") {
      // Notes use "summary" instead of "excerpt"
      // Build frontmatter object without undefined values
      frontmatter = {
        title,
        slug,
        summary: excerpt,
        publishedAt: new Date(),
        updatedAt: new Date(),
        tags: Array.isArray(tags) ? tags : [],
        categories: Array.isArray(categories) ? categories : [],
        references: Array.isArray(data.references) ? data.references : [],
        attachments: Array.isArray(data.attachments) ? data.attachments : [],
      }
      
      // Add optional fields only if they have values
      if (data.seriesId) frontmatter.seriesId = data.seriesId
      if (data.orderInSeries !== undefined) frontmatter.orderInSeries = data.orderInSeries
    } else {
      // Post/Act fields
      const validStatus = ["draft", "review", "scheduled", "published", "archived"].includes(status) ? status : "draft"
      frontmatter = {
        title,
        slug,
        excerpt,
        status: validStatus as "draft" | "review" | "scheduled" | "published" | "archived",
        publishedAt: isEdit ? undefined : new Date(), // Keep original publishedAt for edits
        updatedAt: new Date(),
        categories: Array.isArray(categories) ? categories : [],
        tags: Array.isArray(tags) ? tags : [],
        authors: [author || "editorial-team"],
        isFeatured: !!isFeatured,
        isEditorPick: !!isEditorPick,
      }
      
      // For edits, preserve original publishedAt if it exists
      if (isEdit && originalSlug) {
        try {
          const originalPath = path.join(process.cwd(), contentDir, `${originalSlug}.mdx`)
          if (fs.existsSync(originalPath)) {
            const originalContent = fs.readFileSync(originalPath, "utf-8")
            const { data: originalFrontmatter } = matter(originalContent)
            if (originalFrontmatter.publishedAt) {
              frontmatter.publishedAt = originalFrontmatter.publishedAt
            }
          }
        } catch (e) {
          // If we can't read original, use current date
          frontmatter.publishedAt = new Date()
        }
      } else {
        frontmatter.publishedAt = new Date()
      }
      
      // Add optional fields only if they have values
      if (coverImage) frontmatter.coverImage = coverImage
    }

    // Validate frontmatter against appropriate schema before saving
    try {
      if (type === "job") {
        JobFrontmatterSchema.parse(frontmatter)
      } else if (type === "note") {
        NoteFrontmatterSchema.parse(frontmatter)
      } else if (type === "act") {
        ActFrontmatterSchema.parse(frontmatter)
      } else {
        PostFrontmatterSchema.parse(frontmatter)
      }
    } catch (validationError) {
      console.error("Frontmatter validation error:", validationError)
      return NextResponse.json({ 
        error: "Content validation failed", 
        details: validationError instanceof Error ? validationError.message : "Invalid content format"
      }, { status: 400 })
    }

    // Create MDX content
    const fileContent = matter.stringify(content, frontmatter)

    // Write file directly with error handling
    try {
      console.log("Writing file to:", filePath)
      console.log("File content length:", fileContent.length)
      fs.writeFileSync(filePath, fileContent, "utf-8")
      console.log("File written successfully")
      
      // Verify file was written
      if (fs.existsSync(filePath)) {
        const writtenContent = fs.readFileSync(filePath, "utf-8")
        console.log("File verification: exists and has", writtenContent.length, "characters")
      } else {
        console.error("File was not created:", filePath)
        return NextResponse.json({ error: "File was not created" }, { status: 500 })
      }
    } catch (writeError) {
      console.error("File write error:", writeError)
      return NextResponse.json({ 
        error: "Failed to write content file", 
        details: writeError instanceof Error ? writeError.message : String(writeError),
        filePath 
      }, { status: 500 })
    }

    // Update content index with error handling
    try {
      updateContentIndex()
    } catch (indexError) {
      console.error("Content index update error (non-critical):", indexError)
      // Don't fail the request if index update fails
    }

    // Force revalidation of all relevant pages
    try {
      revalidatePath("/")
      revalidatePath("/blog")
      revalidatePath("/notes")
      revalidatePath("/acts")
      revalidatePath("/jobs")
      revalidatePath("/admin")
      revalidatePath(`/${type === "post" ? "blog" : type}/${slug}`)
      revalidatePath("/api/admin/content")
    } catch (revalidateError) {
      console.log("Revalidation error (non-critical):", revalidateError)
    }

    // Broadcast live update event
    try {
      const eventType = status === "published" ? "content:published" : "content:updated"
      broadcastUpdate(eventType, { 
        type, 
        slug, 
        title,
        status: status || "draft",
        timestamp: Date.now()
      })
    } catch (e) {
      console.log("SSE broadcast error (non-critical):", e)
    }

    return NextResponse.json({
      success: true,
      slug,
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} ${isEdit ? "updated" : (status === "published" ? "published" : "saved")} successfully!`,
      revalidated: true,
      isEdit,
    })
  } catch (error) {
    console.error("Save error:", error)
    
    // Return more specific error message
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json({ 
      error: "Failed to save content", 
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

function updateContentIndex() {
  try {
    // Import and call the proper content index functions
    const { saveContentIndex, clearContentCache } = require("@/lib/content/loader")

    // Clear cache first
    clearContentCache()

    // Save new index
    saveContentIndex()

    console.log("Content index updated and cache cleared")
  } catch (error) {
    console.error("Index update error:", error)
  }
}
