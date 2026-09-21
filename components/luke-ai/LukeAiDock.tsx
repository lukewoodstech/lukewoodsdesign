'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import LukeAiCard from './LukeAiCard'
import { useLukeAi } from './LukeAiProvider'

/*
 * Luke AI as a site-wide dock, bottom-right — the terminal layer of the
 * site, and the only conversational thing on it.
 *
 * It used to be the hero of the landing screen, which meant it existed on
 * exactly one frame of one page. As a dock it's on the canvas, on every
 * case study, and on /about: present at the moment someone reading about
 * Lucid actually has a question. Fewer people will open it; the ones who
 * do will open it where it's useful.
 *
 * Collapsed it's a chip. Expanded it's the same LukeAiCard as before,
 * anchored to the corner. The conversation is untouched by either — it
 * lives in LukeAiProvider, so collapsing is genuinely just putting the
 * window away, and maximize still hands the same thread to /chat.
 *
 * The peek: on a first visit it opens itself once so the chip isn't a
 * mystery, then puts itself away again. It waits PEEK_IN_MS first so it
 * isn't competing with the page for attention while that's still landing,
 * and it leaves itself open if the visitor has started using it. It skips
 * the whole performance if a conversation already exists — someone coming
 * back mid-thread doesn't need an introduction. sessionStorage, not
 * localStorage: a genuinely new visit should get the introduction.
 *
 * It never peeks on a phone. The panel is nearly the full screen at that
 * width, so an uninvited one isn't a peek — it's an interstitial over the
 * work someone came to see.
 */

const PEEK_KEY = 'luke-ai-dock-peeked'
const PEEK_IN_MS = 1200
const PEEK_MS = 6000
/* Same 48em line the rest of the site draws between canvas and stack. */
const PEEK_MIN_WIDTH = '(min-width: 48em)'

/* /chat IS this conversation, maximized. A dock on top of it would be the
   same window twice. */
const HIDE_ON = ['/chat']

/* A stable subscribe: useSyncExternalStore with an inline one would
   resubscribe on every render. Nothing ever changes — the store's only
   job is telling render-on-the-server from render-in-the-browser. */
const noopSubscribe = () => () => {}

export default function LukeAiDock() {
  const pathname = usePathname()
  const { messages } = useLukeAi()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  /* Nothing renders on the server: whether the dock has peeked this
     session is a sessionStorage question, and a server-rendered chip
     would flash into a panel (or the reverse) on hydration. */
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )

  const hidden = HIDE_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  useEffect(() => {
    if (!isClient || hidden) return
    if (!window.matchMedia(PEEK_MIN_WIDTH).matches) return
    let peeked = true
    try {
      peeked = sessionStorage.getItem(PEEK_KEY) === '1'
    } catch {}
    if (peeked || messages.length > 0) return
    try {
      sessionStorage.setItem(PEEK_KEY, '1')
    } catch {}
    const openTimer = setTimeout(() => setOpen(true), PEEK_IN_MS)
    const closeTimer = setTimeout(() => {
      /* Don't yank the panel out from under someone who is using it. */
      if (panelRef.current?.contains(document.activeElement)) return
      setOpen(false)
    }, PEEK_IN_MS + PEEK_MS)
    return () => {
      clearTimeout(openTimer)
      clearTimeout(closeTimer)
    }
    /* Deliberately mount-only: this must fire once per session, not on
       every message or route change. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, hidden])

  /* Escape closes it, the way any panel should. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!isClient || hidden) return null

  return (
    <div className={`ai-dock${open ? ' is-open' : ''}`}>
      {open ? (
        <div className="ai-dock__panel" ref={panelRef}>
          <LukeAiCard onClose={() => setOpen(false)} />
        </div>
      ) : (
        <button
          type="button"
          className="ai-dock__chip"
          onClick={() => setOpen(true)}
          aria-label="Open Luke AI"
        >
          <span className="ai-dock__star" aria-hidden="true">
            ✱
          </span>
          ask luke-ai
          {/* Honest state, not a notification badge: it only shows when
              there really is a conversation waiting behind the chip. */}
          {messages.length > 0 && <span className="ai-dock__resume">resume</span>}
        </button>
      )}
    </div>
  )
}
