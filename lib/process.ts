import type { ToolStage } from '@/lib/about'

/*
 * "My process" on /about (2026-11-05): five steps, each with the design
 * fundamental, where AI comes in, the proof from a case study, and the
 * tools that support it (tools are matched by `stage` in lib/about.ts).
 *
 * Every line traces to lib/lukeAiFacts.ts:
 *   find    pattern-discovery-interviews (internship-wide, not Custom
 *           Reports), plus the Pendo line from TOOLS
 *   design  lucid-20-capabilities
 *   test    awardco-external-prototype-testing, awardco-usability-results
 *           (usability-test numbers, never production)
 *   build   BACKGROUND.site ("designs in Figma and pairs with Claude
 *           Code"), awardco-ai-prototyping-guide
 *   ship    the GitHub line from TOOLS
 *
 * `ai` is set only where a fact says how Luke uses AI. Find, design and
 * ship have none yet: Luke hasn't said, and the truth layer won't guess.
 */

export type ProcessStep = {
  id: ToolStage | 'test'
  title: string
  /** The design fundamental: what the step is made of. */
  practice: string
  /** Where AI comes in, only when sourced. */
  ai?: string
  proof: { line: string; href: string; label: string }
  /** A note that this step feeds back into an earlier one. */
  loop?: string
}

export const PROCESS: ReadonlyArray<ProcessStep> = [
  {
    id: 'find',
    title: 'Find the problem',
    practice: 'Interviews, product data, and the ticket behind the ticket.',
    proof: {
      line: '50+ discovery interviews across my Pattern internship. Pendo showed high trial and poor retention: a usability problem, not a demand problem.',
      href: '/work/pattern-custom-reports',
      label: 'Pattern',
    },
  },
  {
    id: 'design',
    title: 'Design it',
    practice: 'Go wide on directions, then cut hard.',
    proof: {
      line: 'More than 20 capabilities prototyped and tested before Lucid AI narrowed to four core skills.',
      href: '/work/lucid-ai',
      label: 'Lucid',
    },
  },
  {
    id: 'test',
    title: 'Test it',
    practice: 'Working prototypes with real inputs, in front of real users.',
    ai: 'I build coded prototypes with AI, and contributed that workflow to Awardco’s AI-prototyping guide.',
    proof: {
      line: 'Tested with 20+ admins and end users. Choosing a login method went from 27 seconds to 5.9 in usability testing.',
      href: '/work/awardco-login-flow-redesign',
      label: 'Awardco',
    },
    loop: 'What testing breaks goes back to step 01.',
  },
  {
    id: 'build',
    title: 'Build it',
    practice: 'In code, not only in Figma.',
    ai: 'I design in Figma and pair with Claude Code.',
    proof: {
      line: 'This site, including Luke AI, which streams from Claude.',
      href: '/chat',
      label: 'Ask Luke AI',
    },
  },
  {
    id: 'ship',
    title: 'Ship it',
    practice: 'Alongside engineers, not over a wall.',
    proof: {
      line: 'Awardco prototypes were iterated on a real branch with the frontend engineers, not handed over as mocks.',
      href: '/work/awardco-login-flow-redesign',
      label: 'Awardco',
    },
  },
]
