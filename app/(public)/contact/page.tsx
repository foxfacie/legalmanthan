import { Container } from "../_components/Container"
import { Section } from "../_components/Section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, MessageSquare, Users, BookOpen } from "lucide-react"
import { generateMetadata as generateSEOMetadata } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = generateSEOMetadata({
  title: "Contact Us - Get in Touch",
  description: "Have questions? Get in touch with our team for support, partnerships, or general inquiries.",
  url: "/contact",
})

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "dupg0050729@lc2.du.ac.in",
      description: "Send us an email and we'll respond within 24 hours",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 97184 78156",
      description: "Monday to Friday, 9 AM to 6 PM IST",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Law Faculty, Delhi, India",
      description: "Schedule an appointment",
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: "Mon - Fri: 9 AM - 6 PM",
      description: "We're here to help during business hours",
    },
  ]

  const inquiryTypes = [
    { icon: MessageSquare, title: "General Inquiry", description: "Questions about our platform or services" },
    { icon: Users, title: "Partnership", description: "Collaboration and partnership opportunities" },
    { icon: BookOpen, title: "Content Submission", description: "Submit articles or contribute content" },
  ]

  return (
    <>
      <main id="main-content">
        {/* Hero Section */}
        <Section spacing="lg" className="bg-gradient-to-br from-primary/5 to-accent/5">
          <Container>
            <div className="text-center">
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground mb-6">Get in Touch</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Have questions, suggestions, or want to collaborate? We'd love to hear from you. Reach out to our team
                and we'll get back to you as soon as possible.
              </p>
            </div>
          </Container>
        </Section>

        {/* Contact Info */}
        <Section spacing="lg">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info) => (
                <Card key={info.title} className="text-center">
                  <CardContent className="pt-8 pb-6">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <info.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">{info.title}</h3>
                    <p className="font-semibold text-primary mb-2">{info.details}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Send us a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                        First Name *
                      </label>
                      <Input id="firstName" placeholder="Enter your first name" required />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                        Last Name *
                      </label>
                      <Input id="lastName" placeholder="Enter your last name" required />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input id="email" type="email" placeholder="Enter your email address" required />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <Input id="phone" type="tel" placeholder="Enter your phone number" />
                  </div>

                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-medium text-foreground mb-2">
                      Inquiry Type *
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="content">Content Submission</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="career">Career Opportunities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      Subject *
                    </label>
                    <Input id="subject" placeholder="Enter the subject of your message" required />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea id="message" placeholder="Tell us more about your inquiry..." rows={6} required />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Inquiry Types */}
              <div>
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6">How Can We Help?</h2>
                <div className="space-y-6">
                  {inquiryTypes.map((type) => (
                    <Card key={type.title}>
                      <CardHeader>
                        <div className="flex items-start space-x-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <type.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{type.title}</CardTitle>
                            <p className="text-muted-foreground mt-1">{type.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                {/* FAQ Link */}
                <Card className="mt-8">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-lg text-foreground mb-2">Frequently Asked Questions</h3>
                    <p className="text-muted-foreground mb-4">
                      Check out our FAQ section for quick answers to common questions.
                    </p>
                    <Button variant="outline">View FAQ</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </Section>


      </main>
    </>
  )
}
