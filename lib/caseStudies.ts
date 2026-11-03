export type ProcessStep = {
  heading: string
  body: string
  /** A figure shown right under this step, for a study whose beats are things to look at. */
  figure?: Figure
  /** Full phone screens shown under this step as a carousel (components/ScreenCarousel). */
  screens?: Screen[]
  /** Two captures of the same screen, old and new, shown side by side
      with Before / After under each. Phone-shaped pairs get phone frames. */
  compare?: Compare
}

export type Compare = {
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
  /** Width over height of both images. */
  aspect: number
  caption: string
  /** A phone screen: framed and held to phone width instead of the column. */
  phone?: boolean
}

export type Screen = {
  src: string
  /** What is on the screen, for a reader who cannot see it. */
  alt: string
  /** The short name under the dot: "Feed", "Stats", "Coach". */
  label: string
}

export type Figure = {
  src?: string
  caption: string
  height?: string
  /** A figure that is a door, not a picture to inspect: clicking opens this URL instead of the lightbox. */
  href?: string
}

/** One layer of a study's tech stack: "The app", "The site". */
export type StackGroup = {
  label: string
  /** Each tool, and what it does in this project. */
  items: { name: string; use: string }[]
}

export type CaseStudy = {
  slug: string
  title: string
  company: string
  /** The study's accent color — drives its OG card and page `--accent`. */
  accent: string
  role: string
  period: string
  team?: string
  /** Facts for the story header's grid; the bespoke pages hardcode theirs. */
  tools?: string
  skills?: string
  /** Where the work is live, for the facts grid. */
  site?: { href: string; label: string }
  /** One line for the work-grid tile. Kept here so tile copy can't drift from the case study. */
  summary: string
  /** 2–3 short metrics for the at-a-glance row. Omit until the study has real numbers. */
  headline?: string[]
  /*
   * The article, for studies the generic /work/[slug] template renders.
   *
   * All optional, because most studies don't use them: the three written
   * ones have bespoke pages under app/work/<slug> and take only the tile
   * and prev/next fields from here, and an unwritten one has no article
   * yet by definition. They were required until 2026-09-22, which meant
   * every entry had to carry a full set of bracketed stand-ins to satisfy
   * the type — forty of them across Lucid and Hoth, unreachable but one
   * routing change away from rendering "[Step 1 — e.g. Discovery &
   * research]" to a visitor. Absent says the same thing and can't leak.
   */
  tagline?: string
  overview?: string
  problemIntro?: string
  problemPoints?: string[]
  process?: ProcessStep[]
  outcomes?: string[]
  heroSrc?: string
  heroCaption?: string
  /*
   * The hero band's colour when the hero is a photograph rather than a
   * device frame: set it to the picture's own ground so the band and the
   * picture read as one surface (Pitch's app capture sits on a pale
   * wash; on the accent blue the picture looked pasted on).
   */
  heroGround?: string
  /** The tech stack, as its own act after the work: a snapshot of what was built on. */
  stack?: StackGroup[]
  problemFigure?: Figure
  processFigures?: Figure[]
  /*
   * The three section labels, for a study whose shape is not
   * problem/process/outcome. The template's defaults are "Problem",
   * "Process" and "Outcome"; Pitch, which is being built rather than
   * looked back on, says "Why", "What we are building" and "Where it stands".
   */
  eyebrows?: { problem?: string; process?: string; outcome?: string; impact?: string; stack?: string }
  /*
   * Leave the Timeline fact off the at-a-glance row. `period` still feeds
   * the year on the home tile; this only keeps it off the page, for a
   * study about what is being built rather than when (Pitch, Luke
   * 2026-10-14: "take out the whole PR and timeline thing").
   */
  hideTimeline?: boolean
  /**
   * Header layout: summary across the full column, facts in a row below it
   * (MetaGrid `stacked`). Off by default; Pitch uses it (LUK-199).
   */
  metaStacked?: boolean
  /*
   * "The project at a glance": the big-number row under the hero, as on the
   * bespoke studies. `lead` is the bold start of the caption, `rest` the
   * plain words after it.
   */
  glance?: { value: number | string; suffix?: string; lead: string; rest?: string }[]
  nextSlug?: string
}

export const caseStudies: CaseStudy[] = [
  {
    /*
     * The article itself is the bespoke page at app/work/lucid-ai/page.tsx —
     * this entry only feeds the home-grid tile and the prev/next chain.
     */
    slug: 'lucid-ai',
    title: 'Bringing Lucid AI to the homepage',
    company: 'Lucid',
    accent: '#f96b13',
    role: 'Product Design Intern',
    period: 'May – Aug 2026 · 12 weeks',
    team: 'Two scrum teams: search + AI',
    summary: 'An AI assistant that finds, summarizes, and creates work from the Lucid homepage.',
    headline: [
      'General availability on every tier in 12 weeks',
      'Four core skills: Find docs, Summarize, Build a diagram, Catch up',
    ],
    tagline:
      'An AI assistant that helps users find, understand, and create work from the Lucid homepage.',
    nextSlug: 'awardco-login-flow-redesign',
  },
  {
    /*
     * The article itself is the bespoke page at
     * app/work/pattern-custom-reports/page.tsx — this entry feeds the
     * home-grid tile, the prev/next chain, and the chat zero-state.
     *
     * Sourced from the 2026-08 interview record, which is kept out of
     * this repo (see .gitignore). Its build decisions are binding:
     * - Canonical numbers only: Pendo baseline ~60% trial / ~15% retention
     *   (vs ~28–35% benchmarks), 30–60 min manual reporting, 50+ interviews,
     *   20-user testing, 9-week project.
     * - The redesign was BUILT AFTER THE INTERNSHIP — impact is framed as
     *   "validated through usability testing and shipped after my internship".
     *   The old 80%-adoption / +50%-satisfaction figures are cut entirely.
     * - Filter override behavior is unverified — say "clearer, editable after
     *   creation" and nothing more specific.
     */
    slug: 'pattern-custom-reports',
    title: 'Custom Reports in Predict',
    company: 'Pattern',
    accent: '#1d7cf3',
    role: 'Product Design Intern',
    // Résumé dates; the Custom Reports project itself ran 9 weeks inside them.
    period: 'Jan – Oct 2025',
    team: 'Julie Broadbent (Design Manager) · Mitch Park (Director of Product)',
    summary: 'Rebuilding the failed reporting tool brand managers had abandoned for Excel.',
    headline: [
      '60% tried the old tool — only 15% stayed',
      'Validated with 20 users in live testing',
      'Shipped by the team after handoff',
    ],
    tagline:
      "Redesigning Predict's abandoned reporting tool so brand managers could build, edit, and share multi-metric client reports without falling back to Excel.",
    overview:
      "Pattern's Predict platform had a Custom Reports tool built to replace the export-to-Excel reporting grind — and a year in, almost nobody used it. Pendo showed roughly 60% of eligible users had tried it, but only about 15% came back, well under enterprise retention benchmarks. The demand was real; the experience was failing it. Starting from a one-line ticket and 50+ discovery interviews, I made the case for a redesign, scoped it to 9 weeks with product and design leadership, rebuilt the core report-building experience, and validated it with 20 users. The team built and shipped it after my internship ended.",
    problemIntro:
      "Brand managers at Pattern each juggle around six brands and are the primary point of contact for brand partners — reporting performance is a core part of their week. The old tool made that painful: charts were capped at two metrics, so comparing ad spend against sales lift in one view was impossible, and both brand managers and ad strategists fell back to stitching screenshots and Excel exports into client decks.",
    problemPoints: [
      '60% of eligible users tried Custom Reports in its first year; only ~15% returned — versus ~28–35% enterprise retention benchmarks',
      'Assembling one client-ready report took 30–60 minutes across Predict, Excel, and slides',
      'Charts capped at two metrics — no way to compare ad spend against sales lift in one view',
      'Filters were locked at creation and their effects were opaque, so editing often meant rebuilding',
      'Separate view and edit modes hid basic actions like add, duplicate, and rearrange',
    ],
    process: [
      {
        heading: 'A one-line ticket, pulled on its thread',
        body: "My first project at Pattern was a small ClickUp ticket: let users duplicate a widget. Working the flow, I realized duplication treated a symptom — people cloned widgets because building reports was slow, confusing, and inflexible. I carried that question into the weekly continuous-discovery interviews I was already running, and reporting workarounds kept surfacing across otherwise unrelated conversations.",
      },
      {
        heading: 'Building the case',
        body: "I synthesized the interview patterns, checked Pendo — high trial, poor retention, so a usability problem rather than a demand problem — and brought the opportunity to the Predict product and design team. Once we agreed it was worth pursuing, I scoped a 9-week project with my design manager and our Director of Product, focused on the core report-building experience: creating reports, configuring widgets and filters, and editing content.",
      },
      {
        heading: 'Prioritize under real constraints',
        body: "No new data sources, a fixed design system, and limited engineering capacity meant scope discipline: the smallest set of high-impact changes that could realistically ship. A drag-and-drop builder matched advanced users' mental models but exceeded the roadmap, so I kept its underlying value — flexible report construction — in a structured, feasible flow, and deferred drill-downs, pivot-style analysis, and new integrations.",
      },
      {
        heading: 'The redesign',
        body: "A templates-and-tiles home replaced the text list, a guided modal flow replaced the side drawer for new reports, a first-run wizard explained the settings that used to be opaque, charts broke the two-metric cap, and reports gained share, export, and scheduled email sending. Filters became clearer and editable after creation instead of locked in.",
      },
      {
        heading: 'Testing killed my favorite assumption',
        body: "I tested the redesigned flows in 20 usability sessions — 10 brand managers, 10 advertising strategists. I'd assumed users wanted separate view and edit modes; watching managers edit graphs live with clients in the room killed that, and the shipped design uses one combined mode. To seed the new Templates feature, I ran a report-building competition with prizes — the winning reports became the shipped templates.",
      },
      {
        heading: 'Handoff & honest impact',
        body: "I handed off annotated specs, the prototype, documentation, and a backlog; the team built and shipped Custom Reports after my internship ended. The impact I can claim is what testing showed — both user groups building multi-metric reports quickly and confidently against a 30–60 minute baseline — and I frame it exactly that way.",
      },
    ],
    outcomes: [
      'Redesign validated through usability testing with 20 brand managers and ad strategists, then shipped by the team after my internship',
      'Broke the two-metric chart cap — multi-metric comparison became the core of the in-report experience',
      'Templates seeded from a prized report-building competition among the tool’s actual users',
      'Full handoff: annotated specs, prototype, documentation, and a follow-up testing plan',
    ],
    heroSrc: '/work/pattern/figma/new-home.png',
    heroCaption: 'Final design — the redesigned Custom Reports home: templates plus a previewing tile grid',
    problemFigure: {
      src: '/work/pattern/figma/old-preview-mode.png',
      caption: 'The old UI — two-metric charts, buried controls, and filters you couldn’t change after creation',
    },
    processFigures: [
      {
        src: '/work/pattern/discovery-board.png',
        caption: 'Discovery — auditing the existing reporting flows and collecting feature feedback',
      },
      {
        src: '/work/pattern/figma/modal-general.png',
        caption: 'The guided create-report modal — filter scope explained before you build',
      },
      {
        src: '/work/pattern/figma/widget-redesign.png',
        caption: 'Final in-report design — multi-metric comparison with color customization',
      },
    ],
    // Pitch, not Hoth: Hoth is still gated, and a public study must never link to a locked door.
    nextSlug: 'pitch',
  },
  {
    slug: 'hoth',
    title: 'Hoth Landing Page',
    company: 'Hoth',
    accent: '#008fff',
    role: 'Product Design Intern',
    period: 'Dec 2024 – Apr 2025',
    summary: 'Brand identity and landing page for an encrypted work platform.',
    nextSlug: 'lucid-ai',
  },
  {
    /*
     * The article itself is the bespoke page at
     * app/work/awardco-login-flow-redesign/page.tsx — this entry feeds the
     * home-grid tile, the prev/next chain, and the chat zero-state.
     */
    slug: 'awardco-login-flow-redesign',
    title: 'Reducing Authentication Friction',
    company: 'Awardco',
    accent: '#008fff',
    // Role/period follow the résumé (public/resume.pdf) — the single source of truth.
    role: 'Product Design Intern',
    period: 'Oct 2025 – Apr 2026',
    team: 'Natalie McKenzie (PM) · Robert Jensen (Tech Lead) · Michelle Rodabough (UX Manager)',
    summary: 'Unifying login, MFA, recovery, and SSO across desktop and mobile.',
    headline: [
      '27s → 5.9s login decision (−78%)',
      '25% faster login in testing',
      '+4.5% successful sign-ins',
    ],
    tagline:
      "Redesigning Awardco's login, MFA, SSO, recovery, and mobile verification into one guided authentication system — 25% faster logins and 4.5% more successful sign-ins.",
    overview:
      "Awardco's authentication was fragmented across login, MFA, SSO, password recovery, and mobile verification, and a year of telemetry showed 7.7 million failed login attempts. I redesigned the system end-to-end into one guided path, building coded prototypes and testing with more than 20 users to validate the flow ahead of handoff. In usability testing, the redesign delivered a 25% faster login and a 4.5% increase in successful sign-ins.",
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
        body: "I usability-tested three variants of the sign-in surface — the old design as control, an SSO-first layout, and a password-first layout — using heatmaps and task metrics. SSO-first cut decision time from 27s to 5.9s (−78%) and raised confidence over the old design. Password-first was marginally faster still (−83%) and edged it on confidence, but it reinforced password usage — the least reliable method — working directly against SSO adoption goals. That trade-off, speed versus steering users onto the right path, decided the design.",
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
      'Login-method decision time cut 78% in testing (27s → 5.9s), with confidence and reported difficulty both improved over the old design',
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
  },
  {
    /*
     * A living study. Pitch is being built right now, and this page is
     * written alongside it rather than reconstructed afterwards. It was
     * password-gated from 2026-10-09 (LUK-76) until Luke promoted it on
     * 2026-10-14 (LUK-77); it has had a tile on the home canvas since
     * LUK-122 the same day.
     *
     * House rules for this entry, which future edits keep:
     * - Impact first, few words. Each beat is what changed and why it
     *   mattered, in one or two sentences. If a line needs a third, cut it.
 * - What was built, not how it was shipped: no pull request or process
 *   talk (Luke, 2026-10-14). The Timeline fact shows since LUK-199.
     * - No pilot customer names or pilot figures. Product screens are fine
     *   here because the gate holds them; public positioning (usepitch.app)
     *   is fine to repeat anywhere.
     * - Role and dates follow the résumé; `period` stays open-ended.
     * - Out of the prev/next chain on purpose (no nextSlug, nothing points
     *   here), so public studies never link to a locked door.
     * - Luke AI knows nothing about Pitch yet (lib/lukeAiFacts.ts). That is
     *   deliberate: the truth layer gets Pitch when the study is promoted.
     * - The figures: every one is a real app screen from the simulator on
     *   the Private look (LUK-119). Since 2026-11-03 (LUK-195) the study is
     *   the app work only: Luke's role is contract design and engineering,
     *   and no hardware is described (the nametag was dropped, LUK-194).
     *   The site figure and the recording screen are captures of
     *   usepitch.app taken 2026-11-03 with the pilot-count lines hidden;
     *   the stack is a snapshot from the repos the same day.
     */
    slug: 'pitch',
    title: 'Building Pitch',
    company: 'Pitch',
    // Cornflower, the brand accent locked 2026-10-13 (LUK-119).
    accent: '#4c7be8',
    // Named as contract design and engineering (Luke, 2026-11-03, LUK-195).
    role: 'Contract designer and engineer',
    // Shown since LUK-199 (Luke, 2026-11-03): the header carries Role,
    // Timeline, Tools and Built only, under a full-width summary.
    period: 'Sep 2026 – present',
    metaStacked: true,
    tools: 'Figma, React Native, Expo, Supabase, Next.js, Claude Code',
    summary: 'An AI coach for face-to-face sales. I redesigned the app and built its core flows.',
    headline: [
      'A full redesign of the rep app, every screen',
      'Recording, Stats and Coach, designed and built end to end',
      'Live with a pilot team',
    ],
    tagline:
      'Pitch is an AI sales coach for people who sell face to face, like door-to-door and field reps. A rep taps record at the start of a shift, and Pitch turns the day into scored conversations and coaching on what to say next time.',
    overview:
      'The aim: give every rep the feedback a great manager would, without asking them to log anything. I joined the two founders on contract to design and build the app. I redesigned the rep app and built its three core flows: recording, Stats and Coach.',
    eyebrows: {
      problem: 'Why',
      process: 'What I built',
      outcome: 'Where it stands',
      impact: 'Built',
    },
    problemPoints: [
      'Sales teams keep years of records and have never heard the conversation behind any of them',
      'Reps will not log anything, so every number has to come from the recording',
      'An app that listens all day gets abandoned the moment it feels like surveillance',
    ],
    process: [
      {
        heading: 'The redesign',
        body: 'The old app was loud: hard black outlines, square corners, a heavy display face, and a brand red beside the red that meant “fix this”. I rebuilt it light and calm: a serif for the numbers, one cornflower accent that never touches a score, and every screen moved onto it.',
        figure: {
          src: '/work/pitch/design-system.png',
          caption: 'The system, drawn from the app’s own tokens: type, colour, the feed card, score bands and the tab bar. Bottom middle, a card rebuilt from the old theme.',
        },
      },
      {
        heading: 'Recording',
        body: 'The main flow. A rep starts recording at the top of a shift and forgets it: it runs in the background, survives a locked phone, and an on-device speech model splits the day into doors. Each door lands in the feed scored, with its clip and one line of coaching.',
        figure: {
          src: '/work/pitch/record-screen.png',
          caption: 'The recording screen: one timer, the door count, and a stop button',
        },
      },
      {
        heading: 'Stats',
        body: 'Pace, not just totals: sales this week against the goal, today’s conversations, pitches and close attempts against targets, and a field-day streak.',
        screens: [
          {
            src: '/work/pitch/screen-stats.png',
            label: 'Stats',
            alt: 'Stats: sales this week against the goal with a pace line, today’s conversations, pitches and close attempts against targets, and a field-day streak',
          },
        ],
      },
      {
        heading: 'Coach',
        body: 'A lost door becomes practice. The rep sees the objection, what they said, a stronger answer, and a guided two-minute roleplay.',
        screens: [
          {
            src: '/work/pitch/screen-coach.png',
            label: 'Coach',
            alt: 'Coach: an objection the rep lost a door on, quoted from the transcript with what the rep said, a button to show a good response, and a two-minute roleplay',
          },
        ],
      },
      {
        heading: 'The site',
        body: 'I designed and built usepitch.app for everyone who sells face to face: the app up front, how a pitch gets scored, the manager dashboard, and a demo request on every button.',
        figure: {
          src: '/work/pitch/site-hero.png',
          caption: 'usepitch.app, the hero: the app is the product shot, and every button books a demo',
          href: 'https://usepitch.app',
        },
      },
      {
        heading: 'My role',
        body: 'Contract design and engineering. I designed the screens, built them in React Native, wired them to the data, and shipped them to the pilot team.',
      },
    ],
    outcomes: [
      'Every screen of the rep app runs on the new design',
      'A pilot team records a full shift and sees coaching without touching anything but the record button',
      'Stats and Coach are live, both built from the rep’s own doors',
    ],
    heroSrc: '/work/pitch/app-feed.png',
    heroCaption: 'The feed: every door scored, with its clip and one line of coaching',
    // The capture's own ground, sampled from its middle band.
    heroGround: '#eef0f8',
    // Product facts only: pilot figures stay off the page (Luke, 2026-10-14).
    glance: [
      // Counted 2026-11-03 from Luke's commits on pitch-mobile main (local
      // clone; GitHub access ended that day): 37 of the app's 42 screen
      // files and 21 new component files.
      { value: 37, lead: 'screens', rest: 'reworked in the redesign' },
      { value: 21, lead: 'components', rest: 'built new for it' },
      { value: 3, lead: 'core flows', rest: 'designed and built: recording, Stats and Coach' },
    ],
    // A snapshot as of 2026-11-03 (LUK-195), read from the app and site
    // repos' package.json: Luke may lose repo access, so it lives here.
    stack: [
      {
        label: 'The app',
        items: [
          { name: 'React Native 0.86 and Expo 57', use: 'the iOS app, with over-the-air updates for JS-only changes' },
          { name: 'Supabase', use: 'sign-in, Postgres with row-level security, and audio storage' },
          { name: 'Silero VAD on ONNX Runtime', use: 'on-device speech detection that splits a shift into doors' },
          { name: 'expo-audio and expo-location', use: 'background recording and the address for each door' },
          { name: 'React Navigation', use: 'the tab bar with the record button at its centre' },
          { name: 'Face ID', use: 'the returning-rep sign-in, via expo-local-authentication' },
          { name: 'Lucide and Instrument Serif', use: 'the icon set and the numbers type in the redesign' },
        ],
      },
      {
        label: 'The site',
        items: [
          { name: 'Next.js 16 and React 19', use: 'usepitch.app, on Vercel' },
          { name: 'Tailwind CSS 4', use: 'the layout and the light, calm look' },
          { name: 'GSAP and Lenis', use: 'the scroll-pinned story sections' },
          { name: 'Sentry', use: 'error reporting' },
        ],
      },
      {
        label: 'How I work',
        items: [
          { name: 'Figma', use: 'screens and the design system' },
          { name: 'Claude Code', use: 'pairing on the code, from the app to the site' },
          { name: 'Linear and GitHub', use: 'every change tracked from issue to merge' },
        ],
      },
    ],
    nextSlug: 'lucid-ai',
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

/*
 * Studies with a bespoke page and OG card under app/work/<slug>. Those static
 * segments shadow the app/work/[slug] template, so the template must not also
 * generate them — once for the page, once for the preview image.
 *
 * Kept here rather than in either route because both need it and neither owns
 * it: app/work/[slug]/page.tsx skips these when prerendering, and
 * app/work/[slug]/opengraph-image.tsx skips them for the same reason.
 */
export const BESPOKE_SLUGS: ReadonlySet<string> = new Set([
  'lucid-ai',
  'awardco-login-flow-redesign',
  'pattern-custom-reports',
])
