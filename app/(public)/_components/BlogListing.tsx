"use client"

import { useState, useMemo } from "react"
import { ArticleCard } from "./ArticleCard"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Post } from "@/lib/content/types"

interface BlogListingProps {
  posts: Post[]
  initialLimit?: number
}

export function BlogListing({ posts, initialLimit = 12 }: BlogListingProps) {
  const [displayLimit, setDisplayLimit] = useState(initialLimit)
  const [sortBy, setSortBy] = useState("newest")

  const sortedPosts = useMemo(() => {
    let sorted = [...posts]
    
    switch (sortBy) {
      case "popular":
        sorted = sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        break
      case "trending":
        // Sort by recent engagement (simplified: recent posts with high view count)
        sorted = sorted.sort((a, b) => {
          const aScore = (a.viewCount || 0) * (Date.now() - a.publishedAt.getTime() > 7 * 24 * 60 * 60 * 1000 ? 0.5 : 1)
          const bScore = (b.viewCount || 0) * (Date.now() - b.publishedAt.getTime() > 7 * 24 * 60 * 60 * 1000 ? 0.5 : 1)
          return bScore - aScore
        })
        break
      case "newest":
      default:
        sorted = sorted.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
        break
    }
    
    return sorted
  }, [posts, sortBy])

  const displayedPosts = sortedPosts.slice(0, displayLimit)
  const hasMorePosts = displayLimit < sortedPosts.length

  const loadMore = () => {
    setDisplayLimit(prev => Math.min(prev + initialLimit, sortedPosts.length))
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-3xl font-bold text-foreground">
          Latest Articles ({sortedPosts.length})
        </h2>
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedPosts.map((post) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>

      {hasMorePosts && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={loadMore}>
            Load More Articles ({sortedPosts.length - displayLimit} remaining)
          </Button>
        </div>
      )}
    </>
  )
}
