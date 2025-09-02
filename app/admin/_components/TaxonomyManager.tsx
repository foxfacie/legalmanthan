"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit, Trash2, Save, X } from "lucide-react"
import { slugify } from "@/lib/utils"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  order: number
}

interface Tag {
  id: string
  name: string
  slug: string
}

export function TaxonomyManager() {
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    order: 0,
  })
  const [isEditingCategory, setIsEditingCategory] = useState(false)

  // Tag form state
  const [tagForm, setTagForm] = useState({
    id: "",
    name: "",
    slug: "",
  })
  const [isEditingTag, setIsEditingTag] = useState(false)

  useEffect(() => {
    fetchTaxonomy()
  }, [])

  const fetchTaxonomy = async () => {
    try {
      const [categoriesRes, tagsRes] = await Promise.all([fetch("/api/admin/categories"), fetch("/api/admin/tags")])

      if (categoriesRes.ok) setCategories(await categoriesRes.json())
      if (tagsRes.ok) setTags(await tagsRes.json())
    } catch (error) {
      console.error("Failed to fetch taxonomy:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryForm.name.trim()) return

    try {
      const categoryData = {
        ...categoryForm,
        slug: categoryForm.slug || slugify(categoryForm.name),
        order: categoryForm.order || categories.length + 1,
      }

      const response = await fetch("/api/admin/categories", {
        method: isEditingCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      })

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Category ${isEditingCategory ? "updated" : "created"} successfully!`,
        })
        fetchTaxonomy()
        resetCategoryForm()
      } else {
        setMessage({ type: "error", text: "Failed to save category." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while saving." })
    }
  }

  const handleTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tagForm.name.trim()) return

    try {
      const tagData = {
        ...tagForm,
        slug: tagForm.slug || slugify(tagForm.name),
      }

      const response = await fetch("/api/admin/tags", {
        method: isEditingTag ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tagData),
      })

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Tag ${isEditingTag ? "updated" : "created"} successfully!`,
        })
        fetchTaxonomy()
        resetTagForm()
      } else {
        setMessage({ type: "error", text: "Failed to save tag." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while saving." })
    }
  }

  const editCategory = (category: Category) => {
    setCategoryForm(category)
    setIsEditingCategory(true)
  }

  const editTag = (tag: Tag) => {
    setTagForm(tag)
    setIsEditingTag(true)
  }

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Category deleted successfully!" })
        fetchTaxonomy()
      } else {
        setMessage({ type: "error", text: "Failed to delete category." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while deleting." })
    }
  }

  const deleteTag = async (tagId: string) => {
    if (!confirm("Are you sure you want to delete this tag?")) return

    try {
      const response = await fetch(`/api/admin/tags/${tagId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Tag deleted successfully!" })
        fetchTaxonomy()
      } else {
        setMessage({ type: "error", text: "Failed to delete tag." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while deleting." })
    }
  }

  const resetCategoryForm = () => {
    setCategoryForm({ id: "", name: "", slug: "", description: "", order: 0 })
    setIsEditingCategory(false)
  }

  const resetTagForm = () => {
    setTagForm({ id: "", name: "", slug: "" })
    setIsEditingTag(false)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-muted rounded"></div>
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
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Form */}
            <Card>
              <CardHeader>
                <CardTitle>{isEditingCategory ? "Edit Category" : "Add New Category"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">Name *</Label>
                    <Input
                      id="categoryName"
                      value={categoryForm.name}
                      onChange={(e) => {
                        setCategoryForm({
                          ...categoryForm,
                          name: e.target.value,
                          slug: e.target.value ? slugify(e.target.value) : "",
                        })
                      }}
                      placeholder="Category name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categorySlug">Slug</Label>
                    <Input
                      id="categorySlug"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                      placeholder="category-slug"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryDescription">Description</Label>
                    <Textarea
                      id="categoryDescription"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      placeholder="Brief description of the category"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoryOrder">Order</Label>
                    <Input
                      id="categoryOrder"
                      type="number"
                      value={categoryForm.order}
                      onChange={(e) =>
                        setCategoryForm({ ...categoryForm, order: Number.parseInt(e.target.value) || 0 })
                      }
                      placeholder="Display order"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {isEditingCategory ? "Update" : "Create"}
                    </Button>
                    {isEditingCategory && (
                      <Button type="button" variant="outline" onClick={resetCategoryForm}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Categories List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Categories ({categories.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories
                    .sort((a, b) => a.order - b.order)
                    .map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">/{category.slug}</div>
                          {category.description && (
                            <div className="text-sm text-muted-foreground mt-1">{category.description}</div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{category.order}</Badge>
                          <Button size="sm" variant="ghost" onClick={() => editCategory(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteCategory(category.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  {categories.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">No categories found.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tags" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tag Form */}
            <Card>
              <CardHeader>
                <CardTitle>{isEditingTag ? "Edit Tag" : "Add New Tag"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTagSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tagName">Name *</Label>
                    <Input
                      id="tagName"
                      value={tagForm.name}
                      onChange={(e) => {
                        setTagForm({
                          ...tagForm,
                          name: e.target.value,
                          slug: e.target.value ? slugify(e.target.value) : "",
                        })
                      }}
                      placeholder="Tag name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagSlug">Slug</Label>
                    <Input
                      id="tagSlug"
                      value={tagForm.slug}
                      onChange={(e) => setTagForm({ ...tagForm, slug: e.target.value })}
                      placeholder="tag-slug"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      {isEditingTag ? "Update" : "Create"}
                    </Button>
                    {isEditingTag && (
                      <Button type="button" variant="outline" onClick={resetTagForm}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Tags List */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Tags ({tags.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-1 bg-muted/50 rounded-lg p-2">
                      <Badge variant="outline">{tag.name}</Badge>
                      <Button size="sm" variant="ghost" onClick={() => editTag(tag)} className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTag(tag.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  {tags.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground w-full">No tags found.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
