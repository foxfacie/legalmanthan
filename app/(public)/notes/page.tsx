import { Container } from "../_components/Container"
import { Section } from "../_components/Section"
import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, FileText, Scale, Gavel } from "lucide-react"
import Link from "next/link"
import { getAllNotes, getNotesByCategory } from "@/lib/content/loader"
import { generateMetadata as generateSEOMetadata, formatDate } from "@/lib/utils"
import { NotesListing } from "../_components/NotesListing"
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: "Law Notes & Acts - Comprehensive Legal Resources",
  description: "Access comprehensive law notes, acts, and legal resources for students and professionals.",
  url: "/notes",
})

export default function NotesPage() {
  const allNotes = getAllNotes()
  const constitutionalNotes = getNotesByCategory("constitutional-law").slice(0, 4)
  const criminalNotes = getNotesByCategory("criminal-law").slice(0, 4)
  const corporateNotes = getNotesByCategory("corporate-law").slice(0, 4)

  const categories = [
    { name: "Constitutional Law", slug: "constitutional-law", icon: Scale, count: constitutionalNotes.length },
    { name: "Criminal Law", slug: "criminal-law", icon: Gavel, count: criminalNotes.length },
    { name: "Corporate Law", slug: "corporate-law", icon: FileText, count: corporateNotes.length },
    { name: "Civil Law", slug: "civil-law", icon: BookOpen, count: 12 },
    { name: "Tax Law", slug: "tax-law", icon: FileText, count: 8 },
    { name: "Labour Law", slug: "labour-law", icon: Scale, count: 15 },
  ]

  return (
    <>
      <main id="main-content">
        {/* Hero Section */}
        <Section spacing="lg" className="bg-gradient-to-br from-primary/5 to-accent/5">
          <Container>
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">Law Notes & Legal Acts</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Comprehensive collection of law notes, acts, and legal resources for students, professionals, and
                researchers.
              </p>
            </div>
          </Container>
        </Section>



        {/* All Notes with Load More */}
        <Section spacing="lg" className="bg-muted/20">
          <Container>
            <NotesListing notes={allNotes} initialLimit={9} />
          </Container>
        </Section>

        {/* Quick Access */}
        <Section spacing="lg">
          <Container>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold mb-2">Indian Constitution</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete text and analysis of the Indian Constitution with amendments.
                  </p>
                  <Button>Access Now</Button>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-center">
                  <Gavel className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-bold mb-2">Indian Penal Code</h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive coverage of IPC sections with case laws and examples.
                  </p>
                  <Button>Access Now</Button>
                </div>
              </Card>
            </div>
          </Container>
        </Section>
      </main>
    </>
  )
}
