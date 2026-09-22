import Image from 'next/image'
import type { Quote } from '@/lib/about'

/*
 * Kind words as a wall: every recommendation on the page at once, in two
 * masonry columns, each card as tall as its own quote.
 *
 * It was a carousel until 2026-09-22. The carousel had to pick a height,
 * and picking the tallest quote left the short ones floating in an empty
 * 622px box beside a stranded 240px portrait. Luke: "too big and generic
 * and the photo of the person is awkwardly floating in the middle." He
 * was right — that shape is a testimonial widget, not this site.
 *
 * So: no arrows, no counter, no fixed height, nothing hidden behind a
 * control. `columns` does the masonry, which is the whole reason the
 * heights stop mattering — a card ends where its quote ends. The photo
 * is a 40px tile in the byline, where a face belongs.
 *
 * The cards are opaque (`--mono-tile`) like the role cards above them,
 * because the section's dot grid reads straight through a translucent
 * one. They carry no hover state on purpose: nothing here is a link, and
 * a glow that implies otherwise is a fake control.
 *
 * Headshots live in public/about/quotes/ and are pointed at by `avatar`
 * in lib/about.ts; anything without one falls back to initials, so a
 * missing file never breaks the wall.
 */

/** Up to two initials — "Dan Littlewood" → "DL", "Cher" → "C". */
function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  return (parts[0].charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : '')).toUpperCase()
}

export default function Testimonials({ quotes }: { quotes: ReadonlyArray<Quote> }) {
  return (
    <ul className="kw">
      {quotes.map((q) => (
        <li key={q.id} className="kw__card">
          <figure className="kw__fig">
            <blockquote className="kw__quote">
              <p>{q.quote}</p>
            </blockquote>
            <figcaption className="kw__who">
              {/* The face is decoration for the name beside it, so it
                  carries no alt of its own. */}
              <span className={`kw__face ${q.avatar ? '' : 'kw__face--mono'}`} aria-hidden="true">
                {q.avatar ? (
                  <Image src={q.avatar} alt="" fill sizes="40px" className="kw__img" />
                ) : (
                  <span className="kw__initials">{q.placeholder ? '?' : initials(q.name)}</span>
                )}
              </span>
              <span className="kw__id">
                <span className="kw__name">
                  {q.name}
                  {q.placeholder && (
                    <span className="ph-tag" aria-label="placeholder">
                      placeholder
                    </span>
                  )}
                </span>
                <span className="kw__title">
                  {q.title} @ {q.org}
                </span>
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  )
}
