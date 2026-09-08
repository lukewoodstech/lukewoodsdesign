'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import {
  STORAGE_KEY,
  HANDOFF_KEY,
  genId,
  makeTitle,
  type Message,
  type Conversation,
} from '@/lib/lukeAiStorage'

/*
 * The live Luke AI window that is the hero of the homepage (desktop landing
 * and the top of the mobile stack): visitors chat right here, streaming
 * from the same /api/chat route as the full page. The expand button saves
 * the conversation into the shared localStorage store, stamps a
 * sessionStorage handoff, and navigates to /chat — which opens the same
 * conversation full screen.
 *
 * The chips are the pitch. Each one sends a prompt the system prompt is
 * built to answer well: the short version, the design + code + business
 * story, and the fit map (paste a job description, get requirement →
 * evidence, one line each) — the thing a static page cannot do.
 */

const GREETING = 'luke-ai v1.0 — the portfolio you can interview.'

const SUGGESTIONS: ReadonlyArray<{ label: string; message: string }> = [
  { label: 'give me the 30-second version', message: 'give me the 30-second version' },
  {
    label: 'where did code or business change a design call?',
    message:
      'Give me one concrete decision per project where knowing the code or the business changed what Luke designed.',
  },
  {
    label: 'map him to a job description',
    message: "I'm hiring. I'd like to paste a job description and get a fit map.",
  },
]

const IconExpand = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 4h6v6" />
    <path d="M20 4 12.5 11.5" />
    <path d="M10 20H4v-6" />
    <path d="M4 20l7.5-7.5" />
  </svg>
)

const IconArrowUp = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 19V5m0 0-6 6m6-6 6 6" />
  </svg>
)

export default function LukeAiCard() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [hasError, setHasError] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const sendMessage = (text: string) => sendWith(messages, text)

  /* Retry replays the failed prompt without duplicating it in the thread. */
  const retry = () => {
    const last = messages[messages.length - 1]
    if (!last || last.role !== 'user') return
    void sendWith(messages.slice(0, -1), last.content)
  }

  const sendWith = async (base: Message[], text: string) => {
    if (!text || isStreaming) return
    setInput('')
    setHasError(false)

    const withUser: Message[] = [...base, { role: 'user', content: text }]
    setMessages([...withUser, { role: 'assistant', content: '' }])
    setIsStreaming(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: withUser.map(({ role, content }) => ({ role, content })),
        }),
      })
      if (!res.ok || !res.body) throw new Error('stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const last = prev[prev.length - 1]
          return [...prev.slice(0, -1), { ...last, content: last.content + chunk }]
        })
      }
    } catch {
      setMessages(withUser)
      setHasError(true)
    } finally {
      setIsStreaming(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  /* Hand the conversation to the full page (see lib/lukeAiStorage.ts). */
  const expand = () => {
    try {
      const real = messages.filter((m) => m.content)
      if (real.length) {
        const raw = localStorage.getItem(STORAGE_KEY)
        const convs: Conversation[] = raw ? JSON.parse(raw) : []
        const conv: Conversation = {
          id: genId(),
          title: makeTitle(real[0].content),
          messages: real,
          updatedAt: Date.now(),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify([conv, ...convs]))
        sessionStorage.setItem(HANDOFF_KEY, conv.id)
      }
    } catch {}
    router.push('/chat')
  }

  const zeroState = messages.length === 0

  return (
    <div className="ai-card">
      <header className="ai-card__bar">
        <span className="term-nav__tabtitle" aria-hidden="true">
          output
        </span>
        <span className="term-nav__tabtitle is-active">terminal</span>
        <span className="ai-card__shell" aria-hidden="true">
          luke-ai — zsh
        </span>
        <button
          type="button"
          className="ai-card__expand"
          onClick={expand}
          title="Open full screen"
          aria-label="Open this conversation full screen"
        >
          <IconExpand />
          <span>expand</span>
        </button>
      </header>

      <div className="ai-card__body" ref={listRef}>
        {/* the session opener: the visitor "launched" luke-ai */}
        <p className="ai-card__boot" aria-hidden="true">
          <span className="term-nav__arrow">➜</span>
          <span className="term-nav__dir">~</span> luke-ai
        </p>
        <p className="ai-card__greeting">
          <span className="ai-card__bootdot" aria-hidden="true">
            ●
          </span>{' '}
          {GREETING}
        </p>
        {zeroState ? (
          <div className="ai-card__chips">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                className="ai-card__chip"
                onClick={() => sendMessage(s.message)}
              >
                {s.label}
              </button>
            ))}
          </div>
        ) : (
          messages.map((msg, i) =>
            msg.role === 'user' ? (
              <div key={i} className="ai-card__msg ai-card__msg--user">
                <span className="term-nav__arrow">➜</span>
                <span className="term-nav__dir">~</span> {msg.content}
              </div>
            ) : (
              <div key={i} className="ai-card__msg ai-card__msg--ai">
                {msg.content === '' && isStreaming && i === messages.length - 1 ? (
                  <span className="ai-card__thinking" aria-label="Luke AI is thinking">
                    <i />
                    <i />
                    <i />
                  </span>
                ) : (
                  <ReactMarkdown
                    components={{
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
            ),
          )
        )}
        {hasError && (
          <p className="ai-card__error">
            something broke mid-thought.{' '}
            <button type="button" onClick={retry}>
              try again
            </button>
          </p>
        )}
      </div>

      <form
        className="ai-card__inputrow"
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage(input.trim())
        }}
      >
        <span className="term-nav__arrow" aria-hidden="true">
          ➜
        </span>
        <span className="term-nav__dir" aria-hidden="true">
          ~
        </span>
        <input
          ref={inputRef}
          className="ai-card__input"
          type="text"
          value={input}
          placeholder="ask about luke's work…"
          onChange={(e) => setInput(e.target.value)}
          aria-label="Message Luke AI"
        />
        <button
          type="submit"
          className="ai-card__send"
          disabled={!input.trim() || isStreaming}
          aria-label="Send"
        >
          <IconArrowUp />
        </button>
      </form>
    </div>
  )
}
