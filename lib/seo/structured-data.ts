import type { Post, Job, Author } from "@/lib/content/types"

export function generateArticleStructuredData(post: Post, authors: Author[]) {
  const author = authors.find((a) => a.id === post.authors[0])

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? `${process.env.NEXT_PUBLIC_SITE_URL}${post.coverImage}` : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: author?.name || "Editorial Team",
      url: author?.website,
    },
    publisher: {
      "@type": "Organization",
      name: "Legal Insights",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
    },
  }
}

export function generateJobStructuredData(job: Job) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.publishedAt,
    validThrough: job.applicationDeadline,
    employmentType: job.type?.toUpperCase(),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      sameAs: job.companyWebsite,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "IN",
      },
    },
    baseSalary: job.salary
      ? {
          "@type": "MonetaryAmount",
          currency: "INR",
          value: {
            "@type": "QuantitativeValue",
            value: job.salary,
            unitText: "YEAR",
          },
        }
      : undefined,
  }
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
