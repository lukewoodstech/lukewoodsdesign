import Image from 'next/image'
import type { RoomBlock } from '@/lib/about'

/*
 * The reptile room as a photo essay rather than a pet register.
 *
 * The first version (2026-09-21) was six cards reading "Name / Species /
 * enclosure 01", all flagged PLACEHOLDER, waiting on portraits of six
 * specific animals. The photos that arrived (2026-09-22) were scenes
 * instead — the room, the enclosures he built, the rodent racks, and
 * child after child being handed a snake — so the section became the
 * thing the photos were actually of.
 *
 * Layout is a 12-column grid per block; each shot carries its own span
 * and aspect ratio from lib/about.ts, and blocks group shots of one
 * ratio so a row's heights agree. No card is cropped square, because a
 * landscape photo squeezed into a portrait frame cuts the person out of
 * the picture — which in this section is the whole subject.
 *
 * Hover lifts the card. That's the only interaction, because looking at
 * the photo is the point.
 *
 * On a phone the row is two columns, not one: thirteen full-width shots
 * made this section half the page in scroll. The wide ones (span 6, the
 * 4:3 scenes) keep the full width there — at half a phone's width a
 * landscape is 170px across and its caption covers the picture.
 */
export default function ReptileRoom({ blocks }: { blocks: ReadonlyArray<RoomBlock> }) {
  return (
    <div className="rr">
      {blocks.map((block) => (
        <section key={block.id} className="rr__block">
          {block.chapter && (
            <header className="rr__chapter">
              {block.chapter.label && <p className="rr__chapter-label">{block.chapter.label}</p>}
              <h3 className="rr__chapter-title">{block.chapter.title}</h3>
              {block.chapter.body && <p className="rr__chapter-body">{block.chapter.body}</p>}
              {block.chapter.facts && (
                <ul className="rr__facts">
                  {block.chapter.facts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              )}
            </header>
          )}
          <ul className="rr__row">
            {block.shots.map((shot) => (
              <li
                key={shot.src ?? shot.slot ?? shot.alt}
                className={`story-card story-card--photo rr__card${shot.span >= 6 ? ' rr__card--wide' : ''}`}
                style={
                  {
                    '--rr-span': shot.span,
                    '--rr-ratio': shot.ratio,
                    ...(shot.focus ? { '--card-focus': shot.focus } : {}),
                  } as React.CSSProperties
                }
              >
                <div className="story-card__art">
                  {shot.src ? (
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes={
                        shot.span === 12
                          ? '(max-width: 60em) 92vw, 1100px'
                          : shot.span === 6
                            ? '(max-width: 60em) 92vw, 550px'
                            : '(max-width: 60em) 92vw, 370px'
                      }
                    />
                  ) : (
                    /* The same dashed slot the story deck draws for a
                       photo that hasn't landed, naming the file it wants. */
                    <span className="story-card__slot">photo · {shot.slot ?? 'pending'}</span>
                  )}
                </div>
                <p className="story-card__cap">{shot.caption}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
