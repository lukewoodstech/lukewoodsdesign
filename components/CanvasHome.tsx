'use client'

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import Image from 'next/image'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import MobileHome from './MobileHome'
import LukeAiCard from './LukeAiCard'
import VectorName from './VectorName'
import LocalTimeLine from './LocalTimeLine'
import { CodeTagline, ContactCard, ContactFinale, WORK_TILES } from './CanvasBits'
import { SITE } from '@/lib/site'
import { useReducedMotion } from '@/lib/useReducedMotion'

/*
 * Prototype of a queenie.works-style homepage: one wide "designer's canvas"
 * that glides horizontally as the visitor scrolls (vertically OR sideways).
 * The first screen is a full landing: giant name plate, a business card
 * rendered as a selected canvas object (handles + frame), and dashed
 * sticker nav buttons on the left. The existing tiles become cards pinned
 * further down the canvas.
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
   WORK_TILES entry in order. The landing screen owns the first ~100vw,
   so the cards start past it. */
const CARDS: readonly CardSpec[] = [
  /* top ≥ 12vh keeps the floating labels from crowding the top edge */
  { left: 112, top: 12, w: 40, h: 70, rot: -1.6, drift: 1 },
  { left: 159, top: 16, w: 38, h: 68, rot: 1.2, drift: -1 },
  { left: 204, top: 11, w: 38, h: 66, rot: -0.9, drift: 1 },
  { left: 249, top: 14, w: 38, h: 68, rot: 1.7, drift: -1 },
]

/* The live Luke AI window sits after the last case study. */
const AI_CARD: CardSpec = { left: 293, top: 13, w: 32, h: 68, rot: 1.1, drift: -1 }

/* About section: photos → simplified résumé → contact finale */
const ABOUT_PHOTOS_LEFT = 336 // vw
const ABOUT_RESUME_LEFT = 370 // vw
const OUTRO_LEFT = 404 // vw
const STRIP_W = OUTRO_LEFT + 42 // vw — contact box + right margin
const TRAVEL = STRIP_W - 100 // vw the strip translates over the full scroll

/* Simplified résumé rows — dates follow public/resume.pdf, the single
   source of truth (same strings as lib/caseStudies.ts). */
const RESUME_ROWS = [
  { company: 'Lucid', period: 'May – Aug 2026' },
  { company: 'Awardco', period: 'Oct 2025 – Apr 2026' },
  { company: 'Pattern', period: 'Jan – Oct 2025' },
  { company: 'Hoth', period: 'Aug – Dec 2024' },
] as const

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
  const trackRef = useRef<HTMLDivElement>(null)
  const isDesktop = useIsDesktop()
  const reducedMotion = useReducedMotion()

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
  const canvasActive = isDesktop === true && !reducedMotion
  useEffect(() => {
    if (!canvasActive) return
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
  }, [canvasActive])

  /*
   * Coming back from a case study or /chat should land the visitor exactly
   * where they left the canvas, not at the start. Position is saved as the
   * visitor scrolls; on mount it's restored instantly, and the spring is
   * jumped to match so the strip doesn't visibly glide in from zero.
   * (Browser back/forward already restores scroll natively — this covers
   * link navigation, which starts a fresh entry at the top.)
   */
  useEffect(() => {
    if (!canvasActive) return
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
  }, [canvasActive, smooth, scrollYProgress])

  if (isDesktop === null) {
    return <div style={{ height: '100vh' }} aria-hidden="true" />
  }

  /* The plain stack is the fallback, not a lesser version — same canvas
     dressing, just scrolling normally. */
  if (!isDesktop || reducedMotion) {
    return <MobileHome />
  }

  return (
    <div
      className="canvas-track"
      ref={trackRef}
      style={{ height: `calc(100vh + ${TRAVEL}vw)` }}
    >
      <div className="canvas-viewport">
        <motion.div className="canvas-bg" style={{ x: bgX }} aria-hidden="true">
          <span className="canvas-bg__name" style={{ left: '78vw' }}>
            product designer
          </span>
          <span className="canvas-bg__name" style={{ left: '160vw', top: '48vh' }}>
            research → shipped
          </span>
        </motion.div>

        <motion.div className="canvas-strip" style={{ x }}>
          {/* ── Landing screen: the first 100vw of canvas ── */}
          <section className="canvas-intro">
            <div className="canvas-intro__tag">
              <p className="canvas-intro__highlight-wrap">
                <CodeTagline />
              </p>
              <p className="canvas-intro__cred">
                recently at Lucid — previously Awardco, Pattern, and Hoth.
              </p>
              <LocalTimeLine />
            </div>

            <ContactCard />

            <VectorName />

            <p className="canvas-intro__hint" aria-hidden="true">
              scroll <span className="canvas-intro__arrow">→</span>
            </p>
          </section>

          {WORK_TILES.map((item, i) => (
            <CanvasCard key={item.slug} card={CARDS[i]} label={item.label} progress={smooth}>
              {item.tile}
            </CanvasCard>
          ))}

          {/* ── Live Luke AI window: chat right here, expand for the full page ── */}
          <CanvasCard card={AI_CARD} label="05 · luke ai — ask it anything" progress={smooth}>
            <LukeAiCard />
          </CanvasCard>

          {/* ── About: photos → simplified résumé → contact finale ── */}
          <section
            className="about-photos"
            style={{ left: `${ABOUT_PHOTOS_LEFT}vw` }}
            aria-label="Photos of Luke"
          >
            <span className="canvas-card__label" aria-hidden="true">
              06 · about me
            </span>
            {/* second frame: placeholder until the next real shot lands */}
            <figure className="polaroid polaroid--second" aria-hidden="true">
              <div className="polaroid__blank">next photo soon</div>
              <figcaption>…</figcaption>
            </figure>
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
          </section>

          <section
            className="about-resume"
            style={{ left: `${ABOUT_RESUME_LEFT}vw` }}
            aria-label="Simplified résumé"
          >
            <span className="canvas-card__label" aria-hidden="true">
              07 · résumé
            </span>
            <div className="code-card resume-md">
              <div className="code-card__bar" aria-hidden="true">
                <span className="code-card__dot code-card__dot--r" />
                <span className="code-card__dot code-card__dot--y" />
                <span className="code-card__dot code-card__dot--g" />
                <span className="code-card__file">resume.md — portfolio</span>
              </div>
              <div className="code-card__tabs" aria-hidden="true">
                <span className="code-card__tab">
                  <span className="code-card__mdicon">M↓</span>
                  resume.md (Preview)
                  <span className="code-card__tabclose">×</span>
                </span>
              </div>
              <div className="resume-md__body">
                <h2>luke woods</h2>
                <p className="resume-md__lede">product designer</p>
                <h3>experience</h3>
                <ul className="resume-md__rows">
                  {RESUME_ROWS.map((row) => (
                    <li key={row.company}>
                      <span className="resume-md__company">{row.company}</span>
                      <span className="resume-md__role">Product Design Intern</span>
                      <span className="resume-md__period">{row.period}</span>
                    </li>
                  ))}
                </ul>
                <h3>toolkit</h3>
                <p className="resume-md__tags">
                  research · design systems · prototyping · motion · code
                </p>
                <a
                  className="resume-md__dl"
                  href={SITE.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ⤓ download the full résumé
                </a>
              </div>
            </div>
          </section>

          <section className="canvas-outro" style={{ left: `${OUTRO_LEFT}vw` }}>
            <div className="canvas-outro__stack">
              <span className="canvas-card__label" aria-hidden="true">
                08 · say hi
              </span>
              <h2 className="canvas-outro__title">like what you see?</h2>
              <ContactFinale />
            </div>
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
            <a className="term-nav__line" href="/chat">
              <span className="term-nav__arrow">➜</span>
              <span className="term-nav__dir">~</span> open luke-ai
              <span className="term-nav__caret" aria-hidden="true" />
            </a>
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
