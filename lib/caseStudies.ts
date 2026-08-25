export type ProcessStep = {
  heading: string
  body: string
}

export type Figure = {
  src?: string
  caption: string
  height?: string
}

export type CaseStudy = {
  slug: string
  title: string
  company: string
  role: string
  period: string
  team: string
  /** One line for the work-grid tile. Kept here so tile copy can't drift from the case study. */
  summary: string
  /** Discipline tags for the tile, colour-coded by TileFooter. */
  tags: string[]
  /** 2–3 short metrics for the at-a-glance row. Omit until the study has real numbers. */
  headline?: string[]
  tagline: string
  overview: string
  problemIntro: string
  problemPoints: string[]
  process: ProcessStep[]
  outcomes: string[]
  heroSrc?: string
  heroCaption?: string
  problemFigure?: Figure
  processFigures?: Figure[]
  nextSlug?: string
  nextTitle?: string
}

export const caseStudies: CaseStudy[] = [
  {
    /*
     * The article itself is the bespoke page at app/work/lucid-ai/page.tsx —
     * this entry only feeds the home-grid tile and the prev/next chain.
     */
    slug: 'lucid-ai',
    title: 'Bringing Lucid AI out of the canvas',
    company: 'Lucid',
    role: 'Product Design Intern',
    period: 'May – Aug 2026 · 12 weeks',
    team: 'Two scrum teams: search + AI',
    summary: 'The AI chat panel that brought Lucid AI to the docs list, GA on every tier.',
    tags: ['AI Product', '0 → 1', 'Prototyping'],
    headline: [
      'GA on all tiers in 12 weeks',
      'Harness for every future docs list skill',
    ],
    tagline: "So you can find a doc you can't name.",
    overview:
      '[2–4 sentences: the situation, what you did end-to-end, and the headline result. This paragraph sits directly under the hero image.]',
    problemIntro:
      '[1 short paragraph: what was broken or missing before this work, and why it hurt users or the business.]',
    problemPoints: [
      '[Pain point 1 — specific and concrete]',
      '[Pain point 2]',
      '[Pain point 3]',
    ],
    process: [
      {
        heading: '[Step 1 — e.g. Discovery & research]',
        body: '[What you did, who you talked to, what you learned that changed the direction.]',
      },
      {
        heading: '[Step 2 — e.g. Defining scope]',
        body: '[The key decision or trade-off you made and the reasoning behind it.]',
      },
      {
        heading: '[Step 3 — e.g. Design & prototyping]',
        body: '[How you explored options, what you tested, what you landed on.]',
      },
      {
        heading: '[Step 4 — e.g. Testing & handoff]',
        body: '[How you validated the work and got it shipped.]',
      },
    ],
    outcomes: [
      '[Outcome 1 — measurable if possible]',
      '[Outcome 2]',
      '[Outcome 3]',
    ],
    problemFigure: { caption: '[Figure — research or problem evidence]', height: 'h-64' },
    processFigures: [
      { caption: '[Figure — explorations or prototypes]' },
      { caption: '[Figure — final design]', height: 'h-[500px]' },
    ],
    nextSlug: 'awardco-login-flow-redesign',
    nextTitle: 'Awardco Login Flow Redesign',
  },
  {
    slug: 'pattern-custom-reports',
    title: 'Custom Reports in Predict',
    company: 'Pattern',
    role: 'Product Design Intern',
    // Résumé dates; the Custom Reports project itself ran ~10 weeks inside them.
    period: 'Jan – Oct 2025',
    team: 'Gavin Munro (PM) · Tanner Dopp (Eng Manager) · Zach Brough (Director of Product)',
    summary: 'Rebuilding reporting so brand managers ship client-ready reports in minutes.',
    tags: ['B2B SaaS', 'Data Visualization', 'User Research'],
    headline: [
      '30–60 min → under 10 min per report',
      '80% of brand managers adopted in week one',
      '+50% user satisfaction',
    ],
    tagline:
      'Rebuilding Predict’s reporting tool so brand managers could create executive-ready, multi-metric reports in minutes instead of an hour.',
    overview:
      "Pattern's Predict platform had a Custom Reports tool that was built to save time — and was doing exactly the opposite. Adoption sat at 35%, retention at 20%, and it took 80 seconds just to get into a report; most managers tried it once and went back to Excel. Over a 10-week project on the Predict team, I redesigned Custom Reports end-to-end, from discovery through final handoff. The redesigned tool cut report creation from 30–60 minutes to under 10, and 80% of brand managers created at least one custom report in the first week.",
    problemIntro:
      "Brand managers at Pattern each juggle around six brands and are the primary point of contact for brand partners — reporting performance is a core part of their week. The old tool made that painful: one KPI per view meant stitching together multiple one-metric dashboards to tell a story, and comparing ad spend against sales lift in a single report was impossible. Ad strategists had the same problem connecting ad performance with sales metrics. So both groups fell back to exporting data into Excel — slow, manual, and unpolished in front of clients.",
    problemPoints: [
      'Adoption at 35%, retention at 20% — managers tried Custom Reports once, then reverted to Excel and Tableau',
      'Reporting took 30–60 minutes per brand, stitched together from one-metric dashboards',
      'No way to compare multiple KPIs — like ad spend vs. sales lift — in a single report',
      'Entering a report and starting to build took 80 seconds of navigation',
      'Screenshots and raw Excel exports looked unprofessional in client meetings',
    ],
    process: [
      {
        heading: 'Understand: research with both user groups',
        body: "I structured the 10 weeks as Understand → Ideate → Validate → Design → Test. I ran discovery sessions and usability interviews with the two user groups the tool had to serve — brand managers and ad strategists — and built personas around their competing needs: managers wanted fast, client-ready reports; strategists wanted to connect ad performance with sales data. Auditing the old view and edit modes surfaced exactly where the UI fought its users.",
      },
      {
        heading: 'Define success before designing',
        body: "With my PM I defined four success metrics up front: adoption rate (was it valuable enough to try?), retention (did it become a core tool, not a novelty?), time-to-report (managers were losing 30–60 minutes per brand), and share/export usage (did it replace the Excel workaround?). Every design decision afterward had a measurable target to answer to.",
      },
      {
        heading: 'Prioritize under real constraints',
        body: "Ten weeks, limited engineering capacity, and an existing design system meant scope discipline. I ran requirements through an Eisenhower matrix — fixing the report-creation workflow, making the in-report UI intuitive, and adding automated Gmail sending landed as urgent and important; cross-brand reporting and BI-tool integrations were consciously deferred. Competitive analysis of Tableau, Excel, Shopify, and the Google ecosystem showed what 'intuitive reporting' looks like when done well.",
      },
      {
        heading: 'The drag-and-drop trade-off',
        body: "The original vision was a fully flexible drag-and-drop report builder. Engineering flagged it as too complex for the timeline, so I partnered with them on a streamlined 'add metric' flow instead — faster to build, and it still solved the core user need. We shipped something usable on time, with drag-and-drop documented as a future roadmap item rather than a blocked release.",
      },
      {
        heading: 'High-fidelity prototypes',
        body: "I designed the full system in Figma: a Custom Reports home with search, templates, and sharing states; a create-report modal that drops users straight into configuration; and an in-report experience built around multi-metric line charts with comparison and color customization. Each flow went through user testing rounds, and annotated prototypes gave engineers implementation-ready specs.",
      },
      {
        heading: 'Handoff & continuity',
        body: "My internship ended shortly after release, leaving limited time to capture post-launch insights. I worked with the PM and engineers to document assumptions and hand off a clear plan for follow-up testing and iteration, so the next design and product team could validate and refine the feature beyond the internship window.",
      },
    ],
    outcomes: [
      'Report creation dropped from 30–60 minutes to under 10 — and entering a report from 80 seconds to under 30',
      '80% of brand managers created at least one custom report in the first week',
      'Weekly repeat usage grew as managers shifted off Excel and Tableau back into Predict',
      'Automated Gmail sending and polished exports became the standard reporting workflow; user satisfaction rose 50%',
    ],
    heroSrc: '/work/pattern/hifi-home-send-report.png',
    heroCaption: 'Final design — Custom Reports home and send-report flow in Predict',
    problemFigure: {
      src: '/work/pattern/old-ui-view-mode.png',
      caption: 'The old UI — one metric per view, buried controls, and an 80-second path into a report',
    },
    processFigures: [
      {
        src: '/work/pattern/discovery-board.png',
        caption: 'Discovery — auditing the existing reporting flows and collecting feature feedback',
      },
      {
        src: '/work/pattern/new-report-flow.png',
        caption: 'New report flow — from user-flow mapping to high-fidelity create and configure screens',
      },
      {
        src: '/work/pattern/final-chart-ui.png',
        caption: 'Final in-report design — multi-metric comparison with color customization',
      },
    ],
    nextSlug: 'hoth',
    nextTitle: 'Hoth Landing Page',
  },
  {
    slug: 'hoth',
    title: 'Hoth Landing Page',
    company: 'Hoth',
    role: 'Product Design Intern',
    period: 'Aug – Dec 2024',
    team: '[Team — e.g. Solo project]',
    summary: 'Brand identity and landing page for an encrypted work platform.',
    tags: ['Brand Identity', 'Web Design', 'Motion'],
    tagline: '[One-sentence tagline: what was the project and why does it matter?]',
    overview:
      '[2–4 sentences: the situation, what you did end-to-end, and the headline result. This paragraph sits directly under the hero image.]',
    problemIntro:
      '[1 short paragraph: what was broken or missing before this work, and why it hurt users or the business.]',
    problemPoints: [
      '[Pain point 1 — specific and concrete]',
      '[Pain point 2]',
      '[Pain point 3]',
    ],
    process: [
      {
        heading: '[Step 1 — e.g. Discovery & research]',
        body: '[What you did, who you talked to, what you learned that changed the direction.]',
      },
      {
        heading: '[Step 2 — e.g. Defining scope]',
        body: '[The key decision or trade-off you made and the reasoning behind it.]',
      },
      {
        heading: '[Step 3 — e.g. Design & prototyping]',
        body: '[How you explored options, what you tested, what you landed on.]',
      },
      {
        heading: '[Step 4 — e.g. Testing & handoff]',
        body: '[How you validated the work and got it shipped.]',
      },
    ],
    outcomes: [
      '[Outcome 1 — measurable if possible]',
      '[Outcome 2]',
      '[Outcome 3]',
    ],
    problemFigure: { caption: '[Figure — research or problem evidence]', height: 'h-64' },
    processFigures: [
      { caption: '[Figure — explorations or prototypes]' },
      { caption: '[Figure — final design]', height: 'h-[500px]' },
    ],
    nextSlug: 'lucid-ai',
    nextTitle: 'Lucid AI',
  },
  {
    slug: 'awardco-login-flow-redesign',
    title: 'Reducing Authentication Friction',
    company: 'Awardco',
    // Role/period follow the résumé (public/resume.pdf) — the single source of truth.
    role: 'Product Design Intern',
    period: 'Oct 2025 – Apr 2026',
    team: 'Natalie McKenzie (PM) · Robert Jensen (Tech Lead) · Michelle Rodabough (UX Manager)',
    summary: 'Turning 7.7M failed logins into one guided path across SSO, MFA, and mobile.',
    tags: ['Mobile Design', 'Design Systems', 'UX Research'],
    headline: [
      '27s → 5.9s login decision (−78%)',
      '7.7M annual failed logins addressed',
      '−25% reported difficulty',
    ],
    tagline:
      'Turning 7.7 million failed logins into a unified, guided authentication system across SSO, MFA, and standard login.',
    overview:
      "Awardco is a B2B employee-recognition platform, and every company on it configures authentication differently — SSO, passwords, MFA, login codes. The result was a fragmented login experience that quietly became the platform's biggest point of friction: a year of login telemetry showed 7.7 million failed attempts, and login help was the top customer-support topic. I redesigned authentication end-to-end into a single guided path across mobile and desktop — eliminating redundant authentication steps without reducing security. In usability testing, the new SSO-first flow cut login decision time by 78%.",
    problemIntro:
      "Awardco's universal login only identified the user — it didn't authenticate them. After entering an email and a login code, users were routed to their company's login page and asked to fully authenticate again, often entering a second code. Mobile and desktop diverged (magic links vs. codes), deskless workers without work email on their phones were blocked entirely, and with multiple authentication methods shown upfront, users guessed wrong and failed repeatedly. The data made the case impossible to ignore:",
    problemPoints: [
      '7.7M failed login attempts in one year — 6.7M from password login alone, which succeeded only ~35% of the time',
      'Guided methods told a different story: SSO succeeded 98% of the time (32M+ logins), login codes 87.6%, MFA 86.2%',
      'Users authenticated twice — once at universal login, again on their company page — and felt stuck in a loop',
      'Login help was the single largest customer-support case topic',
      'Deskless and mobile users hit the most friction: magic-link vs. code inconsistencies and no SMS fallback',
    ],
    process: [
      {
        heading: 'Research at behavioral scale',
        body: "I grounded the project in three evidence streams: a year of login telemetry (45.9M attempts, broken down by method), support-case data showing login help as the top topic, and discovery interviews with Customer Success, Implementation, and company admins. I mapped every end-to-end authentication flow across mobile and desktop to locate exactly where each path fractured — fragmented entry points, inconsistent login paths, and failure points across SSO, password, and MFA flows.",
      },
      {
        heading: 'Reframing failure as a UX problem',
        body: "The 7.7M failures weren't security issues — they were UX failures. Users weren't choosing wrong passwords; they were choosing wrong methods. That reframe produced the strategy: design for the worst case first (deskless workers on mobile without work email), remove choice by routing users automatically from org to email to auth method, and standardize on one system with one predictable path.",
      },
      {
        heading: 'Testing SSO-first against password-first',
        body: "I usability-tested three variants of the sign-in surface — the old design as control, an SSO-first layout, and a password-first layout — using heatmaps and task metrics. SSO-first cut decision time from 27s to 5.9s (−78%) and raised confidence. Password-first was marginally faster (−83%), but it reinforced password usage — the least reliable method — working directly against SSO adoption goals. That trade-off, speed versus steering users onto the right path, decided the design.",
      },
      {
        heading: 'Guide the user, don’t ask them',
        body: "The new flow follows one principle: the system identifies, guides, and validates. Users enter an email; the system determines the right authentication method and routes them to it, surfacing the email at each step to prevent wrong-account attempts. The universal login code now persists as a secure token that satisfies MFA on the company page — eliminating the double code entry entirely, without weakening security. Proactive guidance replaced reactive errors: inline validation, resend timers, and spam-folder hints prevent failures before submission.",
      },
      {
        heading: 'Designing mobile-first for deskless workers',
        body: "Mobile is the primary access point for deskless users, so small screens set the constraints: only relevant options shown, a single streamlined path, and SMS authentication added as a fallback for workers without work email on their phones. The design then scaled up to desktop, where extra space enhances rather than defines the experience. Login, password reset, and MFA all moved onto one consistent, dynamically company-branded system.",
      },
      {
        heading: 'AI-accelerated prototyping with engineering',
        body: "To validate flows beyond static mocks, I built functional prototypes in VS Code using Copilot with real components and logic, iterating directly on a GitHub branch with the frontend engineers. Testing real behavior surfaced edge cases far earlier than handoff would have. I turned that workflow into the team's AI prototyping guide and led its early adoption across the design org.",
      },
    ],
    outcomes: [
      'Login decision time cut 78% in testing (27s → 5.9s), with confidence up and reported difficulty down 25%',
      'Eliminated redundant double authentication — the login code now persists as a secure token that counts as MFA',
      'One guided, consistent path across mobile and desktop, with SMS authentication added for deskless workers',
      'Unified login, reset, and MFA into a single company-branded system, replacing fragmented per-state UIs',
      'Established AI prototyping as a team practice, speeding iteration between design and engineering',
    ],
    heroSrc: '/work/awardco/final-unified-auth.png',
    heroCaption: 'Final unified authentication experience — one guided login across desktop and mobile',
    problemFigure: {
      src: '/work/awardco/failed-logins-data.png',
      caption: 'A year of login telemetry: password login drove failure at scale, while guided methods succeeded',
    },
    processFigures: [
      {
        src: '/work/awardco/iteration.png',
        caption: 'Iteration toward a guided system — from sketches through multi-directional ideation to the final SSO-first design',
      },
      {
        src: '/work/awardco/heatmap-testing.png',
        caption: 'Heatmap testing of control vs. SSO-first vs. password-first — SSO-first won on speed and steering users to the right path',
      },
    ],
    nextSlug: 'pattern-custom-reports',
    nextTitle: 'Pattern Custom Reports',
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug)
}

/*
 * Unfinished studies still carry '[Your role — e.g. …]' scaffolding. Anywhere
 * that copy would face a visitor — the at-a-glance row, the tile meta line,
 * page titles, OG cards — routes through this first, so a half-written study
 * renders as absent rather than as a bracketed to-do. Becomes a no-op the
 * moment the real value is filled in.
 */
export function isPlaceholder(value?: string): boolean {
  return !value || value.trim().startsWith('[')
}

/** `undefined` for placeholder or empty values, so callers can `??`/`&&` them away. */
export function real(value?: string): string | undefined {
  return isPlaceholder(value) ? undefined : value
}

/*
 * Team credits run long ("Name (PM) · Name (Eng Manager) · Name (Director)").
 * The at-a-glance row only has room for the first, so the rest become a count.
 */
export function shortTeam(team?: string): string | undefined {
  const value = real(team)
  if (!value) return undefined
  const members = value.split('·').map((m) => m.trim()).filter(Boolean)
  if (members.length <= 1) return value
  return `${members[0]} +${members.length - 1}`
}
