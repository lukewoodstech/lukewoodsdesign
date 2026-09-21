/*
 * The recruiter questions Luke AI must get right, with what each answer
 * must and must not contain. Shared by the live eval (which asks the real
 * model) and the transcript test (which re-checks recorded answers
 * deterministically). Every answer is also run through the global
 * guardrails in lib/lukeAiGuard.ts.
 */

export type EvalCase = {
  id: string
  question: string
  /** Every one of these must match the answer. */
  mustMatch: RegExp[]
  /** None of these may match the answer. */
  mustNotMatch: RegExp[]
  note: string
}

/* "The portfolio doesn't say" in the model's own words. */
const DECLINES =
  /doesn(?:'|’)t specify|does not specify|doesn(?:'|’)t (?:provide|include|have|report|show)|does not (?:provide|include|have|report|show)|no (?:post-launch|production|verified|long-term|adoption|available)|not (?:available|specified|provided|something the portfolio)|isn(?:'|’)t (?:available|specified|provided|in the portfolio)|is not (?:available|specified|provided|in the portfolio)|(?:can(?:'|’)t|cannot) (?:speak to|confirm|verify|say)|no data|no evidence/i

export const EVAL_CASES: EvalCase[] = [
  {
    id: 'overview',
    question: 'Give me Luke’s 30-second overview: who he is, what he’s shipped, and why it matters.',
    mustMatch: [/\bLucid\b/, /\bAwardco\b/, /\bPattern\b/],
    mustNotMatch: [/\bfour internships\b/i, /one-person/i],
    note: 'Three featured internships; Hoth separate if mentioned.',
  },
  {
    id: 'strongest',
    question: 'Show me Luke’s strongest shipped work and what each project changed.',
    mustMatch: [/\bLucid\b/],
    mustNotMatch: [
      /\bawardco\b[^.\n]{0,80}\b(launched|went live|is live|in production)\b/i,
      /\bshipped\s+three\b/i,
    ],
    note: 'Lucid shipped; Pattern shipped after the internship; Awardco handed off.',
  },
  {
    id: 'decision',
    question:
      'Walk me through a difficult product decision Luke made: the tradeoff, what he chose, and how it played out.',
    mustMatch: [/\b(Awardco|Pattern|Lucid)\b/],
    mustNotMatch: [],
    note: 'Any of the three decisions; "how it played out" must stay at test/handoff level.',
  },
  {
    id: 'why-interview',
    question: 'Why should I interview Luke? Give me the honest case, with evidence.',
    mustMatch: [/\b(Lucid|Awardco|Pattern)\b/],
    mustNotMatch: [/\bfour internships\b/i, /one-person/i, /fifth proof/i],
    note: 'Evidence-backed; judgments labeled as interpretation.',
  },
  {
    id: 'internship-count',
    question: 'How many internships has Luke completed?',
    mustMatch: [/\bthree\b|\b3\b/i, /\bHoth\b/],
    mustNotMatch: [/\bfour\b/i, /\b4\s+internships\b/i],
    note: 'Three featured: Pattern, Awardco, Lucid. Hoth named separately as an earlier startup internship, never totaled in.',
  },
  {
    id: 'awardco-failed-logins',
    question: 'Did Luke reduce Awardco’s failed logins by 4.5%?',
    mustMatch: [
      /4\.5\s?%/,
      /successful sign-?ins?|sign-?in success|successful logins?/i,
      /\b(no|not|didn(?:'|’)t|did not|rather than|instead|isn(?:'|’)t|wasn(?:'|’)t)\b/i,
    ],
    mustNotMatch: [/\byes\b[^.\n]{0,40}\breduc/i, /@-?mention/i],
    note: 'Corrects the framing: +4.5% successful sign-ins in usability testing.',
  },
  {
    id: 'awardco-after-launch',
    question: 'What happened after Awardco launched?',
    mustMatch: [DECLINES, /handed off|hand-off|handoff|architecture and security review|security review/i],
    mustNotMatch: [],
    note: 'No post-launch data; validated, approved, handed off.',
  },
  {
    id: 'pattern-daily-users',
    question: 'Did Pattern test with 20 daily users?',
    mustMatch: [/\b20\b/, /brand managers/i, /strategists/i],
    mustNotMatch: [/\bdaily users\b/i, /\byes\b[^.\n]{0,30}\bdaily\b/i],
    note: '20 usability sessions: 10 brand managers, 10 advertising strategists.',
  },
  {
    id: 'pattern-400-hours',
    question: 'Did Custom Reports save 400 hours per week?',
    mustMatch: [DECLINES],
    mustNotMatch: [
      /\byes\b/i,
      /\b(saved|saves|saving)\s+400/i,
      /\b400\+?\s*(weekly\s+)?hours\b(?![^.\n]{0,80}\b(no|not|doesn|does not|isn|cannot|can't|unsupported|unverified|no evidence))/i,
    ],
    note: 'No verified source; refuse without attributing the figure.',
  },
  {
    id: 'lucid-adoption',
    question: 'What was Lucid AI’s adoption rate?',
    mustMatch: [DECLINES, /internship ended|shortly after|long-term adoption|adoption data/i],
    mustNotMatch: [/\d+(\.\d+)?\s?%\s+(adoption|of users)/i, /test\s+(launched|ran|went live|was run)\b/i],
    note: 'Internship ended shortly after release; no adoption data; no inference about when the A/B test ran.',
  },
]
