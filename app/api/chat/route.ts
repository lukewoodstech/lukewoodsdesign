import Anthropic from '@anthropic-ai/sdk'
import { buildRequest } from '@/lib/lukeAiRequest'
import { audit } from '@/lib/lukeAiGuard'
import { isSameOrigin, checkMessages, clientKey, rateLimit } from '@/lib/chatGuard'
import type { Surface } from '@/lib/lukeAiStorage'

/*
 * Luke AI's route. Everything the model knows is rendered from the truth
 * layer (lib/lukeAiFacts.ts → lib/lukeAiPrompt.ts → lib/lukeAiRequest.ts);
 * nothing factual lives in this file. After an answer finishes streaming
 * it is run through the same guardrail checks the tests use, and a hit is
 * logged so drift shows up in server logs.
 *
 * The gauntlet before any of that — same origin, under the rate limit, a
 * well-formed conversation within its ceilings — lives in lib/chatGuard, so
 * the policy is testable without a key and this file stays about streaming.
 * Order matters: the cheapest rejections come first, and nothing touches the
 * Anthropic client until every check has passed.
 */

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const json = (status: number, error: string, headers?: HeadersInit) =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })

export async function POST(request: Request) {
  /* A request from anywhere but this site's own pages. */
  if (!isSameOrigin(request)) return json(403, 'Forbidden.')

  const { limited, retryAfter } = rateLimit(clientKey(request))
  if (limited) {
    return json(429, 'Too many messages. Give it a minute.', {
      'Retry-After': String(retryAfter),
    })
  }

  /* Malformed JSON used to throw here and surface as an unhandled 500. */
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json(400, 'Expected JSON.')
  }

  const { messages: raw, surface: rawSurface } = (body ?? {}) as {
    messages?: unknown
    surface?: unknown
  }

  const checked = checkMessages(raw)
  if (!checked.ok) return json(checked.status, checked.error)

  const messages = checked.messages
  const surface: Surface = rawSurface === 'card' ? 'card' : 'page'

  const stream = client.messages.stream(buildRequest(messages, surface))

  const encoder = new TextEncoder()

  const readable = new ReadableStream({
    async start(controller) {
      let full = ''
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === 'content_block_delta' &&
            chunk.delta.type === 'text_delta'
          ) {
            full += chunk.delta.text
            controller.enqueue(encoder.encode(chunk.delta.text))
          }
        }
        const hits = audit(full)
        if (hits.length) {
          console.warn('[luke-ai] guardrail hit', {
            question: messages[messages.length - 1]?.content,
            hits,
          })
        }
      } catch (err) {
        controller.error(err)
      } finally {
        controller.close()
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  })
}
