/*
 * Luke AI conversation model, storage, and answer parsing — the pure half
 * of the feature. The React half (components/luke-ai/LukeAiProvider.tsx)
 * keeps one conversation in memory for the whole site, so the homepage
 * terminal and the full page at /chat are the same session; this module
 * is what it reads and writes.
 *
 * Conversations live only in the visitor's browser: the list under
 * STORAGE_KEY (localStorage), and the id of the open one under ACTIVE_KEY
 * (sessionStorage, so a new tab starts clean while a reload — or the round
 * trip homepage → /chat → homepage — keeps the thread).
 */

export type Role = 'user' | 'assistant'

export type Message = {
  role: Role
  content: string
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  updatedAt: number
  createdAt?: number
}

export type Surface = 'card' | 'page'

export const STORAGE_KEY = 'luke-ai-conversations'
export const ACTIVE_KEY = 'luke-ai-active'
export const HISTORY_OPEN_KEY = 'luke-ai-history-open'
export const MAX_CONVERSATIONS = 50

/* The empty-state welcome, shared by the homepage window and /chat. Plain
   and warm: who this is, what it is for, and one line inviting a question. */
export const WELCOME = {
  title: 'Luke AI',
  body: 'Explore Luke’s shipped work, product decisions, technical experience, and résumé.',
  note: 'Hiring for a specific role? Paste the job description.',
} as const

/*
 * The four suggested questions, the same on the homepage window and on
 * /chat so the maximized page reads as the same object with more room.
 * Each one is a job a recruiter in a hurry actually has and the static
 * pages cannot do: the compressed version, the best evidence, one
 * decision under pressure, and the honest case for a call.
 */
export const SUGGESTIONS: ReadonlyArray<{ label: string; message: string }> = [
  {
    label: 'Give me Luke’s 30-second overview',
    message: 'Give me Luke’s 30-second overview: who he is, what he’s shipped, and why it matters.',
  },
  {
    label: 'Show me his strongest shipped work',
    message: 'Show me Luke’s strongest shipped work and what each project changed.',
  },
  {
    label: 'Walk me through a difficult product decision',
    message:
      'Walk me through a difficult product decision Luke made: the tradeoff, what he chose, and how it played out.',
  },
  {
    label: 'Why should I interview Luke?',
    message: 'Why should I interview Luke? Give me the honest case, with evidence.',
  },
]

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

/* ── storage ── */

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isConversation) : []
  } catch {
    return []
  }
}

export function saveConversations(convs: Conversation[]) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(convs.slice(0, MAX_CONVERSATIONS)),
    )
  } catch {}
}

export function readActiveId(): string {
  try {
    return sessionStorage.getItem(ACTIVE_KEY) ?? ''
  } catch {
    return ''
  }
}

export function writeActiveId(id: string) {
  try {
    if (id) sessionStorage.setItem(ACTIVE_KEY, id)
    else sessionStorage.removeItem(ACTIVE_KEY)
  } catch {}
}

function isConversation(c: unknown): c is Conversation {
  if (!c || typeof c !== 'object') return false
  const o = c as Record<string, unknown>
  return typeof o.id === 'string' && Array.isArray(o.messages)
}

/*
 * The history row's title is the first question, cleaned up: whitespace
 * collapsed, trailing punctuation dropped, cut at a word boundary. Rows
 * clamp to two lines in CSS, so the cap is generous rather than the old
 * 38 characters that turned "where did code or business change a design
 * call?" into "where did code or business change a…".
 */
export function makeTitle(text: string, max = 110) {
  const clean = text.replace(/\s+/g, ' ').trim().replace(/[?.!:,;]+$/, '')
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const atWord = cut.lastIndexOf(' ')
  return (atWord > max * 0.6 ? cut.slice(0, atWord) : cut) + '…'
}

/* ── answer parsing ── */

/*
 * Every answer ends with a follow-up block the interface strips and turns
 * into `↳` actions (see the system prompt in app/api/chat/route.ts):
 *
 *   [[followups]]
 *   go deeper on Lucid
 *   how technical is Luke?
 */
export const FOLLOWUP_MARK = '[[followups]]'

export function splitAnswer(raw: string, streaming = false) {
  const at = raw.indexOf(FOLLOWUP_MARK)
  if (at === -1) {
    return { body: streaming ? hidePartialMark(raw) : raw.trimEnd(), followups: [] as string[] }
  }
  const body = raw.slice(0, at).trimEnd()
  const followups = raw
    .slice(at + FOLLOWUP_MARK.length)
    .split('\n')
    .map((l) => l.replace(/^[\s\-–•↳>*]+/, '').trim())
    .filter(Boolean)
    .slice(0, 3)
  return { body, followups }
}

/* Mid-stream the mark arrives a few characters at a time; don't flash
   "[[fol" at the end of the answer while it does. */
function hidePartialMark(raw: string) {
  const tail = raw.slice(-FOLLOWUP_MARK.length)
  for (let n = Math.min(tail.length, FOLLOWUP_MARK.length - 1); n > 0; n--) {
    if (raw.endsWith(FOLLOWUP_MARK.slice(0, n))) return raw.slice(0, -n)
  }
  return raw
}

/*
 * Mid-stream, an opened `**` or backtick renders as literal asterisks
 * until its partner arrives a chunk later. Close it for display only.
 */
export function balanceMarkdown(body: string) {
  let out = body
  const bold = (out.match(/\*\*/g) ?? []).length
  if (bold % 2 === 1) out += '**'
  const ticks = (out.match(/`/g) ?? []).length
  if (ticks % 2 === 1) out += '`'
  return out
}

/* What goes back to the model: the answers without their trailers. */
export function forApi(messages: Message[]) {
  return messages
    .filter((m) => m.content)
    .map((m) => ({
      role: m.role,
      content: m.role === 'assistant' ? splitAnswer(m.content).body : m.content,
    }))
}

/*
 * Real site routes only. The case studies with public pages are the three
 * bespoke ones; Hoth is password-gated and its tile hidden, so it gets no
 * action. Matches are on the company name as the answer would write it.
 */
export type RouteAction = { label: string; href: string }

const ROUTES: ReadonlyArray<{ test: RegExp; href: string; label: string }> = [
  { test: /\blucid\b/i, href: '/work/lucid-ai', label: 'read the Lucid case study' },
  {
    test: /\bawardco\b/i,
    href: '/work/awardco-login-flow-redesign',
    label: 'read the Awardco case study',
  },
  /* "pattern" is an ordinary word too, so the company only counts
     capitalised or by its product names. */
  {
    test: /\bPattern\b|\bcustom reports\b|\bPredict\b/,
    href: '/work/pattern-custom-reports',
    label: 'read the Pattern case study',
  },
]

export function routeActions(body: string): RouteAction[] {
  return ROUTES.filter((r) => r.test.test(body)).map((r) => ({ label: r.label, href: r.href }))
}

/* If the model skips the trailer, derive something relevant instead of
   showing nothing — still keyed to what the answer talked about. */
export function fallbackFollowups(body: string): string[] {
  const out: string[] = []
  if (/\bLucid\b/.test(body)) out.push('go deeper on Lucid')
  if (/\bAwardco\b/i.test(body)) out.push('why choose the slower login flow?')
  if (/\bPattern\b/.test(body)) out.push('what got cut at Pattern, and why?')
  if (out.length < 2) out.push('how technical is Luke?')
  if (out.length < 2) out.push('what did Luke actually ship?')
  return out.slice(0, 3)
}

/* The status line shown between the message and the first streamed word,
   chosen from the question so it says what is actually being looked up.
   Two entries: the second one takes over if the model is slow to start. */
export function processingLabels(question: string): [string, string] {
  const q = question.toLowerCase()
  if (/\b(job|role|hiring|jd|requirements|position|description)\b/.test(q))
    return ['matching the requirements to Luke’s experience…', 'reading the résumé…']
  if (/\blucid\b/.test(q)) return ['reading the Lucid case study…', 'checking the details…']
  if (/\bawardco\b|\blogin\b|\bauth/.test(q))
    return ['reading the Awardco case study…', 'checking the details…']
  if (/\bpattern\b|\breports?\b/.test(q))
    return ['reading the Pattern case study…', 'checking the details…']
  if (/\bhoth\b/.test(q)) return ['reading about Hoth…', 'finding the relevant work…']
  if (/\b(site|built|shader|tile|slider|homepage|how was this)\b/.test(q))
    return ['looking at how this site is built…', 'finding the relevant work…']
  if (/\b(ship|shipped|technical|code|engineer)/.test(q))
    return ['reading through Luke’s experience…', 'finding the relevant work…']
  return ['looking through the portfolio…', 'finding the relevant work…']
}

/* Markdown → something a screen reader can announce once. */
export function toPlainText(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^[#>\-*+\d.\s]+/gm, '')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

export function relativeDay(ts: number, now = Date.now()) {
  const d = new Date(ts)
  const n = new Date(now)
  const sameDay = d.toDateString() === n.toDateString()
  if (sameDay) return 'today'
  const yesterday = new Date(now - 86_400_000)
  if (d.toDateString() === yesterday.toDateString()) return 'yesterday'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
