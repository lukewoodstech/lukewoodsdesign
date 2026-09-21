'use client'

import { useEffect, useRef } from 'react'
import StoryCard from './StoryCard'
import type { StoryCard as Card } from '@/lib/about'

/*
 * The story stage: fifteen cards that start as one — the portrait — and
 * deal out into a 5×3 grid as you scroll.
 *
 * The trick is that the grid is real the whole time. CSS lays the cards
 * out in their final cells and never moves them; all the motion is a
 * transform on each card that says "how far are you from the centre
 * cell, times how much of the deal is left." At progress 0 every card
 * sits exactly on the portrait; at 1 the transform is identity and the
 * grid is just a grid. So there's nothing to measure but two centres,
 * and the layout can't drift from the animation because they're the
 * same numbers.
 *
 * Progress comes from a sticky stage inside a tall section: the stage
 * pins for the section's extra height and progress is how far through
 * that extra height the page has scrolled. Cards nearer the centre deal
 * first (a delay proportional to distance), which is what makes it read
 * as a hand fanning a deck rather than an explosion.
 *
 * The scroll position is not applied directly. A mouse wheel moves the
 * page in steps and a trackpad in bursts, and drawing the deck at each
 * raw position made the deal stutter. Instead the drawn progress chases
 * the scrolled progress a fixed fraction per frame — a critically damped
 * follow that turns steps into a glide and settles in about a quarter
 * second. The loop only runs while there is distance left to close.
 *
 * The deal finishes just before the end of the scrub. It used to finish
 * at 85% of it, which left a third of a screen of scrolling where the
 * grid was already complete and nothing moved — the stage read as stuck.
 * Now the rest is a few vh, long enough to land on and not long enough
 * to feel like the page has stopped responding.
 *
 * The portrait starts at hero size — measured, not guessed: whatever
 * scale makes the card about three-fifths of the viewport tall, so it
 * arrives as a photograph of a person and shrinks into a card. The
 * caption and the corner radius are counter-scaled so they stay their
 * designed size the whole way down instead of being magnified with it.
 *
 * Phones get the grid two-up with a staggered fade-in instead — a 5×3
 * deal has nowhere to go on a 390px screen — and reduced motion gets the
 * finished grid, still, everywhere.
 */

const DESKTOP = '(min-width: 60em)'
/* Ease-out for things that should arrive gently (lift, the portrait
   settling); a smoothstep for the cards' travel so they leave the deck
   without a jolt and land without one. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4)
const smooth = (t: number) => t * t * (3 - 2 * t)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
/* Fraction of the remaining distance the drawn progress closes per frame
   (at 60fps; scaled by frame time so 120Hz screens feel the same). */
const FOLLOW = 0.16
/* The deal is complete at this much of the scrub; the rest is rest. */
const DEAL_END = 0.94
/* How tall the portrait stands before the deal, as a fraction of the
   viewport, and the scale that can't be exceeded getting there. */
const HERO_VH = 0.6
const HERO_MAX = 3.4
/* Must match --ab-card-r; the centre card's radius is divided by its
   scale so the hero's corners aren't magnified. */
const CARD_RADIUS = 16

export default function StoryStage({ cards }: { cards: ReadonlyArray<Card> }) {
  const secRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const sec = secRef.current
    const grid = gridRef.current
    if (!sec || !grid) return

    const items = Array.from(grid.querySelectorAll<HTMLLIElement>('.story-card'))
    const center = grid.querySelector<HTMLLIElement>('.story-card.is-center')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const desktop = window.matchMedia(DESKTOP)

    /* ── Phone / reduced motion: no scrub ── */
    if (reduce) {
      sec.classList.add('is-static', 'is-ready')
      return
    }

    const cap = center?.querySelector<HTMLElement>('.story-card__cap') ?? null
    let geo: { dx: number; dy: number; delay: number }[] = []
    let hero = 1
    let raf = 0
    let mode: 'scrub' | 'stagger' | null = null
    let io: IntersectionObserver | null = null
    /* Drawn progress vs. where the scroll actually is. */
    let shown = 0
    let target = 0
    let last = 0

    const measure = () => {
      if (!center) return
      const c = center.getBoundingClientRect()
      const cx = c.left + c.width / 2
      const cy = c.top + c.height / 2
      let max = 1
      geo = items.map((el) => {
        const r = el.getBoundingClientRect()
        const dx = cx - (r.left + r.width / 2)
        const dy = cy - (r.top + r.height / 2)
        const d = Math.hypot(dx, dy)
        max = Math.max(max, d)
        return { dx, dy, delay: d }
      })
      geo.forEach((g) => (g.delay = (g.delay / max) * 0.45))
      /* Hero size from the card's own resting height, so the portrait is
         the same share of the screen on a laptop and a 27". */
      hero = Math.min(HERO_MAX, Math.max(1, (HERO_VH * window.innerHeight) / c.height))
    }

    const apply = (raw: number) => {
      /* Everything below runs on the deal's own clock, 0..1 by DEAL_END. */
      const p = clamp01(raw / DEAL_END)
      /* A small lift only — the hero is tall enough now that the old
         18vh would have pushed its top off the stage. */
      const lift = -0.05 * window.innerHeight * (1 - easeOut(clamp01(p / 0.4)))
      grid.style.transform = `translate3d(0, ${lift.toFixed(2)}px, 0)`
      items.forEach((el, i) => {
        if (el === center) {
          /* Shrinks across most of the deal, not the first quarter of
             it: the portrait has to still be big while the first cards
             come out from under it, or the deck deals from nothing. */
          const s = hero - (hero - 1) * smooth(clamp01(p / 0.8))
          el.style.transform = `scale(${s.toFixed(4)})`
          el.style.borderRadius = `${(CARD_RADIUS / s).toFixed(2)}px`
          if (cap) {
            /* Counter-scale from the card's own bottom-left corner: the
               caption keeps its designed type size and padding while the
               card around it is up to 3× life size. */
            cap.style.width = `${(s * 100).toFixed(2)}%`
            cap.style.transform = `scale(${(1 / s).toFixed(4)})`
          }
          return
        }
        const g = geo[i]
        const pi = smooth(clamp01((p - g.delay) / 0.55))
        const x = (g.dx * (1 - pi)).toFixed(2)
        const y = (g.dy * (1 - pi)).toFixed(2)
        const sc = (0.8 + 0.2 * pi).toFixed(4)
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${sc})`
        /* Fade over the first third of the card's own travel — long
           enough to read as emerging from behind the portrait. */
        el.style.opacity = clamp01(pi * 3).toFixed(3)
      })
    }

    const progress = () => {
      const r = sec.getBoundingClientRect()
      const scrub = sec.offsetHeight - window.innerHeight
      return scrub <= 0 ? 1 : clamp01(-r.top / scrub)
    }

    /* The follow loop: close a fixed fraction of the gap each frame,
       stop when the gap is too small to draw. */
    const tick = (now: number) => {
      const dt = last ? Math.min(3, (now - last) / (1000 / 60)) : 1
      last = now
      const gap = target - shown
      if (Math.abs(gap) < 0.0005) {
        shown = target
        apply(shown)
        raf = 0
        last = 0
        return
      }
      shown += gap * (1 - Math.pow(1 - FOLLOW, dt))
      apply(shown)
      raf = requestAnimationFrame(tick)
    }
    const follow = () => {
      target = progress()
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const snap = () => {
      /* Jump straight to the scroll position — first paint and resize,
         where a glide from a stale value would look like a glitch. */
      cancelAnimationFrame(raf)
      raf = 0
      last = 0
      shown = target = progress()
      apply(shown)
    }

    const onScroll = follow
    const onResize = () => {
      /* Measure with transforms cleared, or the centres are wrong. */
      items.forEach((el) => (el.style.transform = ''))
      grid.style.transform = ''
      measure()
      snap()
    }

    const clear = () => {
      items.forEach((el) => {
        el.style.transform = ''
        el.style.opacity = ''
        el.style.borderRadius = ''
      })
      if (cap) {
        cap.style.width = ''
        cap.style.transform = ''
      }
      grid.style.transform = ''
    }

    const enter = (next: 'scrub' | 'stagger') => {
      if (mode === next) return
      /* leave the old mode */
      if (mode === 'scrub') {
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('resize', onResize)
        cancelAnimationFrame(raf)
        raf = 0
        clear()
      }
      if (mode === 'stagger') {
        io?.disconnect()
        io = null
        sec.classList.remove('is-in')
      }
      mode = next
      if (next === 'scrub') {
        sec.classList.remove('is-static')
        measure()
        snap()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onResize)
      } else {
        sec.classList.add('is-static')
        io = new IntersectionObserver(
          ([e]) => {
            if (e.isIntersecting) {
              sec.classList.add('is-in')
              io?.disconnect()
            }
          },
          { threshold: 0.15 },
        )
        io.observe(grid)
      }
      sec.classList.add('is-ready')
    }

    enter(desktop.matches ? 'scrub' : 'stagger')
    const onMq = () => enter(desktop.matches ? 'scrub' : 'stagger')
    desktop.addEventListener('change', onMq)

    return () => {
      desktop.removeEventListener('change', onMq)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      io?.disconnect()
    }
  }, [])

  return (
    <section ref={secRef} className="story" aria-label="A few things about me">
      <div className="story__stage">
        <ul ref={gridRef} className="story__grid">
          {cards.map((c, i) => (
            <StoryCard
              key={i}
              card={c}
              index={i}
              priority={c.kind === 'photo' && !!c.center}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
