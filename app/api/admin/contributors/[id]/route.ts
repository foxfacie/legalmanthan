import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const authorsPath = path.join(process.cwd(), "content/meta/authors.json")
    
    // Read existing authors
    const authorsData = fs.readFileSync(authorsPath, "utf-8")
    let authors = JSON.parse(authorsData)
    
    // Remove contributor
    authors = authors.filter((author: any) => author.id !== id)
    
    // Write back to file
    fs.writeFileSync(authorsPath, JSON.stringify(authors, null, 2))
    
    return NextResponse.json({ 
      success: true, 
      message: "Contributor deleted successfully!" 
    })
  } catch (error) {
    console.error("Contributor deletion error:", error)
    return NextResponse.json({ error: "Failed to delete contributor" }, { status: 500 })
  }
}