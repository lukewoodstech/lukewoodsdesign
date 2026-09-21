'use client'

import Link from 'next/link'
import { getCaseStudy } from '@/lib/caseStudies'

type Props = {
  /** Everything shown here comes from lib/caseStudies.ts, keyed by this. */
  slug: string
  /** Drop a real mark in /public/logos and pass it here; falls back to a monogram. */
  logoSrc?: string
  /** Company's own site. Makes the mark an outbound link instead of inert art. */
  companyHref?: string
  hovered?: boolean
}

/*
 * The band under every tile's artwork: company mark and name on one line, the
 * case study title with its year, and a one-line summary. Sized as a fixed
 * slab under a flexible stage, so all four tiles line up across the grid.
 *
 * The title is a real <Link>, and its ::after (see .tile-footer__link in
 * globals.css) stretches over the whole card, so the entire tile is that one
 * link — keyboard, crawler, middle-click and cmd-click all agree on where it
 * goes. The company mark sits above the stretched layer and stays its own
 * outbound link. The visible affordance for the link is the "open" badge in
 * the card's top-right corner — it appears on hover and focus (and sits
 * faintly at rest on touch screens, where there is no hover). It's under
 * the stretched link, so it's a signal, not a second control.
 */
export default function TileFooter({
  slug,
  logoSrc,
  companyHref,
  hovered = false,
}: Props) {
  const cs = getCaseStudy(slug)
  if (!cs) return null

  const { company, title, summary, period } = cs

  // Periods read like "Oct 2025 – Apr 2026 · 12 weeks"; show the last (most
  // recent) year on the tile.
  const year = period.match(/\d{4}/g)?.at(-1)

  const mark = logoSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoSrc} alt="" className="tile-footer__logo-img" />
  ) : (
    <span className="tile-footer__logo" aria-hidden="true">
      {company.charAt(0)}
    </span>
  )

  return (
    <div className={`tile-footer${hovered ? ' is-hovered' : ''}`}>
      <div className="tile-footer__head">
        {companyHref ? (
          <a
            href={companyHref}
            className="tile-footer__logo-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${company} — visit their site`}
          >
            {mark}
          </a>
        ) : (
          mark
        )}
        {/* Spelled out, not just the monogram — "A" tells a visitor nothing. */}
        <span className="tile-footer__company">{company}</span>
      </div>

      <h3 className="tile-footer__title">
        <Link href={`/work/${slug}`} className="tile-footer__link">
          {title}
        </Link>
        {year && (
          <span className="tile-footer__year">
            {' · '}
            {year}
          </span>
        )}
      </h3>

      <p className="tile-footer__summary">{summary}</p>

      {/* The open badge. Positioned against the card (the footer is static
          on purpose, see .tile-footer). Decorative: the title link already
          names the destination. */}
      <span className="tile-open" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17 17 7 M7 7h10v10" />
        </svg>
      </span>
    </div>
  )
}
