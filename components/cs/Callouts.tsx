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
 * `ax`, then down (or up) to `ay`. Defaults land on the box's top-centre.
 * On phones the lines go away and the boxes get numbered instead, so the
 * figure reads as a list plus a picture rather than a tangle.
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
        <svg className="cs-callouts__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {items.map((c, i) => {
            const lx = ((i + 0.5) / n) * 100
            const ax = c.ax ?? c.x + c.w / 2
            const ay = c.ay ?? c.y
            const gy = Math.min(Math.max(c.gy ?? c.y - 6, 1), ay)
            return (
              <path
                key={c.label}
                d={`M${lx} 0 V${gy} H${ax} V${ay}`}
                pathLength={1}
                style={{ '--co': COLORS[i % COLORS.length], '--i': i } as React.CSSProperties}
              />
            )
          })}
        </svg>
        {items.map((c, i) => (
          <span
            key={c.label}
            className="cs-callouts__box"
            style={
              {
                left: `${c.x}%`,
                top: `${c.y}%`,
                width: `${c.w}%`,
                height: `${c.h}%`,
                '--co': COLORS[i % COLORS.length],
                '--i': i,
              } as React.CSSProperties
            }
            aria-hidden="true"
          >
            <i>{i + 1}</i>
          </span>
        ))}
      </div>
    </Reveal>
  )
}
