import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { readingTime, wordCount } from "@/lib/utils"
import {
  PostFrontmatterSchema,
  NoteFrontmatterSchema,
  JobFrontmatterSchema,
  ActFrontmatterSchema,
  CategorySchema,
  TagSchema,
  AuthorSchema,
  SeriesSchema,
} from "./schemas"
import type { Post, Note, Job, Act, Category, Tag, Author, Series, ContentMeta } from "./types"

const CONTENT_DIR = path.join(process.cwd(), "content")
const POSTS_DIR = path.join(CONTENT_DIR, "posts")
const NOTES_DIR = path.join(CONTENT_DIR, "notes")
const JOBS_DIR = path.join(CONTENT_DIR, "jobs")
const ACTS_DIR = path.join(CONTENT_DIR, "acts")
const META_DIR = path.join(CONTENT_DIR, "meta")

// Ensure content directories exist
function ensureDirectories() {
  const dirs = [CONTENT_DIR, POSTS_DIR, NOTES_DIR, JOBS_DIR, ACTS_DIR, META_DIR]
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })
}

function loadMetaFile<T>(filename: string, schema: any): T[] {
  try {
    const filePath = path.join(META_DIR, filename)
    if (!fs.existsSync(filePath)) {
      return []
    }
    const content = fs.readFileSync(filePath, "utf-8")
    const data = JSON.parse(content)
    return Array.isArray(data) ? data.map((item) => schema.parse(item)) : []
  } catch (error: any) {
    // Log the error with more details if it's a ZodError
    if (error.issues) {
      console.error(`Error loading ${filename}:`, JSON.stringify(error.issues, null, 2))
    } else {
      console.error(`Error loading ${filename}:`, error)
    }
    return []
  }
}

function loadMDXFiles<T>(
  directory: string,
  schema: any,
  transform: (frontmatter: any, content: string, slug: string) => T,
): T[] {
  ensureDirectories()

  if (!fs.existsSync(directory)) {
    return []
  }

  const files = fs.readdirSync(directory).filter((file) => file.endsWith(".mdx"))
  const items: T[] = []
  const slugs = new Set<string>()

  for (const file of files) {
    try {
      const filePath = path.join(directory, file)
      const fileContent = fs.readFileSync(filePath, "utf-8")
      const { data: frontmatter, content } = matter(fileContent)

      // Validate frontmatter
      const validatedFrontmatter = schema.parse(frontmatter)
      const slug = validatedFrontmatter.slug

      // Check for slug collisions
      if (slugs.has(slug)) {
        throw new Error(`Duplicate slug found: ${slug}`)
      }
      slugs.add(slug)

      const item = transform(validatedFrontmatter, content, slug)
      items.push(item)
    } catch (error) {
      // Log the error but DO NOT crash the whole site
      console.error(`Error processing ${file}:`, error)
      // Skip this file in production to avoid 500s due to a single bad document
      continue
    }
  }

  return items
}

// Post loaders
export function getAllPosts(): Post[] {
  return loadMDXFiles(POSTS_DIR, PostFrontmatterSchema, (frontmatter, content, slug) => ({
    id: slug,
    ...frontmatter,
    author: frontmatter.authors[0] || "Unknown Author", // Convert authors array to single author string
    content,
    readingTimeMin: readingTime(content),
    wordCount: wordCount(content),
    viewCount: 0, // Will be loaded from analytics later
  }))
}

export function getPublishedPosts(): Post[] {
  return getAllPosts()
    .filter((post) => post.status === "published")
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts()
  return posts.find((post) => post.slug === slug) || null
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return getPublishedPosts().filter((post) => post.categories.includes(categorySlug))
}

export function getFeaturedPosts(): Post[] {
  return getPublishedPosts().filter((post) => post.isFeatured)
}

export function getEditorPickPosts(): Post[] {
  return getPublishedPosts().filter((post) => post.isEditorPick)
}

// Note loaders
export function getAllNotes(): Note[] {
  return loadMDXFiles(NOTES_DIR, NoteFrontmatterSchema, (frontmatter, content, slug) => ({
    id: slug,
    ...frontmatter,
    content,
    readingTimeMin: readingTime(content),
    wordCount: wordCount(content),
  }))
}

export function getNoteBySlug(slug: string): Note | null {
  const notes = getAllNotes()
  return notes.find((note) => note.slug === slug) || null
}

export function getNotesBySeries(seriesId: string): Note[] {
  return getAllNotes()
    .filter((note) => note.seriesId === seriesId)
    .sort((a, b) => (a.orderInSeries || 0) - (b.orderInSeries || 0))
}

export function getNotesByCategory(categorySlug: string): Note[] {
  return getAllNotes().filter((note) => note.categories.includes(categorySlug))
}

// Job loaders
export function getAllJobs(): Job[] {
  return loadMDXFiles(JOBS_DIR, JobFrontmatterSchema, (frontmatter, content, slug) => ({
    id: slug,
    ...frontmatter,
    description: content,
  }))
}

export function getActiveJobs(): Job[] {
  const now = new Date()
  return getAllJobs()
    .filter((job) => {
      if (job.status !== "published") return false
      if (job.deadlineAt && job.deadlineAt < now) return false
      return true
    })
    .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())
}

export function getJobBySlug(slug: string): Job | null {
  const jobs = getAllJobs()
  return jobs.find((job) => job.slug === slug) || null
}

export function getFeaturedJobs(): Job[] {
  return getActiveJobs().filter((job) => job.isFeatured)
}

export function getJobsByCompany(companyName: string): Job[] {
  return getActiveJobs().filter((job) => job.companyName === companyName)
}

// Act loaders
export function getAllActs(): Act[] {
  return loadMDXFiles(ACTS_DIR, ActFrontmatterSchema, (frontmatter, content, slug) => ({
    id: slug,
    ...frontmatter,
    content,
    readingTimeMin: readingTime(content),
    wordCount: wordCount(content),
    viewCount: 0,
  }))
}

export function getPublishedActs(): Act[] {
  return getAllActs()
    .filter((act) => act.status === "published")
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

export function getActBySlug(slug: string): Act | null {
  const acts = getAllActs()
  return acts.find((act) => act.slug === slug) || null
}

export function getActsByCategory(categorySlug: string): Act[] {
  return getPublishedActs().filter((act) => act.categories.includes(categorySlug))
}

export function getFeaturedActs(): Act[] {
  return getPublishedActs().filter((act) => act.isFeatured)
}

// Meta data loaders
export function getAllCategories(): Category[] {
  return loadMetaFile("categories.json", CategorySchema)
}

export function getAllTags(): Tag[] {
  return loadMetaFile("tags.json", TagSchema)
}

export function getAllAuthors(): Author[] {
  return loadMetaFile("authors.json", AuthorSchema)
}

export function getAllSeries(): Series[] {
  return loadMetaFile("series.json", SeriesSchema)
}

export function getCategoryBySlug(slug: string): Category | null {
  const categories = getAllCategories()
  return categories.find((category) => category.slug === slug) || null
}

export function getTagBySlug(slug: string): Tag | null {
  const tags = getAllTags()
  return tags.find((tag) => tag.slug === slug) || null
}

export function getAuthorBySlug(slug: string): Author | null {
  const authors = getAllAuthors()
  return authors.find((author) => author.slug === slug) || null
}

export function getSeriesBySlug(slug: string): Series | null {
  const series = getAllSeries()
  return series.find((s) => s.slug === slug) || null
}

// Cache management for real-time updates
let contentCache: ContentMeta | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 1000 // 1 second cache for development

// Content index for real-time updates
export function generateContentIndex(): ContentMeta {
  return {
    posts: getAllPosts(),
    notes: getAllNotes(),
    jobs: getAllJobs(),
    acts: getAllActs(),
    categories: getAllCategories(),
    tags: getAllTags(),
    authors: getAllAuthors(),
    series: getAllSeries(),
    lastUpdated: new Date(),
  }
}

export function saveContentIndex() {
  const index = generateContentIndex()
  const indexPath = path.join(CONTENT_DIR, "index.json")
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2))
  // Clear cache to force reload
  clearContentCache()
}

export function clearContentCache() {
  contentCache = null
  cacheTimestamp = 0
  console.log("Content cache cleared")
}

export function getContentIndex(): ContentMeta {
  const now = Date.now()
  
  // Always return fresh data in development or if cache is expired
  if (!contentCache || (now - cacheTimestamp) > CACHE_DURATION) {
    console.log("Generating fresh content index")
    contentCache = generateContentIndex()
    cacheTimestamp = now
  }
  
  return contentCache
}

// Get latest updates from all content types
interface LatestUpdate {
  id: string
  title: string
  slug: string
  publishedAt: Date
  type: 'post' | 'note' | 'job' | 'act'
  category?: string
  author?: string
  excerpt?: string
}

export function getLatestUpdates(limit: number = 10): LatestUpdate[] {
  const updates: LatestUpdate[] = []
  
  // Get latest posts
  const posts = getPublishedPosts().slice(0, limit).map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    publishedAt: post.publishedAt,
    type: 'post' as const,
    category: post.categories[0] || undefined,
    author: post.author,
    excerpt: post.excerpt
  }))
  
  // Get latest notes
  const notes = getAllNotes()
    .filter(note => note.status === 'published')
    .sort((a, b) => (b.publishedAt || new Date(0)).getTime() - (a.publishedAt || new Date(0)).getTime())
    .slice(0, limit)
    .map(note => ({
      id: note.id,
      title: note.title,
      slug: note.slug,
      publishedAt: note.publishedAt || new Date(),
      type: 'note' as const,
      category: note.categories[0] || undefined,
      author: note.author,
      excerpt: note.excerpt
    }))
  
  // Get latest jobs
  const jobs = getActiveJobs().slice(0, limit).map(job => ({
    id: job.id,
    title: job.title,
    slug: job.slug,
    publishedAt: job.postedAt,
    type: 'job' as const,
    category: job.practiceAreas?.[0] || undefined,
    author: job.companyName,
    excerpt: job.summary
  }))
  
  // Get latest acts
  const acts = getPublishedActs().slice(0, limit).map(act => ({
    id: act.id,
    title: act.title,
    slug: act.slug,
    publishedAt: act.publishedAt,
    type: 'act' as const,
    category: act.categories[0] || undefined,
    author: act.author,
    excerpt: act.excerpt
  }))
  
  // Combine and sort by publish date
  updates.push(...posts, ...notes, ...jobs, ...acts)
  
  return updates
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, limit)
}
