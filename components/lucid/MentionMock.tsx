'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'

/*
 * The @mention interaction, rebuilt in code from the design file's own
 * components (`<lucid-input>`, `Collaborator <lucid-single-select-menu>`,
 * `<lucid-tag>`, node 1480:27209) rather than screenshotted.
 *
 * It is a rebuild for one reason: the Figma frame lists real teammates and
 * their work email addresses, which this case study must never show. Every
 * person below is invented, at an obviously placeholder domain. Sizes,
 * spacing, weights and colours are the design file's: a 480×32 input, a
 * 327px menu with 8px padding and a 0 5px 15px rgba(0,0,0,.15) shadow,
 * 32px avatars, 14px semibold names over 14px regular emails on #282c33,
 * and the rgba(131,138,147,.1) hover ground.
 *
 * The loop types "@j", opens the menu, picks a person, and resolves the
 * chip; reduced motion renders the resolved state and never animates.
 */

const FONT = "'Graphik LC App', 'Helvetica Neue', 'Segoe UI', Arial, sans-serif"
const INK = '#282c33'
const HOVER = 'rgba(131,138,147,0.1)'
const MOCK = '/case-studies/lucid/mock'

/* Invented people. Never put a real directory in here. */
const PEOPLE = [
  { handle: '@jreyes', email: 'jreyes@example.com', initials: 'JR', color: '#635dff', ink: '#fff' },
  { handle: '@jtavares', email: 'jtavares@example.com', initials: 'JT', color: '#fcce14', ink: '#000' },
  { handle: '@jmalik', email: 'jmalik@example.com', initials: 'JM', color: '#4c535d', ink: '#fff' },
]
const TEAM = { name: 'Enterprise scrum', email: 'scrum-team@example.com' }
const PICKED = PEOPLE[0]

const BEFORE = 'Find the 1 on 1 board '
const TYPED = '@j'
const AFTER = 'shared with me'

/* One pass: type the handle, open the menu, choose, resolve, hold. */
const TYPE_START = 600
const TYPE_STEP = 190
const MENU_AT = TYPE_START + TYPE_STEP * TYPED.length + 220
const PICK_AT = MENU_AT + 1500
const RESOLVE_AT = PICK_AT + 420
const LOOP_END = RESOLVE_AT + 3200

function Avatar({
  initials,
  color,
  ink,
  size = 32,
}: {
  initials: string
  color: string
  ink: string
  size?: number
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-semibold uppercase"
      style={{ width: size, height: size, background: color, color: ink, fontSize: 14 }}
    >
      {initials}
    </span>
  )
}

/* The resolved <lucid-tag>: 16px icon, name, on the secondary ground. */
function Tag({ label, team = false }: { label: string; team?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-[4px] rounded-[4px] px-[4px] align-middle"
      style={{ background: HOVER, height: 20 }}
    >
      {team ? (
        <span
          aria-hidden="true"
          className="inline-block rounded-full"
          style={{ width: 12, height: 12, border: `2px solid ${INK}`, opacity: 0.55 }}
        />
      ) : (
        <Avatar initials={PICKED.initials} color={PICKED.color} ink={PICKED.ink} size={16} />
      )}
      <span style={{ fontSize: 14, lineHeight: '20px', color: INK }}>{label}</span>
    </span>
  )
}

export default function MentionMock() {
  const reducedMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const [t, setT] = useState(0)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || reducedMotion) return
    let raf = 0
    let start: number | null = null
    const tick = (now: number) => {
      if (start === null) start = now
      setT((now - start) % LOOP_END)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, reducedMotion])

  const settled = reducedMotion || !inView
  const typedCount = settled
    ? TYPED.length
    : Math.min(Math.max(Math.floor((t - TYPE_START) / TYPE_STEP), 0), TYPED.length)
  const menuOpen = !settled && t >= MENU_AT && t < RESOLVE_AT
  const highlighted = !settled && t >= PICK_AT
  const resolved = settled || t >= RESOLVE_AT

  return (
    <div
      ref={rootRef}
      className="lcs-mentionmock"
      style={{ fontFamily: FONT, color: INK }}
      role="img"
      aria-label="The @mention interaction: typing an at sign in the search bar opens a list of collaborators, and choosing one resolves it into a chip inside the query"
    >
      {/* ── The search input: 480×32 in the design file ── */}
      <div className="lcs-mentionmock__input">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${MOCK}/intelligent-search-24.svg`} alt="" className="size-[16px] opacity-60" />
        <span className="flex min-w-0 flex-1 items-center gap-[4px] whitespace-nowrap">
          <span>{BEFORE}</span>
          {resolved ? (
            <Tag label={PICKED.handle.slice(1)} />
          ) : (
            <span>
              {TYPED.slice(0, typedCount)}
              <span className="lcs-mentionmock__caret" />
            </span>
          )}
          <span>{AFTER}</span>
        </span>
      </div>

      {/* ── The collaborator menu, anchored under the mention ── */}
      <div
        className={`lcs-mentionmock__menu ${menuOpen ? '' : 'lcs-mentionmock__menu--hidden'}`}
        aria-hidden="true"
      >
        {PEOPLE.map((p, i) => (
          <div
            key={p.handle}
            className="lcs-mentionmock__row"
            style={{ background: highlighted && i === 0 ? HOVER : 'transparent' }}
          >
            <Avatar initials={p.initials} color={p.color} ink={p.ink} />
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-semibold leading-[20px]">
                {p.handle}
              </span>
              <span className="block truncate text-[14px] leading-[16px]">{p.email}</span>
            </span>
          </div>
        ))}
        <div className="lcs-mentionmock__row">
          <span
            className="flex size-[32px] shrink-0 items-center justify-center rounded-full"
            style={{ background: HOVER }}
          >
            <span
              aria-hidden="true"
              className="inline-block rounded-full"
              style={{ width: 14, height: 14, border: `2px solid ${INK}`, opacity: 0.55 }}
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-semibold leading-[20px]">
              {TEAM.name}
            </span>
            <span className="block truncate text-[14px] leading-[16px]">{TEAM.email}</span>
          </span>
        </div>
      </div>

      {/* A team resolves the same way a person does. */}
      <div className="lcs-mentionmock__input lcs-mentionmock__input--second">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${MOCK}/intelligent-search-24.svg`} alt="" className="size-[16px] opacity-60" />
        <span className="flex min-w-0 flex-1 items-center gap-[4px] whitespace-nowrap">
          <span>{BEFORE}</span>
          <Tag label={TEAM.name} team />
          <span>{AFTER}</span>
        </span>
      </div>
    </div>
  )
}
