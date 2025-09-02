import { NextResponse } from "next/server"
import { getAllCategories } from "@/lib/content/loader"

export async function GET() {
  try {
    const categories = getAllCategories()
    
    // Transform categories to include id field
    const categoriesWithId = categories.map((category, index) => ({
      id: category.slug,
      name: category.name,
      slug: category.slug,
      count: category.count || 0
    }))
    
    return NextResponse.json(categoriesWithId)
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}