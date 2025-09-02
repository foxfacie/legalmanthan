import { Container } from "../_components/Container"
import { Section } from "../_components/Section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, Briefcase, Building, Star } from "lucide-react"
import Link from "next/link"
import { getActiveJobs, getFeaturedJobs } from "@/lib/content/loader"
import { formatDate } from "@/lib/utils"
import { JobsListing } from "../_components/JobsListing"

export default function JobsPage() {
  const featuredJobs = getFeaturedJobs()
  const allJobs = getActiveJobs()

  return (
    <>
      <main id="main-content">
        {/* Hero Section */}
        <Section spacing="lg" className="bg-gradient-to-br from-primary/5 to-accent/5">
          <Container>
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Legal Career Opportunities
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Discover your next career move with premium legal positions from top law firms, corporations, and legal
                organizations across India.
              </p>

            </div>
          </Container>
        </Section>

        {/* Featured Jobs */}
        {featuredJobs.length > 0 && (
          <Section spacing="lg">
            <Container>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-3xl font-bold text-foreground">Featured Opportunities</h2>
                <Badge variant="secondary">Premium Listings</Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredJobs.map((job) => (
                  <Card key={job.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="group-hover:text-primary transition-colors">
                            <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{job.companyName}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-amber-500 fill-current" />
                          <Badge variant="secondary">Featured</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Briefcase className="h-4 w-4" />
                            <span className="capitalize">{job.workMode.replace("-", " ")}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(job.postedAt)}</span>
                          </div>
                        </div>

                        {job.salaryMin && job.salaryMax && (
                          <div className="text-lg font-semibold text-foreground">
                            ₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L per annum
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {job.practiceAreas.slice(0, 3).map((area) => (
                            <Badge key={area} variant="outline" className="text-xs">
                              {area.replace("-", " ").toUpperCase()}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <div className="text-sm text-muted-foreground">
                            {job.experienceMin && job.experienceMax && (
                              <span>
                                {job.experienceMin}-{job.experienceMax} years experience
                              </span>
                            )}
                          </div>
                          <Button asChild>
                            <Link href={`/jobs/${job.slug}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Container>
          </Section>
        )}

        {/* All Jobs with Load More */}
        <Section spacing="lg" className="bg-muted/20">
          <Container>
            <JobsListing jobs={allJobs} initialLimit={10} />
          </Container>
        </Section>
      </main>
    </>
  )
}
