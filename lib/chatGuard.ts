import type Anthropic from '@anthropic-ai/sdk'

/*
 * Abuse controls for /api/chat.
 *
 * The route is the one place on this site that spends money per request: it
 * streams Sonnet 5 on Luke's API key, with a large cached system prompt
 * behind it. Until 2026-09-22 it took `body.messages` straight from the
 * request and handed it to the SDK — no origin check, no rate limit, no
 * ceiling on how many messages or how much text. Anyone who opened devtools
 * had a free Anthropic endpoint, and the prompt cache made it *cheaper* for
 * them than for a real visitor.
 *
 * Everything here is a pure function over a Request or a parsed body, which
 * is what lets tests/chatGuard.test.ts cover the rules without a network or
 * an API key. The route composes them; it makes no policy decisions itself.
 *
 * These are the code-side half. The other half is a Vercel WAF rate-limit
 * rule on /api/chat, which stops traffic before it reaches a function at all
 * — see the note on `rateLimit` below.
 */

/* ── Origin ──────────────────────────────────────────────────────── */

/*
 * The only legitimate caller is this site's own JavaScript, so the check is
 * simply "did this come from the page it is served with".
 *
 * Per the Fetch spec a browser sends `Origin` on every request whose method
 * is not GET or HEAD, same-origin included, so requiring it costs a real
 * visitor nothing and rejects curl and server-to-server scripts outright.
 *
 * The allowed host is read off the request rather than configured, so this
 * works unchanged on localhost, on every preview deployment, and in
 * production without an env var to forget.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false

  const host = request.headers.get('host')
  if (!host) return false

  try {
    // `host` carries a port but no scheme; compare on host alone so http in
    // development and https in production both pass.
    return new URL(origin).host === host
  } catch {
    return false
  }
}

/* ── Shape and size ──────────────────────────────────────────────── */

/*
 * Ceilings, not guesses at what a conversation needs. The card answers in
 * 150 words and the page in 175 (see lib/lukeAiRequest), and the thread
 * trims itself long before any of these bite. They exist to bound the worst
 * case, not to shape the normal one.
 */
export const MAX_MESSAGES = 30
export const MAX_MESSAGE_CHARS = 4_000
export const MAX_TOTAL_CHARS = 24_000

export type GuardFailure = { ok: false; status: number; error: string }
export type GuardSuccess = { ok: true; messages: Anthropic.MessageParam[] }
export type GuardResult = GuardFailure | GuardSuccess

/*
 * Validates the message array's shape as well as its size. The SDK accepts
 * content blocks as well as strings, but this site only ever sends strings
 * (lib/lukeAiStore), so anything else is someone else's request and is
 * refused rather than forwarded.
 */
export function checkMessages(value: unknown): GuardResult {
  if (!Array.isArray(value)) {
    return { ok: false, status: 400, error: 'Expected a messages array.' }
  }
  if (value.length === 0) {
    return { ok: false, status: 400, error: 'No messages.' }
  }
  if (value.length > MAX_MESSAGES) {
    return { ok: false, status: 413, error: 'Conversation too long.' }
  }

  let total = 0
  for (const m of value) {
    if (typeof m !== 'object' || m === null) {
      return { ok: false, status: 400, error: 'Malformed message.' }
    }
    const { role, content } = m as { role?: unknown; content?: unknown }
    if (role !== 'user' && role !== 'assistant') {
      return { ok: false, status: 400, error: 'Unknown message role.' }
    }
    if (typeof content !== 'string') {
      return { ok: false, status: 400, error: 'Message content must be text.' }
    }
    if (content.length > MAX_MESSAGE_CHARS) {
      return { ok: false, status: 413, error: 'Message too long.' }
    }
    total += content.length
  }

  if (total > MAX_TOTAL_CHARS) {
    return { ok: false, status: 413, error: 'Conversation too long.' }
  }

  return { ok: true, messages: value as Anthropic.MessageParam[] }
}

/* ── Rate limit ──────────────────────────────────────────────────── */

/*
 * A fixed window per client, held in the function instance's memory.
 *
 * Be clear about what this is and isn't. On serverless each instance keeps
 * its own counter, so a burst spread across cold starts sees a higher
 * effective limit than the number below, and the map dies with the instance.
 * It is a speed bump: it makes a naive `for` loop against the endpoint
 * useless, and it costs nothing and needs no service.
 *
 * The real ceiling belongs in front of the function, as a Vercel WAF
 * rate-limit rule on /api/chat (Firewall → Rate Limiting: something like 20
 * requests per 60s, keyed by IP, action deny). That one is enforced at the
 * edge across every instance and never spends a function invocation. It has
 * to be added in the dashboard, so it is not in this repo; this map is what
 * protects the endpoint until it is.
 */
export const RATE_LIMIT = 15
export const RATE_WINDOW_MS = 60_000

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

/*
 * `x-forwarded-for` is a list, client first, and is set by Vercel's proxy.
 * A request that arrives without one shares the 'unknown' bucket, which is
 * deliberately strict: anything reaching the function with no client address
 * is not a browser on the site.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

export function rateLimit(
  key: string,
  now = Date.now(),
): { limited: boolean; retryAfter: number } {
  const bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS })
    /* Opportunistic sweep so a long-lived instance doesn't hold every key it
       has ever seen. Cheap: it only runs when a window opens. */
    if (buckets.size > 1_000) {
      for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k)
    }
    return { limited: false, retryAfter: 0 }
  }

  bucket.count += 1
  if (bucket.count > RATE_LIMIT) {
    return { limited: true, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  return { limited: false, retryAfter: 0 }
}

/** Test seam: the bucket map is module state, and tests need a clean one. */
export function resetRateLimits() {
  buckets.clear()
}
