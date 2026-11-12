'use client'

import Image from 'next/image'
import { useRef, useState, type ReactNode } from 'react'
import Reveal from '@/components/lucid/Reveal'

/*
 * The annotated screenshot: outlined regions on the picture, each tagged
 * with a number, and a numbered key under it. No leader lines (Luke,
 * 2026-11-09): boxes are placed in percentages of the image, so they hold
 * at every width with nothing to measure, and the number does the pairing.
 *
 * Picking a callout (hover with a mouse, tap on touch, focus with a
 * keyboard) dims the rest of the picture around its box and quiets the
 * other key entries. A second tap, or a tap on the picture, lets it go.
 */
export type Callout = {
  label: string
  text: ReactNode
  /** The outlined region, in % of the image. */
  x: number
  y: number
  w: number
  h: number
  /** More regions that share this callout's number, e.g. several spots. */
  more?: { x: number; y: number; w: number; h: number }[]
  /** Unused since the leader lines went; kept so existing pages compile. */
  ax?: number
  ay?: number
}

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
  const [active, setActive] = useState<number | null>(null)
  /* A mouse already lit the callout on hover, so its click should not
     toggle it back off. */
  const via = useRef('')

  const pick = (i: number) => ({
    onPointerDown: (e: React.PointerEvent) => {
      via.current = e.pointerType
    },
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') setActive(i)
    },
    onPointerLeave: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') setActive(null)
    },
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      const mouse = via.current === 'mouse'
      via.current = ''
      if (!mouse) setActive((a) => (a === i ? null : i))
    },
  })
  const on = (i: number) => (active === i ? 'is-on' : undefined)

  return (
    <Reveal className="cs-callouts" role="figure">
      <div className="cs-callouts__body" data-active={active ?? undefined}>
        <div className="cs-callouts__stage" onClick={() => setActive(null)}>
          <Image src={src} alt={alt} width={width} height={height} sizes={sizes} />
          {items.flatMap((c, i) =>
            [c, ...(c.more ?? [])].map((r, j) => (
              <span
                key={`${c.label}-${j}`}
                className={['cs-callouts__box', on(i), c.more?.length && 'is-multi', r.y < 4 && 'is-top', r.x < 3 && 'is-left']
                  .filter(Boolean)
                  .join(' ')}
                style={
                  {
                    left: `${r.x}%`,
                    top: `${r.y}%`,
                    width: `${r.w}%`,
                    height: `${r.h}%`,
                    '--i': i,
                  } as React.CSSProperties
                }
                aria-hidden="true"
                {...pick(i)}
              >
                <span className="cs-callouts__tag">{i + 1}</span>
              </span>
            )),
          )}
        </div>

        <ol className="cs-callouts__key" /* Three across at most: four make a 2×2, five a 3 + 2. */
          style={{ '--cols': items.length === 4 ? 2 : Math.min(items.length, 3) } as React.CSSProperties}>
          {items.map((c, i) => (
            <li key={c.label} className={on(i)}>
              <button
                type="button"
                className="cs-callouts__pick"
                aria-pressed={active === i}
                /* Keyboard focus only: a tap focuses too, and its click
                   would then toggle the callout straight back off. */
                onFocus={(e) => e.currentTarget.matches(':focus-visible') && setActive(i)}
                onBlur={() => setActive(null)}
                {...pick(i)}
              >
                <span className="cs-callouts__num">{i + 1}</span>
                <span>
                  <span className="cs-callouts__label">{c.label}</span>
                  {c.text}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  )
}
