"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Send, X, Upload } from "lucide-react"
import { slugify } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}



interface WriteEditorProps {
  editSlug?: string
  onEditComplete?: () => void
}

export function WriteEditor({ editSlug, onEditComplete }: WriteEditorProps = {}) {
  const [contentType, setContentType] = useState<"post" | "note" | "act" | "job">("post")
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [authorName, setAuthorName] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [isEditorPick, setIsEditorPick] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingContent, setIsLoadingContent] = useState(!!editSlug)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isEditMode, setIsEditMode] = useState(!!editSlug)

  // Job-specific fields
  const [formData, setFormData] = useState<any>({
    location: "",
    jobType: "",
    experience: "",
    salary: "",
    remote: false,
    urgent: false
  })

  // Metadata
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    fetchMetadata()
    if (editSlug) {
      loadContentForEdit(editSlug)
    }
  }, [editSlug])

  useEffect(() => {
    if (title && !slug) {
      setSlug(slugify(title))
    }
  }, [title, slug])

  const fetchMetadata = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/tags"),
      ])

      if (categoriesRes.ok) setCategories(await categoriesRes.json())
      if (tagsRes.ok) setTags(await tagsRes.json())
    } catch (error) {
      console.error("Failed to fetch metadata:", error)
    }
  }

  const loadContentForEdit = async (contentSlug: string) => {
    setIsLoadingContent(true)
    console.log("Loading content for edit:", contentSlug)
    try {
      const response = await fetch(`/api/admin/content/${contentSlug}/edit`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
      console.log("Edit API response status:", response.status)
      
      if (response.ok) {
        const result = await response.json()
        console.log("Edit API result:", result)
        const data = result.data
        
        // Populate form with existing data
        setContentType(data.type)
        setTitle(data.title)
        setSlug(data.slug)
        setExcerpt(data.excerpt)
        setContent(data.content)
        setCoverImage(data.coverImage || "")
        setSelectedCategories(data.categories || [])
        setSelectedTags(data.tags || [])
        setAuthorName(data.author || "")
        setIsFeatured(data.isFeatured || false)
        setIsEditorPick(data.isEditorPick || false)
        
        // Job-specific fields
        if (data.type === "job") {
          setFormData({
            location: data.location || "",
            workMode: data.workMode || "on-site",
            salaryMin: data.salaryMin || "",
            salaryMax: data.salaryMax || "",
            practiceAreas: data.practiceAreas || [],
            companyWebsite: data.companyWebsite || "",
            applyUrl: data.applyUrl || "",
            applyEmail: data.applyEmail || "",
            deadlineAt: data.deadlineAt || "",
          })
        }
        
        setMessage({ type: "success", text: "Content loaded for editing" })
      } else {
        const errorText = await response.text()
        console.error("Edit API error:", errorText)
        setMessage({ type: "error", text: "Failed to load content for editing" })
      }
    } catch (error) {
      console.error("Failed to load content:", error)
      setMessage({ type: "error", text: "Error loading content" })
    } finally {
      setIsLoadingContent(false)
    }
  }

  const handleSave = async (saveStatus: "draft" | "published") => {
    if (!title.trim() || !content.trim()) {
      setMessage({ type: "error", text: "Title and content are required." })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const postData = {
        type: contentType,
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        excerpt: excerpt.trim(),
        content: content.trim(),
        coverImage: coverImage.trim(),
        categories: selectedCategories,
        tags: selectedTags,
        author: authorName.trim() || "Editorial Team",
        isFeatured,
        isEditorPick,
        status: saveStatus,
        isEdit: isEditMode,
        originalSlug: editSlug,
        // Job-specific fields
        ...(contentType === "job" && {
          location: formData.location,
          workMode: formData.workMode,
          salaryMin: formData.salaryMin,
          salaryMax: formData.salaryMax,
          practiceAreas: formData.practiceAreas,
          companyWebsite: formData.companyWebsite,
          applyUrl: formData.applyUrl,
          applyEmail: formData.applyEmail,
          deadlineAt: formData.deadlineAt,
        }),
      }

      console.log("Saving content with data:", postData)
      
      const response = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })
      
      console.log("Save API response status:", response.status)

      if (response.ok) {
        const result = await response.json()
        setMessage({
          type: "success",
          text: result.message || `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} ${saveStatus === "published" ? "published" : "saved"} successfully!`,
        })

        if (saveStatus === "published") {
          // For editing, call the completion callback after a short delay
          if (isEditMode && onEditComplete) {
            setTimeout(() => {
              onEditComplete()
            }, 1500)
          } else {
            // Force immediate refresh to show updated content for new posts
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          }
        } else if (!isEditMode) {
          // Reset form after saving draft (only for new content)
          setTimeout(() => {
            resetForm()
          }, 2000)
        } else if (isEditMode && onEditComplete) {
          // For draft edits, also call completion callback
          setTimeout(() => {
            onEditComplete()
          }, 1500)
        }
      } else {
        let errorMessage = "Failed to save content."
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.details || errorMessage
          if (errorData.details) {
            errorMessage += `: ${errorData.details}`
          }
        } catch {
          // If JSON parsing fails, try text
          try {
            const errorText = await response.text()
            errorMessage = errorText || errorMessage
          } catch {
            // Keep default error message
          }
        }
        setMessage({ type: "error", text: errorMessage })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while saving." })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setSlug("")
    setExcerpt("")
    setContent("")
    setCoverImage("")
    setSelectedCategories([])
    setSelectedTags([])
    setAuthorName("")
    setIsFeatured(false)
    setIsEditorPick(false)
    setFormData({
      location: "",
      workMode: "on-site",
      salaryMin: "",
      salaryMax: "",
      practiceAreas: [],
      companyWebsite: "",
      applyUrl: "",
      applyEmail: "",
      deadlineAt: "",
    })
    setMessage(null)
    setIsEditMode(false)
  }

  const addCategory = (categoryId: string) => {
    if (!selectedCategories.includes(categoryId)) {
      setSelectedCategories([...selectedCategories, categoryId])
    }
  }

  const removeCategory = (categoryId: string) => {
    setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
  }

  const addTag = (tagId: string) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId])
    }
  }

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId))
  }

  if (isLoadingContent) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={`skeleton-${i}`} className="h-12 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Content Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? `Edit ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}` : "Create New Content"}</CardTitle>
          {isEditMode && (
            <p className="text-sm text-muted-foreground">Editing: {title || editSlug}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={contentType === "post" ? "default" : "outline"} 
              onClick={() => setContentType("post")}
              disabled={isEditMode}
            >
              Article/Blog
            </Button>
            <Button 
              variant={contentType === "note" ? "default" : "outline"} 
              onClick={() => setContentType("note")}
              disabled={isEditMode}
            >
              Law Note
            </Button>
            <Button 
              variant={contentType === "act" ? "default" : "outline"} 
              onClick={() => setContentType("act")}
              disabled={isEditMode}
            >
              Legal Act
            </Button>
            <Button 
              variant={contentType === "job" ? "default" : "outline"} 
              onClick={() => setContentType("job")}
              disabled={isEditMode}
            >
              Job Posting
            </Button>
          </div>
          {isEditMode && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Edit Mode:</strong> You are currently editing existing content. Content type cannot be changed during editing.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter the title..."
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-from-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">
                  {contentType === "job" ? "Job Summary *" : "Excerpt *"}
                </Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder={
                    contentType === "job"
                      ? "Brief job description and key requirements..."
                      : "Brief description (160-200 characters)..."
                  }
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">{excerpt.length}/200 characters</p>
              </div>

              {contentType === "job" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location || ""}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., Mumbai, Remote, Hybrid"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jobType">Job Type</Label>
                      <Input
                        id="jobType"
                        value={formData.jobType || ""}
                        onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                        placeholder="e.g., Full-time, Part-time, Contract"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience Level</Label>
                      <Input
                        id="experience"
                        value={formData.experience || ""}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="e.g., 2-5 years, Senior Level"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input
                        id="salary"
                        value={formData.salary || ""}
                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                        placeholder="e.g., ₹8-12 LPA, Competitive"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <div className="flex space-x-2">
                  <Input
                    id="coverImage"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your content in Markdown format..."
                rows={20}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Options */}
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                <Label htmlFor="featured">Featured</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="editorPick" checked={isEditorPick} onCheckedChange={setIsEditorPick} />
                <Label htmlFor="editorPick">Editor's Pick</Label>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => handleSave("draft")} disabled={isLoading} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={() => handleSave("published")} disabled={isLoading} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Publish
                </Button>
              </div>

              {isEditMode ? (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    resetForm()
                    if (onEditComplete) onEditComplete()
                  }} 
                  className="w-full"
                >
                  Cancel Edit
                </Button>
              ) : (
                <Button variant="ghost" onClick={resetForm} className="w-full">
                  Clear Form
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={addCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Add category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((cat) => !selectedCategories.includes(cat.id))
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((categoryId) => {
                  const category = categories.find((c) => c.id === categoryId)
                  return (
                    <Badge key={categoryId} variant="secondary" className="flex items-center space-x-1">
                      <span>{category?.name}</span>
                      <button onClick={() => removeCategory(categoryId)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={addTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Add tag..." />
                </SelectTrigger>
                <SelectContent>
                  {tags
                    .filter((tag) => !selectedTags.includes(tag.id))
                    .map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId)
                  return (
                    <Badge key={tagId} variant="outline" className="flex items-center space-x-1">
                      <span>{tag?.name}</span>
                      <button onClick={() => removeTag(tagId)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Author */}
          <Card>
            <CardHeader>
              <CardTitle>Author</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="authorName">Author Name</Label>
              <Input
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Enter author name..."
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use "Editorial Team" as default
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
