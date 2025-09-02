"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, MoreHorizontal, Edit, Trash2, Eye, Star, Calendar, RefreshCw } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface ContentItem {
  id: string
  title: string
  slug: string
  type: "post" | "note" | "job"
  status: string
  publishedAt: string
  updatedAt?: string
  authors: string[]
  categories: string[]
  isFeatured: boolean
  isEditorPick: boolean
  viewCount: number
}

export function ContentManager() {
  const [content, setContent] = useState<ContentItem[]>([])
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchContent()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchContent()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    filterContent()
  }, [content, searchQuery, statusFilter, typeFilter])

  const fetchContent = async () => {
    try {
      // Add cache-busting timestamp to force fresh data
      const timestamp = Date.now()
      console.log("Fetching content at:", new Date().toISOString())
      
      const response = await fetch(`/api/admin/content?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
      
      console.log("Content API response status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        setContent(data)
        console.log("Content refreshed:", data.length, "items")
        console.log("Sample content items:", data.slice(0, 3).map(item => ({ id: item.id, title: item.title, type: item.type })))
      } else {
        const errorText = await response.text()
        console.error("Content API error:", errorText)
      }
    } catch (error) {
      console.error("Failed to fetch content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterContent = () => {
    let filtered = content

    if (searchQuery) {
      filtered = filtered.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === typeFilter)
    }

    setFilteredContent(filtered)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredContent.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId))
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) return

    try {
      const response = await fetch("/api/admin/bulk-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, items: selectedItems }),
      })

      if (response.ok) {
        setSelectedItems([])
        // Force immediate refresh
        setTimeout(() => {
          fetchContent()
        }, 500)
      }
    } catch (error) {
      console.error("Bulk action failed:", error)
    }
  }

  const handleItemAction = async (itemId: string, action: string) => {
    if (action === "edit") {
      // Find the item to get its slug
      const item = content.find(c => c.id === itemId)
      const slug = item?.slug || itemId.replace(/^(post|note|act|job)-/, '') // Remove type prefix if present
      // Trigger edit mode - we'll need to communicate with parent component
      window.dispatchEvent(new CustomEvent('editContent', { detail: { slug } }))
      return
    }
    
    try {
      const response = await fetch(`/api/admin/content/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        setMessage({ type: "success", text: `Successfully performed ${action} on item` })
        // Force immediate refresh
        setTimeout(() => {
          fetchContent()
        }, 500)
      }
    } catch (error) {
      console.error("Item action failed:", error)
      setMessage({ type: "error", text: "Action failed" })
    }
  }

  const handleForceRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Call refresh API to clear cache
      await fetch("/api/admin/refresh", { method: "POST" })
      // Then fetch fresh content
      await fetchContent()
      setMessage({ type: "success", text: "Content refreshed successfully" })
    } catch (error) {
      console.error("Refresh failed:", error)
      setMessage({ type: "error", text: "Refresh failed" })
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      published: "default",
      draft: "secondary",
      archived: "outline",
      review: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"} className="capitalize">
        {status}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      post: "bg-blue-100 text-blue-800",
      note: "bg-green-100 text-green-800",
      job: "bg-purple-100 text-purple-800",
    }

    return (
      <Badge variant="outline" className={`capitalize ${colors[type as keyof typeof colors]}`}>
        {type}
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
              {[...Array(5)].map((_, i) => (
                <div key={`skeleton-${i}`} className="h-12 bg-muted rounded"></div>
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
            <CardTitle>Content Management</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleForceRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-4">
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
          
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="post">Posts</SelectItem>
                <SelectItem value="note">Notes</SelectItem>
                <SelectItem value="job">Jobs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-2 mb-4 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">{selectedItems.length} items selected</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("publish")}>
                Publish
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("unpublish")}>
                Unpublish
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("feature")}>
                Feature
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction("archive")}>
                Archive
              </Button>
            </div>
          )}

          {/* Content Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContent.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium line-clamp-1">{item.title}</div>
                        <div className="flex items-center space-x-2">
                          {item.isFeatured && <Star className="h-3 w-3 text-amber-500 fill-current" />}
                          {item.isEditorPick && (
                            <Badge variant="outline" className="text-xs">
                              Editor's Pick
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(item.type)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {(item.authors && item.authors.join(", ")) || "Unknown"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(new Date(item.publishedAt))}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{item.viewCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleItemAction(item.id, "edit")}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleItemAction(item.id, "view")}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleItemAction(item.id, item.status === "published" ? "unpublish" : "publish")
                            }
                          >
                            {item.status === "published" ? "Unpublish" : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleItemAction(item.id, "delete")}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredContent.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No content found matching your criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
