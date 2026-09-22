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
      <div
        className="story-card__art"
        aria-hidden={card.kind !== 'photo' || !card.src}
        style={
          card.kind === 'photo' && card.focus
            ? ({ '--card-focus': card.focus } as React.CSSProperties)
            : undefined
        }
      >
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
        {/* Real marks, Luke's call (2026-09-22): these are places he
            actually belongs to, so they wear their own logos and colours
            rather than a drawn stand-in. SVG goes through a plain <img>
            because next/image needs dangerouslyAllowSVG, which is off. */}
        {card.kind === 'figma' && (
          <span className="story-card__brand story-card__brand--figma">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/figma-color.svg" alt="" />
          </span>
        )}
        {card.kind === 'jazz' && (
          <span className="story-card__brand story-card__brand--jazz">
            <Image src="/logos/jazz.png" alt="" width={200} height={200} />
          </span>
        )}
        {card.kind === 'sandbox' && (
          <span className="story-card__brand story-card__brand--sandbox">
            <Image src="/logos/sandbox.png" alt="" width={200} height={200} />
          </span>
        )}
        {/* The wordmark is dark art on transparency, so it needs a light
            ground. Luke is swapping this for a real listing of his. */}
        {card.kind === 'morphmarket' && (
          <span className="story-card__brand story-card__brand--morph">
            <Image src="/logos/morphmarket.png" alt="" width={442} height={144} />
          </span>
        )}
        {/* A real map, not a drawn one: OpenStreetMap tiles composed into
            a static crop centred on Provo (public/about/provo-map.png).
            Attribution is in the footer, as the licence requires. */}
        {card.kind === 'map' && (
          <span className="story-card__map">
            <Image src="/about/provo-map.png" alt="" fill sizes={sizes} />
            <span className="story-card__map-pin" />
          </span>
        )}
      </div>
      <p className="story-card__cap">{card.caption}</p>
    </li>
  )
}
