import { type NextRequest, NextResponse } from "next/server"
import { getAllPosts, getAllJobs, getAllNotes } from "@/lib/content/loader"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.toLowerCase()

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    const [posts, jobs, notes] = await Promise.all([getAllPosts(), getAllJobs(), getAllNotes()])

    const searchResults = []

    // Search posts (articles/blogs)
    const matchingPosts = posts
      .filter((post) => post.status === "published")
      .filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query) ||
          post.categories.some((cat) => cat.toLowerCase().includes(query)) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
      .slice(0, 8)

    searchResults.push(
      ...matchingPosts.map((post) => ({
        type: "post",
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        category: post.categories[0],
        author: post.author,
      })),
    )

    // Search law notes
    const matchingNotes = notes
      .filter((note) => note.status === "published")
      .filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.summary.toLowerCase().includes(query) ||
          note.author?.toLowerCase().includes(query) ||
          note.categories.some((cat) => cat.toLowerCase().includes(query)) ||
          note.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
      .slice(0, 6)

    searchResults.push(
      ...matchingNotes.map((note) => ({
        type: "note",
        title: note.title,
        slug: note.slug,
        excerpt: note.summary,
        category: note.categories[0],
        author: note.author,
      })),
    )

    // Search jobs
    const matchingJobs = jobs
      .filter((job) => job.status === "published")
      .filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.companyName.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.practiceAreas.some((area) => area.toLowerCase().includes(query)),
      )
      .slice(0, 4)

    searchResults.push(
      ...matchingJobs.map((job) => ({
        type: "job",
        title: job.title,
        slug: job.slug,
        excerpt: `${job.companyName} • ${job.location}`,
        category: job.practiceAreas[0],
        author: job.companyName,
      })),
    )

    return NextResponse.json({ results: searchResults })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
