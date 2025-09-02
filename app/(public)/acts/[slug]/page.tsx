import { notFound } from "next/navigation"
import { Container } from "../../_components/Container"
import { Section } from "../../_components/Section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, Eye, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { getActBySlug, getPublishedActs } from "@/lib/content/loader"
import { formatDate } from "@/lib/utils"
import { generateMetadata as generateSEOMetadata } from "@/lib/utils"
import type { Metadata } from "next"

interface ActPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const acts = getPublishedActs()
  return acts.map((act) => ({
    slug: act.slug,
  }))
}

export async function generateMetadata({ params }: ActPageProps): Promise<Metadata> {
  const act = getActBySlug(params.slug)
  
  if (!act) {
    return generateSEOMetadata({
      title: "Act Not Found",
      description: "The requested legal act could not be found.",
    })
  }

  return generateSEOMetadata({
    title: act.title,
    description: act.excerpt,
    url: `/acts/${act.slug}`,
  })
}

export default function ActPage({ params }: ActPageProps) {
  const act = getActBySlug(params.slug)

  if (!act) {
    notFound()
  }

  return (
    <>
      <main id="main-content">
        {/* Header */}
        <Section spacing="md" className="bg-muted/20">
          <Container>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/acts">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Acts
                </Link>
              </Button>
            </div>

            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {act.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category.replace('-', ' ').toUpperCase()}
                  </Badge>
                ))}
                {act.isFeatured && (
                  <Badge variant="default">Featured</Badge>
                )}
              </div>

              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {act.title}
              </h1>

              <p className="text-xl text-muted-foreground mb-6">
                {act.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Published {formatDate(act.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{act.readingTimeMin} min read</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{act.viewCount} views</span>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        {/* Content */}
        <Section spacing="lg">
          <Container>
            <div className="max-w-4xl">
              <Card>
                <CardContent className="p-8">
                  <div 
                    className="prose prose-lg max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: act.content.replace(/\n/g, '<br />') }}
                  />
                </CardContent>
              </Card>

              {/* Tags */}
              {act.tags.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {act.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Container>
        </Section>
      </main>
    </>
  )
}