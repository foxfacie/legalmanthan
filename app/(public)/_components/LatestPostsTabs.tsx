"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArticleCard } from "./ArticleCard"
import type { Post } from "@/lib/content/types"

interface LatestPostsTabsProps {
  postsByCategory: Record<string, Post[]>
  categories: Array<{ name: string; slug: string }>
}

export function LatestPostsTabs({ postsByCategory, categories }: LatestPostsTabsProps) {
  const [activeTab, setActiveTab] = useState("all")

  const allPosts = Object.values(postsByCategory)
    .flat()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 12)

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
        <TabsTrigger value="all">All Posts</TabsTrigger>
        {categories.slice(0, 4).map((category) => (
          <TabsTrigger key={category.slug} value={category.slug}>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="all" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map((post, index) => (
            <ArticleCard key={`all-${post.id}-${index}`} post={post} />
          ))}
        </div>
      </TabsContent>

      {categories.slice(0, 4).map((category) => (
        <TabsContent key={category.slug} value={category.slug} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(postsByCategory[category.slug] || []).slice(0, 12).map((post, index) => (
              <ArticleCard key={`${category.slug}-${post.id}-${index}`} post={post} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
