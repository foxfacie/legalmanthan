import { Container } from "../_components/Container"
import { Section } from "../_components/Section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, BookOpen, Award, Users, ExternalLink } from "lucide-react"
import Link from "next/link"
import { AnimatedCard } from "@/components/ui/animated-card"
import { TextReveal } from "@/components/ui/text-reveal"
import { generateMetadata as generateSEOMetadata } from "@/lib/utils"
import { getAllAuthors } from "@/lib/content/loader"
import { AuthorsListing } from "../_components/AuthorsListing"
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: "Legal Authors & Contributors - Expert Profiles",
  description: "Meet our expert legal authors, judges, advocates, and legal scholars contributing to our platform.",
  url: "/authors",
})

export default function AuthorsPage() {
  // Get real authors from content loader
  const authorsData = getAllAuthors()
  
  // Transform the author data to match the component expectations
  const allAuthors = authorsData.map(author => ({
    name: author.displayName,
    title: author.roleTitle,
    bio: author.bioShort,
    avatar: author.avatar || '/placeholder-user.jpg',
    location: author.location || 'Location not specified',
    articles: author.articleCount || 0,
    specialization: author.expertise || [],
    slug: author.slug,
    linkedinUrl: author.socials?.linkedin
  }))
  
  // Show featured authors (you can add isFeatured field to schema later)
  const featuredAuthors = allAuthors.slice(0, 4)

  const specializations = [
    "Constitutional Law",
    "Criminal Law",
    "Corporate Law",
    "Tax Law",
    "IP Law",
    "Labour Law",
    "Environmental Law",
    "Cyber Law"
  ]

  return (
    <>
      <main id="main-content">
        {/* Hero Section */}
        <Section spacing="lg" className="bg-gradient-to-br from-primary/10 to-accent/10">
          <Container>
            <AnimatedCard className="text-center mb-12">
              <TextReveal className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Legal Authors & Contributors
              </TextReveal>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Meet our distinguished panel of legal experts, judges, advocates, and scholars who contribute
                their knowledge and insights to our platform.
              </p>

            </AnimatedCard>
          </Container>
        </Section>

        {/* Featured Authors */}
        <Section spacing="lg">
          <Container>
            <AnimatedCard className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Featured Contributors</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our most prolific and respected legal experts sharing their knowledge
              </p>
            </AnimatedCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredAuthors.map((author, index) => (
                <AnimatedCard key={author.slug} delay={index * 0.1} className="hover-lift">
                  <Card className="h-full glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={author.avatar} alt={author.name} />
                          <AvatarFallback>
                            {author.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">
                                <Link 
                                  href={author.linkedinUrl || `/authors/${author.slug}`}
                                  className="hover:text-primary transition-colors"
                                  target={author.linkedinUrl ? "_blank" : "_self"}
                                  rel={author.linkedinUrl ? "noopener noreferrer" : undefined}
                                >
                                  {author.name}
                                </Link>
                              </h3>
                              <p className="text-sm text-primary font-medium">{author.title}</p>
                            </div>
                            <Badge variant="secondary">Featured</Badge>
                          </div>

                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{author.bio}</p>

                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-3">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{author.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{author.articles} articles</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {author.specialization.slice(0, 2).map((spec) => (
                              <Badge key={spec} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>

                          <Button variant="outline" size="sm" asChild>
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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </div>
          </Container>
        </Section>



        {/* All Authors with Load More */}
        <Section spacing="lg">
          <Container>
            <AuthorsListing authors={allAuthors} initialLimit={8} />
          </Container>
        </Section>
      </main>
    </>
  )
}