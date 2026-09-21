/*
 * One answer, every check: the case's own expectations, the global
 * prohibited list, the qualifier rules, the length target, and the
 * follow-up block's shape. Returns human-readable problems; empty means
 * the answer is safe to show a recruiter.
 */

import { audit } from '../lib/lukeAiGuard'
import type { EvalCase } from './lukeAi.eval'

export type Transcript = {
  id: string
  question: string
  surface: 'card' | 'page'
  raw: string
  body: string
  followups: string[]
}

const WORD_CEILING = 230
const RISKY_FOLLOWUP = /after launch|post-launch|adoption|in production|results after|since launch/i

export function checkAnswer(c: EvalCase, t: Transcript): string[] {
  const problems: string[] = []
  const text = t.body

  for (const re of c.mustMatch) {
    if (!re.test(text)) problems.push(`expected to match ${re}`)
  }
  for (const re of c.mustNotMatch) {
    const m = re.exec(text)
    if (m) problems.push(`must not match ${re}: "${m[0]}"`)
  }
  for (const v of audit(text)) {
    problems.push(`guardrail (${v.reason}): "${v.match}"`)
  }

  /* Markdown hygiene: no headings, tables, rules, code fences, unbalanced
     bold, or leaked follow-up markers. */
  if (/^#{1,6}\s/m.test(text)) problems.push('markdown: heading')
  if (/^\|/m.test(text)) problems.push('markdown: table')
  if (/^(-{3,}|\*{3,}|_{3,})\s*$/m.test(text)) problems.push('markdown: horizontal rule')
  if (/```/.test(text)) problems.push('markdown: code fence')
  if ((text.match(/\*\*/g) ?? []).length % 2 === 1) problems.push('markdown: unbalanced bold')
  if (/\[\[|\]\]/.test(text)) problems.push('markdown: stray [[ or ]] in body')
  if (/\[\/work\/[^\]]+\](?!\()/.test(text)) problems.push('markdown: bare [/work/…] without a link target')
  if (/follow-?ups?\]?\]?\s*$/i.test(text)) problems.push('markdown: follow-up marker leaked into body')
  for (const line of text.split('\n')) {
    const bold = /^\*\*(.+)\*\*$/.exec(line.trim())
    if (bold && bold[1].length > 48 && !/^-/.test(line.trim())) problems.push(`bold whole line: "${line.trim()}"`)
  }

  /* Follow-ups: two or three clean questions, none about post-launch. */
  if (t.followups.length < 2) problems.push(`followups: only ${t.followups.length}`)
  for (const f of t.followups) {
    if (/[\[\]]/.test(f)) problems.push(`followup has brackets: "${f}"`)
    if (RISKY_FOLLOWUP.test(f)) problems.push(`followup is risky: "${f}"`)
    if (/\byou\b/i.test(f) && !/\bLuke\b/.test(f)) problems.push(`followup in second person: "${f}"`)
  }

  const words = text.split(/\s+/).filter(Boolean).length
  if (words > WORD_CEILING) problems.push(`length: ${words} words`)

  return problems
}
