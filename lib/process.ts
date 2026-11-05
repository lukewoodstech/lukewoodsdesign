/*
 * "My process" on /about (2026-11-05, Luke's structure): five steps.
 * Under each, the methods Luke uses first (what he did), then the tools
 * (what he did it with), each with one line from a real project. Method
 * names are design vocabulary on purpose. Tool icons and colours come
 * from TOOLS in lib/about.ts by name; methods get a line icon.
 *
 * Every line traces to lib/lukeAiFacts.ts or a case study:
 *   User interviews       pattern-discovery-interviews (internship-wide,
 *                         never "for Custom Reports"); "the first thing
 *                         I do" is Luke's own words, 2026-11-05
 *   Divergent exploration lucid-20-capabilities
 *   High-fidelity proto.  awardco-external-prototype-testing + case study
 *   Participant recruit.  Pattern: validated with 20 users (ten brand
 *                         managers, ten advertising strategists). Not
 *                         called personas: no source says he made any.
 *   Usability testing     awardco-usability-results (test numbers only)
 *   Focused user sessions pattern-uk-session
 *   Systems mapping       Awardco case study ("states and transitions")
 *   Concept evaluation    Lucid case study, entry-point candidates
 *   Concept validation    Lucid case study ("people found the
 *                         spot beside search the most familiar")
 *   Cross-functional rev. awardco-token
 *   Design handoff        pattern-handoff, pattern-shipped-after
 *   Tools                 TOOLS provenance; Figma (test) from the BYU
 *                         Library line in BACKGROUND.experience;
 *                         Claude from BACKGROUND.site
 */

export type MethodIcon =
  | 'interviews'
  | 'people'
  | 'diverge'
  | 'map'
  | 'compare'
  | 'code'
  | 'eye'
  | 'check'
  | 'review'
  | 'handoff'

type Link = { href: string; label: string }

export type ProcessEntry =
  | { kind: 'method'; name: string; icon: MethodIcon; line: string; link?: Link }
  /* `name` must match a `name` in TOOLS. */
  | { kind: 'tool'; name: string; line: string; link?: Link }

export type ProcessStep = { title: string; entries: ReadonlyArray<ProcessEntry> }

const PATTERN = { href: '/work/pattern-custom-reports', label: 'Pattern' }
const LUCID = { href: '/work/lucid-ai', label: 'Lucid' }
const AWARDCO = { href: '/work/awardco-login-flow-redesign', label: 'Awardco' }

export const PROCESS: ReadonlyArray<ProcessStep> = [
  {
    title: 'Discovery',
    entries: [
      {
        kind: 'method',
        name: 'User interviews',
        icon: 'interviews',
        line: 'The first thing I do on any project is talk to the people who use it. At Pattern that was 50+ discovery interviews across my internship.',
        link: PATTERN,
      },
      {
        kind: 'method',
        name: 'Focused user sessions',
        icon: 'people',
        line: 'A focused session with four UK brand managers who had used Pattern’s Custom Reports.',
        link: PATTERN,
      },
      {
        kind: 'tool',
        name: 'Pendo',
        line: 'High trial, poor retention. That told me Pattern had a usability problem, not a demand problem.',
        link: PATTERN,
      },
      {
        kind: 'tool',
        name: 'ClickUp',
        line: 'The whole Pattern project started as one ticket: let users duplicate a widget.',
      },
    ],
  },
  {
    title: 'Design',
    entries: [
      {
        kind: 'method',
        name: 'Divergent exploration',
        icon: 'diverge',
        line: 'Go wide, then converge. More than 20 capabilities prototyped and tested before Lucid AI narrowed to four core skills.',
        link: LUCID,
      },
      {
        kind: 'method',
        name: 'Systems mapping',
        icon: 'map',
        line: 'Before drawing a screen of Awardco’s login, I mapped the system as states and transitions.',
        link: AWARDCO,
      },
      {
        kind: 'method',
        name: 'Concept evaluation',
        icon: 'compare',
        line: 'For Lucid AI’s entry point I weighed the left nav, the links below it and the top-right icons against the spot beside search.',
        link: LUCID,
      },
      {
        kind: 'tool',
        name: 'Figma',
        line: 'Where every project on this site started: Lucid, Awardco and Pattern.',
      },
    ],
  },
  {
    title: 'Build',
    entries: [
      {
        kind: 'method',
        name: 'High-fidelity prototyping',
        icon: 'code',
        line: 'A Figma prototype couldn’t show where people struggled to type, so at Awardco I built working prototypes with real inputs, validation and code entry.',
        link: AWARDCO,
      },
      {
        kind: 'tool',
        name: 'Claude',
        line: 'I pair with Claude Code to build in code. Luke AI on this site streams from Claude.',
        link: { href: '/chat', label: 'Ask Luke AI' },
      },
      {
        kind: 'tool',
        name: 'Next.js',
        line: 'Every page of this site, including the route Luke AI answers from.',
      },
    ],
  },
  {
    title: 'Test',
    entries: [
      {
        kind: 'method',
        name: 'Participant recruitment',
        icon: 'people',
        line: 'Pattern’s redesign was validated with 20 users: ten brand managers and ten advertising strategists.',
        link: PATTERN,
      },
      {
        kind: 'method',
        name: 'Usability testing',
        icon: 'eye',
        line: 'Before-and-after testing at Awardco: choosing a login method went from 27 seconds to 5.9.',
        link: AWARDCO,
      },
      {
        kind: 'method',
        name: 'Concept validation',
        icon: 'check',
        line: 'In testing at Lucid, people found the spot beside search the most familiar, so that’s where the entry point went.',
        link: LUCID,
      },
      {
        kind: 'tool',
        name: 'Figma',
        line: 'Prototypes for usability testing on the BYU Library website.',
      },
    ],
  },
  {
    title: 'Ship',
    entries: [
      {
        kind: 'method',
        name: 'Cross-functional review',
        icon: 'review',
        line: 'I took Awardco’s token-based login through engineering, architecture and security review. It passed without material changes.',
        link: AWARDCO,
      },
      {
        kind: 'method',
        name: 'Design handoff',
        icon: 'handoff',
        line: 'Annotated designs, the prototype, documentation, a prioritized backlog and a follow-up testing plan. Pattern’s team shipped it after my internship.',
        link: PATTERN,
      },
      {
        kind: 'tool',
        name: 'GitHub',
        line: 'Awardco prototypes were iterated on a real branch with the frontend engineers, not handed over as mocks.',
      },
      {
        kind: 'tool',
        name: 'Vercel',
        line: 'Where this site is deployed.',
      },
    ],
  },
]
