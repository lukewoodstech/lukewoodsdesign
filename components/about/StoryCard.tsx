import Image from 'next/image'
import type { StoryCard as Card } from '@/lib/about'

/*
 * One card of the story deck: a picture (or a designed tile) with a
 * caption pinned to its foot over a scrim. Used by the story stage and,
 * with the same look, by the reptile room — a person's photos should
 * all sit in the same frame.
 *
 * A photo with no `src` yet renders the dashed slot with a hatch and a
 * mono layer-name, so the empty spot reads as part of the design
 * language and never as a broken image.
 */
export default function StoryCard({
  card,
  index,
  sizes = '(max-width: 60em) 46vw, 200px',
  priority = false,
}: {
  card: Card
  index: number
  sizes?: string
  priority?: boolean
}) {
  const isCenter = card.kind === 'photo' && card.center
  return (
    <li
      className={`story-card story-card--${card.kind} ${isCenter ? 'is-center' : ''}`.trim()}
      data-i={index}
    >
      <div className="story-card__art" aria-hidden={card.kind !== 'photo' || !card.src}>
        {card.kind === 'photo' && card.src && (
          <Image src={card.src} alt={card.alt} fill sizes={sizes} priority={priority} />
        )}
        {card.kind === 'photo' && !card.src && (
          <span className="story-card__slot">photo · {String(index + 1).padStart(2, '0')}</span>
        )}
        {card.kind === 'byu' && <span className="story-card__byu">BYU</span>}
        {card.kind === 'code' && (
          <span className="story-card__code">
            <span className="story-card__dots">
              <i /> <i /> <i />
            </span>
            <span className="story-card__lines">
              <i style={{ width: '62%' }} />
              <i style={{ width: '44%' }} />
              <i style={{ width: '78%' }} />
              <i style={{ width: '36%' }} />
              <i style={{ width: '58%' }} />
            </span>
          </span>
        )}
        {card.kind === 'figma' && (
          <span className="story-card__figma">
            <span className="tb__glyph" style={{ maskImage: 'url(/tools/figma.svg)', WebkitMaskImage: 'url(/tools/figma.svg)' }} />
          </span>
        )}
      </div>
      <p className="story-card__cap">{card.caption}</p>
    </li>
  )
}
