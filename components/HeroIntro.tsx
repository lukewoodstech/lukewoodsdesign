import { Fragment, type CSSProperties } from 'react'
import { INTRO_LINES, INTRO_SENTENCE } from '@/lib/site'

/*
 * The hero intro, after the opening of tannerengland.framer.website: one
 * sentence in a serif, centred on the first screen of the homepage.
 *
 *   Hi, I’m Luke, a product designer that enjoys building data-driven
 *   and user-centric experiences for other humans.
 *
 * History: until 2026-11-05 the sentence was "A creative & impact-driven
 * product designer.", with hover effects on three words and an ending
 * that rolled over like a split-flap board. Luke cut both; the sentence
 * is plain type now.
 *
 * The words that say who and what stay full white; the words that join
 * them are set back, so the sentence scans as Luke, product designer,
 * data-driven, user-centric.
 *
 * Each word blurs up in turn on arrival (the reference starts every word
 * at opacity 0 / blur 10px / y 10px and staggers them). That entrance is
 * a CSS animation, not framer-motion: a motion `initial` renders as
 * inline opacity:0 in the server HTML, so the sentence stayed invisible
 * until React hydrated (seconds of blank hero on a cold phone, forever
 * if hydration never landed). CSS runs on first paint, so this needs no
 * JavaScript at all and is a server component.
 */

/* The words set in full white. Everything else is dimmed. */
const BRIGHT = new Set(['Luke,', 'product', 'designer', 'data-driven', 'user-centric'])

export default function HeroIntro() {
  let wordIndex = 0

  return (
    <div className="hero-intro">
      <div className="hero-intro__body">
        <h1 className="hero-line" aria-label={INTRO_SENTENCE}>
          {INTRO_LINES.map((line, l) => (
            /* `.hero-l` is a block on wide screens, so this space never
               renders there; it keeps the heading's text from running
               lines together, and on a phone (inline lines) it is the gap. */
            <Fragment key={l}>
              {l > 0 && ' '}
              <span className="hero-l">
                {line.split(' ').map((word, i) => {
                  /* `--wi` is the word's place in the stagger. */
                  const style = { '--wi': wordIndex++ } as CSSProperties
                  /* The space lives between the spans, not inside them:
                     leading whitespace inside an inline-block collapses. */
                  return (
                    <Fragment key={i}>
                      {i > 0 && ' '}
                      <span className={`hero-word${BRIGHT.has(word) ? '' : ' hero-word--dim'}`} style={style}>
                        {word}
                      </span>
                    </Fragment>
                  )
                })}
              </span>
            </Fragment>
          ))}
        </h1>
      </div>
    </div>
  )
}
