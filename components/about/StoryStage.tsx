import StoryCard from './StoryCard'
import type { StoryCard as Card } from '@/lib/about'

/*
 * The story stage: the page heading, then fifteen cards in a 5×3 grid
 * (two-up on a phone, portrait first).
 *
 * Until 2026-11-05 this was a scroll scrub: the portrait started at hero
 * size and the other fourteen cards dealt out from under it as the page
 * pinned for 240vh. Luke cut it; the grid shows right away, still, on
 * every screen. That was already the reduced-motion layout, so it is
 * the only layout now and this needs no JavaScript.
 */

export default function StoryStage({
  cards,
  intro,
}: {
  cards: ReadonlyArray<Card>
  /* The page heading, set above the grid. */
  intro?: React.ReactNode
}) {
  return (
    <section className="story" aria-label="A few things about me">
      <div className="story__stage">
        {intro && <div className="story__intro">{intro}</div>}
        <ul className="story__grid">
          {cards.map((c, i) => (
            <StoryCard
              key={i}
              card={c}
              index={i}
              priority={c.kind === 'photo' && !!c.center}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
