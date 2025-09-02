import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Container } from "../../../_components/Container"
import { Section } from "../../../_components/Section"
import { ArticleCard } from "../../../_components/ArticleCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatedCard } from "@/components/ui/animated-card"
import { TextReveal } from "@/components/ui/text-reveal"
import { getPostsByCategory, getCategoryBySlug } from "@/lib/content/loader"
import { generateMetadata as generateSEOMetadata } from "@/lib/utils"

interface CategoryPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug)
  
  if (!category) {
    return { title: "Category Not Found" }
  }

  return generateSEOMetadata({
    title: `${category.name} Articles - Legal Insights`,
    description: `Explore comprehensive articles and insights on ${category.name} from leading legal experts.`,
    url: `/blog/category/${params.slug}`,
  })
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug)
  const posts = getPostsByCategory(params.slug)

  if (!category) {
    notFound()
  }

  const featuredPosts = posts.filter(post => post.isFeatured).slice(0, 3)
  const regularPosts = posts.filter(post => !post.isFeatured)

  return (
    <>
      <main id="main-content">
        {/* Hero Section */}
        <Section spacing="lg" className="bg-gradient-to-br from-primary/10 to-accent/10">
          <Container>
            <AnimatedCard className="text-center">
              <div className="text-4xl mb-4">{category.emoji || "📚"}</div>
              <TextReveal className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {category.name}
              </TextReveal>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                {category.description || `Comprehensive articles and insights on ${category.name} from leading legal experts and practitioners.`}
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Badge variant="secondary" className="text-sm">
                  {posts.length} Articles
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Updated Weekly
                </Badge>
              </div>
            </AnimatedCard>
          </Container>
        </Section>

        {/* Featured Articles */}
        {featuredPosts.length > 0 && (
          <Section spacing="lg">
            <Container>
              <AnimatedCard className="mb-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-3xl font-bold text-foreground">Featured Articles</h2>
                  <Badge variant="secondary">Editor's Choice</Badge>
                </div>
              </AnimatedCard>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {featuredPosts.map((post, index) => (
                  <AnimatedCard key={post.id} delay={index * 0.1} className="hover-lift">
                    <ArticleCard post={post} variant="featured" />
                  </AnimatedCard>
                ))}
              </div>
            </Container>
          </Section>
        )}

        {/* All Articles */}
        <Section spacing="lg" className={featuredPosts.length > 0 ? "bg-muted/20" : ""}>
          <Container>
            <div className="flex items-center justify-between mb-8">
              <AnimatedCard>
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  {featuredPosts.length > 0 ? "All Articles" : "Latest Articles"}
                </h2>
              </AnimatedCard>
              <div className="flex items-center space-x-4">
                <Select>
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

            {regularPosts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.slice(0, 12).map((post, index) => (
                    <AnimatedCard key={post.id} delay={index * 0.1} className="hover-lift">
                      <ArticleCard post={post} />
                    </AnimatedCard>
                  ))}
                </div>

                {regularPosts.length > 12 && (
                  <div className="text-center mt-12">
                    <Button variant="outline" size="lg">
                      Load More Articles
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <AnimatedCard>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-4">No Articles Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    We're working on adding more content to this category. Check back soon!
                  </p>
                  <Button asChild>
                    <a href="/blog">Browse All Articles</a>
                  </Button>
                </div>
              </AnimatedCard>
            )}
          </Container>
        </Section>

        {/* Related Categories */}
        <Section spacing="lg">
          <Container>
            <AnimatedCard className="text-center">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-8">Explore Related Topics</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {["Constitutional Law", "Criminal Law", "Corporate Law", "Contract Law", "Tax Law"].map((topic, index) => (
                  <AnimatedCard key={topic} delay={index * 0.1}>
                    <Button variant="outline" size="sm" className="hover-glow" asChild>
                      <a href={`/blog/category/${topic.toLowerCase().replace(" ", "-")}`}>
                        {topic}
                      </a>
                    </Button>
                  </AnimatedCard>
                ))}
              </div>
            </AnimatedCard>
          </Container>
        </Section>
      </main>
    </>
  )
}