import Link from "next/link"
import { Container } from "./Container"

const footerLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Law Notes", href: "/notes" },
  { name: "Acts", href: "/acts" },
  { name: "Authors", href: "/authors" },
  { name: "Careers", href: "/jobs" },
]

export function Footer() {
  return (
    <footer className="bg-muted/20 border-t border-border/50">
      <Container>
        <div className="py-8 md:py-12">
          {/* Main footer content */}
          <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:justify-between md:items-start">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <Link href="/" className="inline-flex items-center space-x-3 mb-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                  <span className="text-primary-foreground font-bold">LM</span>
                </div>
                <span className="font-serif text-xl font-bold">LEGALMANTHAN</span>
              </Link>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto md:mx-0">
                Your trusted source for legal content and career guidance.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-8 pt-6 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} LEGALMANTHAN. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
