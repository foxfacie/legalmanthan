import type React from "react"
import type { Metadata } from "next"
import { Crimson_Text, Inter, Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-serif",
})

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    template: "%s | LEGALMANTHAN",
    default: "LEGALMANTHAN - Premium Legal Content & Career Platform",
  },
  description: "Comprehensive legal content, career opportunities, and educational resources for legal professionals.",
  generator: "LEGALMANTHAN",
  keywords: ["legal", "law", "careers", "education", "articles", "notes"],
  authors: [{ name: "LEGALMANTHAN Editorial Team" }],
  creator: "LEGALMANTHAN",
  publisher: "LEGALMANTHAN",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://legalmanthan.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://legalmanthan.com",
    siteName: "LEGALMANTHAN",
    title: "LEGALMANTHAN - Premium Legal Content & Career Platform",
    description:
      "Comprehensive legal content, career opportunities, and educational resources for legal professionals.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LEGALMANTHAN - Premium Legal Content & Career Platform",
    description:
      "Comprehensive legal content, career opportunities, and educational resources for legal professionals.",
    creator: "@legalmanthan",
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
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${crimsonText.variable} ${geist.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Skip to main content
          </a>
          <div className="relative">
            {/* Background gradient */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-background to-muted/20" />
            {/* Animated background elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl animate-pulse delay-500" />
            </div>
            {children}
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
