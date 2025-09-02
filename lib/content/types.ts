export interface Author {
  id: string
  displayName: string
  slug: string
  avatar?: string
  bioShort?: string
  bioLong?: string
  roleTitle?: string
  socials?: {
    twitter?: string
    linkedin?: string
    website?: string
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  icon?: string
  order: number
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  status: "draft" | "review" | "scheduled" | "published" | "archived"
  publishedAt: Date
  updatedAt?: Date
  categories: string[]
  tags: string[]
  author: string
  isFeatured: boolean
  isEditorPick: boolean
  pinnedWeight?: number
  seo?: {
    canonicalUrl?: string
    metaTitle?: string
    metaDescription?: string
  }
  openGraph?: {
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
  }
  readingTimeMin: number
  wordCount: number
  viewCount: number
}

export interface Note {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  seriesId?: string
  orderInSeries?: number
  publishedAt: Date
  updatedAt?: Date
  tags: string[]
  categories: string[]
  references?: string[]
  attachments?: string[]
  readingTimeMin: number
  wordCount: number
}

export interface Series {
  id: string
  title: string
  slug: string
  description: string
  noteIds: string[]
}

export interface Job {
  id: string
  title: string
  slug: string
  companyName: string
  companyWebsite?: string
  logo?: string
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
  deadlineAt?: Date
  postedAt: Date
  isFeatured: boolean
  status: "draft" | "published" | "expired"
  seo?: {
    canonicalUrl?: string
    metaTitle?: string
    metaDescription?: string
  }
  openGraph?: {
    ogTitle?: string
    ogDescription?: string
    ogImage?: string
  }
}

export interface Act {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  status: "draft" | "published" | "archived"
  publishedAt: Date
  updatedAt?: Date
  categories: string[]
  tags: string[]
  authors: string[]
  isFeatured: boolean
  isEditorPick: boolean
  readingTimeMin: number
  wordCount: number
  viewCount: number
}

export interface ContentMeta {
  posts: Post[]
  notes: Note[]
  jobs: Job[]
  acts: Act[]
  categories: Category[]
  tags: Tag[]
  authors: Author[]
  series: Series[]
  lastUpdated: Date
}
