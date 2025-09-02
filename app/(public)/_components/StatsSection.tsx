import { BookOpen, Briefcase, Users, TrendingUp } from "lucide-react"
import { Container } from "./Container"
import { Section } from "./Section"

interface StatsSectionProps {
  className?: string
  variant?: "default" | "compact"
}

export function StatsSection({ className, variant = "default" }: StatsSectionProps) {
  const stats = [
    { label: "Articles Published", value: "2,500+", icon: BookOpen },
    { label: "Legal Professionals", value: "50,000+", icon: Users },
    { label: "Job Opportunities", value: "1,200+", icon: Briefcase },
    { label: "Monthly Readers", value: "100,000+", icon: TrendingUp },
  ]

  if (variant === "compact") {
    return (
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-serif text-xl lg:text-2xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Section spacing="md" className={`bg-muted/30 ${className}`}>
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="flex justify-center mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
