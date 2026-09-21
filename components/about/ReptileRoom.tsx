import Image from 'next/image'
import type { Critter } from '@/lib/about'

/*
 * The reptile room: six enclosures in the same frame as the story cards,
 * each with a name and a species pinned to its foot. Hover lifts the
 * card; that's the whole interaction, because looking at a photo of a
 * snake is the point.
 *
 * Every card is a placeholder until Luke swaps the data in lib/about.ts;
 * the PLACEHOLDER tag renders from the flag, not from a class, so it
 * can't be left on by accident once the flag is deleted.
 */
export default function ReptileRoom({ critters }: { critters: ReadonlyArray<Critter> }) {
  return (
    <ul className="rr" aria-label="The reptile room">
      {critters.map((c, i) => (
        <li key={c.id} className="story-card rr__card">
          <div className="story-card__art">
            {c.photo ? (
              <Image src={c.photo} alt={`${c.name}, a ${c.species}`} fill sizes="(max-width: 60em) 46vw, 300px" />
            ) : (
              <span className="story-card__slot">enclosure · {String(i + 1).padStart(2, '0')}</span>
            )}
          </div>
          <p className="story-card__cap">
            <span className="rr__name">
              {c.name}
              {c.placeholder && (
                <span className="ph-tag" aria-label="placeholder">
                  placeholder
                </span>
              )}
            </span>
            <span className="rr__species">{c.species}</span>
          </p>
        </li>
      ))}
    </ul>
  )
}
