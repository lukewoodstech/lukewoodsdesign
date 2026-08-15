'use client'

import type { CSSProperties } from 'react'
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
 * Discipline accents, drawn from the site palette. Grouped by kind so a tag
 * keeps its colour wherever it appears: craft = blue, research/brand = pink,
 * product & motion = green, stage-of-work = yellow.
 */
const TAG_COLORS: Record<string, string> = {
  'Prototyping': 'var(--mono-blue)',
  'Design Systems': 'var(--mono-blue)',
  'Data Visualization': 'var(--mono-blue)',
  'Web Design': 'var(--mono-blue)',
  'UX Research': 'var(--mono-pink)',
  'User Research': 'var(--mono-pink)',
  'Brand Identity': 'var(--mono-pink)',
  'AI Product': 'var(--mono-green)',
  'Mobile Design': 'var(--mono-green)',
  'Motion': 'var(--mono-green)',
  '0 → 1': 'var(--mono-yellow)',
  'B2B SaaS': 'var(--mono-yellow)',
}

const FALLBACK = ['var(--mono-blue)', 'var(--mono-pink)', 'var(--mono-green)', 'var(--mono-yellow)']

function tagColor(tag: string) {
  if (TAG_COLORS[tag]) return TAG_COLORS[tag]
  // Stable per-name colour so an unmapped tag still reads consistently
  let h = 0
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) | 0
  return FALLBACK[Math.abs(h) % FALLBACK.length]
}

/*
 * The band under every tile's artwork: company mark and name on one line, the
 * case study title, a one-line summary, and colour-coded discipline tags.
 * Sized as a fixed slab under a flexible stage, so all four tiles line up
 * across the grid. Role and period live on the case study itself — in the grid
 * they only varied by which studies happened to have them filled in.
 *
 * The title is a real <Link>, which is the only keyboard- and crawler-visible
 * route into the case studies — the tile itself is a click-only div. A
 * full-card <a> overlay would be simpler but it would swallow the mousemove
 * that drives the Awardco slider and the Hoth binary field.
 */
export default function TileFooter({
  slug,
  logoSrc,
  companyHref,
  hovered = false,
}: Props) {
  const cs = getCaseStudy(slug)
  if (!cs) return null

  const { company, title, summary, tags } = cs

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
            /*
             * The whole tile is a click-to-case-study div, so without this the
             * mark would open the company's site *and* route to the case study
             * behind it.
             */
            onClick={(e) => e.stopPropagation()}
          >
            {mark}
          </a>
        ) : (
          mark
        )}
        {/* Spelled out, not just the monogram — "A" tells a visitor nothing. */}
        <span className="tile-footer__company">{company}</span>
        <span className="tile-footer__enter" aria-hidden="true">
          Enter ↵
        </span>
      </div>

      <h3 className="tile-footer__title">
        <Link href={`/work/${slug}`} className="tile-footer__link">
          {title}
        </Link>
      </h3>

      <p className="tile-footer__summary">{summary}</p>

      <ul className="tile-footer__tags">
        {tags.map((tag, i) => (
          <li
            key={tag}
            className="tile-footer__tag"
            style={
              {
                '--tag-color': tagColor(tag),
                transitionDelay: hovered ? `${i * 45}ms` : '0ms',
              } as CSSProperties
            }
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  )
}
