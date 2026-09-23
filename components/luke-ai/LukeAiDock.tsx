'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import LukeAiCard from './LukeAiCard'
import LukeSprite from './LukeSprite'
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
 * It opens when it is opened, and not before. Until 2026-09-22 it
 * peeked: on a first visit it opened itself a second in, sat there for
 * six, and put itself away. Luke, landing on the deployed site: there is
 * a lot going on. He was right — a hero assembling itself, pixel Luke
 * leaning in to say hover me, and a chat window dealing itself open in
 * the corner, all inside the first two seconds, is three things asking
 * for the same attention. The chip is legible on its own, and the one
 * hint the first screen gets is the one attached to the thing it is
 * about.
 */

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

  /* Nothing renders on the server. The chip carries a resume badge when
     a stored conversation is waiting, and that lives in the visitor's
     browser — a server-rendered dock would paint the wrong one and
     correct itself on hydration. */
  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )

  const hidden = HIDE_ON.some((p) => pathname === p || pathname.startsWith(`${p}/`))

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
        <div className="ai-dock__panel">
          <LukeAiCard onClose={() => setOpen(false)} />
        </div>
      ) : (
        <button
          type="button"
          className="ai-dock__chip"
          onClick={() => setOpen(true)}
          aria-label="Open Luke AI"
        >
          <span className="ai-dock__name" aria-hidden="true">
            luke.ai
          </span>
          <LukeSprite variant="chip" className="ai-dock__face" />
          {/* Honest state, not a notification badge: it only shows when
              there really is a conversation waiting behind the chip. */}
          {messages.length > 0 && <span className="ai-dock__resume">resume</span>}
        </button>
      )}
    </div>
  )
}
