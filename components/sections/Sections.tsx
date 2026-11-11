import ZoomShot from '@/components/lucid/ZoomShot'
import type { CaseSection, SectionVisual } from '@/lib/sections'

/*
 * Renders a case study's sections in the visual-first format: a text card
 * and its visuals. Layout, spacing and the card's accent glow live in
 * globals.css under `.vs-`. The page sets `--accent` on an ancestor.
 */

export function SectionCard({
  step,
  subtitle,
  body,
}: {
  step?: string
  subtitle: string
  body: string
}) {
  return (
    <div className="vs-card">
      <h2 className="vs-card__title">
        {step && <span className="vs-card__step">{step}: </span>}
        {subtitle}
      </h2>
      <p className="vs-card__body">{body}</p>
    </div>
  )
}

export function Visual({ v }: { v: SectionVisual }) {
  let content
  if (v.element) {
    content = v.element
  } else if (v.src && v.width && v.height) {
    content = (
      <div className="vs-visual__frame">
        <ZoomShot
          src={v.src}
          alt={v.alt}
          width={v.width}
          height={v.height}
          sizes={v.orientation === 'tall' ? '(min-width: 56.25em) 560px, 100vw' : '(min-width: 65em) 1040px, 100vw'}
        />
      </div>
    )
  } else {
    content = (
      <div className="vs-placeholder" role="img" aria-label={v.alt}>
        <span>{v.placeholder ?? v.alt}</span>
      </div>
    )
  }
  return (
    <figure className={`vs-visual${v.orientation === 'tall' ? ' vs-visual--tall' : ''}`}>
      {content}
      {v.caption && <figcaption className="vs-visual__cap">{v.caption}</figcaption>}
    </figure>
  )
}

export function Section({ s }: { s: CaseSection }) {
  const card = <SectionCard step={s.step} subtitle={s.subtitle} body={s.body} />
  if (s.layout === 'split' && s.visuals.length) {
    const [first, ...rest] = s.visuals
    return (
      <section className="vs-section vs-section--split">
        <div className="vs-split">
          <div className="vs-split__card">{card}</div>
          <Visual v={first} />
        </div>
        {rest.length > 0 && (
          <div className="vs-visuals">
            {rest.map((v) => (
              <Visual key={v.alt} v={v} />
            ))}
          </div>
        )}
      </section>
    )
  }
  return (
    <section className="vs-section">
      {card}
      {s.visuals.length > 0 && (
        <div className="vs-visuals">
          {s.visuals.map((v) => (
            <Visual key={v.alt} v={v} />
          ))}
        </div>
      )}
    </section>
  )
}

export default function Sections({ sections }: { sections: CaseSection[] }) {
  return (
    <div className="vs-sections">
      {sections.map((s) => (
        <Section key={s.subtitle} s={s} />
      ))}
    </div>
  )
}
