/*
 * Live eval: asks the real model the recruiter questions through the same
 * request builder the route uses, and fails on any prohibited phrasing,
 * missing qualifier, malformed follow-up, or unmet expectation.
 *
 * Opt-in because it costs money and needs a key:
 *   npm run test:live      run against the API
 *   npm run test:record    same, and rewrite tests/fixtures/lukeAiTranscripts.json
 *
 * The recorded transcripts are then checked deterministically by
 * tests/lukeAi.transcripts.test.ts on every `npm test`.
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import Anthropic from '@anthropic-ai/sdk'
import { buildRequest } from '../lib/lukeAiRequest'
import { splitAnswer } from '../lib/lukeAiStorage'
import { EVAL_CASES } from './lukeAi.eval'
import { checkAnswer, type Transcript } from './lukeAi.check'

const LIVE = process.env.LUKE_AI_LIVE === '1'
const RECORD = process.env.LUKE_AI_RECORD === '1'
const FIXTURE = join(__dirname, 'fixtures', 'lukeAiTranscripts.json')

/* .env.local is where the key lives locally; never printed. */
function loadEnvLocal() {
  const p = join(__dirname, '..', '.env.local')
  if (!existsSync(p) || process.env.ANTHROPIC_API_KEY) return
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

test('live eval', { skip: !LIVE && 'set LUKE_AI_LIVE=1 to run against the API' }, async (t) => {
  loadEnvLocal()
  const client = new Anthropic()
  const transcripts: Transcript[] = []
  const failures: string[] = []

  for (const c of EVAL_CASES) {
    await t.test(c.id, async () => {
      /* The homepage prompts are asked on the card surface, the rest on
         the page, matching where a recruiter meets them. */
      const surface = ['overview', 'strongest', 'decision', 'why-interview'].includes(c.id)
        ? 'card'
        : 'page'
      const message = await client.messages
        .stream(buildRequest([{ role: 'user', content: c.question }], surface))
        .finalMessage()
      const raw = message.content
        .filter((b): b is Anthropic.TextBlock => b.type === 'text')
        .map((b) => b.text)
        .join('')
      const { body, followups } = splitAnswer(raw)
      const transcript: Transcript = { id: c.id, question: c.question, surface, raw, body, followups }
      transcripts.push(transcript)
      const problems = checkAnswer(c, transcript)
      if (problems.length) failures.push(`${c.id}:\n  ${problems.join('\n  ')}`)
      assert.deepEqual(problems, [], `${c.id}\n\n${raw}`)
    })
  }

  if (RECORD) {
    writeFileSync(FIXTURE, JSON.stringify({ recordedAt: new Date().toISOString(), transcripts }, null, 2) + '\n')
  }
  assert.deepEqual(failures, [])
})
