import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  })
}

export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return formatDate(dateObj)
}

export function readingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function wordCount(content: string): number {
  return content.trim().split(/\s+/).length
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).replace(/\s+\S*$/, "") + "..."
}

export function extractExcerpt(content: string, length = 160): string {
  // Remove markdown syntax and HTML tags
  const plainText = content
    .replace(/#{1,6}\s+/g, "") // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
    .replace(/\*(.*?)\*/g, "$1") // Remove italic
    .replace(/\[(.*?)\]$$.*?$$/g, "$1") // Remove links
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()

  return truncate(plainText, length)
}

export function generateMetaTitle(title: string, siteName = "LegalHub"): string {
  return `${title} | ${siteName}`
}

export function generateBreadcrumbs(pathname: string): Array<{ label: string; href: string }> {
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs = [{ label: "Home", href: "/" }]

  let currentPath = ""
  for (const segment of segments) {
    currentPath += `/${segment}`
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    breadcrumbs.push({ label, href: currentPath })
  }

  return breadcrumbs
}

export function generateMetadata(options: {
  title: string
  description?: string
  image?: string
  url?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  siteName?: string
}) {
  const {
    title,
    description,
    image,
    url,
    type = "website",
    publishedTime,
    modifiedTime,
    authors,
    siteName = "LegalHub",
  } = options

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://legalhub.com"
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const fullImage = image ? `${baseUrl}${image}` : `${baseUrl}/og-image.png`

  return {
    title: generateMetaTitle(title, siteName),
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}
