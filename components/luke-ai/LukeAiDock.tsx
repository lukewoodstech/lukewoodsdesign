'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import LukeAiCard from './LukeAiCard'
import LukeSprite from './LukeSprite'

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
 * On a wide screen it starts open, the way it did originally. It spent
 * a while starting closed: the peek it had until 2026-09-22 opened a
 * second in, sat there six, and put itself away, and Luke landing on the
 * deployed site said there was a lot going on — a hero assembling
 * itself, pixel Luke leaning in, and a window dealing itself open, all
 * inside two seconds. Starting open is not that. Nothing animates in
 * late and nothing takes itself away; the panel is simply already there,
 * and closing it is one click that sticks for the rest of the visit.
 *
 * Phones keep the chip. Down there the panel is the whole screen, so
 * opening by default would be opening a page nobody asked for.
 */

/* /chat IS this conversation, maximized. A dock on top of it would be the
   same window twice. */
const HIDE_ON = ['/chat']

/* A stable subscribe: useSyncExternalStore with an inline one would
   resubscribe on every render. Nothing ever changes — the store's only
   job is telling render-on-the-server from render-in-the-browser. */
const noopSubscribe = () => () => {}

/* Wide enough that the panel is a window in the corner rather than the
   view itself. Matches the breakpoint the rest of the site calls desktop;
   the dock's own phone layout starts lower, at 36em, and everything
   between the two keeps the chip. */
const OPENS_ITSELF = '(min-width: 60em)'

export default function LukeAiDock() {
  const pathname = usePathname()
  /* Read once, on mount. The dock lives in the layout and is never
     remounted, so a close survives every client-side navigation after
     it, and a visitor who puts the panel away keeps it away. */
  const [open, setOpen] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(OPENS_ITSELF).matches,
  )

  /* Nothing renders on the server. The chip is a control and nothing
     else: without JS it would sit in the corner doing nothing, so it
     waits until it can actually open. */
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
        </button>
      )}
    </div>
  )
}
