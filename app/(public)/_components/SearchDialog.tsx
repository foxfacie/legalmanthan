"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileText, Briefcase, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { debounce } from "lodash"

interface SearchResult {
  type: "post" | "job" | "note"
  title: string
  slug: string
  excerpt: string
  category?: string
  author?: string
}

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const searchContent = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.results || [])
        }
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [],
  )

  useEffect(() => {
    searchContent(query)
  }, [query, searchContent])

  const handleResultClick = (result: SearchResult) => {
    const path =
      result.type === "post"
        ? `/blog/${result.slug}`
        : result.type === "job"
          ? `/jobs/${result.slug}`
          : `/notes/${result.slug}`
    router.push(path)
    onOpenChange(false)
    setQuery("")
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "post":
        return <FileText className="w-4 h-4" />
      case "job":
        return <Briefcase className="w-4 h-4" />
      case "note":
        return <BookOpen className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Content</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search articles, jobs, and law notes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {isLoading && <div className="text-center py-8 text-gray-500">Searching...</div>}

            {!isLoading && query && results.length === 0 && (
              <div className="text-center py-8 text-gray-500">No results found for "{query}"</div>
            )}

            {results.map((result, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-4 text-left"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-gray-400 mt-1">{getIcon(result.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1">{result.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{result.excerpt}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {result.author && (
                        <span className="text-xs text-green-600">By {result.author}</span>
                      )}
                      {result.category && result.author && (
                        <span className="text-xs text-gray-400">•</span>
                      )}
                      {result.category && (
                        <span className="text-xs text-blue-600">{result.category}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
