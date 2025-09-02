# LEGALMANTHAN - Legal Content & Career Platform

A modern, production-ready legal content management system built with Next.js 15, featuring real-time updates, admin panel, and comprehensive content management.

## 🚀 Features

- **Real-time Content Updates** - Live notifications for new content
- **Admin Panel** - Complete content management system
- **SEO Optimized** - Built-in SEO features and sitemap generation
- **Responsive Design** - Mobile-first approach with modern UI
- **Content Types** - Posts, Notes, Jobs, Acts with full categorization
- **Search Functionality** - Advanced search across all content
- **Performance Optimized** - Static generation with dynamic updates

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom components
- **Content**: MDX with gray-matter for frontmatter
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel (optimized)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/legalmanthan.git
cd legalmanthan
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
ADMIN_PASSWORD=your_secure_password
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=LEGALMANTHAN
```

4. Run the development server:
```bash
npm run dev
```

## 🚀 Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account
- Your code pushed to GitHub

### Step-by-Step Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Environment Variables**:
   In Vercel dashboard, add these environment variables:
   ```
   ADMIN_PASSWORD=your_secure_admin_password
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SITE_NAME=LEGALMANTHAN
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live!

### Files to Upload to GitHub

Upload these essential files and folders:

```
📁 Root Directory
├── 📁 app/                 # Next.js app directory
├── 📁 components/          # React components
├── 📁 content/            # Content files (posts, notes, etc.)
├── 📁 hooks/              # Custom React hooks
├── 📁 lib/                # Utility functions and content loaders
├── 📁 public/             # Static assets
├── 📁 styles/             # Additional styles
├── 📄 .env.example        # Environment variables template
├── 📄 .gitignore          # Git ignore rules
├── 📄 components.json     # UI components config
├── 📄 next-env.d.ts       # Next.js TypeScript definitions
├── 📄 next-sitemap.config.js # Sitemap configuration
├── 📄 next.config.mjs     # Next.js configuration
├── 📄 package.json        # Dependencies and scripts
├── 📄 package-lock.json   # Dependency lock file
├── 📄 postcss.config.mjs  # PostCSS configuration
├── 📄 README.md           # This file
├── 📄 tsconfig.json       # TypeScript configuration
└── 📄 vercel.json         # Vercel deployment configuration
```

### DO NOT Upload:
- `node_modules/` (automatically installed)
- `.next/` (build directory)
- `.env.local` (contains secrets)
- `dist/` (build artifacts)

## 🔧 Configuration

### Admin Panel Access
- URL: `https://your-domain.vercel.app/admin`
- Password: Set via `ADMIN_PASSWORD` environment variable

### Content Management
- Posts: `content/posts/*.mdx`
- Notes: `content/notes/*.mdx`
- Jobs: `content/jobs/*.mdx`
- Acts: `content/acts/*.mdx`
- Meta: `content/meta/*.json`

### Real-time Updates
The system includes Server-Sent Events (SSE) for real-time content updates:
- Endpoint: `/api/events`
- Automatic reconnection
- Live status indicator

## 📝 Content Structure

### Post Example
```mdx
---
title: "Your Post Title"
slug: "your-post-slug"
excerpt: "Brief description"
status: "published"
publishedAt: "2024-01-01T00:00:00.000Z"
categories: ["category-slug"]
tags: ["tag1", "tag2"]
authors: ["author-slug"]
isFeatured: false
isEditorPick: true
---

# Your Content Here

Write your content in MDX format...
```

## 🎨 Customization

### Styling
- Modify `app/globals.css` for global styles
- Update `tailwind.config.js` for theme customization
- Components in `components/ui/` for UI elements

### Content Types
- Add new content types in `lib/content/types.ts`
- Update schemas in `lib/content/schemas.ts`
- Extend loader functions in `lib/content/loader.ts`

## 🔍 SEO Features

- Automatic sitemap generation
- Meta tags optimization
- Open Graph support
- Twitter Card support
- Structured data (JSON-LD)

## 📊 Analytics

Vercel Analytics is integrated for:
- Page views tracking
- Performance monitoring
- User engagement metrics

## 🛡️ Security

- Environment variables for sensitive data
- Admin authentication
- Input validation with Zod schemas
- XSS protection

## 🚨 Troubleshooting

### Build Issues
If you encounter build errors:

1. **Clear cache**:
   ```bash
   rm -rf .next node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

2. **Check environment variables**:
   Ensure all required variables are set in Vercel dashboard

3. **Verify content files**:
   Check that all MDX files have valid frontmatter

### Common Issues

- **"Function Runtimes must have a valid version"**: Fixed in `vercel.json`
- **React version conflicts**: Use `--legacy-peer-deps` flag
- **Build timeouts**: Content files are optimized for fast builds

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review Vercel deployment logs
- Ensure all environment variables are set correctly

## 📄 License

This project is licensed under the MIT License.

---

**Ready for Production** ✅
- All build errors fixed
- Vercel configuration optimized
- Real-time features working
- SEO and performance optimized
- Admin panel functional
- Content management system ready