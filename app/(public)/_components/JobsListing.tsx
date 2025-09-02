"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Building, DollarSign } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import type { Job } from "@/lib/content/types"

interface JobsListingProps {
  jobs: Job[]
  initialLimit?: number
}

export function JobsListing({ jobs, initialLimit = 12 }: JobsListingProps) {
  const [displayLimit, setDisplayLimit] = useState(initialLimit)
  const [sortBy, setSortBy] = useState("newest")

  const sortedJobs = useMemo(() => {
    let sorted = [...jobs]
    
    switch (sortBy) {
      case "salary":
        sorted = sorted.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0))
        break
      case "company":
        sorted = sorted.sort((a, b) => a.companyName.localeCompare(b.companyName))
        break
      case "location":
        sorted = sorted.sort((a, b) => a.location.localeCompare(b.location))
        break
      case "newest":
      default:
        sorted = sorted.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())
        break
    }
    
    return sorted
  }, [jobs, sortBy])

  const displayedJobs = sortedJobs.slice(0, displayLimit)
  const hasMoreJobs = displayLimit < sortedJobs.length

  const loadMore = () => {
    setDisplayLimit(prev => Math.min(prev + initialLimit, sortedJobs.length))
  }

  const formatSalary = (job: Job) => {
    if (job.salaryMin && job.salaryMax) {
      return `₹${(job.salaryMin / 100000).toFixed(0)}-${(job.salaryMax / 100000).toFixed(0)}L`
    }
    if (job.salaryMin) {
      return `₹${(job.salaryMin / 100000).toFixed(0)}L+`
    }
    return "Competitive"
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
          Available Positions ({sortedJobs.length})
        </h2>
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36 sm:w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Latest First</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {displayedJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-all duration-300 group">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Link 
                    href={`/jobs/${job.slug}`}
                    className="group-hover:text-primary transition-colors"
                  >
                    <h3 className="font-semibold text-base md:text-lg mb-1 group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                  </Link>
                  <p className="text-primary font-medium flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {job.companyName}
                  </p>
                </div>
                {job.isFeatured && (
                  <Badge variant="default" className="ml-4">
                    Featured
                  </Badge>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                    <span>{formatSalary(job)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant={job.workMode === "remote" ? "default" : "outline"}
                    className="text-xs"
                  >
                    {job.workMode.charAt(0).toUpperCase() + job.workMode.slice(1)}
                  </Badge>
                  {job.practiceAreas?.slice(0, 2).map((area) => (
                    <Badge key={area} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Posted {formatDate(job.postedAt)}</span>
                </div>
                {job.deadlineAt && (
                  <span>
                    Deadline: {formatDate(job.deadlineAt)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMoreJobs && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" onClick={loadMore}>
            Load More Jobs ({sortedJobs.length - displayLimit} remaining)
          </Button>
        </div>
      )}
    </>
  )
}
