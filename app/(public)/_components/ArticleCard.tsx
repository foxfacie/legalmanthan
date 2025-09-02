import Link from "next/link"
import Image from "next/image"
import { Clock, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Chip } from "./Chip"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/lib/content/types"

interface ArticleCardProps {
  post: Post
  variant?: "default" | "featured" | "compact"
  showImage?: boolean
}

export function ArticleCard({ post, variant = "default", showImage = true }: ArticleCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
      <Link href={`/blog/${post.slug}`}>
        {showImage && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={post.coverImage || `/placeholder.svg?height=300&width=500&query=${post.title}`}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3">
              <Chip variant="accent" size="sm">
                {post.categories[0]?.replace("-", " ").toUpperCase() || "ARTICLE"}
              </Chip>
            </div>
            {post.isFeatured && (
              <div className="absolute top-3 right-3">
                <Chip variant="default" size="sm">
                  FEATURED
                </Chip>
              </div>
            )}
          </div>
        )}

        <CardContent className="p-4 md:p-6">
          <div className="space-y-2 md:space-y-3">
            {/* Title */}
            <h3
              className={`font-serif font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2 ${
                variant === "featured" ? "text-base md:text-lg lg:text-xl" : "text-sm md:text-base"
              }`}
            >
              {post.title}
            </h3>

            {/* Excerpt - Hidden on mobile for compact view */}
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed line-clamp-2 hidden sm:block">
              {post.excerpt}
            </p>

            {/* Meta - Simplified for mobile */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-2 md:space-x-3 truncate">
                <span className="truncate">By {post.author}</span>
                <span className="hidden sm:inline">{formatDate(post.publishedAt)}</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span>{post.readingTimeMin}m</span>
                </div>
              </div>
              {post.isEditorPick && (
                <Chip variant="secondary" size="sm" className="hidden md:inline-flex">
                  Editor's Pick
                </Chip>
              )}
            </div>

            {/* Tags - Show fewer on mobile */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 md:hidden">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded truncate">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {post.tags.length > 0 && (
              <div className="hidden md:flex flex-wrap gap-1">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
