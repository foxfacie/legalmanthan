import { Container } from "../_components/Container"
import { Section } from "../_components/Section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedCard } from "@/components/ui/animated-card"
import { MagneticButton } from "@/components/ui/magnetic-button"
import { TextReveal } from "@/components/ui/text-reveal"
import { GradientBorder } from "@/components/ui/gradient-border"
import { LoadingSpinner, LoadingDots } from "@/components/ui/loading-spinner"
import { ParallaxSection } from "@/components/ui/parallax-section"
import { Play, Sparkles, Zap, Palette, Code, Eye } from "lucide-react"
import { generateMetadata as generateSEOMetadata } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = generateSEOMetadata({
  title: "UI Components Demo - Interactive Showcase",
  description: "Explore our premium animated UI components and interactive elements in action.",
  url: "/demo",
})

export default function DemoPage() {
  const components = [
    {
      title: "Animated Cards",
      description: "Smooth entrance animations with intersection observer",
      icon: Sparkles,
      demo: "animated-cards"
    },
    {
      title: "Magnetic Buttons", 
      description: "Interactive buttons that respond to mouse movement",
      icon: Zap,
      demo: "magnetic-buttons"
    },
    {
      title: "Text Reveal",
      description: "Staggered word animations for engaging typography",
      icon: Eye,
      demo: "text-reveal"
    },
    {
      title: "Gradient Borders",
      description: "Animated gradient borders with glass morphism",
      icon: Palette,
      demo: "gradient-borders"
    },
    {
      title: "Loading States",
      description: "Elegant loading spinners and animated dots",
      icon: Code,
      demo: "loading-states"
    },
    {
      title: "Parallax Effects",
      description: "Smooth parallax scrolling for depth and motion",
      icon: Play,
      demo: "parallax"
    }
  ]

  return (
    <>
      <main id="main-content">
        {/* Hero Section */}
        <ParallaxSection speed={0.3}>
          <Section spacing="lg" className="bg-gradient-to-br from-primary/10 to-accent/10">
            <Container>
              <AnimatedCard className="text-center">
                <TextReveal className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  UI Components Demo
                </TextReveal>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                  Experience our premium animated components and interactive elements. Each component is designed 
                  for performance, accessibility, and visual appeal.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <MagneticButton>Explore Components</MagneticButton>
                  <Button variant="outline" size="lg" className="hover-glow">
                    View Source Code
                  </Button>
                </div>
              </AnimatedCard>
            </Container>
          </Section>
        </ParallaxSection>

        {/* Components Grid */}
        <Section spacing="lg">
          <Container>
            <AnimatedCard className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Interactive Components</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hover, click, and scroll to see these components in action
              </p>
            </AnimatedCard>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {components.map((component, index) => (
                <AnimatedCard key={component.title} delay={index * 0.1} className="hover-lift">
                  <GradientBorder>
                    <Card className="h-full glass-card">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <component.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="gradient-text">{component.title}</CardTitle>
                            <Badge variant="secondary" className="mt-1">Interactive</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{component.description}</p>
                        <MagneticButton strength={0.2} className="w-full">
                          Try Component
                        </MagneticButton>
                      </CardContent>
                    </Card>
                  </GradientBorder>
                </AnimatedCard>
              ))}
            </div>
          </Container>
        </Section>

        {/* Animated Cards Demo */}
        <Section spacing="lg" className="bg-muted/20">
          <Container>
            <AnimatedCard className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Animated Cards in Action</h2>
              <p className="text-lg text-muted-foreground">
                Watch as cards animate into view with staggered timing
              </p>
            </AnimatedCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <AnimatedCard 
                  key={item} 
                  delay={index * 0.15} 
                  direction={index % 2 === 0 ? "up" : "down"}
                  className="hover-lift"
                >
                  <Card className="glass-card">
                    <CardContent className="p-6 text-center">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{item}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">Demo Card {item}</h3>
                      <p className="text-muted-foreground text-sm">
                        This card animates in with a {index % 2 === 0 ? "upward" : "downward"} motion
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              ))}
            </div>
          </Container>
        </Section>

        {/* Text Reveal Demo */}
        <ParallaxSection speed={0.2}>
          <Section spacing="lg">
            <Container>
              <div className="text-center">
                <TextReveal className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Beautiful Typography Animations
                </TextReveal>
                <TextReveal 
                  className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" 
                  delay={0.5}
                >
                  Each word appears with a smooth staggered animation creating an engaging reading experience that captures attention and guides the eye naturally through the content
                </TextReveal>
              </div>
            </Container>
          </Section>
        </ParallaxSection>

        {/* Loading States Demo */}
        <Section spacing="lg" className="bg-muted/20">
          <Container>
            <AnimatedCard className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Loading States</h2>
              <p className="text-lg text-muted-foreground">
                Elegant loading indicators for better user experience
              </p>
            </AnimatedCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="glass-card p-8 text-center">
                <h3 className="font-semibold mb-4">Spinner - Small</h3>
                <LoadingSpinner size="sm" />
              </Card>
              
              <Card className="glass-card p-8 text-center">
                <h3 className="font-semibold mb-4">Spinner - Medium</h3>
                <LoadingSpinner size="md" />
              </Card>
              
              <Card className="glass-card p-8 text-center">
                <h3 className="font-semibold mb-4">Animated Dots</h3>
                <LoadingDots />
              </Card>
            </div>
          </Container>
        </Section>

        {/* Magnetic Buttons Demo */}
        <Section spacing="lg">
          <Container>
            <AnimatedCard className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Magnetic Interactions</h2>
              <p className="text-lg text-muted-foreground">
                Buttons that respond to your mouse movement with smooth physics
              </p>
            </AnimatedCard>

            <div className="flex flex-wrap justify-center gap-6">
              <MagneticButton strength={0.3}>
                Default Strength
              </MagneticButton>
              
              <MagneticButton strength={0.5} className="bg-accent hover:bg-accent/90">
                Strong Magnetic
              </MagneticButton>
              
              <MagneticButton strength={0.1} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                Subtle Effect
              </MagneticButton>
            </div>
          </Container>
        </Section>

        {/* Call to Action */}
        <ParallaxSection speed={0.1}>
          <Section spacing="lg" className="bg-gradient-to-r from-primary/10 to-accent/10">
            <Container>
              <AnimatedCard>
                <GradientBorder className="glass-card">
                  <Card className="border-0 bg-transparent">
                    <CardContent className="p-12 text-center">
                      <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
                        Ready to Enhance Your UI?
                      </h2>
                      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        These components are built with performance, accessibility, and developer experience in mind. 
                        Start building beautiful interfaces today.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <MagneticButton>Get Started</MagneticButton>
                        <Button variant="outline" size="lg" className="hover-glow">
                          Documentation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </GradientBorder>
              </AnimatedCard>
            </Container>
          </Section>
        </ParallaxSection>
      </main>
    </>
  )
}