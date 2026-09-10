'use client'

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import MobileHome from './MobileHome'
import LukeAiCard from './LukeAiCard'
import { AboutReadme, IntroLede, WORK_TILES } from './CanvasBits'
import { useReducedMotion } from '@/lib/useReducedMotion'

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
  rot: number
  drift: number
}

/* left/w in vw, top/h in vh — positions on the wide strip, one per
   WORK_TILES entry in order. The landing screen owns the first 100vw
   (Luke AI lives there), so the case studies start right past it. */
const CARDS: readonly CardSpec[] = [
  /* top ≥ 12vh keeps the floating labels from crowding the top edge */
  { left: 112, top: 12, w: 40, h: 70, rot: -1.6, drift: 1 },
  { left: 159, top: 16, w: 38, h: 68, rot: 1.2, drift: -1 },
  { left: 204, top: 11, w: 38, h: 66, rot: -0.9, drift: 1 },
  { left: 249, top: 14, w: 38, h: 68, rot: 1.7, drift: -1 },
]

/* About section: photos + the combined README (blurb + résumé), placed
   48vw past the last VISIBLE card so hiding a tile shortens the canvas.
   Polaroids + README span ~90vw. */
const LAST_CARD = CARDS[WORK_TILES.length - 1]
const ABOUT_PHOTOS_LEFT = LAST_CARD.left + 48 // vw
/* The README is the canvas's last object: photos section + its left
   offset (65) + its 27vw width, plus right margin. */
const STRIP_W = ABOUT_PHOTOS_LEFT + 110 // vw
/* Labels count the visible work cards; the about section comes next. */
const ABOUT_LABEL = `${String(WORK_TILES.length + 1).padStart(2, '0')} · about me`
const TRAVEL = STRIP_W - 100 // vw the strip translates over the full scroll
/* Progress range over which the outline depth layer fades out — pinned to
   where the about section arrives, so the ending is calm dot-grid. */
const BG_FADE = [(ABOUT_PHOTOS_LEFT - 70) / TRAVEL, (ABOUT_PHOTOS_LEFT - 20) / TRAVEL]

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
     cards read as pinned to a surface instead of cells in a row. */
  const y = useTransform(progress, [0, 1], [`${card.drift * 3}vh`, `${card.drift * -3}vh`])

  return (
    <motion.div
      className="canvas-card"
      style={{
        left: `${card.left}vw`,
        top: `${card.top}vh`,
        width: `${card.w}vw`,
        height: `${card.h}vh`,
        rotate: card.rot,
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
  const router = useRouter()
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
  const x = useTransform(smooth, (v) => `${-v * TRAVEL}vw`)
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
                luke-ai · ask it anything
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
              <figcaption>luke woods — hello!</figcaption>
            </figure>
            <figure className="polaroid polaroid--second">
              <Image
                src="/luke-fishing.jpg"
                alt="Luke waist-deep in the Kenai River in Alaska, grinning and holding up a large salmon"
                width={700}
                height={700}
                sizes="22vw"
              />
              <figcaption>kenai river, alaska</figcaption>
            </figure>
            <figure className="polaroid polaroid--third">
              <Image
                src="/luke-grand-canyon.jpg"
                alt="Luke smiling in a selfie on a Grand Canyon trail, canyon ridges stretching out behind him"
                width={700}
                height={700}
                sizes="22vw"
              />
              <figcaption>grand canyon, arizona</figcaption>
            </figure>
            <AboutReadme />
          </section>
        </motion.div>

        {/* ── Screen-fixed chrome: the nav as a tiny terminal ── */}
        <nav className="canvas-nav" aria-label="Canvas navigation">
          <div className="term-nav">
            {/* VS Code panel header: tab titles + shell name */}
            <div className="term-nav__tabs" aria-hidden="true">
              <span className="term-nav__tabtitle">problems</span>
              <span className="term-nav__tabtitle">output</span>
              <span className="term-nav__tabtitle is-active">terminal</span>
              <span className="term-nav__shell">zsh</span>
            </div>
            <button type="button" className="term-nav__line" onClick={() => goToVw(0)}>
              <span className="term-nav__arrow">➜</span>
              <span className="term-nav__dir">~</span> cd home
              <span className="term-nav__caret" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="term-nav__line"
              onClick={() => goToVw(CARDS[0].left - 8)}
            >
              <span className="term-nav__arrow">➜</span>
              <span className="term-nav__dir">~</span> cd work
              <span className="term-nav__caret" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="term-nav__line"
              onClick={() => goToVw(ABOUT_PHOTOS_LEFT - 8)}
            >
              <span className="term-nav__arrow">➜</span>
              <span className="term-nav__dir">~</span> cd about
              <span className="term-nav__caret" aria-hidden="true" />
            </button>
            {/* Luke AI lives on the landing screen; this opens it full
                screen, the way `open` launches an app. */}
            <button type="button" className="term-nav__line" onClick={() => router.push('/chat')}>
              <span className="term-nav__arrow">➜</span>
              <span className="term-nav__dir">~</span> open luke-ai
              <span className="term-nav__caret" aria-hidden="true" />
            </button>
            {/* idle prompt, cursor always blinking — the shell is waiting */}
            <div className="term-nav__line term-nav__line--idle" aria-hidden="true">
              <span className="term-nav__arrow">➜</span>
              <span className="term-nav__dir">~</span>
              <span className="term-nav__caret is-idle" />
            </div>
          </div>
        </nav>

      </div>
    </div>
  )
}
