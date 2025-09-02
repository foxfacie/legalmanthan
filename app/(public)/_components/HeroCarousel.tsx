"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play, Pause, Calendar, Clock, User, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Chip } from "./Chip"
import { useLiveUpdates } from "@/hooks/use-live-updates"
import type { Post } from "@/lib/content/types"

interface HeroCarouselProps {
  posts: Post[]
}

export function HeroCarousel({ posts }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [hasNewContent, setHasNewContent] = useState(false)
  const { lastUpdate, isConnected } = useLiveUpdates()

  // Check for new blog posts
  useEffect(() => {
    if (lastUpdate && (lastUpdate.type === "content:published" || lastUpdate.type === "content:updated")) {
      if (lastUpdate.data.type === "post") {
        setHasNewContent(true)
        // Auto-refresh after 3 seconds to show new content
        setTimeout(() => {
          window.location.reload()
        }, 3000)
      }
    }
  }, [lastUpdate])

  useEffect(() => {
    if (!isPlaying || posts.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPlaying, posts.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPrevious()
      } else if (event.key === "ArrowRight") {
        goToNext()
      } else if (event.key === " ") {
        event.preventDefault()
        setIsPlaying(!isPlaying)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPlaying])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + posts.length) % posts.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posts.length)
  }

  if (posts.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
        <div className="relative h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px] flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-serif text-2xl font-bold text-foreground mb-2">No Blog Posts Available</h2>
            <p className="text-muted-foreground">Check back soon for the latest legal insights.</p>
          </div>
        </div>
      </div>
    )
  }

  const currentPost = posts[currentIndex]

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
      <div className="relative h-[450px] md:h-[500px] lg:h-[550px] xl:h-[600px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={
              currentPost.coverImage ||
              `/placeholder.svg?height=600&width=1200&query=legal+article+${encodeURIComponent(currentPost.title)}`
            }
            alt={currentPost.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              {/* Latest Blog Badge */}
              <div className="mb-4 flex items-center gap-3">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Latest Blog
                </Badge>
                <Chip variant="accent" size="sm">
                  {currentPost.categories[0]?.replace("-", " ").toUpperCase() || "FEATURED"}
                </Chip>
              </div>

              {/* Title */}
              <h1 className="font-serif font-bold text-3xl lg:text-5xl xl:text-6xl text-foreground mb-4 leading-tight">
                {currentPost.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg lg:text-xl text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                {currentPost.excerpt}
              </p>

              {/* Author and Meta Information */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium text-foreground">{currentPost.author}</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(currentPost.publishedAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{currentPost.readingTimeMin} min read</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex items-center gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href={`/blog/${currentPost.slug}`}>Read Full Article</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/blog">View All Blogs</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute inset-y-0 left-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevious}
            className="h-10 w-10 rounded-full bg-background/80 hover:bg-background"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="absolute inset-y-0 right-4 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNext}
            className="h-10 w-10 rounded-full bg-background/80 hover:bg-background"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Play/Pause Control */}
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-10 w-10 rounded-full bg-background/80 hover:bg-background"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 w-8 rounded-full transition-all duration-300",
                currentIndex === index ? "bg-primary" : "bg-background/50 hover:bg-background/70",
              )}
            />
          ))}
        </div>

        {/* Next Post Preview */}
        {posts.length > 1 && (
          <div className="absolute bottom-6 right-6 hidden lg:block">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 max-w-xs">
              <p className="text-xs text-muted-foreground mb-1">Up Next:</p>
              <p className="text-sm font-medium text-foreground line-clamp-2">
                {posts[(currentIndex + 1) % posts.length].title}
              </p>
            </div>
          </div>
        )}

        {/* Blog Counter and Live Status */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <Badge variant="secondary" className="bg-background/80 text-foreground">
            {currentIndex + 1} / {posts.length}
          </Badge>
          {isConnected && (
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              Live
            </Badge>
          )}
          {hasNewContent && (
            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20 animate-pulse">
              <RefreshCw className="w-3 h-3 mr-1" />
              New Content
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
