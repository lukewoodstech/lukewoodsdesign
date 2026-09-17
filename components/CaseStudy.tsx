import Image from 'next/image'
import Reveal from '@/components/lucid/Reveal'
import ZoomShot from '@/components/lucid/ZoomShot'

/*
 * The shared article system for every case study. All typography lives in the
 * `.cs-*` classes in globals.css, and every accent color reads `--accent`,
 * which each page root sets (`.lcs`, `.pcs`; the default is the site blue).
 * A study should differ from its siblings in content and accent — nothing else.
 */

export function Section({
  eyebrow,
  headline,
  children,
}: {
  eyebrow?: string
  headline?: string
  children: React.ReactNode
}) {
  return (
    <Reveal as="section" className="mt-20">
      {eyebrow && <span className="cs-eyebrow">{eyebrow}</span>}
      {headline && <h2 className="cs-headline">{headline}</h2>}
      {children}
    </Reveal>
  )
}

export const Prose = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => <div className={`cs-prose ${className}`.trim()}>{children}</div>

export const Bullets = ({ items }: { items: string[] }) => (
  <ul className="cs-bullets mt-5">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)

/* The blockquote "reframe" device all three written studies share. */
export const Reframe = ({
  quote,
  children,
}: {
  quote: React.ReactNode
  children?: React.ReactNode
}) => (
  <Reveal className="mt-20">
    <blockquote className="border-l-2 border-[var(--accent)] pl-6 py-1">
      <p className="cs-quote">
        {quote}
      </p>
    </blockquote>
    {children}
  </Reveal>
)

/*
 * Standard figure: expandable screenshot + caption. `plain` opts out of the
 * lightbox for images that already render near natural size (phone frames).
 */
export function Fig({
  src,
  alt,
  caption,
  width,
  height,
  sizes,
  plain = false,
  className = 'my-12',
}: {
  src: string
  alt: string
  caption?: React.ReactNode
  width: number
  height: number
  sizes?: string
  plain?: boolean
  className?: string
}) {
  return (
    <figure className={className}>
      {plain ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className="w-full h-auto rounded-lg border border-white/10"
        />
      ) : (
        <ZoomShot src={src} alt={alt} width={width} height={height} sizes={sizes} />
      )}
      {caption && <figcaption className="cs-cap">{caption}</figcaption>}
    </figure>
  )
}

/* Role / Timeline / Team facts + optional impact metrics under the title. */
export function FactStrip({
  facts,
  impact,
  impactLabel = 'Impact',
}: {
  facts: [string, string][]
  impact?: string[]
  impactLabel?: string
}) {
  return (
    <div className="mt-8 border-y border-white/10 py-6">
      <dl className="flex flex-wrap gap-x-12 gap-y-5">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="cs-label-sm mb-1.5">{label}</dt>
            <dd className="text-base text-white">{value}</dd>
          </div>
        ))}
      </dl>
      {impact && impact.length > 0 && (
        <div className="mt-6">
          <p className="cs-label-sm mb-1.5">{impactLabel}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1.5 text-base text-white">
            {impact.map((metric) => (
              <li key={metric} className="flex gap-2.5">
                <span aria-hidden="true" className="text-[var(--accent)] flex-shrink-0">
                  —
                </span>
                {metric}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/*
 * The one-person-product-team strip: the same three lenses on every study,
 * one line each, right under the deliverable. This is where the site's
 * story ("design + code + business, held at once") has to show up in the
 * work rather than in the tagline. Keep each line to a single sentence.
 */
export function ThreeLenses({
  design,
  code,
  business,
}: {
  design: string
  code: string
  business: string
}) {
  const rows: [string, string, string][] = [
    ['design', 'lens-design', design],
    ['code', 'lens-code', code],
    ['business', 'lens-business', business],
  ]
  return (
    <Reveal as="section" className="cs-lenses">
      <h2 className="visually-hidden">Design, code, and business on this project</h2>
      <p className="cs-lenses__decl" aria-hidden="true">
        <span className="ct-dim">const</span> {'this'} <span className="ct-dim">=</span>{' '}
        <span className="lens-design">design</span> <span className="ct-dim">+</span>{' '}
        <span className="lens-code">code</span> <span className="ct-dim">+</span>{' '}
        <span className="lens-business">business</span>
        <span className="ct-dim">;</span>
      </p>
      <dl className="cs-lenses__grid">
        {rows.map(([label, cls, text]) => (
          <div key={label} className="cs-lenses__cell">
            <dt className={`cs-lenses__label ${cls}`}>{label}</dt>
            <dd className="cs-lenses__text">{text}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  )
}

/*
 * The depth that left the page lives in Luke AI. Each prompt is a real
 * question the study no longer answers at length; the link opens the chat
 * with it already sent (/chat?q=…). Styled as the bot's terminal so it reads
 * as the same object the visitor met on the landing screen.
 */
export function AskLukeAi({ prompts }: { prompts: string[] }) {
  return (
    <Reveal as="section" className="mt-20">
      <span className="cs-eyebrow">Go deeper</span>
      <h2 className="cs-headline">The long version lives in Luke AI. Ask it.</h2>
      <div className="cs-ask">
        <p className="cs-ask__boot" aria-hidden="true">
          <span className="term-nav__arrow">➜</span>
          <span className="term-nav__dir">~</span> luke ai
        </p>
        <ul className="cs-ask__list">
          {prompts.map((q) => (
            <li key={q}>
              <a className="cs-ask__link" href={`/chat?q=${encodeURIComponent(q)}`}>
                {q}
              </a>
            </li>
          ))}
          <li>
            <a className="cs-ask__link cs-ask__link--own" href="/chat">
              or ask your own question
            </a>
          </li>
        </ul>
      </div>
    </Reveal>
  )
}
