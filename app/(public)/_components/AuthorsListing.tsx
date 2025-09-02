"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, BookOpen, User, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Author {
  name: string
  title: string
  bio: string
  avatar: string
  location: string
  articles: number
  specialization: string[]
  slug: string
  linkedinUrl?: string
}

interface AuthorsListingProps {
  authors: Author[]
  initialLimit?: number
}

export function AuthorsListing({ authors, initialLimit = 12 }: AuthorsListingProps) {
  const [displayLimit, setDisplayLimit] = useState(initialLimit)
  const [sortBy, setSortBy] = useState("name")

  const sortedAuthors = useMemo(() => {
    let sorted = [...authors]
    
    switch (sortBy) {
      case "articles":
        sorted = sorted.sort((a, b) => b.articles - a.articles)
        break
      case "location":
        sorted = sorted.sort((a, b) => a.location.localeCompare(b.location))
        break
      case "name":
      default:
        sorted = sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
    }
    
    return sorted
  }, [authors, sortBy])

  const displayedAuthors = sortedAuthors.slice(0, displayLimit)
  const hasMoreAuthors = displayLimit < sortedAuthors.length

  const loadMore = () => {
    setDisplayLimit(prev => Math.min(prev + initialLimit, sortedAuthors.length))
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
          All Contributors ({sortedAuthors.length})
        </h2>
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36 sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="articles">Articles</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {displayedAuthors.map((author) => (
          <Card key={author.slug} className="glass-card hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-4 md:p-6 text-center">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>
                  {author.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>

              <h3 className="font-semibold text-base sm:text-lg mb-1">
                <Link 
                  href={author.linkedinUrl || `/authors/${author.slug}`}
                  className="hover:text-primary transition-colors group-hover:text-primary"
                  target={author.linkedinUrl ? "_blank" : "_self"}
                  rel={author.linkedinUrl ? "noopener noreferrer" : undefined}
                >
                  {author.name}
                </Link>
              </h3>
              <p className="text-sm text-primary font-medium mb-3">{author.title}</p>

              <div className="flex items-center justify-center space-x-3 sm:space-x-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{author.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-3 w-3 flex-shrink-0" />
                  <span>{author.articles}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-1 mb-4">
                {[...new Set(author.specialization)].slice(0, 2).map((spec) => (
                  <Badge key={spec} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>

              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link 
                  href={author.linkedinUrl || `/authors/${author.slug}`}
                  target={author.linkedinUrl ? "_blank" : "_self"}
                  rel={author.linkedinUrl ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-2"
                >
                  {author.linkedinUrl ? "View LinkedIn" : "View Profile"}
                  {author.linkedinUrl && <ExternalLink className="h-3 w-3" />}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMoreAuthors && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={loadMore}>
            Load More Authors ({sortedAuthors.length - displayLimit} remaining)
          </Button>
        </div>
      )}
    </>
  )
}
