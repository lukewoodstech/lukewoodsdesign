'use client'

import { useEffect, useRef, useState } from 'react'

/*
 * The giant name plate as a half-finished vector object: letterforms render
 * as outlines (webkit text-stroke) with Figma-style anchor points sitting on
 * the strokes, and each letter fills to solid white as the cursor sweeps
 * within reach — the visitor finishes the drawing. Fill is permanent for the
 * session; the anchors fade out once every letter is solid.
 *
 * Desktop-canvas only (the mobile stack has no giant plate), so no touch or
 * reduced-motion handling here. Browsers without -webkit-text-stroke get the
 * plain solid name via the @supports guard in globals.css.
 */

const LETTERS = 'luke woods'.split('')

/* First letter starts solid — the hint that the rest can be filled in. */
const INITIAL = LETTERS.map((_, i) => i === 0)

const RADIUS = 110 // px — how close the pointer must pass to fill a letter

/* Decorative anchor points, hand-placed on plausible stroke corners
   ([left, top] as % of the name box). The second one carries a bezier
   handle arm. */
const ANCHORS = [
  { left: '2.5%', top: '4%' }, // top of the l stem
  { left: '30.5%', top: '38%', arm: true }, // e's crossbar
  { left: '55%', top: '10%' }, // w's left peak
  { left: '97.5%', top: '82%' }, // tail of the s
] as const

export default function VectorName() {
  const spansRef = useRef<(HTMLSpanElement | null)[]>([])
  const rafRef = useRef(0)
  const [filled, setFilled] = useState(INITIAL)
  /* Inspect-element hover: real rendered dimensions, measured on entry. */
  const [inspect, setInspect] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  function onPointerEnter(e: React.PointerEvent) {
    const r = e.currentTarget.getBoundingClientRect()
    setInspect({ w: Math.round(r.width), h: Math.round(r.height) })
  }

  function onPointerMove(e: React.PointerEvent) {
    const { clientX, clientY } = e
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0
      setFilled((prev) => {
        let changed = false
        const next = prev.slice()
        spansRef.current.forEach((el, i) => {
          if (!el || next[i]) return
          const r = el.getBoundingClientRect()
          const dx = clientX - (r.left + r.width / 2)
          const dy = clientY - (r.top + r.height / 2)
          if (dx * dx + dy * dy < RADIUS * RADIUS) {
            next[i] = true
            changed = true
          }
        })
        return changed ? next : prev
      })
    })
  }

  const done = filled.every(Boolean)

  return (
    <h1
      className={`canvas-intro__giant vec-name${done ? ' is-done' : ''}${inspect ? ' is-inspected' : ''}`}
      aria-label="luke woods"
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={() => setInspect(null)}
    >
      {LETTERS.map((ch, i) => (
        <span
          key={i}
          ref={(el) => {
            spansRef.current[i] = el
          }}
          data-letter={ch === ' ' ? undefined : ''}
          className={filled[i] ? 'is-filled' : undefined}
          aria-hidden="true"
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
      {ANCHORS.map((a, i) => (
        <span
          key={i}
          className="vec-anchor"
          style={{ left: a.left, top: a.top }}
          aria-hidden="true"
        >
          {'arm' in a && a.arm && <span className="vec-anchor__arm" />}
        </span>
      ))}
      {/* Devtools-style inspect overlay: highlight box + measurement chip */}
      {inspect && (
        <span className="vec-inspect" aria-hidden="true">
          <span className="vec-inspect__chip">
            <b>h1</b>
            <i>.vec-name</i>
            <span className="vec-inspect__dims">
              {inspect.w} × {inspect.h}
            </span>
          </span>
        </span>
      )}
    </h1>
  )
}
