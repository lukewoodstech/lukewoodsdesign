/*
 * Guardrail checks over Luke AI text. The same list of prohibited
 * phrasings (lib/lukeAiFacts.ts) is used three ways: the regression tests
 * scan the truth layer, the suggestions, and the metadata; the live eval
 * scans real answers; and the chat route logs a warning when a streamed
 * answer trips one, so drift shows up in server logs instead of in front
 * of a recruiter.
 */

import { PROHIBITED_PATTERNS, type ProhibitedPattern } from './lukeAiFacts'

export type Violation = { match: string; reason: string; pattern: string }

export function findViolations(
  text: string,
  patterns: readonly ProhibitedPattern[] = PROHIBITED_PATTERNS,
): Violation[] {
  const out: Violation[] = []
  for (const { pattern, reason } of patterns) {
    const re = new RegExp(pattern.source, pattern.flags.replace('g', ''))
    const m = re.exec(text)
    if (m) out.push({ match: m[0].trim(), reason, pattern: pattern.source })
  }
  return out
}

/*
 * Qualifier checks: a metric that appears without the words that keep
 * its meaning is a transformed metric. These are softer than the
 * prohibited list (the model may legitimately not mention the metric at
 * all), so they only fire when the number is present.
 */
export type QualifierRule = {
  /** The metric that triggers the check. */
  trigger: RegExp
  /** At least one of these must appear somewhere in the same text. */
  requires: RegExp[]
  reason: string
}

export const QUALIFIER_RULES: readonly QualifierRule[] = [
  {
    trigger: /\b60%/,
    requires: [/\beligible\b/i],
    reason: 'Pattern: the 60% is of eligible users.',
  },
  {
    trigger: /\b60%/,
    requires: [/\b(roughly|about|approximately|around|~)\b|~60/i],
    reason: 'Pattern: the 60% is approximate.',
  },
  {
    trigger: /\b4\.5\s?%/,
    requires: [/\bsuccessful\s+sign-?ins?\b|\bsign-?in\s+success\b|\bsuccessful\s+logins?\b/i],
    reason: 'Awardco: the 4.5% is an increase in successful sign-ins.',
  },
  {
    trigger: /\b4\.5\s?%/,
    requires: [/\b(usability|testing|tested|test results|before[- ]and[- ]after|before\/after)\b/i],
    reason: 'Awardco: the 4.5% is a usability-test result.',
  },
  {
    trigger: /\b25%\s+faster/i,
    requires: [/\b(usability|testing|tested|test results|before[- ]and[- ]after|before\/after)\b/i],
    reason: 'Awardco: the 25% is a usability-test result.',
  },
  {
    trigger: /\b78\s?%/,
    requires: [/decision[- ]time|time to (choose|decide|pick)|to choose a login method|login-method decision|decide where to begin/i],
    reason: 'Awardco: the 78% is a reduction in login-method decision time, nothing else.',
  },
  {
    trigger: /\bcustom\s+reports\b[^.\n]{0,80}\b(shipped|launched|released)\b|\b(shipped|launched|released)\b[^.\n]{0,80}\bcustom\s+reports\b/i,
    requires: [/\bafter\s+(his|luke['’]?s|the|my)\s+(pattern\s+)?internship\b|\bafter\s+(he|luke)\s+left\b|\bafter\s+(the\s+)?handoff\b|\bpost-internship\b/i],
    reason: 'Pattern: Custom Reports shipped after the internship.',
  },
]

export function findMissingQualifiers(
  text: string,
  rules: readonly QualifierRule[] = QUALIFIER_RULES,
): Violation[] {
  const out: Violation[] = []
  for (const rule of rules) {
    const hit = new RegExp(rule.trigger.source, rule.trigger.flags.replace('g', '')).exec(text)
    if (!hit) continue
    if (rule.requires.some((r) => r.test(text))) continue
    out.push({ match: hit[0].trim(), reason: rule.reason, pattern: rule.trigger.source })
  }
  return out
}

export function audit(text: string): Violation[] {
  return [...findViolations(text), ...findMissingQualifiers(text)]
}
