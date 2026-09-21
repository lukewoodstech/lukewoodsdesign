import Reveal from '@/components/lucid/Reveal'

/*
 * "The journey": the story's stops on one line. The line fills left to
 * right once in view and each stop rises as the fill reaches it. Pure CSS
 * off Reveal's `.is-inview`; the list is the accessible reading.
 */
export default function Journey({ stops }: { stops: string[] }) {
  return (
    <Reveal>
      <ol className="cs-journey" aria-label="The stages of this project">
        <span className="cs-journey__track" aria-hidden="true">
          <span className="cs-journey__fill" />
        </span>
        {stops.map((s, i) => (
          <li key={s} className="cs-journey__stop" style={{ '--i': i } as React.CSSProperties}>
            {s}
            <span className="cs-journey__dot" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </Reveal>
  )
}
