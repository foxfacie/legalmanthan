"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, Calendar, User, Scale } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import type { Note } from "@/lib/content/types"

interface NotesListingProps {
  notes: Note[]
  initialLimit?: number
}

export function NotesListing({ notes, initialLimit = 12 }: NotesListingProps) {
  const [displayLimit, setDisplayLimit] = useState(initialLimit)
  const [sortBy, setSortBy] = useState("newest")

  const sortedNotes = useMemo(() => {
    let sorted = [...notes]
    
    switch (sortBy) {
      case "title":
        sorted = sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "category":
        sorted = sorted.sort((a, b) => {
          const aCat = a.categories[0] || ""
          const bCat = b.categories[0] || ""
          return aCat.localeCompare(bCat)
        })
        break
      case "updated":
        sorted = sorted.sort((a, b) => {
          const aDate = a.updatedAt || a.publishedAt || new Date(0)
          const bDate = b.updatedAt || b.publishedAt || new Date(0)
          return bDate.getTime() - aDate.getTime()
        })
        break
      case "newest":
      default:
        sorted = sorted.sort((a, b) => {
          const aDate = a.publishedAt || new Date(0)
          const bDate = b.publishedAt || new Date(0)
          return bDate.getTime() - aDate.getTime()
        })
        break
    }
    
    return sorted
  }, [notes, sortBy])

  const displayedNotes = sortedNotes.slice(0, displayLimit)
  const hasMoreNotes = displayLimit < sortedNotes.length

  const loadMore = () => {
    setDisplayLimit(prev => Math.min(prev + initialLimit, sortedNotes.length))
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
          Law Notes ({sortedNotes.length})
        </h2>
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36 sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Latest First</SelectItem>
              <SelectItem value="updated">Recently Updated</SelectItem>
              <SelectItem value="title">Alphabetical</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {displayedNotes.map((note) => (
          <Card key={note.id} className="hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-4 md:p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  LAW NOTE
                </Badge>
                {note.categories[0] && (
                  <Badge variant="secondary" className="text-xs">
                    {note.categories[0].replace("-", " ").toUpperCase()}
                  </Badge>
                )}
              </div>
              
              <Link 
                href={`/notes/${note.slug}`} 
                className="group-hover:text-primary transition-colors"
              >
                <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {note.title}
                </h3>
              </Link>
              
              {note.summary && (
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                  {note.summary}
                </p>
              )}
              
              <div className="space-y-3 mt-auto">
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground pt-4 border-t border-border/50 gap-2">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    {note.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate max-w-24">{note.author}</span>
                      </div>
                    )}
                    {note.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>{formatDate(note.publishedAt)}</span>
                      </div>
                    )}
                    {note.readingTimeMin && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span>{note.readingTimeMin} min read</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMoreNotes && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={loadMore}>
            Load More Notes ({sortedNotes.length - displayLimit} remaining)
          </Button>
        </div>
      )}
    </>
  )
}
