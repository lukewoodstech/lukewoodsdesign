/*
 * "My process" on /about (2026-11-05, Luke's structure): five steps,
 * and under each the tools Luke uses and how he used each one on a real
 * project. No labels like "proof" or "with AI": the tool and the line
 * say it. Icons and colours come from TOOLS in lib/about.ts by name.
 *
 * Every line traces to lib/lukeAiFacts.ts or a case study:
 *   Pendo, ClickUp  TOOLS provenance (Pattern case study)
 *   Figma (design)  TOOLS provenance
 *   Claude          BACKGROUND.site ("pairs with Claude Code"), Luke AI
 *   Next.js         TOOLS provenance
 *   Figma (test)    BACKGROUND.experience, BYU Library ("usability
 *                   testing, Figma prototyping")
 *   GitHub          TOOLS provenance (Awardco case study)
 *   Vercel          TOOLS provenance
 *
 * Tools with no project story on the site (Notion, Framer, Cursor,
 * TypeScript, Python, Node, Git, Tailwind, React) are left off to keep
 * it simple.
 */

export type ProcessTool = {
  /** Must match a `name` in TOOLS. */
  name: string
  line: string
  link?: { href: string; label: string }
}

export type ProcessStep = { title: string; tools: ReadonlyArray<ProcessTool> }

export const PROCESS: ReadonlyArray<ProcessStep> = [
  {
    title: 'Discovery',
    tools: [
      {
        name: 'Pendo',
        line: 'High trial, poor retention. That told me Pattern had a usability problem, not a demand problem.',
        link: { href: '/work/pattern-custom-reports', label: 'Pattern' },
      },
      {
        name: 'ClickUp',
        line: 'The whole Pattern project started as one ticket: let users duplicate a widget.',
        link: { href: '/work/pattern-custom-reports', label: 'Pattern' },
      },
    ],
  },
  {
    title: 'Design',
    tools: [
      {
        name: 'Figma',
        line: 'Where every project on this site started: Lucid, Awardco and Pattern.',
      },
    ],
  },
  {
    title: 'Build',
    tools: [
      {
        name: 'Claude',
        line: 'I pair with Claude Code to build in code. Luke AI on this site streams from Claude.',
        link: { href: '/chat', label: 'Ask Luke AI' },
      },
      {
        name: 'Next.js',
        line: 'Every page of this site, including the route Luke AI answers from.',
      },
    ],
  },
  {
    title: 'Test',
    tools: [
      {
        name: 'Figma',
        line: 'Prototypes for usability testing on the BYU Library website.',
      },
    ],
  },
  {
    title: 'Ship',
    tools: [
      {
        name: 'GitHub',
        line: 'Awardco prototypes were iterated on a real branch with the frontend engineers, not handed over as mocks.',
        link: { href: '/work/awardco-login-flow-redesign', label: 'Awardco' },
      },
      {
        name: 'Vercel',
        line: 'Where this site is deployed.',
      },
    ],
  },
]
