import type { MetadataRoute } from "next"
import { getAllPosts, getAllJobs } from "@/lib/content/loader"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://legal-insights.com"

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ]

  // Dynamic pages
  const posts = await getAllPosts()
  const jobs = await getAllJobs()

  const postPages = posts
    .filter((post) => post.status === "published")
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))

  const jobPages = jobs
    .filter((job) => job.status === "active")
    .map((job) => ({
      url: `${baseUrl}/jobs/${job.slug}`,
      lastModified: new Date(job.updatedAt || job.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }))

  return [...staticPages, ...postPages, ...jobPages]
}
