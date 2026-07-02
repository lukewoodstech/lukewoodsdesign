export type ProcessStep = {
  heading: string
  body: string
}

export type CaseStudy = {
  slug: string
  title: string
  company: string
  role: string
  period: string
  team: string
  tagline: string
  overview: string
  problemIntro: string
  problemPoints: string[]
  process: ProcessStep[]
  outcomes: string[]
  nextSlug?: string
  nextTitle?: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'pattern-custom-reports',
    title: 'Custom Reports',
    company: 'Pattern',
    role: 'Product Designer',
    period: 'May – Jul 2025',
    team: 'Gavin Munroe (PM) · 8 engineers',
    tagline: 'Replacing rigid dashboards with a flexible, self-serve reporting system for ecommerce brand managers.',
    overview:
      "Pattern brand managers were spending hours recreating the same reports and exporting raw data to Excel just to get a simple metric comparison. I redesigned the reporting experience end-to-end — giving users the ability to build, save, and share custom reports around the metrics that mattered to their specific business.",
    problemIntro:
      "Pattern's reporting tools forced brand managers into fixed dashboards that couldn't accommodate the diversity of how different brands think about their data. Comparing ROAS against TACOS, or ad sales across channels, required either juggling multiple tabs or resorting to a manual Excel export. Reports that were needed weekly had to be rebuilt from scratch every time.",
    problemPoints: [
      'No way to view multiple key metrics in a single, unified view',
      'Manual Excel exports required for any real cross-metric analysis',
      'Repetitive report rebuilding consumed hours each week',
    ],
    process: [
      {
        heading: 'Discovery & workflow mapping',
        body: "I ran discovery sessions and usability interviews with brand managers to understand how they actually used existing reports — not how the product assumed they used them. We mapped end-to-end reporting workflows and identified the moments where Excel became the workaround.",
      },
      {
        heading: 'Defining the right scope of flexibility',
        body: "The temptation was to build a fully open-ended report builder. Instead, I focused on the 80% case: let users choose which metrics to surface, how to group them, and save that configuration. Maximum usefulness without the complexity of a blank canvas.",
      },
      {
        heading: 'Prototyping & information hierarchy',
        body: "I prototyped in Figma with an emphasis on information hierarchy — how do you make a dense data table feel scannable? I tested multiple grouping and layout patterns before landing on a structure that worked across brands of very different sizes and reporting cadences.",
      },
      {
        heading: 'Iterative testing & design system extension',
        body: "Each round of user testing surfaced small but meaningful friction points. I refined interactions and extended Pattern's design system with a new suite of reporting components built to scale across hundreds of brands without accumulating design debt.",
      },
    ],
    outcomes: [
      'Eliminated the need for manual Excel exports entirely',
      'Enabled direct comparison of ROAS, TACOS, and ad sales in a single configurable view',
      'Built a component system designed to scale across hundreds of Pattern brands',
      'Turned a multi-hour weekly rebuild into a one-click saved report',
    ],
    nextSlug: 'lucid-ai',
    nextTitle: 'Lucid AI',
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug)
}
