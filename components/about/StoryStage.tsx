import StoryCard from './StoryCard'
import type { StoryBeat } from '@/lib/about'

/*
 * The story stage: the page heading, one short paragraph, then two rows
 * of cards (Luke, 2026-11-09). It takes a list of beats, but STORY is a
 * single beat of ten cards; the five-column grid wraps them into rows.
 *
 * Before that it was three paragraphs each with its own row, before
 * that one 5×3 grid, and before that a scroll-scrubbed deck. Still, on every screen, no JavaScript. On a
 * phone each row becomes a sideways swipe strip so five cards don't
 * leave an orphan in a two-up grid.
 */

export default function StoryStage({
  beats,
  intro,
}: {
  beats: ReadonlyArray<StoryBeat>
  /* The page heading, set above the first paragraph. */
  intro?: React.ReactNode
}) {
  let n = 0
  return (
    <section className="story" aria-label="A few things about me">
      {intro && <div className="story__intro">{intro}</div>}
      {beats.map((beat, b) => (
        <div className="story__beat" key={b}>
          <p className="ab-hero__lede story__para">{beat.text}</p>
          <ul className="story__row">
            {beat.cards.map((c) => {
              const i = n++
              return (
                <StoryCard
                  key={i}
                  card={c}
                  index={i}
                  sizes="(max-width: 60em) 40vw, 210px"
                  priority={b === 0}
                />
              )
            })}
          </ul>
        </div>
      ))}
    </section>
  )
}
