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
    nextSlug: 'awardco-login-flow-redesign',
    nextTitle: 'Awardco Login Flow Redesign',
  },
  {
    slug: 'awardco-login-flow-redesign',
    title: 'Login Flow Redesign',
    company: 'Awardco',
    role: 'Product Designer',
    period: '2024',
    team: 'Solo designer · 2 engineers',
    tagline: 'Modernizing a cluttered authentication experience into a clean, trust-building entry point.',
    overview:
      "Awardco's login page was a product design blind spot — functional, but visually outdated and inconsistent with the rest of the platform. I redesigned it from scratch to reduce friction, surface Google SSO more prominently, and establish a more polished first impression for the thousands of employees who use Awardco daily.",
    problemIntro:
      "The existing login flow had accumulated layers of decisions made independently of the broader design system. The result was a page that felt out of place — heavy, cluttered, and unpolished relative to the rest of the product.",
    problemPoints: [
      'Google SSO buried below the fold, despite being the most common sign-in method',
      'Visual inconsistency with Awardco brand and design system',
      'Cluttered layout with competing CTAs creating decision fatigue',
      'No clear hierarchy between primary and secondary authentication options',
    ],
    process: [
      {
        heading: 'Audit & benchmark',
        body: 'I started by auditing the existing flow and benchmarking against login patterns from modern SaaS products. The consistent pattern: SSO at the top, clean card layout, minimal surrounding noise. The existing Awardco flow did the opposite.',
      },
      {
        heading: 'Hierarchy restructure',
        body: "I restructured the authentication options around actual usage data — Google SSO is how the vast majority of users sign in. Promoting it to the primary position, with email as the secondary option beneath an OR divider, immediately reduced visual complexity.",
      },
      {
        heading: 'Visual redesign',
        body: "I updated the visual language to align with Awardco's evolving brand: the full wordmark replaced the standalone icon, a light periwinkle background replaced the flat white, and the card received a more refined shadow and border radius. Every element was pulled from or contributed back to the design system.",
      },
      {
        heading: 'Handoff & implementation',
        body: 'I worked directly with the front-end team to spec the changes, providing annotated Figma files with exact spacing, color tokens, and interaction states. The implementation matched the design closely with minimal back-and-forth.',
      },
    ],
    outcomes: [
      'Promoted Google SSO to primary position, reducing time-to-login for most users',
      'Established a consistent, brand-aligned entry point into the product',
      'Reduced visual noise by consolidating competing CTAs into a clear hierarchy',
      'Contributed new login-card components back to the Awardco design system',
    ],
    nextSlug: 'pattern-custom-reports',
    nextTitle: 'Pattern Custom Reports',
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug)
}
