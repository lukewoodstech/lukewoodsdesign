'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
   cards sit at staggered heights but square, not tilted. */
const CARDS: readonly CardSpec[] = [
  /* top ≥ 12vh keeps the floating labels from crowding the top edge */
  { left: 112, top: 12, w: 40, h: 70, drift: 1 },
  { left: 159, top: 16, w: 38, h: 68, drift: -1 },
  { left: 204, top: 11, w: 38, h: 66, drift: 1 },
  { left: 249, top: 14, w: 38, h: 68, drift: -1 },
]

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
 * The Explorer's three folders and where each one scrolls the canvas to.
 * The nav's open folder follows the visitor: whichever section sits under
 * the middle of the screen is the one whose caret is down, and inside work/
 * the card nearest the middle is the highlighted file — the way VS Code
 * reveals the open file in its tree.
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
/* The nav's root "folder" is the site itself — derived, so a domain change follows. */
const SITE_HOST = new URL(SITE.url).host

/*
 * Most rows in the tree move the canvas; a few leave it for another page
 * (the case studies, the résumé). Those show this arrow on hover and
 * focus so the difference is visible before the click. Decorative — the
 * link text already says where it goes.
 */
const GoToPage = () => (
  <svg
    className="term-nav__goto"
    width="12"
    height="12"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 3.5h6.5V10M12.5 3.5 4 12" />
  </svg>
)

/* VS Code's tree chevron: points right when closed, rotates down when open. */
function Chevron({ open = false }: { open?: boolean }) {
  return (
    <svg
      className={`term-nav__chevron${open ? ' is-open' : ''}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  )
}

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
  const [navOpen, setNavOpen] = useState(true)
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

  const [here, setHere] = useState<Location>({ section: 'home', card: null })
  /*
   * A caret the visitor toggled by hand, or a folder they clicked to glide
   * to. It is dropped — not just ignored — the moment it stops applying,
   * so it can never come back later: a hand toggle lasts while they stay
   * in the section they toggled it from; a glide's folder stays open
   * while the canvas is still travelling toward it, and clears on arrival
   * or if they scroll back the other way.
   */
  const [override, setOverride] = useState<{
    at: Section
    open: Section | null
    to?: Section
  } | null>(null)
  const openFolder = override ? override.open : here.section
  const lastSection = useRef<Section>('home')
  useMotionValueEvent(smooth, 'change', (v) => {
    const next = locate(v * TRAVEL)
    const prevSection = lastSection.current
    lastSection.current = next.section
    setHere((prev) =>
      prev.section === next.section && prev.card === next.card ? prev : next,
    )
    if (next.section === prevSection) return
    setOverride((o) => {
      if (!o) return o
      if (!o.to) return null
      if (next.section === o.to) return null
      const rank = (id: Section) => FOLDERS.findIndex((f) => f.id === id)
      const towards = Math.abs(rank(next.section) - rank(o.to)) < Math.abs(rank(prevSection) - rank(o.to))
      return towards ? o : null
    })
  })
  /* Open a folder now (instant feedback) and glide the canvas there. */
  const openSection = (id: Section) => {
    setOverride({ at: here.section, open: id, to: id })
    goToVw(SECTION_AT[id])
  }
  /* "Opening" luke-ai.tsx: back to the landing with the cursor in the prompt. */
  const openLukeAi = () => {
    goToVw(0)
    document
      .querySelector<HTMLTextAreaElement>('.canvas-intro__ai textarea')
      ?.focus({ preventScroll: true })
  }
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

        {/* ── Screen-fixed chrome: the nav as the VS Code Explorer ── */}
        <nav className="canvas-nav" aria-label="Canvas navigation">
          <div className="term-nav">
            {/* Side-panel header, the way the Explorer view is titled */}
            <div className="term-nav__head" aria-hidden="true">
              <span className="term-nav__title">explorer</span>
            </div>

            {/* Root folder: the site. The caret folds the sections away;
                the name itself is `cd ~`. */}
            <div className="term-nav__row term-nav__row--root">
              <button
                type="button"
                className="term-nav__toggle"
                aria-expanded={navOpen}
                aria-label={navOpen ? 'Collapse navigation' : 'Expand navigation'}
                onClick={() => setNavOpen((v) => !v)}
              >
                <Chevron open={navOpen} />
              </button>
              <button type="button" className="term-nav__label" onClick={() => goToVw(0)}>
                {SITE_HOST}
              </button>
            </div>

            <ul className="term-nav__children" hidden={!navOpen}>
              {FOLDERS.map(({ id, name }) => {
                const open = openFolder === id
                const current = here.section === id
                const filesId = `canvas-nav-files-${id}`
                return (
                  <li key={id}>
                    {/* Same shape as the root row: the caret toggles, the
                        name navigates (and opens). */}
                    <div className="term-nav__row">
                      <button
                        type="button"
                        className="term-nav__toggle"
                        aria-expanded={open}
                        aria-controls={filesId}
                        aria-label={`${open ? 'Collapse' : 'Expand'} ${name}`}
                        onClick={() =>
                          setOverride({ at: here.section, open: open ? null : id })
                        }
                      >
                        <Chevron open={open} />
                      </button>
                      <button
                        type="button"
                        className="term-nav__item"
                        aria-current={current ? 'location' : undefined}
                        onClick={() => openSection(id)}
                      >
                        {name}
                      </button>
                    </div>

                    {/* The folder's files. Every one opens something real:
                        the prompt, a case study, the README, the résumé. */}
                    <ul id={filesId} className="term-nav__files" hidden={!open}>
                      {id === 'home' && (
                        <li>
                          <button
                            type="button"
                            className={`term-nav__file${current ? ' is-active' : ''}`}
                            aria-current={current ? 'true' : undefined}
                            onClick={openLukeAi}
                          >
                            luke-ai.tsx
                          </button>
                        </li>
                      )}
                      {id === 'work' &&
                        WORK_TILES.map((item) => {
                          const active = here.card === item.slug
                          return (
                            <li key={item.slug}>
                              <Link
                                href={item.href}
                                className={`term-nav__file term-nav__file--route${active ? ' is-active' : ''}`}
                                aria-current={active ? 'true' : undefined}
                              >
                                {item.file}
                                <GoToPage />
                              </Link>
                            </li>
                          )
                        })}
                      {id === 'about' && (
                        <>
                          <li>
                            {/* The README is the canvas's last object, so
                                the end of the track is where it's in view. */}
                            <button
                              type="button"
                              className={`term-nav__file${current ? ' is-active' : ''}`}
                              aria-current={current ? 'true' : undefined}
                              onClick={() => goToVw(TRAVEL)}
                            >
                              README.md
                            </button>
                          </li>
                          <li>
                            <a
                              className="term-nav__file term-nav__file--route"
                              href={SITE.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              resume.pdf
                              <span className="sr-only"> (opens in a new tab)</span>
                              <GoToPage />
                            </a>
                          </li>
                        </>
                      )}
                    </ul>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

      </div>
    </div>
  )
}
