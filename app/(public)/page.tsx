import { HeroCarousel } from "./_components/HeroCarousel"
import { ArticleCard } from "./_components/ArticleCard"
import { LatestPostsTabs } from "./_components/LatestPostsTabs"
import { Container } from "./_components/Container"
import { Section } from "./_components/Section"
import { Button } from "@/components/ui/button"
import { AnimatedCard } from "@/components/ui/animated-card"
import { FloatingElements } from "@/components/ui/floating-elements"
import { ParallaxSection } from "@/components/ui/parallax-section"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { getEditorPickPosts, getAllCategories, getPostsByCategory, getLatestUpdates, getPublishedPosts } from "@/lib/content/loader"
import { LatestUpdatesSection } from "./_components/LatestUpdatesSection"

export default function HomePage() {
  // Load content data - Get latest published posts for hero slider
  const latestPosts = getPublishedPosts().slice(0, 5) // Get 5 most recent posts for hero slider
  const editorPicks = getEditorPickPosts().slice(0, 15) // Get more editor picks for both sections
  const categories = getAllCategories().slice(0, 4)
  const latestUpdates = getLatestUpdates(12)

  // Get posts by category for tabs
  const postsByCategory = categories.reduce(
    (acc, category) => {
      acc[category.slug] = getPostsByCategory(category.slug).slice(0, 12)
      return acc
    },
    {} as Record<string, any>,
  )

  return (
    <>
      <FloatingElements />
      <main id="main-content">
        {/* Hero Section - Latest Blogs */}
        <ParallaxSection speed={0.3}>
          <div className="pb-8">
            <Container>
              <AnimatedCard>
                <HeroCarousel posts={latestPosts} />
              </AnimatedCard>
            </Container>
          </div>
        </ParallaxSection>

        {/* Popular Articles */}
        <Section spacing="md">
          <Container>
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
                Popular Articles
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
                Discover our most-read legal content
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {editorPicks.slice(0, 12).map((post, index) => (
                <AnimatedCard key={post.id} delay={index * 0.1} className="hover-lift">
                  <ArticleCard post={post} variant="featured" />
                </AnimatedCard>
              ))}
            </div>
          </Container>
        </Section>



        {/* Latest Updates Section */}
        <Section spacing="md">
          <Container>
            <LatestUpdatesSection updates={latestUpdates} />
          </Container>
        </Section>

        {/* Latest Posts with Tabs */}
        <Section spacing="md" className="bg-muted/10">
          <Container>
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">Browse by Category</h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
                Explore content organized by practice areas and topics
              </p>
            </div>

            <LatestPostsTabs postsByCategory={postsByCategory} categories={categories} />
          </Container>
        </Section>



      </main>
    </>
  )
}
