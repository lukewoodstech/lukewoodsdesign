'use client'

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import Image from 'next/image'
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import About from './About'
import WorkGrid from './WorkGrid'
import Footer from './Footer'
import SiteNav from './SiteNav'
import LucidTile from './LucidTile'
import BeforeAfterTile from './BeforeAfterTile'
import PatternTile from './PatternTile'
import HothTile from './HothTile'
import { SITE, MAILTO } from '@/lib/site'
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
 * The nav stays screen-fixed; a thin progress line along the bottom edge
 * shows how much canvas remains.
 *
 * Below 48em — same breakpoint as the grid — and under reduced motion, this
 * renders the current vertical homepage instead (Queenie does the same:
 * her mobile site is a plain stack with the canvas dressing removed).
 */

/* left/w in vw, top/h in vh — positions on the wide strip. The landing
   screen owns the first ~100vw, so the cards start past it. */
const CARDS = [
  /* top ≥ 12vh keeps the floating labels from crowding the top edge */
  { slug: 'lucid-ai', label: '01 · lucid ai', left: 112, top: 12, w: 40, h: 70, rot: -1.6, drift: 1 },
  { slug: 'awardco', label: '02 · awardco', left: 159, top: 16, w: 38, h: 68, rot: 1.2, drift: -1 },
  { slug: 'pattern', label: '03 · pattern', left: 204, top: 11, w: 38, h: 66, rot: -0.9, drift: 1 },
  { slug: 'hoth', label: '04 · hoth', left: 249, top: 14, w: 38, h: 68, rot: 1.7, drift: -1 },
] as const

/* About section: photos → simplified résumé → contact finale */
const ABOUT_PHOTOS_LEFT = 294 // vw
const ABOUT_RESUME_LEFT = 328 // vw
const OUTRO_LEFT = 362 // vw
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

/* Figma-style selection handles on the corners of a "selected" object. */
function SelectionHandles() {
  return (
    <>
      <span className="sel-handle sel-handle--tl" aria-hidden="true" />
      <span className="sel-handle sel-handle--tr" aria-hidden="true" />
      <span className="sel-handle sel-handle--bl" aria-hidden="true" />
      <span className="sel-handle sel-handle--br" aria-hidden="true" />
    </>
  )
}

function ContactCard() {
  return (
    <div className="canvas-contact">
      {/* messy stack underneath, like cards tossed on a desk */}
      <div className="canvas-contact__shadow canvas-contact__shadow--a" aria-hidden="true" />
      <div className="canvas-contact__shadow canvas-contact__shadow--b" aria-hidden="true" />
      <div className="canvas-contact__card">
        <p className="canvas-contact__eyebrow">if you like my work, contact me!</p>
        <div className="canvas-contact__links">
          <a className="footer-link" href={MAILTO}>
            email me
          </a>
          <a className="footer-link" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
            linkedin
          </a>
          <a className="footer-link" href={SITE.resume} target="_blank" rel="noopener noreferrer">
            résumé
          </a>
        </div>
        <span className="canvas-contact__sig" aria-hidden="true">
          luke.
        </span>
      </div>
      <SelectionHandles />
    </div>
  )
}

function CanvasCard({
  card,
  progress,
  children,
}: {
  card: (typeof CARDS)[number]
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
        {card.label}
      </span>
      {children}
    </motion.div>
  )
}

const TILES: Record<(typeof CARDS)[number]['slug'], ReactNode> = {
  'lucid-ai': <LucidTile />,
  awardco: (
    <BeforeAfterTile
      slug="awardco-login-flow-redesign"
      href="/work/awardco-login-flow-redesign"
      beforeSrc="/before.png"
      afterSrc="/after.png"
      beforeAlt="Awardco's original login screen, showing every authentication method at once"
      afterAlt="The redesigned Awardco login screen, leading with single sign-on"
      logoSrc="/logos/awardco.png"
      companyHref="https://www.awardco.com"
    />
  ),
  pattern: <PatternTile />,
  hoth: <HothTile />,
}

export default function CanvasHome() {
  const trackRef = useRef<HTMLDivElement>(null)
  const isDesktop = useIsDesktop()
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })
  /* Light spring: keeps the 1:1 guided feel but rounds off wheel steps. */
  const smooth = useSpring(scrollYProgress, { stiffness: 300, damping: 50, restDelta: 0.0001 })
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

  if (isDesktop === null) {
    return <div style={{ height: '100vh' }} aria-hidden="true" />
  }

  /* The vertical homepage is the fallback, not a lesser version — it is
     exactly what ships at / today. */
  if (!isDesktop || reducedMotion) {
    return (
      <>
        <SiteNav />
        <About />
        <WorkGrid />
        <Footer />
      </>
    )
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
                <span className="canvas-intro__highlight">
                  i&apos;m luke — product designer.
                  <SelectionHandles />
                </span>
              </p>
              <p className="canvas-intro__cred">
                Recently at Lucid; previously Awardco, Pattern &amp; Hoth.
              </p>
            </div>

            <ContactCard />

            <h1 className="canvas-intro__giant">luke woods</h1>

            <p className="canvas-intro__hint" aria-hidden="true">
              scroll <span className="canvas-intro__arrow">→</span>
            </p>
          </section>

          {CARDS.map((card) => (
            <CanvasCard key={card.slug} card={card} progress={smooth}>
              {TILES[card.slug]}
            </CanvasCard>
          ))}

          {/* ── About: photos → simplified résumé → contact finale ── */}
          <section
            className="about-photos"
            style={{ left: `${ABOUT_PHOTOS_LEFT}vw` }}
            aria-label="Photos of Luke"
          >
            <span className="canvas-card__label" aria-hidden="true">
              05 · about me
            </span>
            {/* blank frames behind — swap in real shots as they land */}
            <div className="polaroid polaroid--back-a" aria-hidden="true" />
            <div className="polaroid polaroid--back-b" aria-hidden="true" />
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
              06 · résumé
            </span>
            <div className="resume-doc">
              <header className="resume-doc__head">
                <h2>luke woods</h2>
                <p>product designer</p>
              </header>
              <h3 className="resume-doc__section">experience</h3>
              <ul className="resume-doc__rows">
                {RESUME_ROWS.map((row) => (
                  <li key={row.company}>
                    <span className="resume-doc__company">{row.company}</span>
                    <span className="resume-doc__role">Product Design Intern</span>
                    <span className="resume-doc__period">{row.period}</span>
                  </li>
                ))}
              </ul>
              <h3 className="resume-doc__section">toolkit</h3>
              <p className="resume-doc__tags">
                research · design systems · prototyping · motion · code
              </p>
              <a
                className="resume-doc__dl"
                href={SITE.resume}
                target="_blank"
                rel="noopener noreferrer"
              >
                download the full résumé →
              </a>
            </div>
          </section>

          <section className="canvas-outro" style={{ left: `${OUTRO_LEFT}vw` }}>
            <div className="canvas-outro__card">
              <SelectionHandles />
              <span className="canvas-card__label" aria-hidden="true">
                07 · say hi
              </span>
              <h2 className="canvas-outro__title">like what you see?</h2>
              <p className="canvas-outro__sub">
                I&apos;m looking for my next product design role — let&apos;s talk.
              </p>
              <a className="canvas-outro__cta footer-link" href={MAILTO}>
                email me →
              </a>
              <div className="canvas-outro__links">
                <a className="footer-link" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">
                  linkedin
                </a>
                <a className="footer-link" href={SITE.resume} target="_blank" rel="noopener noreferrer">
                  résumé
                </a>
                <a className="footer-link" href="/chat">
                  chat with luke ai
                </a>
              </div>
            </div>
          </section>
        </motion.div>

        {/* ── Screen-fixed chrome: sticker nav + progress line ── */}
        <nav className="canvas-nav" aria-label="Canvas navigation">
          <button type="button" className="canvas-nav__btn" onClick={() => goToVw(0)}>
            home
          </button>
          <button
            type="button"
            className="canvas-nav__btn"
            onClick={() => goToVw(CARDS[0].left - 8)}
          >
            work
          </button>
          <button
            type="button"
            className="canvas-nav__btn"
            onClick={() => goToVw(ABOUT_PHOTOS_LEFT - 8)}
          >
            about
          </button>
          <a className="canvas-nav__btn" href="/chat">
            luke ai
          </a>
        </nav>

        <div className="canvas-progress" aria-hidden="true">
          <motion.div className="canvas-progress__fill" style={{ scaleX: smooth }} />
        </div>
      </div>
    </div>
  )
}
