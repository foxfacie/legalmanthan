
import { Container } from "../_components/Container"
import { Section } from "../_components/Section"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Award, Target, Heart, Globe } from "lucide-react"
import { generateMetadata as generateSEOMetadata } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = generateSEOMetadata({
  title: "About Us - Leading Legal Education Platform",
  description:
    "Learn about our mission to democratize legal education and empower the next generation of legal professionals.",
  url: "/about",
})

export default function AboutPage() {
  const team = [
    {
      name: "Sonia Yadav",
      role: "Founder & Editor-in-Chief",
      bio: "Aspiring Legal Professional with Strong Analytical Skills | Law Student at Delhi University",
      avatar: "https://media.licdn.com/dms/image/v2/D4D03AQGhbMlU9NHkIw/profile-displayphoto-scale_200_200/B4DZhCvZGFHsAY-/0/1753466378163?e=1759363200&v=beta&t=ct52z0cpwLMmdY27KiSakbTi2F910elqZq7cERbCzzM",
    },
    {
      name: "Sachin Yadav",
      role: "Senior Developer",
      bio: "Website & Technology Head with expertise in driving digital strategy, managing tech operations, and building impactful online solutions.",
      avatar: "https://media.licdn.com/dms/image/v2/D5603AQFKXDhaoYscfQ/profile-displayphoto-scale_200_200/B56ZjuuXfhHMAY-/0/1756351792029?e=1759363200&v=beta&t=0AiquolGjmtLQ0UgY3ZUlBU1nr7koD69TweEnpbMaHI",
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for the highest quality in legal education and content creation.",
    },
    {
      icon: Heart,
      title: "Accessibility",
      description: "Making legal knowledge accessible to everyone, regardless of background.",
    },
    {
      icon: Globe,
      title: "Innovation",
      description: "Leveraging technology to transform legal education and career development.",
    },
  ]

  const stats = [
    { label: "Students Helped", value: "500+", icon: Users },
    { label: "Articles Published", value: "100+", icon: BookOpen },
    { label: "Years of Experience", value: "1+", icon: Award },
    { label: "Success Stories", value: "10+", icon: Target },
  ]

  return (
    <>
      <main id="main-content">
        {/* Hero Section */}
        <Section spacing="lg" className="bg-gradient-to-br from-primary/5 to-accent/5">
          <Container>
            <div className="text-center">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">Empowering Legal Minds</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                We're on a mission to democratize legal education and create opportunities for the next generation of
                legal professionals in India.
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="flex justify-center mb-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Mission Section */}
        <Section spacing="lg">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  We believe that quality legal education should be accessible to everyone. Our platform bridges the gap
                  between traditional legal education and the evolving needs of modern legal professionals.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  Through comprehensive articles, career guidance, and job opportunities, we're building India's largest
                  community of legal professionals and students.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Legal Education</Badge>
                  <Badge variant="secondary">Career Development</Badge>
                  <Badge variant="secondary">Professional Network</Badge>
                </div>
              </div>
              <div className="relative">
                <img src="https://www.thestatesman.com/wp-content/uploads/2022/09/03_Merged.jpg" alt="Legal education" className="rounded-2xl shadow-lg" />
              </div>
            </div>
          </Container>
        </Section>

        {/* Values Section */}
        <Section spacing="lg" className="bg-muted/20">
          <Container>
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do and shape our commitment to the legal community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value) => (
                <Card key={value.title} className="text-center p-6">
                  <CardContent className="pt-6">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* Team Section */}
        <Section spacing="lg">
          <Container>
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experienced legal professionals and educators dedicated to your success.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member) => (
                <Card key={member.name} className="text-center">
                  <CardContent className="pt-8 pb-6">
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-1">{member.name}</h3>
                    <p className="text-primary font-semibold mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* Story Section */}
        <Section spacing="lg" className="bg-muted/20">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-6">
                  Founded in 2025 by a passionate legal practitioners, our platform began as a
                  simple blog sharing legal insights and career advice.
                  India's most trusted resource for legal education and career development.
                </p>
                <p className="mb-6">
                  We've help law students navigate their academic journey, assisted
                  professionals in advancing their careers, and connected talented individuals with leading law firms
                  and organizations across the country.
                </p>
                <p>
                  Today, we continue to innovate and expand our offerings, always keeping our core mission at heart:
                  making quality legal education accessible to all and empowering the next generation of legal leaders.
                </p>
              </div>
            </div>
          </Container>
        </Section>
      </main>
    </>
  )
}
