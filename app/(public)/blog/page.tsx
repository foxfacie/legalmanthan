import { Container } from "../_components/Container"
import { Section } from "../_components/Section"
import { ArticleCard } from "../_components/ArticleCard"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import Link from "next/link"
import { getPublishedPosts, getFeaturedPosts, getAllCategories, getPostsByCategory } from "@/lib/content/loader"
import { generateMetadata as generateSEOMetadata } from "@/lib/utils"
import { BlogListing } from "../_components/BlogListing"
import type { Metadata } from "next"

export const metadata: Metadata = generateSEOMetadata({
  title: "Legal Blog - Latest Articles & Insights",
  description:
    "Explore comprehensive legal articles, career guidance, and industry insights from leading legal professionals.",
  url: "/blog",
})

export default function BlogPage() {
  const allPosts = getPublishedPosts()
  const featuredPosts = getFeaturedPosts().slice(0, 3)
  const categories = getAllCategories()
  const popularPosts = allPosts.filter((post) => (post.viewCount || 0) > 50).slice(0, 6)

  return (
    <>
      <main id="main-content">
        {/* Hero Section */}
        <Section spacing="lg" className="bg-gradient-to-br from-primary/5 to-accent/5">
          <Container>
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Legal Insights & Analysis
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Stay informed with the latest legal developments, career guidance, and expert analysis from India's
                leading legal professionals.
              </p>
            </div>
          </Container>
        </Section>

        {/* Featured Articles */}
        {featuredPosts.length > 0 && (
          <Section spacing="lg">
            <Container>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-3xl font-bold text-foreground">Featured Articles</h2>
                <Badge variant="secondary">Editor's Choice</Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <ArticleCard key={post.id} post={post} variant="featured" />
                ))}
              </div>
            </Container>
          </Section>
        )}



        {/* Popular Articles */}
        {popularPosts.length > 0 && (
          <Section spacing="lg">
            <Container>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-3xl font-bold text-foreground">Most Popular</h2>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">This Month</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularPosts.map((post) => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>
            </Container>
          </Section>
        )}

        {/* All Articles with Load More */}
        <Section spacing="lg" className="bg-muted/20">
          <Container>
            <BlogListing posts={allPosts} initialLimit={12} />
          </Container>
        </Section>
      </main>
    </>
  )
}
