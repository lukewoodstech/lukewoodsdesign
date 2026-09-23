'use client'

import { useEffect } from 'react'
import Footer from './Footer'
import SiteNav from './SiteNav'
import HeroIntro from './HeroIntro'
import HomeClose from './HomeClose'
import { WORK_TILES } from './CanvasBits'

/*
 * The homepage (2026-09-21): the hero sentence centred at the top, then
 * the case studies down the page. One layout for every width — the
 * phone stacks the cards, the desktop staggers them left and right on
 * the 12-column grid so they still read as pieces laid on a canvas
 * rather than rows in a list.
 *
 * This replaces the horizontal "designer's canvas" (CanvasHome, a
 * scroll-driven strip) and its separate phone version (MobileHome).
 * The strip was the site's signature and its most-reported problem —
 * "the side scrolling is a little hard" came up in every review — and
 * the hero grew large enough that the column-beside-a-card framing no
 * longer fit. What survives from it: the dot-grid surface, the
 * mono layer-labels above each card, the stagger, and the fixed bar
 * reporting which study you're beside.
 */

/* Where the visitor left the page, so a link back from a study lands
   them beside the card they came from. Browser back/forward restores
   scroll natively; this covers link navigation, which starts at the top.
   Session-scoped: a fresh tab starts at the hero like it should. */
const SCROLL_KEY = 'home-scroll-y'

export default function Home() {
  useEffect(() => {
    let raf = 0
    const save = () => {
      raf = 0
      try {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
      } catch {}
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(save)
    }

    try {
      const saved = parseFloat(sessionStorage.getItem(SCROLL_KEY) ?? '')
      if (Number.isFinite(saved) && saved > 0) window.scrollTo({ top: saved, behavior: 'instant' })
    } catch {}

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const goHome = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="home" id="top">
      <SiteNav home={{ onHome: goHome }} />

      <main id="main">
        <section className="home-hero" aria-label="Introduction">
          <HeroIntro />
        </section>

        <section className="home-work" id="work" aria-labelledby="home-work-heading">
          <h2 id="home-work-heading" className="home-work__heading">
            selected work <span aria-hidden="true">—</span>
          </h2>

          {WORK_TILES.map((item, i) => (
            <article
              key={item.slug}
              className={`home-work__item home-work__item--${i % 2 ? 'right' : 'left'}`}
            >
              {/* Layer-name tag above each card — design-tool chrome, so it
                  keeps the mono. */}
              <span className="home-work__label" aria-hidden="true">
                {item.label}
              </span>
              <div className="home-card">{item.tile}</div>
            </article>
          ))}

        </section>

        <HomeClose />
      </main>

      <Footer />
    </div>
  )
}
