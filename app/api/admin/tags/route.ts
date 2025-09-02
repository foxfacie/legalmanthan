import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Common legal tags
    const tags = [
      { id: "constitutional-law", name: "Constitutional Law", slug: "constitutional-law" },
      { id: "criminal-law", name: "Criminal Law", slug: "criminal-law" },
      { id: "civil-law", name: "Civil Law", slug: "civil-law" },
      { id: "corporate-law", name: "Corporate Law", slug: "corporate-law" },
      { id: "family-law", name: "Family Law", slug: "family-law" },
      { id: "property-law", name: "Property Law", slug: "property-law" },
      { id: "tax-law", name: "Tax Law", slug: "tax-law" },
      { id: "labor-law", name: "Labor Law", slug: "labor-law" },
      { id: "environmental-law", name: "Environmental Law", slug: "environmental-law" },
      { id: "intellectual-property", name: "Intellectual Property", slug: "intellectual-property" },
      { id: "contract-law", name: "Contract Law", slug: "contract-law" },
      { id: "tort-law", name: "Tort Law", slug: "tort-law" },
      { id: "administrative-law", name: "Administrative Law", slug: "administrative-law" },
      { id: "international-law", name: "International Law", slug: "international-law" },
      { id: "human-rights", name: "Human Rights", slug: "human-rights" },
      { id: "banking-law", name: "Banking Law", slug: "banking-law" },
      { id: "insurance-law", name: "Insurance Law", slug: "insurance-law" },
      { id: "cyber-law", name: "Cyber Law", slug: "cyber-law" },
      { id: "competition-law", name: "Competition Law", slug: "competition-law" },
      { id: "securities-law", name: "Securities Law", slug: "securities-law" },
    ]
    
    return NextResponse.json(tags)
  } catch (error) {
    console.error("Tags fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}