'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/*
 * Makes the tiles' "Enter ↵" keycap honest: while a tile is hovered,
 * pressing Enter opens its case study. Skips presses aimed at real
 * controls (links, buttons, inputs) and any modified keystrokes, so
 * keyboard navigation and shortcuts pass through untouched.
 */
export function useEnterToOpen(active: boolean, hrefOrOpen: string | (() => void)) {
  const router = useRouter()

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
      const target = e.target as HTMLElement | null
      if (target?.closest('a, button, input, textarea, select, [contenteditable]')) return
      e.preventDefault()
      if (typeof hrefOrOpen === 'string') router.push(hrefOrOpen)
      else hrefOrOpen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, hrefOrOpen, router])
}
