"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Users, Briefcase, Eye, TrendingUp, Calendar } from "lucide-react"
import { useLiveUpdates } from "@/hooks/use-live-updates"

interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalJobs: number
  activeJobs: number
  totalViews: number
  recentPosts: Array<{
    title: string
    slug: string
    status: string
    publishedAt: string
    views: number
  }>
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isConnected, updates } = useLiveUpdates()

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Posts",
      value: stats?.totalPosts || 0,
      subtitle: `${stats?.publishedPosts || 0} published, ${stats?.draftPosts || 0} drafts`,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Active Jobs",
      value: stats?.activeJobs || 0,
      subtitle: `${stats?.totalJobs || 0} total listings`,
      icon: Briefcase,
      color: "text-green-600",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                </div>
                <div className={`h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="h-20 flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>New Article</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent">
              <Briefcase className="h-6 w-6" />
              <span>Post Job</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentPosts?.map((post) => (
                <div key={post.slug} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{post.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={post.status === "published" ? "default" : "secondary"} className="text-xs">
                        {post.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {post.views}
                      </span>
                    </div>
                  </div>
                </div>
              )) || <p className="text-muted-foreground text-sm">No recent posts found.</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Published Articles</span>
                <Badge variant="default">{stats?.publishedPosts || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Draft Articles</span>
                <Badge variant="secondary">{stats?.draftPosts || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Jobs</span>
                <Badge variant="default">{stats?.activeJobs || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Real-time Updates</span>
                <div className="flex items-center gap-2">
                  <Badge variant={isConnected ? "default" : "destructive"}>
                    {isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                  {updates.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {updates.length} recent
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
