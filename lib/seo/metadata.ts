import type { Metadata } from "next"

export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: "website" | "article" | "profile"
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  authors = [],
  section,
  tags = [],
}: SEOProps): Metadata {
  const siteName = "LegalHub"
  const siteUrl = "https://legalhub.com"
  const defaultImage = `${siteUrl}/og-image.jpg`

  const metaTitle = title ? `${title} | ${siteName}` : `${siteName} - Premium Legal Content & Career Platform`
  const metaDescription =
    description ||
    "Comprehensive legal content, career opportunities, and educational resources for legal professionals."
  const metaImage = image ? `${siteUrl}${image}` : defaultImage
  const metaUrl = url ? `${siteUrl}${url}` : siteUrl

  const allKeywords = [
    "legal",
    "law",
    "careers",
    "education",
    "articles",
    "notes",
    "acts",
    "legal professionals",
    ...keywords,
    ...tags,
  ]

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: allKeywords.join(", "),
    authors: authors.map((name) => ({ name })),
    creator: siteName,
    publisher: siteName,

    openGraph: {
      type,
      locale: "en_US",
      url: metaUrl,
      siteName,
      title: metaTitle,
      description: metaDescription,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors: authors,
        section,
        tags,
      }),
    },

    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: "@legalhub",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical: metaUrl,
    },
  }
}

export function generateArticleStructuredData({
  title,
  description,
  url,
  image,
  publishedTime,
  modifiedTime,
  authors = [],
}: {
  title: string
  description: string
  url: string
  image?: string
  publishedTime: string
  modifiedTime?: string
  authors?: string[]
}) {
  const siteUrl = "https://legalhub.com"

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${siteUrl}${url}`,
    image: image ? `${siteUrl}${image}` : `${siteUrl}/og-image.jpg`,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: authors.map((name) => ({
      "@type": "Person",
      name,
    })),
    publisher: {
      "@type": "Organization",
      name: "LegalHub",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
  }
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ label: string; href: string }>) {
  const siteUrl = "https://legalhub.com"

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${siteUrl}${crumb.href}`,
    })),
  }
}
