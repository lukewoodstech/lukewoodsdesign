/*
 * The one canonical truth layer for Luke AI.
 *
 * Every number, status, and qualifier the assistant is allowed to state
 * lives here, once, with the wording it may use and the interpretations it
 * may not make. The system prompt (lib/lukeAiPrompt.ts) is rendered from
 * this file; the regression tests (tests/) read it directly. Nothing about
 * a project should be asserted in a prompt, a suggestion, a component, or
 * page metadata unless it can be traced back to a claim below.
 *
 * Source of truth for the claims is the current case-study copy:
 *   app/work/lucid-ai/page.tsx
 *   app/work/awardco-login-flow-redesign/page.tsx
 *   app/work/pattern-custom-reports/page.tsx
 * plus lib/caseStudies.ts (tile data) and public/resume.pdf. A claim whose
 * source is "luke-2026-09-17" came from Luke's written brief of that date
 * and is not yet displayed on a page.
 *
 * Status vocabulary (in order of how far the work got):
 *   baseline    a before-state measurement; not something Luke produced
 *   tested      observed in a usability test or prototype session
 *   validated   the design decision the tests settled
 *   approved    passed an internal review (architecture, security)
 *   handed-off  delivered to the team for implementation
 *   shipped     released to users
 *   post-launch measured after release — the portfolio has none of these
 */

export type Company = 'Lucid' | 'Awardco' | 'Pattern' | 'Hoth'

export type ClaimStatus =
  | 'baseline'
  | 'tested'
  | 'validated'
  | 'approved'
  | 'handed-off'
  | 'shipped'
  | 'post-launch'

export type ClaimScope = 'project' | 'internship-wide' | 'company-wide'

export type Claim = {
  id: string
  company: Company
  project: string
  /** Short label for the claim. */
  claim: string
  /** The exact wording Luke AI may use. */
  wording: string
  status: ClaimStatus
  scope: ClaimScope
  /** Route or file the claim can be checked against. */
  source: string
  /** Other phrasings that keep the meaning. */
  allowed?: string[]
  /** Interpretations that change the meaning — never say these. */
  prohibited?: string[]
  /** A qualifier that must travel with the claim whenever it is stated. */
  qualifier?: string
}

export type Engagement = {
  company: Company
  role: string
  period: string
  /** The three featured case studies are 'internship'; Hoth is an earlier
      startup internship that is named separately, never totaled with them. */
  kind: 'internship' | 'startup-internship'
  route?: string
  summary: string
}

/* ── Positioning ── */

export const POSITIONING =
  'Luke is a product designer who combines research, systems thinking, technical prototyping, and business judgment to ship useful products.'

/* ── Engagements ── */

export const ENGAGEMENTS: readonly Engagement[] = [
  {
    company: 'Lucid',
    role: 'Product Design Intern',
    period: 'May to August 2026',
    kind: 'internship',
    route: '/work/lucid-ai',
    summary:
      'Visual collaboration platform. Designed the Lucid AI assistant for the homepage: find documents by what you remember, summarize, catch up, or generate a new board.',
  },
  {
    company: 'Awardco',
    role: 'Product Design Intern',
    period: 'October 2025 to April 2026',
    kind: 'internship',
    route: '/work/awardco-login-flow-redesign',
    summary:
      'Employee-recognition platform. Redesigned fragmented authentication (login, MFA, SSO, password recovery, mobile verification) into one guided system.',
  },
  {
    company: 'Pattern',
    role: 'Product Design Intern',
    period: 'January to October 2025',
    kind: 'internship',
    route: '/work/pattern-custom-reports',
    summary:
      'Ecommerce accelerator. Redesigned the Custom Reports workflow in the Predict platform over a nine-week project.',
  },
  {
    company: 'Hoth',
    role: 'Product Design Intern',
    period: 'December 2024 to April 2025',
    kind: 'startup-internship',
    summary:
      'Encrypted work platform startup (formerly Mention). An earlier product-design internship at an early-stage startup; not one of the three featured case studies, and always named separately from them. The case study is password-protected while it is written.',
  },
]

export const INTERNSHIPS = ENGAGEMENTS.filter((e) => e.kind === 'internship')

/* ── Claims ── */

export const CLAIMS: readonly Claim[] = [
  /* ────────── Lucid ────────── */
  {
    id: 'lucid-ga-12-weeks',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: 'Blank page to general availability in 12 weeks',
    wording: 'The project went from a blank page to general availability in 12 weeks.',
    status: 'shipped',
    scope: 'project',
    source: '/work/lucid-ai',
    allowed: ['shipped to general availability 12 weeks from zero'],
    prohibited: [
      'that Luke shipped it alone (two scrum teams, Search and AI, built it)',
      'any adoption, usage, retention, search-success, or revenue figure',
    ],
  },
  {
    id: 'lucid-all-tiers',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: 'Released across every Lucid tier',
    wording:
      'On August 5 it was released to general availability across every Lucid tier, free through enterprise.',
    status: 'shipped',
    scope: 'project',
    source: '/work/lucid-ai',
  },
  {
    id: 'lucid-internal-release',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: 'Internal release on July 20',
    wording:
      'The assistant reached internal users on July 20, and that early release exposed friction the team had not predicted.',
    status: 'shipped',
    scope: 'project',
    source: '/work/lucid-ai',
  },
  {
    id: 'lucid-four-skills',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: 'Four core skills',
    wording:
      'The four final skills were Find docs, Summarize, Build a diagram, and Catch up.',
    status: 'shipped',
    scope: 'project',
    source: '/work/lucid-ai',
  },
  {
    id: 'lucid-20-capabilities',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: 'More than 20 capabilities prototyped before the cut to four',
    wording:
      'More than 20 potential capabilities were prototyped and tested before the experience was narrowed to four core skills.',
    status: 'tested',
    scope: 'project',
    source: '/work/lucid-ai',
  },
  {
    id: 'lucid-twelve-sessions',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: '12 external user sessions',
    wording: 'Luke ran 12 external user sessions for research and testing.',
    status: 'tested',
    scope: 'project',
    source: 'luke-2026-09-17 (confirmed by Luke; not yet on the page)',
    prohibited: ['any other interview or session count for Lucid'],
  },
  {
    id: 'lucid-problem',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: 'The before state: search only matched titles',
    wording:
      'Before the project, homepage search matched keywords in document titles only; people remembered what a document was about, not its title.',
    status: 'baseline',
    scope: 'project',
    source: '/work/lucid-ai',
    prohibited: ['any percentage for search success before or after the project'],
  },
  {
    id: 'lucid-side-panel',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: 'Side panel with a full-page expand state',
    wording:
      'Luke explored multiple layouts. The side panel let users keep viewing and using their documents while chatting, and a full-page state, reachable from the panel, gave room for longer conversations.',
    status: 'shipped',
    scope: 'project',
    source: '/work/lucid-ai',
  },
  {
    id: 'lucid-results-component',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: 'Compact results with an AI summary',
    wording:
      'Luke designed a compact document result with a one-line AI-generated summary, up to seven results in view; hovering a result showed last modified, owner, and team.',
    status: 'shipped',
    scope: 'project',
    source: '/work/lucid-ai',
  },
  {
    id: 'lucid-mention',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: '@mention resolves a collaborator before the search runs',
    wording:
      'After the early release showed the assistant guessing wrong about collaborators, Luke designed an @mention interaction that resolves the person before the search runs.',
    status: 'shipped',
    scope: 'project',
    source: '/work/lucid-ai',
  },
  {
    id: 'lucid-failure-states',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: 'Failure states hand the user a next step',
    wording:
      'Failure states shipped with the release: asked for something out of scope, the assistant names the limit and offers what it can do. The working state reuses the editor assistant’s pattern so the two assistants stay consistent.',
    status: 'shipped',
    scope: 'project',
    source: '/work/lucid-ai',
  },
  {
    id: 'lucid-ab-test',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: 'A/B test designed before leaving',
    wording:
      'Before leaving, Luke designed and implemented an A/B test comparing the side panel and full-page experiences and measuring which capabilities performed best.',
    status: 'handed-off',
    scope: 'project',
    source: '/work/lucid-ai',
    prohibited: ['any result of that A/B test; Luke left before results were available'],
  },
  {
    id: 'lucid-no-adoption-data',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: 'No long-term adoption data',
    wording:
      'Luke’s internship ended shortly after the external release, so he does not have long-term adoption data.',
    status: 'shipped',
    scope: 'project',
    source: '/work/lucid-ai',
    qualifier: 'State this whenever adoption, usage, or impact after release comes up.',
  },
  {
    id: 'lucid-limitation',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: 'Known limitation: two assistants, no shared context',
    wording:
      'One limitation remained: the AI inside the editor and the docs-list AI could not share context. Luke handed off designs for memory controls and chat history so the team could keep building toward it.',
    status: 'handed-off',
    scope: 'project',
    source: '/work/lucid-ai',
  },
  {
    id: 'lucid-tradeoffs',
    company: 'Lucid',
    project: 'Lucid AI on the homepage',
    claim: 'Tradeoffs worked through with engineers',
    wording:
      'Every decision involved tradeoffs between speed, cost, and usability; having enough technical understanding to work through them with engineers expanded what Luke was able to design. The team shipped quickly because the feedback loop never stopped: users saw each round and engineers saw designs within days.',
    status: 'shipped',
    scope: 'project',
    source: '/work/lucid-ai',
  },

  /* ────────── Awardco ────────── */
  {
    id: 'awardco-telemetry-baseline',
    company: 'Awardco',
    project: 'Authentication redesign',
    claim: 'One year of login telemetry (before state)',
    wording:
      'A year of login telemetry showed 45.9 million login attempts, 7.7 million failed attempts (6.7 million from password login alone), 34.6% success for password login, 98% success for SSO, and 9,275 login-related support cases in 90 days.',
    status: 'baseline',
    scope: 'company-wide',
    source: '/work/awardco-login-flow-redesign',
    allowed: ['password login failed nearly two out of three times'],
    prohibited: [
      'that Luke reduced, cut, prevented, or eliminated the 7.7 million failures; these numbers describe the problem before the redesign',
      'any number of failures after the redesign',
    ],
    qualifier: 'This is the before state that motivated the project, not an outcome.',
  },
  {
    id: 'awardco-reframe',
    company: 'Awardco',
    project: 'Authentication redesign',
    claim: 'Users chose the wrong method, not the wrong password',
    wording:
      'The evidence reframed the problem: users were choosing the wrong authentication method, not entering the wrong password, so the new system identifies users by email and routes them to the method most likely to work.',
    status: 'validated',
    scope: 'project',
    source: '/work/awardco-login-flow-redesign',
  },
  {
    id: 'awardco-three-variants',
    company: 'Awardco',
    project: 'Authentication redesign',
    claim: 'Three directions tested with 75 people',
    wording:
      'Luke tested three login directions with 75 people across Awardco: the existing experience, an SSO-first design, and a password-first design. The existing experience took an average of 27 seconds to decide where to begin; SSO-first cut that to 5.9 seconds; password-first was faster still at 4.6 seconds and scored slightly higher on confidence.',
    status: 'tested',
    scope: 'project',
    source: '/work/awardco-login-flow-redesign',
    qualifier:
      'An internal study comparing the three sign-in directions; the numbers are test results. The before-and-after usability results are a separate measurement, and the portfolio does not state how many people took part in it.',
    prohibited: ['describing the 75-person study as the before-and-after validation of the whole redesign'],
  },
  {
    id: 'awardco-chose-sso-first',
    company: 'Awardco',
    project: 'Authentication redesign',
    claim: 'Chose SSO-first over the faster password-first design',
    wording:
      'Luke still chose SSO-first: password-first won the task test, but it emphasized the method that failed nearly two out of three times in the real product, so the fastest design was not the one most likely to help users sign in.',
    status: 'validated',
    scope: 'project',
    source: '/work/awardco-login-flow-redesign',
  },
  {
    id: 'awardco-usability-results',
    company: 'Awardco',
    project: 'Authentication redesign',
    claim: 'Before-and-after usability testing results',
    wording:
      'In before-and-after usability testing, the redesigned system produced a 25% faster login, a 4.5% increase in successful sign-ins, a 78% reduction in login-method decision time (27 seconds to 5.9 seconds), and higher confidence with lower reported difficulty.',
    status: 'tested',
    scope: 'project',
    source: '/work/awardco-login-flow-redesign',
    allowed: ['+4.5% successful sign-ins in usability testing', '4.5% more successful sign-ins in testing'],
    prohibited: [
      'a reduction in failed logins of any size',
      'a production, post-launch, or live metric',
      'converting successful sign-ins into failed-login numbers',
    ],
    qualifier: 'Usability-test results, never production analytics.',
  },
  {
    id: 'awardco-external-prototype-testing',
    company: 'Awardco',
    project: 'Authentication redesign',
    claim: 'Coded prototypes tested with more than 20 admins and end users',
    wording:
      'Luke built working prototypes with real inputs, validation, and code entry, and tested them with more than 20 admins and end users, which exposed friction around email entry, verification codes, and especially password recovery.',
    status: 'tested',
    scope: 'project',
    source: '/work/awardco-login-flow-redesign',
  },
  {
    id: 'awardco-token',
    company: 'Awardco',
    project: 'Authentication redesign',
    claim: 'The token-based flow passed architecture and security review',
    wording:
      'Luke proposed that the first login code create a secure token that persists to the company’s login page, removing the second code entry. He mapped the system as states and transitions and worked it through engineering, architecture, and security review, where it passed without material changes. Engineering owned the implementation details; Luke owned the concept and end-to-end experience.',
    status: 'approved',
    scope: 'project',
    source: '/work/awardco-login-flow-redesign',
    prohibited: ['that the token flow is live or has been measured in production'],
  },
  {
    id: 'awardco-handoff',
    company: 'Awardco',
    project: 'Authentication redesign',
    claim: 'Validated and handed off for implementation',
    wording:
      'The redesign was validated in usability testing and the completed designs were handed off for implementation after Luke’s internship.',
    status: 'handed-off',
    scope: 'project',
    source: '/work/awardco-login-flow-redesign',
    prohibited: [
      'that it launched, went live, or shipped',
      'any post-launch outcome; the portfolio has no verified post-launch data for Awardco',
    ],
    qualifier: 'Handed off, not launched. Say so whenever someone asks what happened after.',
  },
  {
    id: 'awardco-mobile-deskless',
    company: 'Awardco',
    project: 'Authentication redesign',
    claim: 'Mobile-first for deskless workers',
    wording:
      'Designed for deskless workers first: the mobile flow added SMS verification, showed only the authentication options the user’s company supports, and named the SSO provider (Google, Microsoft, Okta) instead of a generic SSO label.',
    status: 'handed-off',
    scope: 'project',
    source: '/work/awardco-login-flow-redesign',
  },
  {
    id: 'awardco-reset',
    company: 'Awardco',
    project: 'Authentication redesign',
    claim: 'Password reset redesigned with inline validation',
    wording:
      'The reset flow went from a disconnected page with a blind password field to inline validation, live password matching, a show-password option, and the same visual system as the rest of authentication.',
    status: 'handed-off',
    scope: 'project',
    source: '/work/awardco-login-flow-redesign',
  },
  {
    id: 'awardco-ai-prototyping-guide',
    company: 'Awardco',
    project: 'Authentication redesign',
    claim: 'Contributed the coded-prototype workflow to the team’s AI-prototyping guide',
    wording:
      'Luke contributed the coded-prototyping workflow to Awardco’s AI-prototyping guide and helped introduce it across the design team.',
    status: 'shipped',
    scope: 'internship-wide',
    source: '/work/awardco-login-flow-redesign',
  },
  {
    id: 'awardco-limitation',
    company: 'Awardco',
    project: 'Authentication redesign',
    claim: 'Known limitation: shared kiosks',
    wording:
      'One limitation remains: some deskless workers cannot carry phones and use shared kiosks, so SMS does not solve authentication for them. Kiosk research would be the next step.',
    status: 'handed-off',
    scope: 'project',
    source: '/work/awardco-login-flow-redesign',
  },

  /* ────────── Pattern ────────── */
  {
    id: 'pattern-usage-baseline',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: 'Trial versus return in the old tool (before state)',
    wording:
      'Available product data showed that roughly 60% of eligible users created at least one report during the feature’s first year, but only about 15% returned.',
    status: 'baseline',
    scope: 'project',
    source: '/work/pattern-custom-reports',
    allowed: ['roughly 60% of eligible users built a first report in year one; about 15% came back'],
    prohibited: [
      'any shortened version that drops "roughly", "eligible users", or "during the feature’s first year", or that relabels the 60% as trial or adoption',
      'the 15% as a bare retention metric; it is always users who returned or came back',
    ],
    qualifier: 'Keep "roughly", "eligible users", "during the feature’s first year", and "returned".',
  },
  {
    id: 'pattern-benchmarks',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: 'Enterprise retention benchmarks for comparison',
    wording:
      'That return rate sat well under enterprise retention benchmarks of roughly 28–35%.',
    status: 'baseline',
    scope: 'project',
    source: 'lib/caseStudies.ts',
    qualifier: 'Approximate benchmarks; only use them next to the 15% figure.',
  },
  {
    id: 'pattern-manual-baseline',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: 'Manual reporting took 30–60 minutes (before state)',
    wording:
      'Assembling one client-ready report took 30–60 minutes across Predict, Excel, and slides.',
    status: 'baseline',
    scope: 'project',
    source: 'lib/caseStudies.ts',
    prohibited: ['any hours-saved or time-saved figure of any size; none is verified for Custom Reports'],
  },
  {
    id: 'pattern-discovery-interviews',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: '50+ discovery interviews across the internship',
    wording:
      'Luke ran weekly discovery interviews throughout his Pattern internship, more than 50 in total, and reporting workarounds kept surfacing in conversations about other parts of Predict.',
    status: 'tested',
    scope: 'internship-wide',
    source: '/work/pattern-custom-reports',
    prohibited: ['that the 50+ interviews were conducted for Custom Reports specifically'],
    qualifier: 'Internship-wide, not project-specific.',
  },
  {
    id: 'pattern-uk-session',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: 'Focused session with four UK brand managers',
    wording:
      'He also held a focused session with four UK brand managers who had used Custom Reports.',
    status: 'tested',
    scope: 'project',
    source: '/work/pattern-custom-reports',
  },
  {
    id: 'pattern-ticket-origin',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: 'A one-to-two-day ticket became a nine-week redesign',
    wording:
      'The project started as a one-to-two-day ClickUp ticket to let users duplicate a widget. Luke treated duplication as a symptom, investigated the surrounding workflow, and turned the ticket into a proposal to redesign the core report-building experience, scoped to nine weeks with his design manager and the Director of Product.',
    status: 'validated',
    scope: 'project',
    source: '/work/pattern-custom-reports',
  },
  {
    id: 'pattern-problems',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: 'Four recurring problems in the old tool',
    wording:
      'Research showed four recurring problems: charts allowed only two metrics; filters were unclear and could not be edited after creation; separate view and edit modes hid basic actions; and a client-ready report still needed Excel, screenshots, or slides.',
    status: 'baseline',
    scope: 'project',
    source: '/work/pattern-custom-reports',
  },
  {
    id: 'pattern-canvas-cut',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: 'The drag-and-drop canvas was cut to the roadmap',
    wording:
      'Luke explored a Slides-style canvas that matched advanced users’ mental model but exceeded the engineering budget. He presented the concept, the evidence, and the tradeoffs; leadership made the scope decision; the full canvas moved to the roadmap and reordering shipped through a simpler list with drag handles.',
    status: 'validated',
    scope: 'project',
    source: '/work/pattern-custom-reports',
  },
  {
    id: 'pattern-usability-sessions',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: '20 usability sessions: 10 brand managers, 10 advertising strategists',
    wording:
      'Luke tested the redesigned flows in 20 usability sessions with 10 brand managers and 10 advertising strategists.',
    status: 'tested',
    scope: 'project',
    source: '/work/pattern-custom-reports',
    allowed: ['validated with 20 users in usability testing (ten brand managers, ten advertising strategists)'],
    prohibited: ['describing the participants by how often they used the product; describe them by role only'],
  },
  {
    id: 'pattern-combined-mode',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: 'Testing removed the separate edit mode',
    wording:
      'Testing showed brand managers editing charts while presenting to clients, so Luke removed the separate edit mode and combined viewing and editing into one experience. This was the most important change testing produced.',
    status: 'validated',
    scope: 'project',
    source: '/work/pattern-custom-reports',
  },
  {
    id: 'pattern-five-metrics',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: 'Charts went from two metrics to five',
    wording:
      'By handoff, users could compare up to five metrics in one chart instead of two, edit filters after creation, add, duplicate, delete, and reorder widgets, attach notes to shared charts, and export, share, or schedule report delivery.',
    status: 'validated',
    scope: 'project',
    source: '/work/pattern-custom-reports',
  },
  {
    id: 'pattern-templates',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: 'Templates came from a report-building competition',
    wording:
      'Luke ran a report-building competition with brand managers and advertising strategists; the strongest entries became the starting templates.',
    status: 'validated',
    scope: 'project',
    source: '/work/pattern-custom-reports',
  },
  {
    id: 'pattern-handoff',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: 'Handoff package',
    wording:
      'Luke delivered annotated designs, the prototype, supporting documentation, a prioritized backlog, and a follow-up testing plan.',
    status: 'handed-off',
    scope: 'project',
    source: '/work/pattern-custom-reports',
  },
  {
    id: 'pattern-shipped-after',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: 'Shipped by the Pattern team after the internship',
    wording:
      'The redesign was validated through usability testing and shipped by the Pattern team after Luke’s internship.',
    status: 'shipped',
    scope: 'project',
    source: '/work/pattern-custom-reports',
    prohibited: [
      'that it launched during the internship',
      'any post-launch adoption, retention, satisfaction, time-saved, or business-impact figure',
    ],
    qualifier: 'Always keep "after my internship" / "after his internship".',
  },
  {
    id: 'pattern-reflection',
    company: 'Pattern',
    project: 'Custom Reports in Predict',
    claim: 'Reflection: more features would have recreated the problem',
    wording:
      'Luke’s first instinct was to include everything users requested; the more valuable work was finding the changes that improved the core workflow for everyone and fit what engineering could support. The redesign did not solve missing forecast, wholesale, or logistics data, which were platform limitations. Next he would measure whether users returned to build a second report.',
    status: 'handed-off',
    scope: 'project',
    source: '/work/pattern-custom-reports',
  },
  {
    id: 'pattern-other-work',
    company: 'Pattern',
    project: 'Other Predict work',
    claim: 'Other projects during the internship',
    wording:
      'Beyond Custom Reports, Luke worked on a Reports tab restructure, a Conversion versus Match diagnostic page for executives, a Paid Traffic creative-types page redesign, and a filter-indication spike for tables.',
    status: 'handed-off',
    scope: 'internship-wide',
    source: 'public/resume.pdf',
    qualifier: 'Résumé-level descriptions; there are no metrics for these.',
  },

  /* ────────── Hoth ────────── */
  {
    id: 'hoth-design-system',
    company: 'Hoth',
    project: 'Hoth product design',
    claim: 'Established the first design system',
    wording:
      'At Hoth, Luke established the company’s first design system, tokenizing typography, color, and reusable components, and designed the brand identity and landing page.',
    status: 'shipped',
    scope: 'company-wide',
    source: 'public/resume.pdf',
    qualifier: 'A product-design internship at an early-stage startup, named separately from the three featured case studies. The case study is unpublished.',
  },
  {
    id: 'hoth-flows',
    company: 'Hoth',
    project: 'Hoth product design',
    claim: 'Added Google SSO and key recovery flows',
    wording:
      'He added Google SSO and key download, storage, and recovery flows. In user testing of the new flows against the old ones, time-to-value fell 30%.',
    status: 'tested',
    scope: 'company-wide',
    source: 'public/resume.pdf; measurement confirmed by Luke 2026-09-17',
    prohibited: ['presenting the 30% as a production or post-launch metric'],
    qualifier: 'A user-test result comparing new flows to old, not production data.',
  },
]

/* ── What the portfolio does not provide ── */

export const NOT_IN_PORTFOLIO: readonly string[] = [
  'Any post-launch, production, or live metric for Awardco, including whether or when the redesign was implemented and any change in failed logins after it.',
  'Any adoption, usage, retention, search-success, revenue, or A/B-test result for Lucid AI.',
  'Any post-launch adoption, retention, satisfaction, hours-saved-per-week, or revenue figure for Pattern Custom Reports; no time-saved figure of any size is verified for it.',
  'Hackathon placements or awards.',
  'Salary, scholarship amounts, or anything personal.',
]

export const UNAVAILABLE_LINE = 'That one isn’t in my portfolio, so I won’t guess at it.'

/* ── Follow-ups the assistant may offer ── */

export const SAFE_FOLLOWUPS: readonly string[] = [
  'What was validated before the Awardco handoff?',
  'Which project best shows your judgment?',
  'How do you use code in your design process?',
  'What tradeoff did you make at Pattern?',
  'Why did you choose the slower login design at Awardco?',
  'What did you hand off at Pattern?',
  'What shipped at Lucid in 12 weeks?',
  'What would you do next at Lucid?',
  'How technical are you?',
  'What did you learn from testing at Pattern?',
]

/* ── Background beyond the case studies (résumé-level, no metrics) ── */

export const BACKGROUND = {
  education:
    'BYU: BS in Computer Science with a Human-Computer Interaction emphasis and a minor in Business Strategy. Graduating April 2028. GPA 3.92. Brigham Young Academic Scholarship (2024–2026). Co-President of the BYU UX Design Association; Figma Campus Leader.',
  otherRoles: [
    'BYU Harold B. Lee Library, UX Designer / UX Developer and Researcher (November 2024 to present): redesigned library website experiences; interviews, usability testing, Figma prototyping; complex information architecture for diverse institutional users.',
    'BYU College of Humanities, Web UX/UI Designer (May 2024 to November 2024): designed and updated 10+ websites in Brightspot CMS across 20+ client meetings.',
    'Sandbox, BYU’s startup incubator (current): building software for real estate and hotel operations.',
  ],
  projects: [
    'iMessage concept (school project): AI contextual search, locked messages, a reply-later queue; paper prototyping, user testing, iteration.',
    'Nutrua, a supplement-tracking app concept built around trust, routine, and lightweight education, after interviews with four very different users and a competitive review.',
    'myzoo.click (CS 260): a web app built with Node, Express, MongoDB, and AWS EC2 behind Caddy HTTPS; real deployment debugging (502s, SSH keys, TLS, Node versions).',
  ],
  site: [
    'This portfolio is hand-built with Next.js, React, and Tailwind and deployed on Vercel.',
    'The Lucid panel on the Lucid case study is rebuilt in code from the team’s design file rather than screenshotted.',
    'Luke AI streams from Claude through a Next.js route; conversations are stored only in the visitor’s browser.',
  ],
  skills:
    'Product design, UX research, interaction design, UI design, design systems, enterprise UX, data-heavy workflow design, information architecture, prototyping (Figma and code), usability testing, stakeholder interviews, competitive analysis, metrics-oriented design, product thinking.',
  /* Pendo, ClickUp and Claude added 2026-09-22. All three were already
     load-bearing in published copy and were missing from this list:
     Pendo and ClickUp are in the Pattern case study's own Tools row (and
     Pendo is the evidence that reframed that project), and Luke AI on
     this site streams from Claude, which BACKGROUND.site already says. */
  /* Notion added 2026-09-22 on Luke's say-so. Unlike the three above it
     is not in any published copy, so it is a tool he names and nothing
     more: the toolbox tile carries no provenance line, because there is
     no project here it can point at. */
  tools:
    'Figma, Framer, Cursor, Notion, Pendo, ClickUp, Claude, VS Code with Copilot, Brightspot CMS, React and Tailwind, Next.js, Vercel, HTML/CSS, JavaScript/TypeScript, Python, C++, Node/Express, MongoDB, AWS EC2, Git/GitHub.',
  goals:
    'Product design roles at strong product teams, with long-term interest in building or leading digital products, especially in AI, productivity, and enterprise tools.',
  interests: 'Startups, AI tools, basketball, fitness, hackathons, and unusual pets (reptiles and tarantulas).',
  /* The life outside the work, added 2026-09-22 when Luke sent the photos
     for the /about story. Everything here is his own account of it or is
     plainly visible in a photo he supplied — the reptile room section and
     the story deck quote these lines, so nothing may be embellished. The
     optometric-technician line deliberately names no employer and no
     dates, because Luke has not given them. */
  personal: [
    /* The $30,000 is SALES, confirmed by Luke on 2026-09-22 when asked
       revenue-or-profit directly. It is never profit, earnings, or
       take-home, and never a monthly figure — see PROHIBITED_PATTERNS. */
    'Ran a reptile-breeding business through high school: bred snakes and lizards and sold them nationally on MorphMarket, at about $30,000 a year in sales.',
    'About 100 animals at the peak, in a dedicated reptile room at home.',
    'Built the enclosures himself out of wood and glass rather than buying them.',
    'Bred his own mice and rats on racks he built, to feed the collection and cut the business’s largest running cost.',
    'Did his own basic veterinary work, including ultrasounds on gravid females to check a clutch before it was due.',
    'Taught reptile handling to whoever would listen: family, friends, and his mother’s elementary class, in person and over Zoom during remote school.',
    'His first business as a kid, before the reptiles, was walking neighbours’ dogs.',
    'Built a bike and skate ramp in the family backyard.',
    'Lives in Provo, Utah, where BYU is.',
    'Utah Jazz fan.',
    'Worked as an optometric technician, running pre-exam testing on patients.',
    'Two cats: Obi, black, and Mocha, calico.',
  ],
  gaps: [
    'Intern-level experience; graduating April 2028.',
    'Enterprise B2B heavy, consumer light.',
    'The published case studies are three; Hoth is unpublished.',
  ],
} as const

/* ── Prohibited phrasing, checked by tests and logged at runtime ── */

export type ProhibitedPattern = { pattern: RegExp; reason: string }

export const PROHIBITED_PATTERNS: readonly ProhibitedPattern[] = [
  {
    pattern: /\b(four|4)\s+(product[- ]design\s+)?internships\b/i,
    reason: 'Three featured internships; Hoth is named separately, never totaled in.',
  },
  {
    pattern: /\bone[- ]person\s+product\s+team\b/i,
    reason: 'Retired positioning.',
  },
  { pattern: /\bfifth\s+proof\b/i, reason: 'Retired positioning.' },
  {
    pattern: /ships?\s+(the\s+)?things?\s+that\s+works?\b/i,
    reason: 'Retired positioning.',
  },
  { pattern: /visual[- ]brand\s+depth/i, reason: 'Unsupported critique presented as fact.' },
  {
    pattern: /\b30[,.]?000\b[^.\n]{0,40}\b(profit|earnings?|earned|income|take-home|net|margin)\b/i,
    reason: 'The reptile business figure is about $30,000 a year in SALES, never profit or earnings.',
  },
  {
    pattern: /\b(profit|earnings?|earned|income|take-home|net|margin)\b[^.\n]{0,40}\b(of|about|around)?\s*\$?30[,.]?000\b/i,
    reason: 'The reptile business figure is about $30,000 a year in SALES, never profit or earnings.',
  },
  {
    pattern: /\$?30[,.]?000\b[^.\n]{0,20}\b(a|per|each)\s+month\b/i,
    reason: 'The reptile business figure is annual, not monthly.',
  },
  {
    pattern: /\bdaily\s+users?\b/i,
    reason: 'Pattern tested with 20 usability participants, not daily users.',
  },
  {
    pattern: /\b20\s+daily\b/i,
    reason: 'Pattern tested with 20 usability participants, not daily users.',
  },
  {
    pattern:
      /\b(cut|cuts|cutting|reduc\w*|lower\w*|dropp\w*|decreas\w*|fewer|eliminat\w*|prevent\w*)\b[^.\n]{0,60}\bfailed\s+(logins?|log-ins?|sign-?ins?|attempts?)\b[^.\n]{0,40}\b4\.5/i,
    reason: 'Awardco: +4.5% successful sign-ins in testing, never a failed-login reduction.',
  },
  {
    pattern: /\bfailed\s+(logins?|log-ins?|sign-?ins?|attempts?)\b[^.\n]{0,40}\b(by|of)\s+4\.5/i,
    reason: 'Awardco: +4.5% successful sign-ins in testing, never a failed-login reduction.',
  },
  {
    pattern: /(?:^|[\s(])[−-]\s?4\.5\s?%/,
    reason: 'Awardco: the 4.5% is an increase in successful sign-ins, not a negative number.',
  },
  {
    pattern: /\b4\.5%\s+(fewer|reduction|decrease|drop|less)\b/i,
    reason: 'Awardco: the 4.5% is an increase in successful sign-ins.',
  },
  {
    pattern:
      /\b(cut|cuts|reduc\w*|eliminat\w*|prevent\w*|fix\w*|solv\w*|remov\w*)\b[^.\n]{0,40}\b7\.7\s?(m|million)\b/i,
    reason: 'The 7.7 million failures are baseline telemetry, not an outcome Luke produced.',
  },
  {
    pattern: /\b60%\s+(trial|adoption|of\s+users|of\s+all\s+users|tried)\b/i,
    reason: 'Pattern: roughly 60% of eligible users created at least one report in the first year.',
  },
  {
    pattern: /\b400\+?\s*(weekly\s+)?hours\b|\b400\+?\s*hours\s+(per|a|each)\s+week\b/i,
    reason: 'No verified source connects a 400-hour figure to Custom Reports.',
  },
  {
    pattern: /\b(launched|shipped|went\s+live|released)\b[^.\n]{0,50}\bduring\s+(his|luke['’]?s|the)\s+(pattern\s+|awardco\s+)?internship/i,
    reason: 'Pattern shipped after the internship; Awardco was handed off.',
  },
  {
    pattern: /\bawardco\b[^.\n]{0,120}\b(post-launch|after\s+(the\s+)?launch|since\s+(the\s+)?launch|in\s+production|went\s+live|is\s+live|now\s+live)\b[^.\n]{0,80}\d/i,
    reason: 'Awardco has no post-launch data.',
  },
  {
    pattern: /\b(post-launch|after\s+(the\s+)?launch|since\s+(the\s+)?launch|in\s+production)\b[^.\n]{0,80}\b(awardco|login)\b[^.\n]{0,60}\d/i,
    reason: 'Awardco has no post-launch data.',
  },
  {
    pattern: /\blucid\b[^.\n]{0,120}\b(adoption|retention|search[- ]success|revenue|engagement)\b[^.\n]{0,60}\d/i,
    reason: 'Lucid has no adoption, retention, search-success, or revenue data.',
  },
  {
    pattern: /\b\d+(\.\d+)?%\s+(adoption|engagement)\b/i,
    reason: 'No adoption figure exists anywhere in the portfolio.',
  },
  {
    pattern: /\blucid\b[^.\n]{0,100}\b20\s+(external\s+)?(user\s+)?interviews\b/i,
    reason: 'Lucid: 12 external user sessions, not 20 interviews.',
  },
  {
    pattern: /\b6[4-8](?:\.\d+)?\s?%[^.\n]{0,25}\b(fail|failure|failed)|\b(fail|failure|failed)\w*\s+6[4-8](?:\.\d+)?\s?%/i,
    reason: 'Awardco: a derived failure rate; the portfolio states 34.6% success, or "nearly two out of three".',
  },
  {
    pattern: /\bawardco\b[^.\n]{0,140}@-?mention|@-?mention[^.\n]{0,140}\bawardco\b/i,
    reason: 'The @mention interaction is Lucid work, not Awardco.',
  },
  {
    pattern: /\b(lucid|pattern)\b[^.\n]{0,120}\b(sso-first|password-first|login code|mfa)\b|\b(sso-first|password-first)\b[^.\n]{0,120}\b(lucid|pattern)\b/i,
    reason: 'Authentication work belongs to Awardco only.',
  },
  {
    pattern: /\b(proved|proves|proven)\b/i,
    reason: 'Usability tests show; they do not prove.',
  },
]
