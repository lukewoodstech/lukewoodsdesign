import Anthropic from '@anthropic-ai/sdk'
import { buildRequest } from '@/lib/lukeAiRequest'
import { audit } from '@/lib/lukeAiGuard'
import type { Surface } from '@/lib/lukeAiStorage'

/*
 * Luke AI's route. Everything the model knows is rendered from the truth
 * layer (lib/lukeAiFacts.ts → lib/lukeAiPrompt.ts → lib/lukeAiRequest.ts);
 * nothing factual lives in this file. After an answer finishes streaming
 * it is run through the same guardrail checks the tests use, and a hit is
 * logged so drift shows up in server logs.
 */

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  const body = await request.json()
  const messages: Anthropic.MessageParam[] = Array.isArray(body?.messages)
    ? body.messages
    : []
  const surface: Surface = body?.surface === 'card' ? 'card' : 'page'

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
