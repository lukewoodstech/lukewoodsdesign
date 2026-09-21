/*
 * Deterministic eval over recorded answers. The fixture is written by
 * `npm run test:record` (see lukeAi.live.test.ts); this test re-checks
 * every recorded answer against the current expectations and guardrails,
 * so tightening a rule fails here first, without a network call.
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { EVAL_CASES } from './lukeAi.eval'
import { checkAnswer, type Transcript } from './lukeAi.check'
import { splitAnswer } from '../lib/lukeAiStorage'

const FIXTURE = join(__dirname, 'fixtures', 'lukeAiTranscripts.json')

test('recorded transcripts pass every check', () => {
  const { transcripts } = JSON.parse(readFileSync(FIXTURE, 'utf8')) as {
    transcripts: Transcript[]
  }
  assert.equal(transcripts.length, EVAL_CASES.length, 'fixture covers every eval case')
  for (const c of EVAL_CASES) {
    const t = transcripts.find((x) => x.id === c.id)
    assert.ok(t, `no transcript for ${c.id}`)
    /* Re-split from raw so parser changes are exercised too. */
    const { body, followups } = splitAnswer(t.raw)
    const problems = checkAnswer(c, { ...t, body, followups })
    assert.deepEqual(problems, [], `${c.id}\n\n${t.raw}`)
  }
})

/* Answers that used to ship and must fail now: a fixture of the errors. */
test('the known bad answers are caught', () => {
  const bad: Array<[string, string, string]> = [
    ['awardco-failed-logins', 'Yes. Luke cut failed logins by 4.5% at Awardco.', 'failed-login reduction'],
    ['awardco-failed-logins', 'The redesign reduced 7.7 million failed logins.', 'baseline as outcome'],
    ['pattern-daily-users', 'Yes, Pattern validated the redesign with 20 daily users.', 'daily users'],
    ['pattern-400-hours', 'Custom Reports saved 400+ weekly hours across Pattern.', '400 hours'],
    ['internship-count', 'Luke has completed four internships: Pattern, Awardco, Lucid, and Hoth.', 'four internships'],
    ['lucid-adoption', 'Lucid AI reached 40% adoption in its first month.', 'invented adoption'],
    ['overview', 'Luke is a one-person product team. This site is the fifth proof.', 'retired positioning'],
    ['pattern-daily-users', 'Pattern shipped Custom Reports during his internship to 60% trial users.', 'launch + transformed metric'],
  ]
  for (const [id, answer, why] of bad) {
    const c = EVAL_CASES.find((x) => x.id === id)!
    const problems = checkAnswer(c, {
      id,
      question: c.question,
      surface: 'page',
      raw: answer,
      body: answer,
      followups: ['How technical is Luke?', 'What shipped at Lucid in 12 weeks?'],
    })
    assert.ok(problems.length > 0, `should have caught: ${why}\n${answer}`)
  }
})
