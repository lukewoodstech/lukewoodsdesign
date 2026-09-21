/*
 * The one place the Luke AI request is shaped. The chat route streams it;
 * the live eval (tests/lukeAi.live.test.ts) calls the same builder so a
 * passing eval says something about what visitors actually get.
 */

import type Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt, SURFACE_HINTS } from './lukeAiPrompt'
import type { Surface } from './lukeAiStorage'

/*
 * Sonnet 5 by default. Haiku 4.5 passed the prohibited-phrase eval after
 * prompt hardening but still derived numbers ("failed 66% of the time"),
 * moved features between projects (Lucid's @mention into Awardco), and
 * relabeled metrics; Sonnet 5 did none of that across the same probes.
 * Overridable (LUKE_AI_MODEL=claude-haiku-4-5) to compare or to cut cost.
 */
export const LUKE_AI_MODEL = process.env.LUKE_AI_MODEL || 'claude-sonnet-5'

/* Rendered once per process: the prompt is static per deploy, and a
   byte-identical prefix is what makes the cache_control below pay off. */
export const SYSTEM_PROMPT = buildSystemPrompt()

/* Haiku holds a length target far better when it sits in the user turn
   than when it only sits in the system prompt, so the current question
   carries a one-line reminder. Invisible to the visitor: the thread stores
   the question as typed and only the API copy gets the suffix. */
const TURN_REMINDER: Record<Surface, string> = {
  card: '\n\n[Answer in at most 150 words. Every accuracy rule applies.]',
  page: '\n\n[Answer in at most 175 words. Every accuracy rule applies.]',
}

function withReminder(messages: Anthropic.MessageParam[], surface: Surface) {
  const last = messages[messages.length - 1]
  if (!last || last.role !== 'user' || typeof last.content !== 'string') return messages
  return [...messages.slice(0, -1), { ...last, content: last.content + TURN_REMINDER[surface] }]
}

export function buildRequest(
  messages: Anthropic.MessageParam[],
  surface: Surface,
): Anthropic.MessageStreamParams {
  return {
    model: LUKE_AI_MODEL,
    max_tokens: 1024,
    /* Low temperature on Haiku: this is a factual guide, and the accuracy
       rules hold better when sampling is tight. Newer models reject the
       parameter (400), so it is only sent where it is supported. */
    ...(LUKE_AI_MODEL.startsWith('claude-haiku') ? { temperature: 0.2 } : {}),
    /* The system prompt is large and never changes between requests, so it
       is cached; only the short surface hint and the conversation are billed
       at full price. */
    system: [
      { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: SURFACE_HINTS[surface] },
    ],
    messages: withReminder(messages, surface),
  }
}
