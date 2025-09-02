import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedCard } from "@/components/ui/animated-card"
import { ArrowRight, Calendar, User, BookOpen, Briefcase, Scale, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

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

interface LatestUpdatesSectionProps {
  updates: LatestUpdate[]
}

const getTypeConfig = (type: string) => {
  switch (type) {
    case 'post':
      return { 
        label: 'Article', 
        icon: BookOpen, 
        color: 'bg-blue-500/10 text-blue-600 border-blue-200',
        href: '/blog'
      }
    case 'note':
      return { 
        label: 'Law Note', 
        icon: FileText, 
        color: 'bg-green-500/10 text-green-600 border-green-200',
        href: '/notes'
      }
    case 'job':
      return { 
        label: 'Job', 
        icon: Briefcase, 
        color: 'bg-purple-500/10 text-purple-600 border-purple-200',
        href: '/jobs'
      }
    case 'act':
      return { 
        label: 'Legal Act', 
        icon: Scale, 
        color: 'bg-orange-500/10 text-orange-600 border-orange-200',
        href: '/acts'
      }
    default:
      return { 
        label: 'Content', 
        icon: FileText, 
        color: 'bg-gray-500/10 text-gray-600 border-gray-200',
        href: '/blog'
      }
  }
}

const getContentHref = (type: string, slug: string) => {
  switch (type) {
    case 'post':
      return `/blog/${slug}`
    case 'note':
      return `/notes/${slug}`
    case 'job':
      return `/jobs/${slug}`
    case 'act':
      return `/acts/${slug}`
    default:
      return `/blog/${slug}`
  }
}

export function LatestUpdatesSection({ updates }: LatestUpdatesSectionProps) {
  if (!updates.length) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            Latest Updates
          </h2>
          <p className="text-muted-foreground text-sm md:text-base mt-2">
            Stay informed with our newest content across all categories
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="self-start sm:self-auto shrink-0">
          <Link href="/blog">
            <span className="hidden sm:inline">View All</span>
            <span className="sm:hidden">All</span>
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {updates.slice(0, 6).map((update, index) => {
          const typeConfig = getTypeConfig(update.type)
          const Icon = typeConfig.icon
          
          return (
            <AnimatedCard key={`${update.type}-${update.id}`} delay={index * 0.1}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className={`${typeConfig.color} text-xs`}>
                      <Icon className="w-3 h-3 mr-1" />
                      {typeConfig.label}
                    </Badge>
                    {update.category && (
                      <Badge variant="secondary" className="text-xs">
                        {update.category}
                      </Badge>
                    )}
                  </div>
                  
                  <Link 
                    href={getContentHref(update.type, update.slug)} 
                    className="group-hover:text-primary transition-colors"
                  >
                    <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {update.title}
                    </h3>
                  </Link>
                  
                  {update.excerpt && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                      {update.excerpt}
                    </p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border/50 gap-2">
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                      {update.author && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate max-w-24">{update.author}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{formatDistanceToNow(update.publishedAt, { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          )
        })}
      </div>
      
      {updates.length > 6 && (
        <div className="text-center pt-4">
          <Button variant="outline" size="lg" asChild>
            <Link href="/blog">
              View All Latest Updates <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
