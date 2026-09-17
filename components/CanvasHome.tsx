'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import Image from 'next/image'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import MobileHome from './MobileHome'
import LukeAiCard from './luke-ai/LukeAiCard'
import { AboutReadme, IntroLede, WORK_TILES } from './CanvasBits'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { SITE } from '@/lib/site'

/*
 * A queenie.works-style homepage: one wide "designer's canvas" that glides
 * horizontally as the visitor scrolls (vertically OR sideways). The first
 * screen is the landing, and Luke AI is its hero: a live chat window fills
 * the right half, the name + one-line story + three plain links sit on the
 * left. (It used to be the first card off the landing, behind a contact.ts
 * editor window, a vector-outline name plate, and a ticking clock — a
 * reviewer's note: "lots of stuff looks clickable and turns out not to be,"
 * and the bot was the one thing worth finding.) The existing tiles become
 * cards pinned further down the canvas.
 *
 * Mechanics: a tall scroll track (100vh + TRAVEL vw, so scroll distance maps
 * ~1:1 to horizontal travel in pixels) pins a 100vh viewport; scroll progress
 * drives translateX on the card strip via a lightly-springed motion value.
 * The nav stays screen-fixed.
 *
 * Below 48em — same breakpoint as the grid — and under reduced motion, this
 * renders MobileHome instead (Queenie does the same: her mobile site is a
 * plain stack with the canvas dressing kept but the glide removed).
 */

type CardSpec = {
  left: number // vw
  top: number // vh
  w: number // vw
  h: number // vh
  drift: number
}

/* left/w in vw, top/h in vh — positions on the wide strip, one per
   WORK_TILES entry in order. The landing screen owns the first 100vw
   (Luke AI lives there), so the case studies start right past it. The
   cards sit at staggered heights but square, not tilted.

   h was 70/68/66/68 until 2026-09-16; the footer slab is a fixed height,
   so trimming ~11vh takes about a fifth off each media area — the art had
   dark margins to spare, and the next card now enters sooner. */
const CARDS: readonly CardSpec[] = [
  /* top ≥ 12vh keeps the floating labels from crowding the top edge */
  { left: 112, top: 16, w: 40, h: 61, drift: 1 },
  { left: 159, top: 20, w: 38, h: 59, drift: -1 },
  { left: 204, top: 15, w: 38, h: 58, drift: 1 },
  { left: 249, top: 18, w: 38, h: 59, drift: -1 },
]

/* A vh-only height goes lanky on a portrait tablet (826px tall at 328
   wide on an iPad, mostly empty stage). Cap it relative to the width. */
const MAX_ASPECT = 1.3

/* About section: photos + the combined README (blurb + résumé), placed
   48vw past the last VISIBLE card so hiding a tile shortens the canvas.
   Polaroids + README span ~90vw. */
const LAST_CARD = CARDS[WORK_TILES.length - 1]
const ABOUT_PHOTOS_LEFT = LAST_CARD.left + 48 // vw
/* The README is the canvas's last object: photos section + its left
   offset (68) + its 36vw width, plus right margin. */
const STRIP_W = ABOUT_PHOTOS_LEFT + 114 // vw
/* Labels count the visible work cards; the about section comes next. */
const ABOUT_LABEL = `${String(WORK_TILES.length + 1).padStart(2, '0')} · about me`
const TRAVEL = STRIP_W - 100 // vw the strip translates over the full scroll
/* Progress range over which the outline depth layer fades out — pinned to
   where the about section arrives, so the ending is calm dot-grid. */
const BG_FADE = [(ABOUT_PHOTOS_LEFT - 70) / TRAVEL, (ABOUT_PHOTOS_LEFT - 20) / TRAVEL]

/*
 * The nav's three sections and where each one scrolls the canvas to. The
 * current section follows the visitor: whichever one sits under the middle
 * of the screen is marked in the nav, so a sideways page still answers
 * "where am I".
 */
type Section = 'home' | 'work' | 'about'
const FOLDERS: ReadonlyArray<{ id: Section; name: string }> = [
  { id: 'home', name: 'home' },
  { id: 'work', name: 'work' },
  { id: 'about', name: 'about' },
]
const SECTION_AT: Record<Section, number> = {
  home: 0,
  work: CARDS[0].left - 8,
  about: ABOUT_PHOTOS_LEFT - 8,
}
type Location = { section: Section; card: string | null }

/* What's under the middle of the screen after `travelled` vw of canvas. */
function locate(travelled: number): Location {
  const center = travelled + 50
  if (center < CARDS[0].left) return { section: 'home', card: null }
  if (center >= ABOUT_PHOTOS_LEFT) return { section: 'about', card: null }
  let nearest = 0
  let nearestDistance = Infinity
  WORK_TILES.forEach((_, i) => {
    const distance = Math.abs(CARDS[i].left + CARDS[i].w / 2 - center)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearest = i
    }
  })
  return { section: 'work', card: WORK_TILES[nearest].slug }
}

/*
 * Same pattern as lib/useReducedMotion: matchMedia is an external store.
 * The server snapshot is null so neither branch renders (and neither set of
 * tiles mounts) until the client knows the real viewport.
 */
const DESKTOP_QUERY = '(min-width: 48em)'

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function useIsDesktop(): boolean | null {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => null,
  )
}

/* Scroll so the canvas has travelled `vw` viewport-widths — the 1:1 px
   mapping makes the conversion exact. */
/* The nav's root is the site itself — derived, so a domain change follows. */
const SITE_HOST = new URL(SITE.url).host

function goToVw(vw: number) {
  window.scrollTo({ top: (vw / 100) * window.innerWidth, behavior: 'smooth' })
}

/* Where the visitor left the canvas, in travelled vw (px would go stale if
   the window is resized while they're away). Session-scoped: a fresh tab
   starts at the landing screen like it should. */
const SCROLL_KEY = 'canvas-scroll-vw'

function CanvasCard({
  card,
  label,
  progress,
  children,
}: {
  card: CardSpec
  label: string
  progress: MotionValue<number>
  children: ReactNode
}) {
  /* Small vertical drift at alternating rates — the parallax that makes the
     cards read as pinned to a surface instead of cells in a row. Rounded to
     whole pixels: a fractional translate makes the compositor resample the
     card, and its 1px border then blurs by a different amount on each edge
     (the "thick bottom stroke" of 2026-09-16). ±3vh in px. */
  const y = useTransform(progress, (v) =>
    Math.round(((card.drift * 3 - v * card.drift * 6) / 100) * window.innerHeight),
  )

  return (
    <motion.div
      className="canvas-card"
      style={{
        left: `${card.left}vw`,
        top: `${card.top}vh`,
        width: `${card.w}vw`,
        height: `min(${card.h}vh, ${card.w * MAX_ASPECT}vw)`,
        y,
      }}
    >
      <span className="canvas-card__label" aria-hidden="true">
        {label}
      </span>
      {children}
    </motion.div>
  )
}

export default function CanvasHome() {
  const isDesktop = useIsDesktop()
  const reducedMotion = useReducedMotion()

  if (isDesktop === null) {
    return <div style={{ height: '100vh' }} aria-hidden="true" />
  }

  /* The plain stack is the fallback, not a lesser version — same canvas
     dressing, just scrolling normally. */
  if (!isDesktop || reducedMotion) {
    return <MobileHome />
  }

  return <DesktopCanvas />
}

/*
 * All the motion hooks live here, below the desktop/mobile switch: useScroll
 * throws "Target ref is defined but not hydrated" if its target never mounts,
 * which is exactly what happened when CanvasHome rendered MobileHome while
 * still wiring trackRef. In this component the track always renders.
 */
function DesktopCanvas() {
  const trackRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })
  /*
   * A very tight spring: the canvas tracks input near-1:1 (settles in
   * ~100ms) so it feels directly attached to the trackpad, while still
   * rounding the discrete jumps a mouse wheel produces. Going springless
   * is MORE responsive but visibly steppy on wheels — if this ever feels
   * laggy, raise stiffness before removing the spring.
   */
  const smooth = useSpring(scrollYProgress, {
    stiffness: 900,
    damping: 70,
    mass: 0.2,
    restDelta: 0.00001,
  })
  /* Whole pixels, same reason as the card drift: the strip is a composited
     layer, and a fractional translate blurs every card edge riding on it. */
  const x = useTransform(smooth, (v) => Math.round(((-v * TRAVEL) / 100) * window.innerWidth))

  const [here, setHere] = useState<Location>({ section: 'home', card: null })
  useMotionValueEvent(smooth, 'change', (v) => {
    const next = locate(v * TRAVEL)
    setHere((prev) =>
      prev.section === next.section && prev.card === next.card ? prev : next,
    )
  })
  const bgX = useTransform(smooth, (v) => `${-v * TRAVEL * 0.35}vw`)
  /* The outline names drift slower than the canvas, so stray letters can
     linger into the about section — fade the whole depth layer out over
     the last stretch so the ending is calm dot-grid. */
  const bgOpacity = useTransform(smooth, BG_FADE, [1, 0])

  /*
   * Sideways input drives the canvas too: scroll distance maps ~1:1 to
   * horizontal travel in px, so a horizontal wheel/trackpad delta converts
   * directly into vertical scroll. Only the dominant axis is claimed —
   * vertical deltas stay native, and preventDefault on horizontal ones
   * stops macOS's back/forward swipe gesture. `behavior: 'instant'`
   * sidesteps the html `scroll-behavior: smooth` rule, which would
   * otherwise animate every wheel tick into mush. Arrow keys get the
   * same treatment.
   */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      window.scrollBy({ top: e.deltaX, behavior: 'instant' })
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      e.preventDefault()
      window.scrollBy({ top: e.key === 'ArrowRight' ? 120 : -120, behavior: 'instant' })
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  /*
   * Coming back from a case study or /chat should land the visitor exactly
   * where they left the canvas, not at the start. Position is saved as the
   * visitor scrolls; on mount it's restored instantly, and the spring is
   * jumped to match so the strip doesn't visibly glide in from zero.
   * (Browser back/forward already restores scroll natively — this covers
   * link navigation, which starts a fresh entry at the top.)
   */
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SCROLL_KEY)
      const vw = saved === null ? NaN : parseFloat(saved)
      if (Number.isFinite(vw) && vw > 0) {
        window.scrollTo({ top: (vw / 100) * window.innerWidth, behavior: 'instant' })
        requestAnimationFrame(() => smooth.jump(scrollYProgress.get()))
      }
    } catch {}
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        try {
          sessionStorage.setItem(SCROLL_KEY, String((window.scrollY / window.innerWidth) * 100))
        } catch {}
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [smooth, scrollYProgress])

  return (
    <div
      className="canvas-track"
      ref={trackRef}
      style={{ height: `calc(100vh + ${TRAVEL}vw)` }}
    >
      <div className="canvas-viewport">
        {/* ── Screen-fixed chrome, first in the DOM so Tab reaches it first:
            the nav as a small file panel. The site is the root; home, work
            and about hang under it as rows that glide the canvas, and the
            section under the middle of the screen is the selected row.
            Nothing folds, nothing drops down. ── */}
        <nav className="canvas-nav" aria-label="Site">
          <div className="term-nav">
            <span className="term-nav__root">{SITE_HOST}</span>
            <ul className="term-nav__list">
              {FOLDERS.map(({ id, name }) => {
                const current = here.section === id
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className={`term-nav__item${current ? ' is-current' : ''}`}
                      aria-current={current ? 'location' : undefined}
                      onClick={() => goToVw(SECTION_AT[id])}
                    >
                      {name}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        <motion.div className="canvas-bg" style={{ x: bgX, opacity: bgOpacity }} aria-hidden="true">
          <span className="canvas-bg__name" style={{ left: '78vw' }}>
            product designer
          </span>
          <span className="canvas-bg__name" style={{ left: '121vw', top: '48vh' }}>
            research → shipped
          </span>
        </motion.div>

        <motion.div className="canvas-strip" style={{ x }}>
          {/* ── Landing screen: the first 100vw of canvas ── */}
          <section className="canvas-intro">
            <IntroLede />

            {/* The hero: a live Luke AI window, streaming from /api/chat.
                Straight, not pinned at an angle — it's a working app, not
                a case-study card. Expand hands the thread to /chat. */}
            <div className="canvas-intro__ai">
              <span className="canvas-card__label" aria-hidden="true">
                luke ai · ask it anything
              </span>
              <LukeAiCard />
            </div>

            {/* A real button: it scrolls to the first case study. */}
            <button
              type="button"
              className="canvas-intro__hint"
              onClick={() => goToVw(CARDS[0].left - 8)}
            >
              the work <span className="canvas-intro__arrow">→</span>
            </button>
          </section>

          {WORK_TILES.map((item, i) => (
            <CanvasCard key={item.slug} card={CARDS[i]} label={item.label} progress={smooth}>
              {item.tile}
            </CanvasCard>
          ))}

          {/* ── About: photos → simplified résumé → contact finale ── */}
          <section
            className="about-photos"
            style={{ left: `${ABOUT_PHOTOS_LEFT}vw` }}
            aria-label="Photos of Luke"
          >
            <span className="canvas-card__label" aria-hidden="true">
              {ABOUT_LABEL}
            </span>
            {/* second frame: placeholder until the next real shot lands */}
            <figure className="polaroid polaroid--main">
              <Image
                src="/luke-woods.jpg"
                alt="Luke Woods standing on a stone balcony in a light blue suit"
                width={700}
                height={700}
                sizes="22vw"
              />
              <figcaption>me</figcaption>
            </figure>
            <figure className="polaroid polaroid--second">
              <Image
                src="/luke-fishing.jpg"
                alt="Luke waist-deep in the Kenai River in Alaska, grinning and holding up a large salmon"
                width={700}
                height={700}
                sizes="22vw"
              />
              <figcaption>fishing at kenai river, alaska</figcaption>
            </figure>
            <figure className="polaroid polaroid--third">
              <Image
                src="/luke-grand-canyon.jpg"
                alt="Luke smiling in a selfie on a Grand Canyon trail, canyon ridges stretching out behind him"
                width={700}
                height={700}
                sizes="22vw"
              />
              <figcaption>26 miles at the grand canyon</figcaption>
            </figure>
            <AboutReadme />
          </section>
        </motion.div>


      </div>
    </div>
  )
}
