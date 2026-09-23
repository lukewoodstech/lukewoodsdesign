import type { ReactNode } from 'react'
import Reveal from '@/components/lucid/Reveal'

/*
 * Story-edition case study primitives (2026-09-21). One centred column,
 * full-width bands for the visual breaks, and a small vocabulary of
 * blocks that every study composes from: a pill label, an act header,
 * a two-tone subheading, note cards, the key-question band, the
 * success card, the people cards, task→solution pairs, the glass card
 * behind a ghost word. All styling is the `.cs-*` story block in
 * globals.css; colour comes from the page's `--accent`.
 *
 * Everything here is a server component. Motion is CSS keyed off the
 * `.is-inview` class that `Reveal` adds, so the only client code on a
 * story page is the count-up in BigStats and the interactive figures.
 */

/* ── Layout ─────────────────────────────────────────────────────── */

export const Col = ({
  children,
  wide = false,
  className = '',
}: {
  children: ReactNode
  wide?: boolean
  className?: string
}) => <div className={`cs-col ${wide ? 'cs-col--wide' : ''} ${className}`.trim()}>{children}</div>

export function Band({
  children,
  tone = 'lift',
  dust = false,
  crop = false,
  flush = false,
  className = '',
}: {
  children: ReactNode
  /** lift = one step above the page ground; accent = the study's colour */
  tone?: 'lift' | 'accent'
  /** Faint drifting specks, for the bands that carry a single statement. */
  dust?: boolean
  /** The band's bottom edge crops its content (the hero laptop). */
  crop?: boolean
  flush?: boolean
  className?: string
}) {
  const cls = [
    'cs-band',
    tone === 'accent' && 'cs-band--accent',
    dust && 'cs-band--dust',
    crop && 'cs-band--crop',
    flush && 'cs-band--flush',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return <section className={cls}>{children}</section>
}

/* A block that rises in on scroll, with the column's rhythm above it. */
export const Block = ({
  children,
  tight = false,
  className = '',
}: {
  children: ReactNode
  tight?: boolean
  className?: string
}) => (
  <Reveal className={`${tight ? 'cs-block--tight' : 'cs-block'} ${className}`.trim()}>
    {children}
  </Reveal>
)

/* ── Small chrome ───────────────────────────────────────────────── */

export const Pill = ({ children }: { children: ReactNode }) => (
  <span className="cs-pill">{children}</span>
)

export const MonoLabel = ({
  children,
  icon,
  className = '',
}: {
  children: ReactNode
  icon?: IcoName
  className?: string
}) => (
  <span className={`cs-mono-label ${className}`.trim()}>
    {icon && <Ico name={icon} />}
    {children}
  </span>
)

/* Two-tone subheading: the white part is the noun, the grey part the gloss. */
export const H3 = ({ children, dim }: { children: ReactNode; dim?: ReactNode }) => (
  <h3 className="cs-h3">
    {children}
    {dim && (
      <>
        {' '}
        <span className="cs-dim">{dim}</span>
      </>
    )}
  </h3>
)

/* ── Title block ────────────────────────────────────────────────── */

export function StoryTitle({ children, dim }: { children: ReactNode; dim?: ReactNode }) {
  return (
    <h1 className="cs-title cs-title--serif">
      {children}
      {dim && (
        <>
          {' '}
          <span className="cs-title__for">{dim}</span>
        </>
      )}
    </h1>
  )
}

export type Fact = { label: string; value: ReactNode; icon?: IcoName; span?: boolean }

export function MetaGrid({ summary, facts }: { summary: ReactNode; facts: Fact[] }) {
  return (
    <div className="cs-meta">
      <div className="cs-meta__summary">
        <MonoLabel>Summary</MonoLabel>
        <div className="cs-prose">{summary}</div>
      </div>
      <dl className="cs-meta__facts">
        {facts.map((f) => (
          <div key={f.label} className={f.span ? 'cs-meta__span' : undefined}>
            <dt>
              <MonoLabel icon={f.icon}>{f.label}</MonoLabel>
            </dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/* ── The problem ────────────────────────────────────────────────── */

export function Problem({
  children,
  iconSrc,
  iconAlt,
}: {
  children: ReactNode
  iconSrc: string
  iconAlt: string
}) {
  return (
    <div className="cs-centered">
      <Pill>The problem</Pill>
      <p className="cs-hmw">{children}</p>
      <div className="cs-app-icon">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} alt={iconAlt} />
      </div>
    </div>
  )
}

/* ── Acts ───────────────────────────────────────────────────────── */

export function Act({
  phase,
  num,
  title,
  children,
}: {
  phase: string
  num: string
  title: ReactNode
  children?: ReactNode
}) {
  return (
    <Reveal as="section" className="cs-act">
      <p className="cs-act__phase">{phase}</p>
      <h2 className="cs-act__title">
        <span className="cs-act__num">Act {num}:</span> {title}
      </h2>
      {children}
    </Reveal>
  )
}

/* ── Note cards with stickers ───────────────────────────────────── */

/* Two up, one below between them: no card sits on another's text. */
const NOTE_POS: { left?: string; right?: string; top: string; r: string }[] = [
  { left: '0', top: '0', r: '-3deg' },
  { right: '0', top: '64px', r: '2.5deg' },
  { left: 'calc(50% - 190px)', top: '262px', r: '-1deg' },
]

export type Sticker = { src?: string; text?: string }

/* Where the three stickers land, relative to the note field. */
const STICKER_POS: React.CSSProperties[] = [
  { left: '1%', top: '10px', ['--r' as string]: '-10deg' },
  { right: '3%', top: '24px', ['--r' as string]: '12deg' },
  { left: '13%', top: '262px', ['--r' as string]: '8deg' },
]

export function Notes({
  notes,
  label,
  stickers = [],
}: {
  notes: string[]
  label: string
  /** Up to three icon or text stickers scattered between the cards. */
  stickers?: Sticker[]
}) {
  return (
    <Reveal className="cs-block">
      <p className="cs-cap cs-cap--mono">{label}</p>
      <div className="cs-notes" role="list">
        {/* The dashed connectors only exist to tie stickers to cards. */}
        {stickers.length > 0 && (
          <svg className="cs-notes__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M6 12 C 10 18, 12 20, 15 30" />
            <path d="M94 15 C 90 20, 84 22, 80 30" />
            <path d="M17 82 C 22 76, 26 72, 30 62" />
          </svg>
        )}
        {notes.map((n, i) => {
          const p = NOTE_POS[i % NOTE_POS.length]
          return (
            <p
              key={n}
              role="listitem"
              className="cs-note"
              style={{ left: p.left, right: p.right, top: p.top, '--r': p.r, '--i': i } as React.CSSProperties}
            >
              {n}
            </p>
          )
        })}
        {stickers.slice(0, 3).map((s, i) => (
          <span key={i} className="cs-sticker" style={STICKER_POS[i]} aria-hidden="true">
            {s.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.src} alt="" />
            ) : (
              <span>{s.text}</span>
            )}
          </span>
        ))}
      </div>
    </Reveal>
  )
}

/* ── Key question, success card, people ─────────────────────────── */

export function KeyQuestion({ lead = 'This sparked a key question:', children }: { lead?: string; children: ReactNode }) {
  return (
    <div className="cs-centered">
      <div className="cs-spark" aria-hidden="true">
        <Ico name="bulb" />
      </div>
      <p className="cs-keyq__lead">{lead}</p>
      <p className="cs-keyq">{children}</p>
    </div>
  )
}

export function SuccessCard({ children }: { children: ReactNode }) {
  return (
    <div className="cs-success">
      <p className="m-0">{children}</p>
      <span className="cs-success__check" aria-hidden="true">
        <Ico name="check" />
      </span>
    </div>
  )
}

export function People({ items }: { items: { icon: IcoName; title: string; text: string }[] }) {
  return (
    <div className="cs-people" style={{ '--n': items.length } as React.CSSProperties}>
      {items.map((p) => (
        <div key={p.title} className="cs-person">
          <span className="cs-person__icon" aria-hidden="true">
            <Ico name={p.icon} />
          </span>
          <h4>{p.title}</h4>
          <p>{p.text}</p>
        </div>
      ))}
    </div>
  )
}

/* ── Task → Solution pair ───────────────────────────────────────── */

export function Pair({
  num,
  task,
  solution,
  children,
  visual,
  level = 4,
}: {
  num: string
  task: ReactNode
  solution: ReactNode
  children: ReactNode
  visual: ReactNode
  /*
   * Where this pair sits in the page's outline.
   *
   * A pair under an H3 that groups several of them ("Four core skills" on
   * Lucid) is one level below that group, so 4 is right and is the default.
   * A pair sitting straight under an Act is one level below an h2, so it
   * needs 3 — and on Awardco and Pattern, where pairs are an act's only
   * structure, a hard-coded 4 put an h4 directly after an h2 and left a
   * hole in the outline that assistive tech reads as a missing section.
   */
  level?: 3 | 4
}) {
  const H: 'h3' | 'h4' = level === 3 ? 'h3' : 'h4'
  return (
    <Reveal as="section" className="cs-pair">
      <div className="cs-pair__row">
        <div className="cs-pair__cell cs-pair__cell--task">
          <MonoLabel>Task</MonoLabel>
          <H>{task}</H>
        </div>
        <div className="cs-pair__arrow" aria-hidden="true">
          <Ico name="arrow" />
        </div>
        <div className="cs-pair__cell cs-pair__cell--sol">
          <MonoLabel>Solution</MonoLabel>
          <H>{solution}</H>
        </div>
      </div>
      <div className="cs-prose">{children}</div>
      <div className="cs-pair__visual">
        <span className="cs-pair__num" aria-hidden="true">
          {num}
        </span>
        {visual}
      </div>
    </Reveal>
  )
}

/* ── Closing blocks ─────────────────────────────────────────────── */

export function Two({ items }: { items: { label: string; icon?: IcoName; body: ReactNode }[] }) {
  return (
    <div className="cs-two">
      {items.map((it) => (
        <div key={it.label}>
          <MonoLabel icon={it.icon}>{it.label}</MonoLabel>
          <div className="cs-prose">{it.body}</div>
        </div>
      ))}
    </div>
  )
}

export function GhostCard({ word, title, items }: { word: string; title: string; items: ReactNode[] }) {
  return (
    <div className="cs-ghost">
      <p className="cs-ghost__word" aria-hidden="true">
        {word}
      </p>
      <div className="cs-glass">
        <h3>{title}</h3>
        <ul>
          {items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Checklist({ items }: { items: ReactNode[] }) {
  return (
    <ul className="cs-check">
      {items.map((it, i) => (
        <li key={i}>
          <Ico name="check" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  )
}

/* ── Icons ──────────────────────────────────────────────────────── */

export type IcoName =
  | 'user'
  | 'users'
  | 'clock'
  | 'tool'
  | 'sparkle'
  | 'bulb'
  | 'check'
  | 'rocket'
  | 'arrow'
  | 'building'
  | 'chart'
  | 'pen'
  | 'flag'
  | 'lock'
  | 'phone'
  | 'mail'
  | 'layers'

const PATHS: Record<IcoName, ReactNode> = {
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.4.6 3.5 2.6 3.5 5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  tool: <path d="M14.5 4.5a4.5 4.5 0 0 0-5.3 5.9L3 16.6 5.4 19l6.2-6.2a4.5 4.5 0 0 0 5.9-5.3l-2.6 2.6-2.4-.6-.6-2.4z" />,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" />,
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M8.5 14.5A6 6 0 1 1 15.5 14.5c-.8.7-1.5 1.6-1.5 2.5h-4c0-.9-.7-1.8-1.5-2.5z" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>
  ),
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  building: (
    <>
      <path d="M4 21V5l8-2 8 2v16" />
      <path d="M9 9h2M13 9h2M9 13h2M13 13h2M9 17h2M13 17h2M2 21h20" />
    </>
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  pen: <path d="M4 20l4-1 10-10-3-3L5 16l-1 4zM13 7l3 3" />,
  flag: <path d="M5 21V4h11l-1.5 3.5L16 11H5" />,
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  layers: <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5" />,
}

export function Ico({ name, className = '' }: { name: IcoName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name]}
    </svg>
  )
}
