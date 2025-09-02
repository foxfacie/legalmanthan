import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Container } from "../../_components/Container"
import { ArticleCard } from "../../_components/ArticleCard"
import { Chip } from "../../_components/Chip"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Eye, Calendar, Share2, Bookmark } from "lucide-react"
import { getPostBySlug, getPostsByCategory } from "@/lib/content/loader"
import { generateMetadata as generateSEOMetadata, generateBreadcrumbs, formatDate } from "@/lib/utils"

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return generateSEOMetadata({
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    url: `/blog/${post.slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.publishedAt.toISOString(),
    modifiedTime: post.updatedAt?.toISOString(),
    authors: [post.author],
    section: post.categories[0],
    tags: post.tags,
  })
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Get related posts from the same category
  const relatedPosts = getPostsByCategory(post.categories[0] || "")
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)

  // Author name is now a simple string
  const authorName = post.author

  const breadcrumbs = generateBreadcrumbs(`/blog/${post.slug}`)

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

            {/* Article Header */}
            <header className="mb-12">
              <div className="mb-4">
                <Chip variant="accent" size="md">
                  {post.categories[0]?.replace("-", " ").toUpperCase() || "ARTICLE"}
                </Chip>
              </div>

              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>

              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                <div className="flex items-center space-x-2">
                  <span>By {authorName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                {post.updatedAt && (
                  <div className="flex items-center space-x-2">
                    <span>Updated: {formatDate(post.updatedAt)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.readingTimeMin} min read</span>
                </div>
                {post.viewCount > 0 && (
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>{post.viewCount} views</span>
                  </div>
                )}
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

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <MDXRemote source={post.content} />
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
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
                      Article author and contributor to LEGALMANTHAN platform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <ArticleCard key={relatedPost.id} post={relatedPost} />
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
