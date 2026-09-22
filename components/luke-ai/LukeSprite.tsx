'use client'

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import {
  ACTS,
  GLOW_RECT,
  H,
  IDLE_MAX,
  IDLE_MIN,
  W,
  compose,
  idleFrame,
  pickAct,
  type ActName,
  type Frame,
  type Variant,
} from '@/lib/lukeSprite'

/*
 * Luke's face, alive — the pixel portrait from lib/lukeSprite playing its
 * little acts: waving, typing, shooting a basketball, putting headphones
 * on, lifting, yawning, falling asleep.
 *
 * One clock for the whole site, module-level and shared. The dock chip
 * and the open window are two windows onto the same performance, so
 * closing the panel doesn't rewind him to the start of a sequence — he
 * carries on, and the next act is picked at random when the current one
 * ends. 8fps on purpose: stepped, like the games the style comes from.
 *
 * The clock stops when nothing is rendering him and when the tab is in
 * the background, and never starts under reduced motion.
 */

const TICK_MS = 125
const REDUCE = '(prefers-reduced-motion: reduce)'

/* ── the shared performance ── */

const listeners = new Set<() => void>()
let timer = 0
let act: ActName | null = null
let last: ActName | null = null
let t = 0
let len = IDLE_MIN
let blinkAt = 8
let snapshot: Frame = idleFrame(0, 8)

const idleLength = () => IDLE_MIN + Math.floor(Math.random() * (IDLE_MAX - IDLE_MIN))

const advance = () => {
  if (typeof document !== 'undefined' && document.hidden) return
  t += 1
  if (t >= len) {
    t = 0
    if (act) {
      act = null
      len = idleLength()
      blinkAt = 4 + Math.floor(Math.random() * Math.max(1, len - 18))
    } else {
      act = pickAct(last)
      last = act
      len = ACTS[act].len
    }
  }
  snapshot = act ? ACTS[act].frame(t) : idleFrame(t, blinkAt)
  for (const l of listeners) l()
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  if (listeners.size === 1) timer = window.setInterval(advance, TICK_MS)
  return () => {
    listeners.delete(cb)
    if (listeners.size === 0) {
      window.clearInterval(timer)
      timer = 0
    }
  }
}

const getSnapshot = () => snapshot
/* One frozen frame, returned by identity: a fresh object here would make
   useSyncExternalStore loop forever. */
const STILL: Frame = {}
const getServerSnapshot = () => STILL

/* ── reduced motion ── */

const subscribeReduce = (cb: () => void) => {
  const m = window.matchMedia(REDUCE)
  m.addEventListener('change', cb)
  return () => m.removeEventListener('change', cb)
}

export default function LukeSprite({
  variant,
  className,
  act: only,
}: {
  variant: Variant
  className?: string
  /* Play one act on a loop instead of joining the shared performance —
     the hero's hint needs him waving, not asleep on the job. */
  act?: ActName
}) {
  const reduce = useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE).matches,
    () => true,
  )
  const live = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [solo, setSolo] = useState(0)

  useEffect(() => {
    if (reduce || !only) return
    const id = window.setInterval(() => {
      if (!document.hidden) setSolo((n) => n + 1)
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [reduce, only])

  const frame = reduce ? STILL : only ? ACTS[only].frame(solo % ACTS[only].len) : live
  const paths = useMemo(() => compose(frame), [frame])

  return (
    <svg
      className={className}
      data-variant={variant}
      viewBox={`0 0 ${W} ${H}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map(([fill, d]) => (
        <path key={fill} fill={fill} d={d} />
      ))}
      {frame.glow ? (
        <rect
          x={GLOW_RECT.x}
          y={GLOW_RECT.y}
          width={GLOW_RECT.w}
          height={GLOW_RECT.h}
          fill="#3794ff"
          opacity={frame.glow}
        />
      ) : null}
    </svg>
  )
}
