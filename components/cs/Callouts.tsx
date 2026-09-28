'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import Reveal from '@/components/lucid/Reveal'

/*
 * The annotated screenshot: coloured labels in a row above the capture,
 * each with a leader line into the picture ending on an outlined region
 * and a numbered pin. Region and pin coordinates are percentages of the
 * image, so the same numbers hold at every width.
 *
 * Route: straight down from the label's column into the dark band between
 * the captions and the picture, across that band to the pin's column, then
 * straight down into the picture to the pin. All the sideways travel
 * happens over the site's background, never over the screenshot, so what
 * crosses the picture is one vertical per callout. Each line takes its
 * own height in the band (staggered by index) so parallel runs stay apart.
 *
 * The leaders are one SVG over the whole figure, drawn in screen pixels
 * from a measurement of the layout, so the band (rem) and the picture
 * (percent of a scaled image) share one coordinate system and the line is
 * one continuous path with rounded elbows.
 *
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
  /** Where the line lands, in % of the image. Defaults to the region's top centre. */
  ax?: number
  ay?: number
}

const COLORS = ['var(--c1)', 'var(--c2)', 'var(--c3)']

/* Band height in px: room for n staggered runs. Mirrors --cs-callouts-band. */
const bandFor = (n: number) => 20 + n * 14
const ELBOW = 12

/* Down from the caption, one rounded elbow into the band, across, one
   rounded elbow, then down to the pin. Straight runs use V/H so a pin
   sitting directly under its label is a single vertical. */
function route(lx: number, y0: number, gy: number, ax: number, ay: number) {
  const dx = Math.abs(ax - lx)
  if (dx < 1) return `M ${lx} ${y0} V ${ay}`
  const sx = ax > lx ? 1 : -1
  const r = Math.min(ELBOW, dx / 2, gy - y0, ay - gy)
  return (
    `M ${lx} ${y0} V ${gy - r} Q ${lx} ${gy} ${lx + sx * r} ${gy}` +
    ` H ${ax - sx * r} Q ${ax} ${gy} ${ax} ${gy + r} V ${ay}`
  )
}

type Geo = { w: number; h: number; stageTop: number; stageH: number }

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
  const band = bandFor(n)
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [geo, setGeo] = useState<Geo | null>(null)

  useEffect(() => {
    const el = root.current
    const st = stage.current
    if (!el || !st) return
    const measure = () =>
      setGeo({
        w: el.clientWidth,
        h: el.clientHeight,
        stageTop: st.offsetTop,
        stageH: st.offsetHeight,
      })
    const obs = new ResizeObserver(measure)
    obs.observe(el)
    obs.observe(st)
    return () => obs.disconnect()
  }, [])

  const vars = (i: number) =>
    ({ '--co': COLORS[i % COLORS.length], '--i': i }) as React.CSSProperties
  const land = (c: Callout) => ({ ax: c.ax ?? c.x + c.w / 2, ay: c.ay ?? c.y })

  return (
    <Reveal className="cs-callouts" role="figure" aria-label={alt}>
      <div
        ref={root}
        className="cs-callouts__body"
        style={{ '--n': n, '--cs-callouts-band': `${band}px` } as React.CSSProperties}
      >
        <ol className="cs-callouts__labels">
          {items.map((c, i) => (
            <li key={c.label} style={vars(i)}>
              <span className="cs-mono-label">
                <i>{i + 1}</i>
                {c.label}
              </span>
              <br />
              {c.text}
            </li>
          ))}
        </ol>
        <div ref={stage} className="cs-callouts__stage">
          <Image src={src} alt="" width={width} height={height} sizes={sizes} />
          {items.map((c, i) => {
            const { ax, ay } = land(c)
            return (
              <span key={c.label} data-i={i} style={vars(i)} aria-hidden="true">
                <span
                  className="cs-callouts__box"
                  style={{
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    width: `${c.w}%`,
                    height: `${c.h}%`,
                  }}
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
        {geo && (
          <svg className="cs-callouts__lines" viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true">
            {items.map((c, i) => {
              const { ax, ay } = land(c)
              const lx = ((i + 0.5) / n) * geo.w
              const y0 = geo.stageTop - band
              /* Later callouts run lower in the band, so a line heading
                 far right passes above the shorter ones near their own
                 columns instead of through them. */
              const gy = y0 + ((i + 1) / (n + 1)) * band
              const d = route(
                lx,
                y0,
                gy,
                (ax / 100) * geo.w,
                geo.stageTop + (ay / 100) * geo.stageH,
              )
              return (
                <g key={c.label} data-i={i} style={vars(i)}>
                  <path d={d} className="cs-callouts__halo" pathLength={1} />
                  <path d={d} className="cs-callouts__lead" pathLength={1} />
                </g>
              )
            })}
          </svg>
        )}
      </div>
    </Reveal>
  )
}
