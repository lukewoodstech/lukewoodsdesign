/* eslint-disable @next/next/no-img-element -- the file's own 16px SVG glyphs; next/image adds nothing to a decorative inline icon */
import type { ReactNode } from 'react'
import { predictFont } from '@/components/predict/font'

/*
 * Predict's chrome around a page: the icon rail on the left, the title bar
 * on top. Drawn from the design file's home frame (15635:17956) with the
 * file's own icon exports. The rail and bar are scenery for the coded
 * screens, so nothing in them is a control; they are marked decorative and
 * the screen's own content carries the interaction.
 */

const M = '/work/pattern/mock'

const RAIL = [
  'icons-speedometer',
  'icons-megaphone',
  'icons-graph',
  'icons-shield',
  'icons-loyalty',
  'icons-globe',
  'icons-calendar',
  'icons-bar-chart',
]

export default function PredictShell({
  title,
  children,
  active = 7,
  filter = 'YEAR · BY MONTH | AMAZON US | ALL | $USD',
  cta,
  className = '',
}: {
  title: string
  children: ReactNode
  /** Which rail icon is lit. Reports is the bar chart, index 7. */
  active?: number
  filter?: string
  /** The green action pinned bottom-right, e.g. "Create new". */
  cta?: string
  className?: string
}) {
  return (
    <div className={`pm pm-shell ${predictFont.className} ${className}`.trim()}>
      <nav className="pm-rail" aria-hidden="true">
        <div className="pm-rail__logo">
          <img src={`${M}/pattern.svg`} alt="" />
          <span>PRE</span>
        </div>
        <ul>
          {RAIL.map((icon, i) => (
            <li key={icon} className={i === active ? 'is-active' : ''}>
              <img src={`${M}/${icon}.svg`} alt="" />
            </li>
          ))}
        </ul>
        <ul className="pm-rail__bottom">
          <li>
            <img src={`${M}/icons-config.svg`} alt="" />
          </li>
          <li>
            <img src={`${M}/icons-info.svg`} alt="" />
          </li>
        </ul>
      </nav>

      <div className="pm-main">
        <header className="pm-top" aria-hidden="true">
          <h2 className="pm-top__title">{title}</h2>
          <div className="pm-top__tools">
            <span className="pm-chip">
              <img src={`${M}/icons-filter.svg`} alt="" className="pm-icon" />
              {filter}
            </span>
            <span className="pm-pill">
              <img src={`${M}/icons-bell.svg`} alt="" className="pm-icon" />
              12
            </span>
            <span className="pm-pill pm-pill--round">
              <img src={`${M}/icons-search.svg`} alt="" className="pm-icon" />
            </span>
          </div>
        </header>
        <div className="pm-content">{children}</div>
        {cta && (
          <div className="pm-ctabar" aria-hidden="true">
            <span className="pm-cta">{cta}</span>
          </div>
        )}
      </div>
    </div>
  )
}
