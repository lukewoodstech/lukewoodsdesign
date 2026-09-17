'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import HistoryPanel from '@/components/luke-ai/HistoryPanel'
import LukeAiThread from '@/components/luke-ai/LukeAiThread'
import LukeAiComposer, { type ComposerHandle } from '@/components/luke-ai/LukeAiComposer'
import { useLukeAi } from '@/components/luke-ai/LukeAiProvider'
import { useAutoScroll } from '@/components/luke-ai/useAutoScroll'
import { TermTitle, IconPlus, IconRestore, IconPanel } from '@/components/luke-ai/TermChrome'
import { SITE, MAILTO } from '@/lib/site'
import { SUGGESTIONS } from '@/lib/lukeAiStorage'

/*
 * /chat — Luke AI, maximized: the same terminal window as the homepage
 * hero, same session (LukeAiProvider in the root layout), same transcript
 * and composer components. What changes is the room: a reading column,
 * the sessions panel docked on the left, a composer sized as the main
 * control, and answers that may take more structure. It is the version
 * someone uses for ten minutes to decide whether to call Luke.
 */

/*
 * The `+` menu beside the message field: the three places to reach Luke
 * directly. Reads from lib/site.ts like the nav and footer do.
 */
const PLUS_ITEMS = [
  { label: 'résumé', description: 'opens in a new tab', href: SITE.resume },
  { label: 'linkedin', description: 'connect with luke', href: SITE.linkedin },
  { label: 'email luke', description: 'opens your mail app', href: MAILTO },
]

/* The zero-state questions are SUGGESTIONS in lib/lukeAiStorage — the
   same four as the homepage window, so the expanded page reads as the
   same terminal with more room. */

export default function ChatPage() {
  const router = useRouter()
  const {
    hydrated,
    conversations,
    currentId,
    messages,
    phase,
    busy,
    send,
    startNew,
    select,
    remove,
    historyOpen,
    setHistoryOpen,
    toggleHistory,
  } = useLukeAi()

  const [input, setInput] = useState('')
  const [plusOpen, setPlusOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<ComposerHandle>(null)
  const plusRef = useRef<HTMLDivElement>(null)

  /* On phones the panel is an overlay: picking a session closes it. */
  const closeIfNarrow = useCallback(() => {
    if (!window.matchMedia('(min-width: 48em)').matches) setHistoryOpen(false, false)
  }, [setHistoryOpen])

  useEffect(() => {
    if (!plusOpen) return
    const onDown = (e: MouseEvent) => {
      if (plusRef.current && !plusRef.current.contains(e.target as Node)) setPlusOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPlusOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [plusOpen])

  /* A question carried in on the URL (/chat?q=…) — the "ask Luke AI" links
     at the end of each case study. Sent once, into a fresh session, after
     stored conversations have loaded. */
  const askedRef = useRef(false)
  useEffect(() => {
    if (!hydrated || askedRef.current) return
    const q = new URLSearchParams(window.location.search).get('q')?.trim()
    if (!q) return
    askedRef.current = true
    window.history.replaceState(null, '', '/chat')
    startNew()
    send(q, 'page')
  }, [hydrated, startNew, send])

  useEffect(() => {
    composerRef.current?.focus()
  }, [currentId])

  const userTurns = messages.filter((m) => m.role === 'user').length
  useAutoScroll(scrollRef, messages, userTurns)

  const submit = () => {
    if (!input.trim() || busy) return
    send(input, 'page')
    setInput('')
    setTimeout(() => composerRef.current?.focus(), 30)
  }

  const plusMenu = (
    <div ref={plusRef} className="term-pg__plus-wrap">
      <button
        type="button"
        className={`term-pg__plus${plusOpen ? ' is-open' : ''}`}
        onClick={() => setPlusOpen((v) => !v)}
        aria-label="More ways to reach Luke"
        aria-expanded={plusOpen}
        aria-haspopup="menu"
      >
        +
      </button>
      {plusOpen && (
        <div className="term-pg__plus-menu" role="menu">
          {PLUS_ITEMS.map((item) => (
            <a
              key={item.label}
              role="menuitem"
              className="term-pg__plus-item"
              href={item.href}
              target={item.href.startsWith('mailto') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onClick={() => setPlusOpen(false)}
            >
              <span className="term-pg__plus-cmd">{item.label}</span>
              <span className="term-pg__plus-desc">{item.description}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="term-pg">
      {/* One maximized terminal window — the same object as the landing
          screen's Luke AI card, with the sessions panel docked on the left. */}
      <div className="term-pg__window ai-card">
        <header className="ai-card__bar term-pg__bar">
          <button
            type="button"
            className="ai-card__tool term-pg__panel-btn"
            onClick={toggleHistory}
            title={historyOpen ? 'Hide conversations' : 'Show conversations'}
            aria-label={historyOpen ? 'Hide conversations' : 'Show conversations'}
            aria-expanded={historyOpen}
            aria-controls="luke-ai-history"
          >
            <IconPanel />
          </button>
          <TermTitle />
          <div className="ai-card__tools">
            <button
              type="button"
              className="ai-card__tool"
              onClick={() => {
                startNew()
                setInput('')
                closeIfNarrow()
              }}
              title="New conversation"
              aria-label="Start a new conversation"
            >
              <IconPlus />
            </button>
            <button
              type="button"
              className="ai-card__tool ai-card__expand"
              onClick={() => router.push('/')}
              title="Back to the portfolio"
              aria-label="Back to the portfolio"
            >
              <IconRestore />
            </button>
          </div>
        </header>

        <div className="term-pg__body">
          <HistoryPanel
            isOpen={historyOpen}
            conversations={conversations}
            currentId={currentId}
            onSelect={(id) => {
              select(id)
              closeIfNarrow()
            }}
            onNew={() => {
              startNew()
              setInput('')
              closeIfNarrow()
            }}
            onToggle={toggleHistory}
            onDelete={remove}
          />

          {/* The column scrolls as one piece; the composer is the last
              thing in it and sticks to the bottom edge once the thread
              outgrows the window — so a short conversation reads top-down
              with the prompt right under it, like a terminal, and a long
              one keeps the prompt in reach. */}
          <main className="term-pg__scroll" ref={scrollRef} aria-label="Luke AI conversation">
            <div className="term-pg__column">
              <LukeAiThread surface="page" suggestions={SUGGESTIONS} />
              <div className="term-pg__promptbar">
                <LukeAiComposer
                  ref={composerRef}
                  size="page"
                  value={input}
                  onChange={setInput}
                  onSubmit={submit}
                  canSend={phase === 'idle'}
                  before={plusMenu}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
