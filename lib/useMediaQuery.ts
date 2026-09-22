'use client'

import { useSyncExternalStore } from 'react'

/*
 * A media query as React state, for the queries CSS can't answer on its
 * own — a component that has to *behave* differently, not just look
 * different. `(hover: none)` is the case this was written for: on a
 * device with no pointer to hover with, the hero opens its own modes
 * instead of waiting for one (see components/HeroIntro.tsx).
 *
 * Same shape as useReducedMotion, and for the same reason: matchMedia
 * is an external store, so useSyncExternalStore subscribes to it without
 * a setState-in-effect cascade. The server snapshot is false, so the
 * markup matches on first paint and the behaviour arrives with the
 * script — which is the right way round, since the behaviour is the part
 * that needs the script.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
