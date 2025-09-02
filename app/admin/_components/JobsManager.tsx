"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Save, X, Building, MapPin, Clock } from "lucide-react"
import { slugify, formatDate } from "@/lib/utils"

interface Job {
  id: string
  title: string
  slug: string
  companyName: string
  companyWebsite?: string
  location: string
  workMode: "on-site" | "hybrid" | "remote"
  experienceMin?: number
  experienceMax?: number
  salaryMin?: number
  salaryMax?: number
  practiceAreas: string[]
  description: string
  applyUrl?: string
  applyEmail?: string
  deadlineAt?: string
  postedAt: string
  isFeatured: boolean
  status: "draft" | "published" | "expired"
}

const practiceAreaOptions = [
  "corporate-law",
  "litigation",
  "intellectual-property",
  "tax-law",
  "employment-law",
  "real-estate",
  "family-law",
  "criminal-law",
  "environmental-law",
  "healthcare-law",
]

export function JobsManager() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [jobForm, setJobForm] = useState<Partial<Job>>({
    title: "",
    slug: "",
    companyName: "",
    companyWebsite: "",
    location: "",
    workMode: "hybrid",
    experienceMin: undefined,
    experienceMax: undefined,
    salaryMin: undefined,
    salaryMax: undefined,
    practiceAreas: [],
    description: "",
    applyUrl: "",
    applyEmail: "",
    deadlineAt: "",
    isFeatured: false,
    status: "published",
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    if (jobForm.title && !isEditing) {
      setJobForm((prev) => ({ ...prev, slug: slugify(jobForm.title || "") }))
    }
  }, [jobForm.title, isEditing])

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/admin/jobs")
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobForm.title?.trim() || !jobForm.companyName?.trim()) {
      setMessage({ type: "error", text: "Title and company name are required." })
      return
    }

    try {
      const jobData = {
        ...jobForm,
        slug: jobForm.slug || slugify(jobForm.title || ""),
        postedAt: jobForm.postedAt || new Date().toISOString(),
      }

      const response = await fetch("/api/admin/jobs", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      })

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Job ${isEditing ? "updated" : "created"} successfully!`,
        })
        fetchJobs()
        resetForm()
      } else {
        setMessage({ type: "error", text: "Failed to save job." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while saving." })
    }
  }

  const editJob = (job: Job) => {
    setJobForm(job)
    setIsEditing(true)
  }

  const deleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return

    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Job deleted successfully!" })
        fetchJobs()
      } else {
        setMessage({ type: "error", text: "Failed to delete job." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while deleting." })
    }
  }

  const resetForm = () => {
    setJobForm({
      title: "",
      slug: "",
      companyName: "",
      companyWebsite: "",
      location: "",
      workMode: "hybrid",
      experienceMin: undefined,
      experienceMax: undefined,
      salaryMin: undefined,
      salaryMax: undefined,
      practiceAreas: [],
      description: "",
      applyUrl: "",
      applyEmail: "",
      deadlineAt: "",
      isFeatured: false,
      status: "published",
    })
    setIsEditing(false)
  }

  const addPracticeArea = (area: string) => {
    if (!jobForm.practiceAreas?.includes(area)) {
      setJobForm((prev) => ({
        ...prev,
        practiceAreas: [...(prev.practiceAreas || []), area],
      }))
    }
  }

  const removePracticeArea = (area: string) => {
    setJobForm((prev) => ({
      ...prev,
      practiceAreas: prev.practiceAreas?.filter((a) => a !== area) || [],
    }))
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      published: "default",
      draft: "secondary",
      expired: "outline",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"} className="capitalize">
        {status}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Job" : "Create New Job"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={jobForm.title || ""}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="Senior Corporate Lawyer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobSlug">Slug</Label>
                  <Input
                    id="jobSlug"
                    value={jobForm.slug || ""}
                    onChange={(e) => setJobForm({ ...jobForm, slug: e.target.value })}
                    placeholder="senior-corporate-lawyer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={jobForm.companyName || ""}
                    onChange={(e) => setJobForm({ ...jobForm, companyName: e.target.value })}
                    placeholder="Apex Legal Solutions"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    value={jobForm.companyWebsite || ""}
                    onChange={(e) => setJobForm({ ...jobForm, companyWebsite: e.target.value })}
                    placeholder="https://company.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={jobForm.location || ""}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="Mumbai, Maharashtra"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workMode">Work Mode</Label>
                  <Select
                    value={jobForm.workMode || "hybrid"}
                    onValueChange={(value: "on-site" | "hybrid" | "remote") =>
                      setJobForm({ ...jobForm, workMode: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-site">On-site</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="expMin">Min Experience</Label>
                    <Input
                      id="expMin"
                      type="number"
                      value={jobForm.experienceMin || ""}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, experienceMin: Number.parseInt(e.target.value) || undefined })
                      }
                      placeholder="5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expMax">Max Experience</Label>
                    <Input
                      id="expMax"
                      type="number"
                      value={jobForm.experienceMax || ""}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, experienceMax: Number.parseInt(e.target.value) || undefined })
                      }
                      placeholder="8"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin">Min Salary (₹)</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      value={jobForm.salaryMin || ""}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, salaryMin: Number.parseInt(e.target.value) || undefined })
                      }
                      placeholder="1200000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryMax">Max Salary (₹)</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      value={jobForm.salaryMax || ""}
                      onChange={(e) =>
                        setJobForm({ ...jobForm, salaryMax: Number.parseInt(e.target.value) || undefined })
                      }
                      placeholder="2000000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Practice Areas</Label>
                  <Select onValueChange={addPracticeArea}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add practice area..." />
                    </SelectTrigger>
                    <SelectContent>
                      {practiceAreaOptions
                        .filter((area) => !jobForm.practiceAreas?.includes(area))
                        .map((area) => (
                          <SelectItem key={area} value={area}>
                            {area.replace("-", " ").toUpperCase()}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {jobForm.practiceAreas?.map((area) => (
                      <Badge key={area} variant="secondary" className="flex items-center space-x-1">
                        <span>{area.replace("-", " ").toUpperCase()}</span>
                        <button onClick={() => removePracticeArea(area)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    value={jobForm.description || ""}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    placeholder="Detailed job description..."
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applyUrl">Apply URL</Label>
                  <Input
                    id="applyUrl"
                    value={jobForm.applyUrl || ""}
                    onChange={(e) => setJobForm({ ...jobForm, applyUrl: e.target.value })}
                    placeholder="https://company.com/apply"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applyEmail">Apply Email</Label>
                  <Input
                    id="applyEmail"
                    type="email"
                    value={jobForm.applyEmail || ""}
                    onChange={(e) => setJobForm({ ...jobForm, applyEmail: e.target.value })}
                    placeholder="careers@company.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Application Deadline</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={jobForm.deadlineAt || ""}
                    onChange={(e) => setJobForm({ ...jobForm, deadlineAt: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={jobForm.isFeatured || false}
                    onCheckedChange={(checked) => setJobForm({ ...jobForm, isFeatured: checked })}
                  />
                  <Label htmlFor="featured">Featured Job</Label>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={jobForm.status || "published"}
                    onValueChange={(value: "draft" | "published" | "expired") =>
                      setJobForm({ ...jobForm, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? "Update" : "Create"}
                  </Button>
                  {isEditing && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Jobs List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Listings ({jobs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{job.title}</div>
                            <div className="flex items-center space-x-2">
                              {job.isFeatured && <Badge variant="secondary">Featured</Badge>}
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{job.workMode.replace("-", " ")}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{job.companyName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{getStatusBadge(job.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(new Date(job.postedAt))}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button size="sm" variant="ghost" onClick={() => editJob(job)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteJob(job.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {jobs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No jobs found. Create your first job listing!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
