import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { getAllPosts, getAllNotes, getAllJobs, getAllActs, getAllCategories, getAllTags } from "@/lib/content/loader"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const contentDir = path.join(process.cwd(), "content")

    // Check directory structure
    const directories = {
      content: fs.existsSync(contentDir),
      posts: fs.existsSync(path.join(contentDir, "posts")),
      notes: fs.existsSync(path.join(contentDir, "notes")),
      jobs: fs.existsSync(path.join(contentDir, "jobs")),
      acts: fs.existsSync(path.join(contentDir, "acts")),
      meta: fs.existsSync(path.join(contentDir, "meta")),
    }

    // Count files in each directory
    const fileCounts = {
      posts: directories.posts ? fs.readdirSync(path.join(contentDir, "posts")).filter(f => f.endsWith('.mdx')).length : 0,
      notes: directories.notes ? fs.readdirSync(path.join(contentDir, "notes")).filter(f => f.endsWith('.mdx')).length : 0,
      jobs: directories.jobs ? fs.readdirSync(path.join(contentDir, "jobs")).filter(f => f.endsWith('.mdx')).length : 0,
      acts: directories.acts ? fs.readdirSync(path.join(contentDir, "acts")).filter(f => f.endsWith('.mdx')).length : 0,
    }

    // Test content loaders
    let loaderResults = {
      posts: { count: 0, error: null },
      notes: { count: 0, error: null },
      jobs: { count: 0, error: null },
      acts: { count: 0, error: null },
      categories: { count: 0, error: null },
      tags: { count: 0, error: null },
    }

    try {
      const posts = getAllPosts()
      loaderResults.posts.count = posts.length
    } catch (error) {
      loaderResults.posts.error = error instanceof Error ? error.message : String(error)
    }

    try {
      const notes = getAllNotes()
      loaderResults.notes.count = notes.length
    } catch (error) {
      loaderResults.notes.error = error instanceof Error ? error.message : String(error)
    }

    try {
      const jobs = getAllJobs()
      loaderResults.jobs.count = jobs.length
    } catch (error) {
      loaderResults.jobs.error = error instanceof Error ? error.message : String(error)
    }

    try {
      const acts = getAllActs()
      loaderResults.acts.count = acts.length
    } catch (error) {
      loaderResults.acts.error = error instanceof Error ? error.message : String(error)
    }

    try {
      const categories = getAllCategories()
      loaderResults.categories.count = categories.length
    } catch (error) {
      loaderResults.categories.error = error instanceof Error ? error.message : String(error)
    }

    try {
      const tags = getAllTags()
      loaderResults.tags.count = tags.length
    } catch (error) {
      loaderResults.tags.error = error instanceof Error ? error.message : String(error)
    }

    // Check for sample files
    const sampleFiles = []
    if (directories.posts) {
      const postFiles = fs.readdirSync(path.join(contentDir, "posts")).filter(f => f.endsWith('.mdx')).slice(0, 3)
      sampleFiles.push(...postFiles.map(f => `posts/${f}`))
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      directories,
      fileCounts,
      loaderResults,
      sampleFiles,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        cwd: process.cwd(),
      }
    })
  } catch (error) {
    console.error("Debug endpoint error:", error)
    return NextResponse.json({
      error: "Debug failed",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}