/*
 * Luke AI's one session for the whole site, as an external store. The
 * homepage terminal and /chat both read it through useSyncExternalStore
 * (components/luke-ai/LukeAiProvider.tsx), so they are two views of the
 * same thread: expand the card mid-answer and the stream keeps going on
 * the full page; come back and it is still here.
 *
 * The store hydrates from the browser lazily on its first client read —
 * the server snapshot is the empty state, so markup matches on first
 * paint and the stored conversation appears right after hydration.
 *
 * Phases: idle → processing (command sent, nothing back yet; a status
 * line shows) → streaming (first chunk in; text renders as it lands) →
 * idle. Answers are appended as chunks arrive, never typed out by hand.
 */

import {
  type Conversation,
  type Message,
  type Surface,
  HISTORY_OPEN_KEY,
  genId,
  loadConversations,
  saveConversations,
  readActiveId,
  writeActiveId,
  makeTitle,
  forApi,
  processingLabels,
  splitAnswer,
  toPlainText,
} from './lukeAiStorage'

export type Phase = 'idle' | 'processing' | 'streaming'

export type LukeAiState = {
  hydrated: boolean
  conversations: Conversation[]
  currentId: string
  messages: Message[]
  phase: Phase
  status: string
  hasError: boolean
  /* what the polite live region should say next */
  announce: string
  /* /chat sessions panel; null until the browser has been asked */
  historyOpen: boolean
}

const SERVER: LukeAiState = {
  hydrated: false,
  conversations: [],
  currentId: '',
  messages: [],
  phase: 'idle',
  status: '',
  hasError: false,
  announce: '',
  historyOpen: false,
}

/* Hold the status line at least this long so it never flickers. */
const MIN_STATUS_MS = 350
/* Swap to the second status label if the model is slow to start. */
const SECOND_LABEL_MS = 1100
/* The sessions panel is open by default from this width up. */
const WIDE = '(min-width: 64em)'

let state: LukeAiState = SERVER
let loaded = false
let abort: AbortController | null = null
const listeners = new Set<() => void>()

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function emit() {
  listeners.forEach((l) => l())
}

function set(patch: Partial<LukeAiState>) {
  state = { ...state, ...patch }
  emit()
}

function hydrate() {
  const conversations = loadConversations()
  const active = readActiveId()
  const conv = active ? conversations.find((c) => c.id === active) : undefined
  if (!conv) writeActiveId('')
  let historyOpen = window.matchMedia(WIDE).matches
  try {
    const saved = localStorage.getItem(HISTORY_OPEN_KEY)
    if (saved === '1') historyOpen = true
    if (saved === '0') historyOpen = false
  } catch {}
  state = {
    ...state,
    hydrated: true,
    conversations,
    currentId: conv?.id ?? '',
    messages: conv?.messages ?? [],
    historyOpen,
  }
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getSnapshot() {
  if (!loaded) {
    loaded = true
    hydrate()
  }
  return state
}

export function getServerSnapshot() {
  return SERVER
}

/* ── conversations ── */

function commitConversations(conversations: Conversation[]) {
  saveConversations(conversations)
  set({ conversations })
}

function open(id: string, messages: Message[]) {
  writeActiveId(id)
  set({ currentId: id, messages })
}

function upsert(id: string, messages: Message[], title?: string) {
  const now = Date.now()
  const exists = state.conversations.some((c) => c.id === id)
  commitConversations(
    exists
      ? state.conversations.map((c) =>
          c.id === id ? { ...c, messages, updatedAt: now } : c,
        )
      : [
          {
            id,
            title: title ?? makeTitle(messages[0]?.content ?? 'session'),
            messages,
            updatedAt: now,
            createdAt: now,
          },
          ...state.conversations,
        ],
  )
}

function stop() {
  if (abort) {
    abort.abort()
    abort = null
  }
  if (state.phase !== 'idle') set({ phase: 'idle', status: '' })
}

/* ── the request ── */

async function run(base: Message[], text: string, surface: Surface) {
  if (state.phase !== 'idle') return

  const withUser: Message[] = [...base, { role: 'user', content: text }]
  const id = state.currentId || genId()
  upsert(id, withUser, state.currentId ? undefined : makeTitle(text))
  open(id, [...withUser, { role: 'assistant', content: '' }])

  const labels = processingLabels(text)
  set({
    phase: 'processing',
    status: labels[0],
    hasError: false,
    announce: 'Luke AI is searching the portfolio',
  })
  const labelTimer = setTimeout(() => {
    if (state.phase === 'processing') set({ status: labels[1] })
  }, SECOND_LABEL_MS)

  const controller = new AbortController()
  abort = controller
  const started = performance.now()
  let full = ''

  const paint = () => {
    if (state.currentId !== id) return
    set({ messages: [...withUser, { role: 'assistant', content: full }] })
  }

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: forApi(withUser), surface }),
      signal: controller.signal,
    })
    if (!res.ok || !res.body) throw new Error('stream failed')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let first = true
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      full += decoder.decode(value, { stream: true })
      if (first) {
        first = false
        const wait = MIN_STATUS_MS - (performance.now() - started)
        if (wait > 0) await sleep(wait)
        if (controller.signal.aborted) break
        clearTimeout(labelTimer)
        set({ phase: 'streaming', status: '' })
      }
      paint()
    }
    if (controller.signal.aborted) throw new DOMException('aborted', 'AbortError')
    const done: Message[] = [...withUser, { role: 'assistant', content: full }]
    upsert(id, done)
    if (state.currentId === id) set({ messages: done })
    set({ announce: 'Luke AI: ' + toPlainText(splitAnswer(full).body) })
  } catch (err) {
    if ((err as Error)?.name === 'AbortError') {
      /* Session switched or reset mid-answer: keep what arrived. */
      upsert(id, full ? [...withUser, { role: 'assistant', content: full }] : withUser)
    } else {
      upsert(id, withUser)
      if (state.currentId === id) set({ messages: withUser, hasError: true })
      set({ announce: 'Luke AI could not answer. Try again.' })
    }
  } finally {
    clearTimeout(labelTimer)
    if (abort === controller) {
      abort = null
      set({ phase: 'idle', status: '' })
    }
  }
}

/* ── actions ── */

export function send(text: string, surface: Surface) {
  const clean = text.trim()
  if (!clean) return
  void run(state.messages.filter((m) => m.content), clean, surface)
}

/* Replay the failed prompt without a duplicate command in the thread. */
export function retry(surface: Surface) {
  const msgs = state.messages
  const last = msgs[msgs.length - 1]
  if (!last || last.role !== 'user') return
  void run(msgs.slice(0, -1), last.content, surface)
}

export function startNew() {
  stop()
  set({ hasError: false })
  open('', [])
}

export function select(id: string) {
  const conv = state.conversations.find((c) => c.id === id)
  if (!conv || id === state.currentId) return
  stop()
  set({ hasError: false })
  open(conv.id, conv.messages)
}

export function remove(id: string) {
  commitConversations(state.conversations.filter((c) => c.id !== id))
  if (state.currentId === id) {
    stop()
    set({ hasError: false })
    open('', [])
  }
}

/* The /chat sessions panel. A deliberate toggle is remembered; closing
   the phone overlay after picking a session is not a preference. */
export function setHistoryOpen(openNow: boolean, remember = true) {
  if (remember) {
    try {
      localStorage.setItem(HISTORY_OPEN_KEY, openNow ? '1' : '0')
    } catch {}
  }
  set({ historyOpen: openNow })
}

export function toggleHistory() {
  setHistoryOpen(!state.historyOpen)
}
