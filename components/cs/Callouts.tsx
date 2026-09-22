import Image from 'next/image'
import type { ReactNode } from 'react'
import Reveal from '@/components/lucid/Reveal'

/*
 * The annotated screenshot: coloured labels in a row above the capture,
 * each with a leader line dropping into the picture and ending on an
 * outlined region. Coordinates are percentages of the image, so the same
 * numbers hold at every width. The lines are one SVG over the image with
 * a non-scaling stroke; the stems under the labels are CSS.
 *
 * Route: from the label's column centre straight down to `gy`, across to
 * `ax`, then down (or up) to `ay`, where a numbered pin sits on the image.
 * Hovering a label dims the other callouts so one pairing reads at a time.
 * On phones the lines go away and the pins carry the pairing alone.
 */
export type Callout = {
  label: string
  text: ReactNode
  /** The outlined region, in % of the image. */
  x: number
  y: number
  w: number
  h: number
  /** Where the leader line ends and the gutter it turns in; see above. */
  ax?: number
  ay?: number
  gy?: number
}

const COLORS = ['var(--c1)', 'var(--c2)', 'var(--c3)']

export default function Callouts({
  src,
  alt,
  width,
  height,
  items,
  sizes = '(min-width: 60em) 800px, 100vw',
}: {
  src: string
  alt: string
  width: number
  height: number
  items: Callout[]
  sizes?: string
}) {
  const n = items.length
  return (
    <Reveal className="cs-callouts" role="figure" aria-label={alt}>
      <ol className="cs-callouts__labels" style={{ '--n': n } as React.CSSProperties}>
        {items.map((c, i) => (
          <li key={c.label} style={{ '--co': COLORS[i % COLORS.length], '--i': i } as React.CSSProperties}>
            <span className="cs-mono-label">
              <i>{i + 1}</i>
              {c.label}
            </span>
            <br />
            {c.text}
          </li>
        ))}
      </ol>
      <div className="cs-callouts__stage">
        <Image src={src} alt="" width={width} height={height} sizes={sizes} />
        {/* The leader lines as three positioned segments each: down from the
            label's column, across the gutter, down to the pin. HTML rather
            than SVG because a non-uniformly scaled SVG path ignores
            pathLength in Chromium, which turned every line into dashes. */}
        {items.map((c, i) => {
          const lx = ((i + 0.5) / n) * 100
          const ax = c.ax ?? c.x + c.w / 2
          const ay = c.ay ?? c.y
          const gy = Math.min(Math.max(c.gy ?? c.y - 6, 1), ay)
          const vars = { '--co': COLORS[i % COLORS.length], '--i': i } as React.CSSProperties
          return (
            <span key={c.label} data-i={i} style={vars} aria-hidden="true">
              <span className="cs-callouts__seg cs-callouts__seg--v" style={{ left: `${lx}%`, top: 0, height: `${gy}%` }} />
              <span
                className="cs-callouts__seg cs-callouts__seg--h"
                style={{ left: `${Math.min(lx, ax)}%`, top: `${gy}%`, width: `${Math.abs(ax - lx)}%` }}
              />
              <span
                className="cs-callouts__seg cs-callouts__seg--v"
                style={{ left: `${ax}%`, top: `${Math.min(gy, ay)}%`, height: `${Math.abs(ay - gy)}%` }}
              />
            </span>
          )
        })}
        {items.map((c, i) => {
          const ax = c.ax ?? c.x + c.w / 2
          const ay = c.ay ?? c.y
          const vars = { '--co': COLORS[i % COLORS.length], '--i': i } as React.CSSProperties
          return (
            <span key={c.label} data-i={i} style={vars} aria-hidden="true">
              <span
                className="cs-callouts__box"
                style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${c.w}%`, height: `${c.h}%` }}
              />
              {/* The numbered pin where the line lands: the same number as
                  the label, in the same colour, so the pairing reads even
                  where the line crosses busy content. */}
              <span className="cs-callouts__pin" style={{ left: `${ax}%`, top: `${ay}%` }}>
                {i + 1}
              </span>
            </span>
          )
        })}
      </div>
    </Reveal>
  )
}
