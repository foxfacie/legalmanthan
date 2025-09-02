import { NextResponse } from "next/server"
import { getAllPosts, getAllJobs, getAllNotes, getAllActs } from "@/lib/content/loader"

// Disable caching for this API route
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    // Force fresh data by calling loaders directly (no await needed as they're synchronous)
    const posts = getAllPosts()
    const jobs = getAllJobs()
    const notes = getAllNotes()
    const acts = getAllActs()

    // Combine all content into a unified array with unique IDs
    const content = [
      ...posts.map((post) => ({
        id: `post-${post.slug}`, // Ensure unique ID by prefixing with type
        title: post.title,
        slug: post.slug,
        type: "post" as const,
        status: post.status,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
        authors: post.authors,
        categories: post.categories,
        isFeatured: post.isFeatured || false,
        isEditorPick: post.isEditorPick || false,
        viewCount: post.viewCount || 0,
      })),
      ...notes.map((note) => ({
        id: `note-${note.slug}`, // Ensure unique ID by prefixing with type
        title: note.title,
        slug: note.slug,
        type: "note" as const,
        status: note.status,
        publishedAt: note.publishedAt,
        updatedAt: note.updatedAt,
        authors: note.authors,
        categories: note.categories,
        isFeatured: note.isFeatured || false,
        isEditorPick: note.isEditorPick || false,
        viewCount: note.viewCount || 0,
      })),
      ...acts.map((act) => ({
        id: `act-${act.slug}`, // Ensure unique ID by prefixing with type
        title: act.title,
        slug: act.slug,
        type: "act" as const,
        status: act.status,
        publishedAt: act.publishedAt,
        updatedAt: act.updatedAt,
        authors: act.authors,
        categories: act.categories,
        isFeatured: act.isFeatured || false,
        isEditorPick: act.isEditorPick || false,
        viewCount: act.viewCount || 0,
      })),
      ...jobs.map((job) => ({
        id: `job-${job.slug}`, // Ensure unique ID by prefixing with type
        title: job.title,
        slug: job.slug,
        type: "job" as const,
        status: job.status,
        publishedAt: job.postedAt,
        updatedAt: job.updatedAt,
        authors: [job.companyName],
        categories: job.practiceAreas || [],
        isFeatured: job.isFeatured || false,
        isEditorPick: false,
        viewCount: 0,
      })),
    ]

    // Remove duplicates based on unique ID and sort by most recent first
    const uniqueContent = content.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    )
    
    uniqueContent.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

    return NextResponse.json(uniqueContent)
  } catch (error) {
    console.error("Content fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}