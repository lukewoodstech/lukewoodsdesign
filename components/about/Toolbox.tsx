'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { Tool } from '@/lib/about'

/*
 * The toolbox: the tools as app-icon tiles that drop into a tray with
 * real gravity, pile up, and can be picked up and thrown.
 *
 * This is the page's one toy, and it earns its place because it proves
 * the claim the code card makes two screens up: the site is built, not
 * templated. Matter.js does the physics — rigid bodies, restitution,
 * friction, sleeping — and is loaded on demand inside the effect so it
 * costs nothing until this section is reached. The tiles are DOM, not a
 * canvas: each body's position and angle are written to its tile's
 * transform every frame, which keeps the icons crisp, themeable, and in
 * the accessibility tree as a plain list of tool names.
 *
 * Timing: nothing falls until the tray is 30% on screen, so the drop is
 * something you see happen. Dragging is a spring constraint from the
 * pointer to the tile, the same way Matter's own MouseConstraint works,
 * which is what makes a throw carry the pointer's velocity. Only the
 * tiles are `touch-action: none`, so on a phone the page still scrolls
 * over the tray unless a finger is on an icon.
 *
 * Reduced motion: the world is stepped to rest before first paint, so
 * the tiles are simply there, settled, and still draggable.
 *
 * A tile with a `provenance` line is also a button: tapping or focusing
 * it writes that line into the plate under the tray, with a link to the
 * case study where the tool did the work. That is what turns the toy
 * into something load-bearing, and it is why the tray was previously
 * unusable without a mouse: the only label was a `title` tooltip, which
 * no keyboard and no touchscreen can reach. Tools with no sourceable
 * story stay inert on purpose rather than carry an invented sentence.
 *
 * Tap and drag share one pointer stream, so a tap is defined here as a
 * press that travelled under TAP_SLOP. Relying on the button's own click
 * event does not work: the tile takes pointer capture on press, which
 * retargets the click.
 */

type M = typeof import('matter-js')

const SIZE_DESKTOP = 76
const SIZE_MOBILE = 58

export default function Toolbox({ tools }: { tools: ReadonlyArray<Tool> }) {
  const trayRef = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState<number | null>(null)
  /* The effect closes over its own scope, so taps reach React through a
     ref that every render keeps current. */
  const selectRef = useRef<(i: number) => void>(() => {})
  useEffect(() => {
    selectRef.current = (i: number) => {
      if (tools[i]) setActive(i)
    }
  }, [tools])

  useEffect(() => {
    const tray = trayRef.current
    if (!tray) return
    let cancelled = false
    let cleanup = () => {}

    const boot = async () => {
      const mod = await import('matter-js')
      const Matter: M = (mod as unknown as { default?: M }).default ?? (mod as unknown as M)
      if (cancelled) return

      const { Engine, Bodies, Body, Composite, Constraint, Sleeping, Vector } = Matter
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const tiles = Array.from(tray.querySelectorAll<HTMLLIElement>('.tb__tile'))
      const size = window.innerWidth < 600 ? SIZE_MOBILE : SIZE_DESKTOP
      tray.style.setProperty('--tb-size', `${size}px`)

      const engine = Engine.create({ enableSleeping: true })
      engine.gravity.y = 1.15
      const world = engine.world

      let W = tray.clientWidth
      let H = tray.clientHeight
      const T = 200 // wall thickness
      /* A square resting at 45° is size*√2 across, so its corner reaches
         size*(√2-1)/2 beyond the side the body is touching. Walls built
         flush with the tray let a tilted tile hang out and get sliced by
         `overflow: hidden`; inset by the overhang and it cannot. */
      const OVERHANG = (size * (Math.SQRT2 - 1)) / 2
      let walls: Matter.Body[] = []
      const buildWalls = () => {
        walls.forEach((w) => Composite.remove(world, w))
        walls = [
          Bodies.rectangle(W / 2, H + T / 2 - OVERHANG, W + T * 2, T, { isStatic: true }),
          Bodies.rectangle(-T / 2 + OVERHANG, H / 2 - size * 6, T, H + size * 14, { isStatic: true }),
          Bodies.rectangle(W + T / 2 - OVERHANG, H / 2 - size * 6, T, H + size * 14, { isStatic: true }),
          /* a ceiling well above the tray, so a hard throw comes back */
          Bodies.rectangle(W / 2, -size * 12 - T / 2, W + T * 2, T, { isStatic: true }),
        ]
        Composite.add(world, walls)
      }
      buildWalls()

      /* Spawn above the tray, spread across it, each one a little later
         and a little tilted — deterministic, so it looks the same twice. */
      const bodies = tiles.map((_, i) => {
        /* Only the middle 60% of the tray, so they land on each other
           and pile instead of lining up along the floor. */
        const span = W * 0.6
        const left = (W - span) / 2
        const cols = Math.max(3, Math.floor(span / (size * 1.5)))
        const col = i % cols
        const cell = span / cols
        const x = left + cell * col + cell / 2 + ((i * 37) % 23) - 11
        const y = -size * (1.2 + Math.floor(i / cols) * 1.4) - ((i * 53) % 40)
        const b = Bodies.rectangle(x, y, size, size, {
          chamfer: { radius: size * 0.22 },
          restitution: 0.28,
          friction: 0.55,
          frictionAir: 0.012,
          density: 0.0022,
          angle: (((i * 41) % 30) - 15) * (Math.PI / 180),
        })
        return b
      })
      Composite.add(world, bodies)

      const paint = () => {
        for (let i = 0; i < bodies.length; i++) {
          const b = bodies[i]
          tiles[i].style.transform = `translate3d(${b.position.x - size / 2}px, ${b.position.y - size / 2}px, 0) rotate(${b.angle}rad)`
        }
      }

      let raf = 0
      let running = false
      let held: Matter.Constraint | null = null
      const tick = () => {
        Engine.update(engine, 1000 / 60)
        paint()
        const awake = held || bodies.some((b) => !b.isSleeping)
        if (awake) raf = requestAnimationFrame(tick)
        else running = false
      }
      const wake = () => {
        bodies.forEach((b) => Sleeping.set(b, false))
        if (running) return
        running = true
        raf = requestAnimationFrame(tick)
      }

      /* ── Drop in when seen (or already at rest, for reduced motion) ── */
      const start = () => {
        tray.classList.add('is-live')
        if (reduce) {
          for (let i = 0; i < 240; i++) Engine.update(engine, 1000 / 60)
          paint()
          return
        }
        wake()
      }
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            start()
            io.disconnect()
          }
        },
        { threshold: 0.3 },
      )
      io.observe(tray)

      /* ── Drag: a spring from the pointer to the grabbed tile ── */
      const pos = (e: PointerEvent) => {
        const r = tray.getBoundingClientRect()
        return { x: e.clientX - r.left, y: e.clientY - r.top }
      }
      const onDown = (e: PointerEvent) => {
        const el = (e.target as HTMLElement).closest<HTMLLIElement>('.tb__tile')
        if (!el) return
        const i = tiles.indexOf(el)
        if (i < 0) return
        e.preventDefault()
        const b = bodies[i]
        const p = pos(e)
        Sleeping.set(b, false)
        held = Constraint.create({
          pointA: p,
          bodyB: b,
          pointB: Vector.sub(p, b.position),
          stiffness: 0.18,
          damping: 0.08,
          length: 0.01,
        })
        Composite.add(world, held)
        /* On press, not on release under a slop threshold. Picking a
           tile up is the gesture that asks what it is, and a throw asked
           just as much as a tap did — under the old rule a throw told
           you nothing, because it had travelled too far to count. */
        selectRef.current(i)
        el.setPointerCapture(e.pointerId)
        el.classList.add('is-held')
        tiles.forEach((t) => (t.style.zIndex = ''))
        el.style.zIndex = '2'
        wake()
      }
      const onMove = (e: PointerEvent) => {
        if (!held) return
        held.pointA = pos(e)
      }
      const onUp = (e: PointerEvent) => {
        if (!held) return
        const el = (e.target as HTMLElement).closest<HTMLLIElement>('.tb__tile')
        el?.classList.remove('is-held')
        el?.releasePointerCapture(e.pointerId)
        Composite.remove(world, held)
        held = null
      }
      tray.addEventListener('pointerdown', onDown)
      tray.addEventListener('pointermove', onMove)
      tray.addEventListener('pointerup', onUp)
      tray.addEventListener('pointercancel', onUp)

      /* Resize: rebuild the walls and pull anything now outside back in. */
      const ro = new ResizeObserver(() => {
        const w = tray.clientWidth
        const h = tray.clientHeight
        if (Math.abs(w - W) < 2 && Math.abs(h - H) < 2) return
        W = w
        H = h
        buildWalls()
        bodies.forEach((b) => {
          Body.setPosition(b, {
            x: Math.min(Math.max(size / 2, b.position.x), W - size / 2),
            y: Math.min(b.position.y, H - size / 2),
          })
        })
        wake()
      })
      ro.observe(tray)

      cleanup = () => {
        cancelAnimationFrame(raf)
        io.disconnect()
        ro.disconnect()
        tray.removeEventListener('pointerdown', onDown)
        tray.removeEventListener('pointermove', onMove)
        tray.removeEventListener('pointerup', onUp)
        tray.removeEventListener('pointercancel', onUp)
        Engine.clear(engine)
      }
    }

    boot()
    return () => {
      cancelled = true
      cleanup()
    }
  }, [tools])

  return (
    <div className="tb">
      <span className="tb__ghost" aria-hidden="true">
        My toolbox —
      </span>
      <span className="tb__hint" aria-hidden="true">
        (toss them around)
      </span>
      <ul ref={trayRef} className="tb__tray" aria-label="Tools I work in">
        {tools.map((t, i) => {
          const art = t.wordmark ? (
            <span className="tb__word" aria-hidden="true">
              {t.name}
            </span>
          ) : (
            <span
              className="tb__glyph"
              style={{ maskImage: `url(${t.icon})`, WebkitMaskImage: `url(${t.icon})` }}
              aria-hidden="true"
            />
          )
          return (
            <li key={t.name} className="tb__tile" style={{ background: t.color }}>
              {/* Every tile, story or not. Focusable so the plate is
                  reachable without a pointer; the click handler is for
                  keyboard activation only, since pointer presses are
                  already handled on pointerdown above. */}
              <button
                type="button"
                className="tb__btn"
                aria-pressed={active === i}
                onFocus={() => setActive(i)}
                onClick={(e) => {
                  if (e.detail === 0) setActive(i)
                }}
              >
                {art}
                <span className="visually-hidden">
                  {t.name}
                  {t.provenance ? `. ${t.provenance.line}` : ''}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {/* The plate. Reserved whether or not anything is selected, so
          picking a tile never shifts the tray underneath your finger. */}
      <p className="tb__plate" aria-live="polite">
        {active !== null ? (
          /* The name always. A tool with nowhere on this site to point
             at stops there rather than reaching for a sentence, but it
             still answers being picked up. */
          <>
            <span className="tb__plate-name">{tools[active].name}</span>
            {tools[active].provenance && (
              <span className="tb__plate-line">{tools[active].provenance!.line}</span>
            )}
            {tools[active].provenance?.href && (
              <Link className="tb__plate-link" href={tools[active].provenance!.href!}>
                {tools[active].provenance!.cta ?? 'See it in the work'}
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            )}
          </>
        ) : (
          <span className="tb__plate-empty">Pick one up. Some of them have a story.</span>
        )}
      </p>
    </div>
  )
}
