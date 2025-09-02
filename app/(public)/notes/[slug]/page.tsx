import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Container } from "../../_components/Container"
import { ArticleCard } from "../../_components/ArticleCard"
import { Chip } from "../../_components/Chip"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Eye, Calendar, Share2, Bookmark, FileText, Scale } from "lucide-react"
import { getNoteBySlug, getNotesByCategory } from "@/lib/content/loader"
import { generateMetadata as generateSEOMetadata, generateBreadcrumbs, formatDate } from "@/lib/utils"

interface NotePageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const note = getNoteBySlug(params.slug)

  if (!note) {
    return {
      title: "Note Not Found",
    }
  }

  return generateSEOMetadata({
    title: note.title,
    description: note.summary,
    url: `/notes/${note.slug}`,
    type: "article",
    publishedTime: note.publishedAt?.toISOString(),
    modifiedTime: note.updatedAt?.toISOString(),
    authors: [note.author || "Legal Team"],
    section: note.categories[0],
    tags: note.tags,
  })
}

export default function NotePage({ params }: NotePageProps) {
  const note = getNoteBySlug(params.slug)

  if (!note) {
    notFound()
  }

  // Get related notes from the same category
  const relatedNotes = getNotesByCategory(note.categories[0] || "")
    .filter((n) => n.slug !== note.slug)
    .slice(0, 3)

  const authorName = note.author || "Legal Team"
  const breadcrumbs = generateBreadcrumbs(`/notes/${note.slug}`)

  return (
    <>
      <main id="main-content">
        <Container>
          <article className="py-8">
            {/* Breadcrumbs */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.href} className="flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    <a href={crumb.href} className="hover:text-foreground transition-colors">
                      {crumb.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Note Header */}
            <header className="mb-12">
              <div className="mb-4 flex items-center gap-2">
                <Chip variant="accent" size="md">
                  <FileText className="h-3 w-3 mr-1" />
                  LAW NOTE
                </Chip>
                {note.categories[0] && (
                  <Chip variant="secondary" size="sm">
                    {note.categories[0].replace("-", " ").toUpperCase()}
                  </Chip>
                )}
              </div>

              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {note.title}
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{note.summary}</p>

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center space-x-2">
                  <span>By {authorName}</span>
                </div>
                {note.publishedAt && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(note.publishedAt)}</span>
                  </div>
                )}
                {note.updatedAt && (
                  <div className="flex items-center space-x-2">
                    <span>Updated: {formatDate(note.updatedAt)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{note.readingTimeMin} min read</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </header>

            {/* Note Content */}
            <div className="prose prose-lg max-w-none">
              <MDXRemote source={note.content} />
            </div>

            {/* References */}
            {note.references && note.references.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Scale className="h-4 w-4 mr-2" />
                  References
                </h3>
                <div className="space-y-2">
                  {note.references.map((reference, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {index + 1}. {reference}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {note.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <Chip key={tag} variant="secondary" size="sm">
                      {tag}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {/* Author Box */}
            <Card className="mt-12">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>
                      {authorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{authorName}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Legal expert and contributor to LEGALMANTHAN platform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Notes */}
            {relatedNotes.length > 0 && (
              <div className="mt-16">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Related Law Notes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedNotes.map((relatedNote) => (
                    <ArticleCard key={relatedNote.id} post={relatedNote} />
                  ))}
                </div>
              </div>
            )}
          </article>
        </Container>
      </main>
    </>
  )
}
