import { SUGGESTIONS } from './lukeAiStorage'

export type Suggestion = { label: string; message: string }

/*
 * The four questions in the zero state, chosen by the page the visitor is
 * reading.
 *
 * The dock is on every page now, which means it opens next to a specific
 * thing: a case study, the story, the work index. Four generic questions
 * there waste the one advantage the dock has over /chat — it knows where
 * you are standing. A reader three sections into the Lucid study has a
 * different question from someone who just landed on the homepage, and it
 * is rarely "give me the 30-second version".
 *
 * The rule every one of these follows is the rule the whole feature
 * follows: **ask for something the page cannot do**. Never "what is this
 * project about" — the page is about it, at length, in Luke's own words.
 * These ask for the tradeoff that didn't make the write-up, the thing
 * that got cut, what he would change now, what the work is evidence of.
 * A suggestion that the page already answers teaches the visitor that
 * Luke AI is decoration.
 *
 * Every question here is answerable from lib/lukeAiFacts.ts. If you add
 * one the truth layer can't support, the answer is a refusal, which is a
 * worse first impression than no suggestion at all.
 */

/* The homepage and /chat keep the recruiter's four: nothing on those
   surfaces narrows what the visitor might want. */
const DEFAULT: ReadonlyArray<Suggestion> = SUGGESTIONS

const ABOUT: ReadonlyArray<Suggestion> = [
  {
    label: 'What does the reptile business have to do with design?',
    message:
      'You ran a reptile-breeding business through high school. What does that actually have to do with how you work as a designer? Be specific, not cute.',
  },
  {
    label: 'Small team or big team?',
    message:
      'Would you do better on a small team or a big one? Answer with evidence from the places you have actually worked.',
  },
  {
    label: 'What are you still bad at?',
    message: 'What are you still working on as a designer? Be honest rather than modest.',
  },
  {
    label: 'What should I ask you in an interview?',
    message:
      'What should I ask you in an interview to find out whether you are any good? Give me the questions that would actually test you.',
  },
]

/* Keyed by the route, because that is what usePathname gives us. */
const BY_PATH: Record<string, ReadonlyArray<Suggestion>> = {
  '/about': ABOUT,

  '/work/lucid-ai': [
    {
      label: 'What was the hardest call here?',
      message:
        'On the Lucid AI project, what was the hardest design call you made, and what did you give up to make it?',
    },
    {
      label: 'What got cut to ship in twelve weeks?',
      message:
        'Lucid AI went from blank page to general availability in twelve weeks. What did you cut to get there, and do you still think it was the right cut?',
    },
    {
      label: 'What would you change now?',
      message: 'Looking back at Lucid AI, what would you do differently if you started it again?',
    },
    {
      label: 'What does this prove you can do?',
      message:
        'What does the Lucid AI work prove you can do that your other projects do not? Be concrete.',
    },
  ],

  '/work/awardco-login-flow-redesign': [
    {
      label: 'How do you know the numbers are real?',
      message:
        'The Awardco login work claims measured improvements. How were they measured, and how confident are you in them?',
    },
    {
      label: 'What was the hardest call here?',
      message:
        'On the Awardco authentication redesign, what was the hardest call, and what did it cost you?',
    },
    {
      label: 'What transfers from auth to other products?',
      message:
        'What did redesigning login, MFA and SSO teach you that transfers to products that have nothing to do with authentication?',
    },
    {
      label: 'What would you change now?',
      message: 'Looking back at the Awardco work, what would you do differently?',
    },
  ],

  '/work/pattern-custom-reports': [
    {
      label: 'What did research say that the ticket didn’t?',
      message:
        'At Pattern you were handed a duplicate-widget ticket and ended up somewhere else. How did you make that call, and how did you sell it?',
    },
    {
      label: 'How do you run discovery on a deadline?',
      message:
        'The Pattern project ran nine weeks. How do you run discovery against a deadline like that — what do you skip, and what do you refuse to skip?',
    },
    {
      label: 'What would you change now?',
      message: 'Looking back at the Pattern Custom Reports work, what would you do differently?',
    },
    {
      label: 'What does this prove you can do?',
      message: 'What does the Pattern work prove you can do that your other projects do not?',
    },
  ],

  '/work/hoth': [
    {
      label: 'What is early-stage design actually like?',
      message:
        'What is designing at an early-stage startup actually like compared with designing inside a larger company? Use Hoth and your other roles.',
    },
    {
      label: 'What was the hardest call here?',
      message: 'At Hoth, what was the hardest design call you made, and what did you trade away?',
    },
    {
      label: 'How do you work without a design system?',
      message:
        'How do you work when there is no design system and no research budget? What do you build first?',
    },
    {
      label: 'What should I ask you in an interview?',
      message:
        'What should I ask you in an interview to find out whether you are any good? Give me the questions that would actually test you.',
    },
  ],
}

/** The four questions for a route. Anything unmapped gets the default set. */
export function suggestionsFor(pathname: string | null): ReadonlyArray<Suggestion> {
  if (!pathname) return DEFAULT
  /* Trailing slashes, and any deeper route under a mapped one. */
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return BY_PATH[path] ?? DEFAULT
}
