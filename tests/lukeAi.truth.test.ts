/*
 * Static regression tests for Luke AI's truth layer, prompt, suggestions,
 * parser, and site metadata. No network. Run with `npm test`.
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  CLAIMS,
  ENGAGEMENTS,
  INTERNSHIPS,
  POSITIONING,
  SAFE_FOLLOWUPS,
  NOT_IN_PORTFOLIO,
} from '../lib/lukeAiFacts'
import { buildSystemPrompt, renderClaimWordings, SURFACE_HINTS } from '../lib/lukeAiPrompt'
import { audit, findViolations } from '../lib/lukeAiGuard'
import {
  SUGGESTIONS,
  WELCOME,
  splitAnswer,
  fallbackFollowups,
  routeActions,
} from '../lib/lukeAiStorage'
import { SITE } from '../lib/site'
import { caseStudies } from '../lib/caseStudies'

const ROOT = join(__dirname, '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

/* ── the truth layer itself ── */

test('claims: ids unique, sources present, every prohibited reading is prose not a claim', () => {
  const ids = new Set<string>()
  for (const c of CLAIMS) {
    assert.ok(!ids.has(c.id), `duplicate claim id ${c.id}`)
    ids.add(c.id)
    assert.ok(c.source, `${c.id} needs a source`)
    assert.ok(c.wording.length > 20, `${c.id} wording too short`)
  }
})

test('claims: wordings, qualifiers, and allowed paraphrases carry no prohibited phrasing', () => {
  const hits = audit(renderClaimWordings())
  assert.deepEqual(hits, [], JSON.stringify(hits, null, 2))
})

test('claims: Awardco 4.5% is an increase in successful sign-ins in usability testing', () => {
  const c = CLAIMS.find((x) => x.id === 'awardco-usability-results')!
  assert.match(c.wording, /4\.5% increase in successful sign-ins/)
  assert.match(c.wording, /before-and-after usability testing/)
  assert.equal(c.status, 'tested')
})

test('claims: Awardco telemetry is a baseline, never an outcome', () => {
  const c = CLAIMS.find((x) => x.id === 'awardco-telemetry-baseline')!
  assert.equal(c.status, 'baseline')
  assert.match(c.wording, /7\.7 million failed attempts/)
  assert.ok(c.prohibited?.some((p) => /reduced|cut/.test(p)))
})

test('claims: Awardco is handed off, not launched', () => {
  const c = CLAIMS.find((x) => x.id === 'awardco-handoff')!
  assert.equal(c.status, 'handed-off')
  assert.ok(!CLAIMS.some((x) => x.company === 'Awardco' && x.status === 'post-launch'))
})

test('claims: Pattern testing is 20 sessions with 10 + 10, never daily users', () => {
  const c = CLAIMS.find((x) => x.id === 'pattern-usability-sessions')!
  assert.match(c.wording, /20 usability sessions with 10 brand managers and 10 advertising strategists/)
  assert.doesNotMatch(renderClaimWordings(), /daily users/i)
})

test('claims: Pattern shipped after the internship and keeps its usage qualifiers', () => {
  const shipped = CLAIMS.find((x) => x.id === 'pattern-shipped-after')!
  assert.match(shipped.wording, /after Luke’s internship/)
  const usage = CLAIMS.find((x) => x.id === 'pattern-usage-baseline')!
  assert.match(usage.wording, /roughly 60% of eligible users created at least one report during the feature’s first year/)
  assert.match(usage.wording, /about 15% returned/)
  assert.equal(usage.status, 'baseline')
  const interviews = CLAIMS.find((x) => x.id === 'pattern-discovery-interviews')!
  assert.equal(interviews.scope, 'internship-wide')
  assert.doesNotMatch(renderClaimWordings(), /400/)
})

test('claims: Hoth 30% is a user-test result', () => {
  const c = CLAIMS.find((x) => x.id === 'hoth-flows')!
  assert.equal(c.status, 'tested')
  assert.match(c.wording, /user testing of the new flows against the old ones/)
})

test('claims: Lucid stays within the documented evidence', () => {
  const w = renderClaimWordings()
  assert.match(w, /12 weeks/)
  assert.match(w, /every Lucid tier/)
  assert.match(w, /12 external user sessions/)
  assert.match(w, /Find docs, Summarize, Build a diagram, and Catch up/)
  assert.match(w, /does not have long-term adoption data/)
  const lucid = CLAIMS.filter((c) => c.company === 'Lucid').map((c) => c.wording).join('\n')
  assert.doesNotMatch(lucid, /\d+\s?%/, 'no percentages exist for Lucid')
})

test('engagements: three featured internships, Hoth is a separate startup internship', () => {
  assert.deepEqual(
    INTERNSHIPS.map((e) => e.company).sort(),
    ['Awardco', 'Lucid', 'Pattern'],
  )
  const hoth = ENGAGEMENTS.find((e) => e.company === 'Hoth')!
  assert.equal(hoth.kind, 'startup-internship')
  assert.equal(hoth.role, 'Product Design Intern')
})

test('positioning: grounded line, retired lines absent', () => {
  assert.equal(
    POSITIONING,
    'Luke is a product designer who combines research, systems thinking, technical prototyping, and business judgment to ship useful products.',
  )
  assert.deepEqual(findViolations(POSITIONING), [])
})

test('not-in-portfolio list names the post-launch gaps', () => {
  const all = NOT_IN_PORTFOLIO.join('\n')
  assert.match(all, /Awardco/)
  assert.match(all, /Lucid/)
  assert.match(all, /hours-saved-per-week/)
})

/* ── the rendered prompt ── */

test('prompt: carries every required accuracy rule', () => {
  const p = buildSystemPrompt()
  for (const needle of [
    'Preserve the direction and the unit of every metric',
    'Preserve every qualifier',
    'Never convert successful sign-ins into a reduction in failed logins',
    'Never convert usability participants into daily users',
    'Never convert validation or handoff into a launch',
    'Never imply causation',
    'Never combine metrics from different projects',
    'Never invent post-launch results',
    'Never guess',
    'That one isn’t in my portfolio, so I won’t guess at it.',
    'Prefer a smaller number of defensible claims',
    'Link a claim to its case study',
    'three product-design internships',
    'never present them as one total',
    '120–175 words',
  ]) {
    assert.ok(p.includes(needle), `prompt is missing: ${needle}`)
  }
})

test('prompt: renders every claim with its status', () => {
  const p = buildSystemPrompt()
  for (const c of CLAIMS) assert.ok(p.includes(c.wording), `prompt lacks claim ${c.id}`)
  assert.match(p, /HANDED OFF \(delivered for implementation; not launched by Luke\)/)
  assert.match(p, /BASELINE \(before state, not an outcome\)/)
})

test('prompt: never quotes a retired line or a banned phrase (Haiku echoes what it is shown)', () => {
  const p = buildSystemPrompt()
  assert.doesNotMatch(p, /four internships/i)
  assert.doesNotMatch(p, /one-person product team/i)
  assert.doesNotMatch(p, /fifth proof/i)
  assert.doesNotMatch(p, /visual-brand depth/i)
  assert.doesNotMatch(p, /looks good/i)
  assert.doesNotMatch(p, /\b20 daily\b/i)
  assert.doesNotMatch(p, /400\+? ?hours/i)
})

test('prompt: surface hints restate the accuracy rules', () => {
  for (const h of Object.values(SURFACE_HINTS)) assert.match(h, /accuracy rule/i)
})

/* ── suggestions and follow-ups ── */

test('suggestions and follow-ups: no post-launch or adoption prompts', () => {
  const risky = /after launch|post-launch|adoption|retention rate|results in production/i
  for (const s of SUGGESTIONS) {
    assert.doesNotMatch(s.label, risky)
    assert.doesNotMatch(s.message, risky)
  }
  for (const f of SAFE_FOLLOWUPS) assert.doesNotMatch(f, risky)
  for (const f of fallbackFollowups('Lucid Awardco Pattern')) assert.doesNotMatch(f, risky)
  assert.ok(SAFE_FOLLOWUPS.includes('What was validated before the Awardco handoff?'))
  assert.ok(SAFE_FOLLOWUPS.includes('Which project best shows your judgment?'))
  assert.ok(SAFE_FOLLOWUPS.includes('How do you use code in your design process?'))
  assert.ok(SAFE_FOLLOWUPS.includes('What tradeoff did you make at Pattern?'))

  /* The follow-ups are the visitor's next message, so they speak TO Luke:
     "you", never "Luke" or "he". */
  for (const f of SAFE_FOLLOWUPS) assert.doesNotMatch(f, /\bLuke\b|\bhe\b|\bhis\b/i)
})

test('suggestions, welcome, and follow-ups carry no prohibited phrasing', () => {
  const text = [
    ...SUGGESTIONS.flatMap((s) => [s.label, s.message]),
    WELCOME.title,
    WELCOME.body,
    ...SAFE_FOLLOWUPS,
  ].join('\n')
  assert.deepEqual(findViolations(text), [])
})

test('fallback follow-ups never repeat and always yield two or three', () => {
  for (const body of ['', 'Lucid', 'Awardco and Pattern', 'Lucid, Awardco, Pattern']) {
    const f = fallbackFollowups(body)
    assert.ok(f.length >= 2 && f.length <= 3, body)
    assert.equal(new Set(f).size, f.length)
  }
})

/* ── the follow-up parser ── */

test('splitAnswer: canonical block', () => {
  const { body, followups } = splitAnswer('Answer.\n\n[[followups]]\nWhat shipped at Lucid?\nHow technical is Luke?\n')
  assert.equal(body, 'Answer.')
  assert.deepEqual(followups, ['What shipped at Lucid?', 'How technical is Luke?'])
})

test('splitAnswer: strips stray brackets so "see his work]]" can never render', () => {
  const raw = 'Answer.\n\n[[followups]]\nwhat did Luke ship?\nsee his work]]'
  const { followups } = splitAnswer(raw)
  assert.deepEqual(followups, ['what did Luke ship?', 'see his work'])
  for (const f of followups) assert.doesNotMatch(f, /[\[\]]/)
})

test('splitAnswer: tolerates marker variants and list chrome', () => {
  const variants = [
    'A.\n\n**[[followups]]**\n- one question here?\n- two question here?',
    'A.\n\n[[Follow-ups]]\n1. one question here?\n2. two question here?',
    'A.\n\n[followups]\n"one question here?"\n"two question here?"',
    'A.\n\n[[followups]] one question here?\ntwo question here?',
  ]
  for (const v of variants) {
    const { body, followups } = splitAnswer(v)
    assert.equal(body, 'A.', v)
    assert.deepEqual(followups, ['one question here?', 'two question here?'], v)
  }
})

test('splitAnswer: a bare bracketed route becomes a real link', () => {
  const { body } = splitAnswer('See [/work/lucid-ai] and [/work/pattern-custom-reports](/work/pattern-custom-reports).')
  assert.equal(body, 'See [/work/lucid-ai](/work/lucid-ai) and [/work/pattern-custom-reports](/work/pattern-custom-reports).')
})

test('splitAnswer: mid-stream partial marker is hidden', () => {
  assert.equal(splitAnswer('Answer.\n\n[[fol', true).body.trimEnd(), 'Answer.')
  assert.equal(splitAnswer('Answer.\n\n[', true).body.trimEnd(), 'Answer.')
  assert.equal(splitAnswer('Answer.', true).body, 'Answer.')
})

test('routeActions: point at the right case studies', () => {
  assert.deepEqual(
    routeActions('Lucid and Awardco').map((r) => r.href),
    ['/work/lucid-ai', '/work/awardco-login-flow-redesign'],
  )
  assert.deepEqual(routeActions('Custom Reports').map((r) => r.href), ['/work/pattern-custom-reports'])
  assert.deepEqual(routeActions('a pattern of behaviour'), [])
  for (const r of routeActions('Lucid Awardco Pattern')) {
    assert.ok(ENGAGEMENTS.some((e) => e.route === r.href), r.href)
  }
})

/* ── metadata ── */

test('site description is the grounded line and the layout uses it', () => {
  assert.equal(
    SITE.description,
    'Product designer combining research, systems thinking, and code to ship useful products across Lucid, Awardco, Pattern, and Hoth.',
  )
  const layout = read('app/layout.tsx')
  assert.match(layout, /description: SITE\.description/)
  assert.match(layout, /openGraph:[\s\S]*description: SITE\.description/)
  assert.match(layout, /twitter:[\s\S]*description: SITE\.description/)
})

test('no source file still says "four internships" or the retired positioning', () => {
  const files = [
    'lib/site.ts',
    'lib/caseStudies.ts',
    'lib/lukeAiStorage.ts',
    'app/layout.tsx',
    'app/chat/layout.tsx',
    'app/api/chat/route.ts',
    'components/luke-ai/LukeAiThread.tsx',
    'components/luke-ai/LukeAiCard.tsx',
    'components/CanvasBits.tsx',
  ]
  for (const f of files) {
    const src = read(f)
    assert.doesNotMatch(src, /four internships/i, f)
    assert.doesNotMatch(src, /fifth proof/i, f)
    assert.doesNotMatch(src, /one-person product team/i, f)
    assert.doesNotMatch(src, /daily users/i, f)
    assert.doesNotMatch(src, /used Predict daily/i, f)
  }
})

test('case-study data: Hoth role matches the truth layer; Pattern copy says usability sessions', () => {
  const hoth = caseStudies.find((c) => c.slug === 'hoth')!
  assert.equal(hoth.role, ENGAGEMENTS.find((e) => e.company === 'Hoth')!.role)
  const pattern = caseStudies.find((c) => c.slug === 'pattern-custom-reports')!
  const text = JSON.stringify(pattern)
  assert.doesNotMatch(text, /daily/i)
  assert.match(text, /after my internship/)
})
