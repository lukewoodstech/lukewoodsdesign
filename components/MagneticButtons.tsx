'use client'

import { useEffect } from 'react'

/*
 * Magnetic pull on buttons and links: while the pointer is over one of
 * these controls, the control drifts up to PULL px toward the pointer and
 * settles back on leave. This is the hover feel the old custom cursor had,
 * kept on its own now that the site runs the native cursor.
 *
 * One delegated mousemove listener does all the work — no per-element
 * binding, no MutationObserver — so controls added later (a new chat
 * prompt, a lightbox close) get the pull for free.
 */

const SEL =
  '.btn, .footer-link, .term-pg__plus, .ai-card__expand, .ai-card__tool, ' +
  '.lai__chip, .lai__action, .lai-composer__send, .term-hist__new, .term-hist__item, ' +
  '.term-nav__item, .canvas-outro__cta, .pub-card__publish, .resume-doc__dl, ' +
  '.lcs-seg__btn, .lcs-lightbox__close, .ai-dock__chip'

const PULL = 6

export default function MagneticButtons() {
  useEffect(() => {
    // No hover on touch; no drift for people who asked for less motion.
    if (window.matchMedia('(hover: none)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let active: HTMLElement | null = null
    // Measured once on enter, before any translate, so the offset math
    // doesn't chase a box that is itself moving.
    let rect: DOMRect | null = null

    const release = () => {
      if (active) active.style.transform = ''
      active = null
      rect = null
    }

    const onMove = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null
      const el = target?.closest<HTMLElement>(SEL) ?? null
      if (el !== active) {
        release()
        active = el
        rect = el ? el.getBoundingClientRect() : null
      }
      if (!active || !rect) return
      const halfW = rect.width / 2
      const halfH = rect.height / 2
      const x = (e.clientX - rect.left - halfW) / halfW
      const y = (e.clientY - rect.top - halfH) / halfH
      active.style.transform = `translate(${x * PULL}px, ${y * PULL}px)`
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', release)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', release)
      release()
    }
  }, [])

  return null
}
