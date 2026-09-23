'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE } from '@/lib/site'
import { WORK, workForPath } from '@/lib/work'

/*
 * The one nav for the whole site — the same fixed bar on the horizontal
 * home page and on every case study, so the site stops reading as
 * two sites glued together. It belongs to the "editor chrome" layer: fixed,
 * mono, sharp-cornered, and its only job is telling you where you are and
 * letting you leave.
 *
 *   luke woods | my story   lucid  awardco  pattern              résumé
 *
 * Three slots on a 1fr/auto/1fr grid, so the case studies sit dead centre
 * of the SCREEN no matter how wide the two side groups get — with flex and
 * `margin-right: auto` they'd centre in the leftover space instead, which
 * drifts every time a label changes.
 *
 * Every item in the bar — the name, my story, the studies, résumé, next — is
 * one `.sitebar__link`: same family, same size, same padding, same squared
 * hover. The current page, and only the current page, is the editor's
 * selection blue: on the home page no study is highlighted, however far
 * down the cards you have scrolled.
 *
 * The study links go to the study, on every page including the home page.
 * They used to scroll the strip there instead, which made one control mean
 * two different things depending on the route, and cost a click: the tile
 * is itself a full-card link, so "lucid" scrolled you to the Lucid card and
 * then asked you to click it.
 *
 * Links keep `.footer-link` so nav and footer share one hover/focus box
 * and MagneticButtons.tsx pulls them toward the pointer.
 */

const LINK = 'footer-link sitebar__link'

export default function SiteNav({
  next,
  home,
}: {
  next?: { href: string; title: string }
  /* Home page only: the name scrolls back to the top instead of routing. */
  home?: {
    /** Scroll back to the hero — there is no route to go to. */
    onHome: () => void
  }
}) {
  const pathname = usePathname()
  const currentWork = home ? null : workForPath(pathname)
  const onAbout = !home && pathname.startsWith('/about')

  return (
    <header className="sitebar">
      <div className="sitebar__inner">
        {/* ── Left: who this is, and the one page that says more ── */}
        <div className="sitebar__lead">
          {home ? (
            <button type="button" className={`${LINK} sitebar__name`} onClick={home.onHome}>
              {SITE.name}
            </button>
          ) : (
            <Link href="/" className={`${LINK} sitebar__name`}>
              {SITE.name}
            </Link>
          )}
          <span className="sitebar__bar" aria-hidden="true">
            |
          </span>
          <Link
            href="/about"
            className={`${LINK}${onAbout ? ' is-current' : ''}`}
            aria-current={onAbout ? 'page' : undefined}
          >
            my story
          </Link>
        </div>

        {/* ── Centre: the work. Named, because on a sideways page the
            abstract section words were three rows for one destination. ── */}
        <nav className="sitebar__sections" aria-label="Case studies">
          {WORK.map((item) => {
            const here = currentWork === item.slug
            return (
              <Link
                key={item.slug}
                href={item.href}
                className={`${LINK} sitebar__section--work${here ? ' is-current' : ''}`}
                aria-current={here ? 'page' : undefined}
              >
                {item.nav}
              </Link>
            )
          })}
        </nav>

        {/* ── Right: the résumé, and `next` where there is one ── */}
        <div className="sitebar__end">
          <a href={SITE.resume} className={LINK} target="_blank" rel="noopener noreferrer">
            résumé
          </a>
          {next && (
            <Link
              href={next.href}
              className={`${LINK} sitebar__next`}
              aria-label={`Next case study: ${next.title}`}
            >
              {/* The word is a span so a phone can drop it and keep the
                  arrow: the link's aria-label names the destination either
                  way, so nothing is lost but the width. */}
              <span className="sitebar__next-word">next</span>
              <span className="sitebar__next-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
