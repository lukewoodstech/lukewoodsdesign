'use client'

import { useSyncExternalStore } from 'react'

/*
 * The tiles drive their artwork from requestAnimationFrame loops, which the
 * `prefers-reduced-motion` media query in globals.css can't reach — CSS only
 * covers the view transitions and the tile-footer fades. Each loop reads this
 * and renders a single static frame instead.
 *
 * matchMedia is an external store, so useSyncExternalStore is the right fit:
 * it subscribes without a setState-in-effect cascade, and the server snapshot
 * returns false so markup matches on first paint.
 */
const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}
