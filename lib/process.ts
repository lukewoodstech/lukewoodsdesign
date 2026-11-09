/*
 * "My process" on /about (2026-11-05, Luke's structure): five steps.
 * Under each, at most three entries. When cutting, tools are kept and
 * methods fill what's left (Luke's call); on the page methods still sit
 * above tools. Each is one short line from a real project,
 * kept to about two lines in a column so the steps stay even. Method
 * names are design vocabulary on purpose. Tool icons and colours come
 * from TOOLS in lib/about.ts by name; methods get a line icon.
 *
 * Every line traces to lib/lukeAiFacts.ts or a case study:
 *   User interviews       pattern-discovery-interviews (internship-wide,
 *                         never "for Custom Reports"); "the first thing
 *                         I do" is Luke's own words, 2026-11-05
 *   Divergent exploration lucid-20-capabilities
 *   High-fidelity proto.  awardco-internal-prototype-testing + case study
 *   Participant recruit.  Pattern: validated with 20 users (ten brand
 *                         managers, ten advertising strategists). Not
 *                         called personas: no source says he made any.
 *   Usability testing     awardco-usability-results (test numbers only)
 *   Systems mapping       Awardco case study ("states and transitions")
 *   Cross-functional rev. awardco-token
 *   ClickUp · Jira        Pattern case study; Jira at Awardco and Lucid
 *                         is Luke's own word, 2026-11-09
 *   Tools                 TOOLS provenance; Figma (test) from the BYU
 *                         Library line in BACKGROUND.experience;
 *                         Claude from BACKGROUND.site
 */

export type MethodIcon =
  | 'interviews'
  | 'people'
  | 'diverge'
  | 'map'
  | 'code'
  | 'eye'
  | 'review'

type Link = { href: string; label: string }

export type ProcessEntry =
  | { kind: 'method'; name: string; icon: MethodIcon; line: string; link?: Link }
  /* `name` must match a `name` in TOOLS. */
  | {
      kind: 'tool'
      name: string
      /** A second tool that shares the row (also a TOOLS name): its glyph
          sits as a badge on the first tile and its name follows. */
      with?: string
      line: string
      link?: Link
    }

export type ProcessStep = { title: string; entries: ReadonlyArray<ProcessEntry> }

const PATTERN = { href: '/work/pattern-custom-reports', label: 'Pattern' }
const LUCID = { href: '/work/lucid-ai', label: 'Lucid' }
const AWARDCO = { href: '/work/awardco-login-flow-redesign', label: 'Awardco' }

export const PROCESS: ReadonlyArray<ProcessStep> = [
  {
    title: 'Discovery',
    entries: [
      {
        kind: 'tool',
        name: 'Pendo',
        line: 'High trial, poor retention: a usability problem, not demand.',
        link: PATTERN,
      },
      {
        kind: 'tool',
        name: 'ClickUp',
        /* Jira joined this row 2026-11-09 (Luke: used it a lot at
           Awardco and Lucid), keeping Discovery to three entries. */
        with: 'Jira',
        line: 'Pattern started as one ClickUp ticket. Jira ran Awardco and Lucid.',
        link: PATTERN,
      },
      {
        kind: 'method',
        name: 'User interviews',
        icon: 'interviews',
        line: 'The first thing I do. 50+ discovery interviews at Pattern.',
        link: PATTERN,
      },
    ],
  },
  {
    title: 'Design',
    entries: [
      {
        kind: 'tool',
        name: 'Figma',
        line: 'Where every project on this site started.',
      },
      {
        kind: 'method',
        name: 'Divergent exploration',
        icon: 'diverge',
        line: '20+ capabilities prototyped, narrowed to four for Lucid AI.',
        link: LUCID,
      },
      {
        kind: 'method',
        name: 'Systems mapping',
        icon: 'map',
        line: 'Awardco’s login mapped as states and transitions first.',
        link: AWARDCO,
      },
    ],
  },
  {
    title: 'Build',
    entries: [
      {
        kind: 'tool',
        name: 'Claude',
        line: 'I pair with Claude Code to build in code.',
        link: { href: '/chat', label: 'Ask Luke AI' },
      },
      {
        kind: 'tool',
        name: 'Next.js',
        line: 'Every page of this site, including Luke AI.',
      },
      {
        kind: 'method',
        name: 'High-fidelity prototyping',
        icon: 'code',
        line: 'Coded Awardco prototypes with real inputs and validation.',
        link: AWARDCO,
      },
    ],
  },
  {
    title: 'Test',
    entries: [
      {
        kind: 'tool',
        name: 'Figma',
        line: 'Prototypes for usability testing at BYU Library.',
      },
      {
        kind: 'method',
        name: 'Participant recruitment',
        icon: 'people',
        line: '20 users: ten brand managers, ten advertising strategists.',
        link: PATTERN,
      },
      {
        kind: 'method',
        name: 'Usability testing',
        icon: 'eye',
        line: 'Choosing a login method went from 27s to 5.9s.',
        link: AWARDCO,
      },
    ],
  },
  {
    title: 'Ship',
    entries: [
      {
        kind: 'tool',
        name: 'GitHub',
        line: 'Prototypes iterated on a real branch with engineers.',
        link: AWARDCO,
      },
      {
        kind: 'tool',
        name: 'Vercel',
        line: 'Where this site is deployed.',
      },
      {
        kind: 'method',
        name: 'Cross-functional review',
        icon: 'review',
        line: 'Token login cleared security review without material changes.',
        link: AWARDCO,
      },
    ],
  },
]
