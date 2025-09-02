import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Container } from "../../_components/Container"
import { Chip } from "../../_components/Chip"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Briefcase, Building, Users, DollarSign, Calendar, Share2, Bookmark, ExternalLink } from "lucide-react"
import { getJobBySlug, getJobsByCompany } from "@/lib/content/loader"
import { generateMetadata as generateSEOMetadata, generateBreadcrumbs, formatDate } from "@/lib/utils"

interface JobPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const job = getJobBySlug(params.slug)

  if (!job) {
    return {
      title: "Job Not Found",
    }
  }

  return generateSEOMetadata({
    title: `${job.title} at ${job.companyName}`,
    description: job.excerpt,
    url: `/jobs/${job.slug}`,
    type: "article",
    publishedTime: job.postedAt.toISOString(),
  })
}

export default function JobPage({ params }: JobPageProps) {
  const job = getJobBySlug(params.slug)

  if (!job) {
    notFound()
  }

  const relatedJobs = getJobsByCompany(job.companyName)
    .filter((j) => j.slug !== job.slug)
    .slice(0, 3)

  const breadcrumbs = generateBreadcrumbs(`/jobs/${job.slug}`)

  return (
    <>
      <main id="main-content">
        <Container>
          <div className="py-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Job Header */}
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    {job.isFeatured && <Badge variant="secondary">Featured</Badge>}
                    {job.isUrgent && <Badge variant="destructive">Urgent</Badge>}
                  </div>

                  <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">{job.title}</h1>

                  <div className="flex items-center space-x-2 mb-6">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-semibold text-foreground">{job.companyName}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4" />
                      <span className="capitalize">{job.workMode.replace("-", " ")}</span>
                    </div>
                    {job.experienceMin && job.experienceMax && (
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {job.experienceMin}-{job.experienceMax} years experience
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>Posted {formatDate(job.postedAt)}</span>
                    </div>
                  </div>

                  {job.salaryMin && job.salaryMax && (
                    <div className="flex items-center space-x-2 mb-6">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-xl font-semibold text-foreground">
                        ₹{(job.salaryMin / 100000).toFixed(1)}L - ₹{(job.salaryMax / 100000).toFixed(1)}L per annum
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <Button size="lg" className="px-8">
                      Apply Now
                    </Button>
                    <Button variant="outline" size="lg">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="lg">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>

                {/* Job Description */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-lg max-w-none">
                      <MDXRemote source={job.description} />
                    </div>
                  </CardContent>
                </Card>

                {/* Practice Areas */}
                {job.practiceAreas.length > 0 && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Practice Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {job.practiceAreas.map((area) => (
                          <Chip key={area} variant="secondary">
                            {area.replace("-", " ").toUpperCase()}
                          </Chip>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Apply */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Apply</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" size="lg">
                      Apply with Resume
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Company Website
                    </Button>
                    <Separator />
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-2">Application Deadline:</p>
                      <p className="font-semibold text-foreground">
{job.deadlineAt ? formatDate(job.deadlineAt) : "Not specified"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Job Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Job Type</p>
<p className="font-semibold capitalize">{(job as any).employmentType ? (job as any).employmentType.replace("-", " ") : job.workMode.replace("-", " ")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Work Mode</p>
                        <p className="font-semibold capitalize">{job.workMode.replace("-", " ")}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Experience</p>
                        <p className="font-semibold">
                          {job.experienceMin && job.experienceMax
                            ? `${job.experienceMin}-${job.experienceMax} years`
                            : "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Posted</p>
                        <p className="font-semibold">{formatDate(job.postedAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>About {job.companyName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {job.companyDescription || "Leading legal organization with a strong reputation in the industry."}
                    </p>
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Jobs at {job.companyName}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <div className="mt-16">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-8">More Jobs at {job.companyName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedJobs.map((relatedJob) => (
                    <Card key={relatedJob.id} className="group hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          <a href={`/jobs/${relatedJob.slug}`}>{relatedJob.title}</a>
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4" />
                          <span>{relatedJob.location}</span>
                        </div>
                        {relatedJob.salaryMin && relatedJob.salaryMax && (
                          <p className="text-sm font-semibold text-foreground mb-4">
                            ₹{(relatedJob.salaryMin / 100000).toFixed(1)}L - ₹
                            {(relatedJob.salaryMax / 100000).toFixed(1)}L
                          </p>
                        )}
                        <Button size="sm" className="w-full">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </main>
    </>
  )
}
