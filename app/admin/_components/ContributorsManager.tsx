"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { User, Plus, Edit, Trash2, Save } from "lucide-react"

interface Contributor {
  id: string
  displayName: string
  slug: string
  avatar?: string
  bioShort: string
  bioLong: string
  roleTitle: string
  socials?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

export function ContributorsManager() {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [editingContributor, setEditingContributor] = useState<Contributor | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Partial<Contributor>>({
    displayName: "",
    bioShort: "",
    bioLong: "",
    roleTitle: "",
    avatar: "",
    socials: {
      twitter: "",
      linkedin: "",
      website: ""
    }
  })

  useEffect(() => {
    fetchContributors()
  }, [])

  const fetchContributors = async () => {
    try {
      const response = await fetch("/api/admin/contributors")
      if (response.ok) {
        const data = await response.json()
        setContributors(data)
      }
    } catch (error) {
      console.error("Failed to fetch contributors:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSave = async () => {
    if (!formData.displayName?.trim() || !formData.bioShort?.trim()) {
      setMessage({ type: "error", text: "Name and short bio are required." })
      return
    }

    try {
      const contributorData = {
        ...formData,
        id: editingContributor?.id || generateSlug(formData.displayName),
        slug: editingContributor?.slug || generateSlug(formData.displayName),
        displayName: formData.displayName.trim(),
        bioShort: formData.bioShort.trim(),
        bioLong: formData.bioLong?.trim() || formData.bioShort.trim(),
        roleTitle: formData.roleTitle?.trim() || "Contributor",
      }

      const response = await fetch("/api/admin/contributors", {
        method: editingContributor ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contributorData),
      })

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Contributor ${editingContributor ? "updated" : "added"} successfully!`,
        })
        fetchContributors()
        resetForm()
        setIsDialogOpen(false)
      } else {
        const error = await response.text()
        setMessage({ type: "error", text: error || "Failed to save contributor." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while saving." })
    }
  }

  const handleEdit = (contributor: Contributor) => {
    setEditingContributor(contributor)
    setFormData(contributor)
    setIsDialogOpen(true)
  }

  const handleDelete = async (contributorId: string) => {
    if (!confirm("Are you sure you want to delete this contributor?")) return

    try {
      const response = await fetch(`/api/admin/contributors/${contributorId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Contributor deleted successfully!" })
        fetchContributors()
      } else {
        setMessage({ type: "error", text: "Failed to delete contributor." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred while deleting." })
    }
  }

  const resetForm = () => {
    setFormData({
      displayName: "",
      bioShort: "",
      bioLong: "",
      roleTitle: "",
      avatar: "",
      socials: {
        twitter: "",
        linkedin: "",
        website: ""
      }
    })
    setEditingContributor(null)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Contributors Management</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contributor
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingContributor ? "Edit Contributor" : "Add New Contributor"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Full Name *</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName || ""}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roleTitle">Role/Title</Label>
                      <Input
                        id="roleTitle"
                        value={formData.roleTitle || ""}
                        onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                        placeholder="e.g., Senior Partner, Legal Expert"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bioShort">Short Bio *</Label>
                    <Textarea
                      id="bioShort"
                      value={formData.bioShort || ""}
                      onChange={(e) => setFormData({ ...formData, bioShort: e.target.value })}
                      placeholder="Brief description (1-2 sentences)"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bioLong">Detailed Bio</Label>
                    <Textarea
                      id="bioLong"
                      value={formData.bioLong || ""}
                      onChange={(e) => setFormData({ ...formData, bioLong: e.target.value })}
                      placeholder="Detailed background and experience"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <Input
                      id="avatar"
                      value={formData.avatar || ""}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Social Links</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <Input
                        value={formData.socials?.linkedin || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          socials: { ...formData.socials, linkedin: e.target.value }
                        })}
                        placeholder="LinkedIn URL"
                      />
                      <Input
                        value={formData.socials?.twitter || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          socials: { ...formData.socials, twitter: e.target.value }
                        })}
                        placeholder="Twitter URL"
                      />
                      <Input
                        value={formData.socials?.website || ""}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          socials: { ...formData.socials, website: e.target.value }
                        })}
                        placeholder="Website URL"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      {editingContributor ? "Update" : "Add"} Contributor
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-4">
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contributor</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Bio</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contributors.map((contributor) => (
                  <TableRow key={contributor.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {contributor.avatar ? (
                            <img 
                              src={contributor.avatar} 
                              alt={contributor.displayName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{contributor.displayName}</div>
                          <div className="text-sm text-muted-foreground">@{contributor.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{contributor.roleTitle}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm text-muted-foreground">
                        {contributor.bioShort}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(contributor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(contributor.id)}
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

          {contributors.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No contributors found. Add your first contributor to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}