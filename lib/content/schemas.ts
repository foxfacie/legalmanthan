import { z } from "zod"

export const PostFrontmatterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required").max(200, "Excerpt must be under 200 characters"),
  coverImage: z.string().optional(),
  status: z.enum(["draft", "review", "scheduled", "published", "archived"]).default("draft"),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  authors: z.array(z.string()).min(1, "At least one author is required"),
  isFeatured: z.boolean().default(false),
  isEditorPick: z.boolean().default(false),
  pinnedWeight: z.number().optional(),
  seo: z
    .object({
      canonicalUrl: z.string().url().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().max(160).optional(),
    })
    .optional(),
  openGraph: z
    .object({
      ogTitle: z.string().optional(),
      ogDescription: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
})

export const NoteFrontmatterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  summary: z.string().min(1, "Summary is required"),
  seriesId: z.string().optional(),
  orderInSeries: z.number().optional(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  references: z.array(z.string()).default([]),
  attachments: z.array(z.string()).default([]),
})

export const JobFrontmatterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  companyName: z.string().min(1, "Company name is required"),
  companyWebsite: z.string().url().optional(),
  logo: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  workMode: z.enum(["on-site", "hybrid", "remote"]),
  experienceMin: z.number().min(0).optional(),
  experienceMax: z.number().min(0).optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  practiceAreas: z.array(z.string()).default([]),
  applyUrl: z.string().url().optional(),
  applyEmail: z.string().email().optional(),
  deadlineAt: z.coerce.date().optional(),
  postedAt: z.coerce.date(),
  isFeatured: z.boolean().default(false),
  status: z.enum(["draft", "published", "expired"]).default("published"),
  seo: z
    .object({
      canonicalUrl: z.string().url().optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().max(160).optional(),
    })
    .optional(),
  openGraph: z
    .object({
      ogTitle: z.string().optional(),
      ogDescription: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .optional(),
})

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  icon: z.string().optional(),
  order: z.number(),
})

export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
})

export const AuthorSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  slug: z.string(),
  avatar: z.string().optional(),
  bioShort: z.string().optional(),
  bioLong: z.string().optional(),
  roleTitle: z.string().optional(),
  socials: z
    .object({
      twitter: z.string().transform(val => val === "" ? undefined : val).optional(),
      linkedin: z.string().transform(val => val === "" ? undefined : val).optional(),
      website: z.string().optional().nullable().refine((val) => {
        if (!val || val === "") return true; // Allow empty strings and null
        return z.string().url().safeParse(val).success; // Validate only if not empty
      }, {
        message: "Must be a valid URL"
      }).transform(val => val === "" ? null : val),
    })
    .optional(),
})

export const SeriesSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  noteIds: z.array(z.string()),
})

export const ActFrontmatterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  authors: z.array(z.string()).min(1, "At least one author is required"),
  isFeatured: z.boolean().default(false),
  isEditorPick: z.boolean().default(false),
})

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>
export type NoteFrontmatter = z.infer<typeof NoteFrontmatterSchema>
export type JobFrontmatter = z.infer<typeof JobFrontmatterSchema>
export type ActFrontmatter = z.infer<typeof ActFrontmatterSchema>
