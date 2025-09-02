import { Container } from "../_components/Container"
import { Section } from "../_components/Section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, Scale, Gavel, Building, Calendar, Eye } from "lucide-react"
import Link from "next/link"
import { AnimatedCard } from "@/components/ui/animated-card"
import { TextReveal } from "@/components/ui/text-reveal"
import { generateMetadata as generateSEOMetadata, formatDate } from "@/lib/utils"
import { getPublishedActs, getFeaturedActs } from "@/lib/content/loader"
import type { Metadata } from "next"

export const metadata: Metadata = generateSEOMetadata({
  title: "Legal Acts & Statutes - Comprehensive Database",
  description: "Access complete database of Indian legal acts, statutes, and regulations with detailed analysis.",
  url: "/acts",
})

export default function ActsPage() {
  // Load real acts data
  const allActs = getPublishedActs()
  const featuredActs = getFeaturedActs()
  const recentActs = allActs.slice(0, 6) // Get 6 most recent acts

  const getIconForCategory = (category: string) => {
    if (category.includes('criminal')) return Gavel
    if (category.includes('corporate') || category.includes('company')) return Building
    if (category.includes('constitutional')) return Scale
    if (category.includes('contract')) return FileText
    return BookOpen
  }

  return (
    <>
      <main id="main-content">
        {/* Hero Section */}
        <Section spacing="lg" className="bg-gradient-to-br from-primary/10 to-accent/10">
          <Container>
            <AnimatedCard className="text-center mb-12">
              <TextReveal className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Legal Acts & Statutes
              </TextReveal>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Comprehensive database of Indian legal acts, statutes, and regulations with detailed section-wise
                analysis and commentary.
              </p>

            </AnimatedCard>
          </Container>
        </Section>

        {/* Featured Acts */}
        <Section spacing="lg">
          <Container>
            <AnimatedCard className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Featured Acts</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Most referenced and important legal acts in Indian jurisprudence
              </p>
            </AnimatedCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(featuredActs.length > 0 ? featuredActs : allActs.slice(0, 4)).map((act, index) => {
                const IconComponent = getIconForCategory(act.categories[0] || '')
                return (
                  <AnimatedCard key={act.slug} delay={index * 0.1} className="hover-lift">
                    <Card className="h-full glass-card">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              {act.categories[0] && (
                                <Badge variant="secondary" className="mb-2">
                                  {act.categories[0].replace('-', ' ').toUpperCase()}
                                </Badge>
                              )}
                              <CardTitle className="text-lg">
                                <Link href={`/acts/${act.slug}`} className="hover:text-primary transition-colors">
                                  {act.title}
                                </Link>
                              </CardTitle>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{act.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(act.publishedAt)}
                            </span>
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {act.viewCount}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/acts/${act.slug}`}>View Act</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimatedCard>
                )
              })}
            </div>
          </Container>
        </Section>



        {/* Recent Acts */}
        <Section spacing="lg">
          <Container>
            <AnimatedCard className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Recent Legislation</h2>
              <p className="text-lg text-muted-foreground">
                Latest acts and amendments in Indian law
              </p>
            </AnimatedCard>

            <div className="space-y-4">
              {recentActs.map((act, index) => (
                <AnimatedCard key={act.slug} delay={index * 0.1} className="hover-lift">
                  <Card className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              <Link href={`/acts/${act.slug}`} className="hover:text-primary transition-colors">
                                {act.title}
                              </Link>
                            </h3>
                            <Badge variant="outline">
                              {new Date(act.publishedAt).getFullYear()}
                            </Badge>
                            {act.categories[0] && (
                              <Badge variant="secondary">
                                {act.categories[0].replace('-', ' ').toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-2">{act.excerpt}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{act.readingTimeMin} min read</span>
                            <span>{act.wordCount} words</span>
                            <span>{formatDate(act.publishedAt)}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/acts/${act.slug}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </div>

            {allActs.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Acts Available</h3>
                <p className="text-muted-foreground">Acts will appear here once they are published.</p>
              </div>
            )}
          </Container>
        </Section>
      </main>
    </>
  )
}