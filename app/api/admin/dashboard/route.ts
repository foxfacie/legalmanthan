import { NextResponse } from "next/server"
import { getAllPosts, getAllJobs } from "@/lib/content/loader"

export async function GET() {
  try {
    const posts = await getAllPosts()
    const jobs = await getAllJobs()

    const publishedPosts = posts.filter((post) => post.status === "published")
    const draftPosts = posts.filter((post) => post.status === "draft")
    const activeJobs = jobs.filter((job) => job.status === "active")

    const recentPosts = posts
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5)
      .map((post) => ({
        title: post.title,
        slug: post.slug,
        status: post.status,
        publishedAt: post.publishedAt,
        views: Math.floor(Math.random() * 1000) + 100, // Mock data
      }))

    const stats = {
      totalPosts: posts.length,
      publishedPosts: publishedPosts.length,
      draftPosts: draftPosts.length,
      totalJobs: jobs.length,
      activeJobs: activeJobs.length,
      totalViews: Math.floor(Math.random() * 50000) + 10000, // Mock data
      recentPosts,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
