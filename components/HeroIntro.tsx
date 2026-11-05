'use client'

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SITE, INTRO, INTRO_SENTENCE } from '@/lib/site'
import { useReducedMotion } from '@/lib/useReducedMotion'

/*
 * The hero intro (2026-09-21), after the opening of
 * tannerengland.framer.website: one sentence in a serif.
 *
 *   Hi, I’m Luke Woods. A curious & proven product designer.
 *
 * Until 2026-11-05 the name and both adjectives were hoverable: each
 * dealt out photos, icons or stat chips around the sentence and set a
 * line of description under it. Luke cut all three; the sentence is
 * plain type now.
 *
 * Mechanics: the words blur in one at a time on arrival (the reference
 * starts every word at opacity 0 / blur 10px / y 10px and staggers them).
 * The ending is a row of letter cells; a letter that changes exits by
 * rolling up and its replacement rolls in from below, staggered 20ms per
 * cell, so the phrase turns over like a split-flap board. Letters that
 * are the same in both endings ("pro…" in "product designer." and
 * "problem solver.") stay still. Cell widths are measured up front so the
 * line eases between the endings instead of jumping.
 *
 * The ending turns over on its own every few seconds:
 * product designer → designer who codes → problem solver → …
 * Under reduced motion it stays on "product designer."
 *
 * The first screen of the homepage (Home), at every width.
 */


type Mode = 'name' | 'creative' | 'impact'
type State = Mode | 'rest'

/* The endings, one per state. `impact` keeps the resting ending on purpose. */
const TAILS: Record<State, string> = {
  rest: INTRO.tail,
  name: 'designer who codes.',
  creative: 'problem solver.',
  impact: INTRO.tail,
}

type Word = { text: string; dim?: boolean; tail?: true; after?: string }

/*
 * Three lines, fixed. The ending changes width when it rolls, and if it
 * shared a line with anything else the sentence would rewrap as it
 * turned over. So the ending owns its line, and the two lines above it
 * never change.
 */
const LINES: readonly (readonly Word[])[] = [
  [{ text: INTRO.greeting, dim: true }, { text: SITE.name, after: '.' }],
  [
    { text: INTRO.article, dim: true },
    { text: INTRO.adjectives[0] },
    { text: '&', dim: true },
    { text: INTRO.adjectives[1] },
  ],
  [{ text: TAILS.rest, tail: true }],
]

/* What assistive tech reads: the resting sentence, once. */
const SENTENCE = INTRO_SENTENCE

/* Fixed clip geometry so the ruler and the cells always agree. */
const TAIL_KEYS = Object.keys(TAILS) as State[]
/* The order the ending turns through on its own, and how long each stays.
   `impact` keeps the resting ending, so every turn passes through
   "product designer." once. */
const CYCLE: readonly Mode[] = ['name', 'creative', 'impact']
const CYCLE_MS = 4200
const CELLS = Math.max(...TAIL_KEYS.map((k) => TAILS[k].length))

/*
 * The per-letter widths of every ending, measured from a hidden ruler set
 * in the headline's own font (cells are inline-blocks, so the ruler's
 * letters are too — that way neither is kerned and the numbers agree).
 * Re-measured when the webfont lands and on resize (the type is vw-sized).
 *
 * Widths never become React state: they're written straight onto the
 * cells as `style.width`, which is what lets CSS ease each cell from one
 * letter's width to the next. Until the first measurement (and on the
 * server) a cell is as wide as its resting letter.
 */
function useCellWidths(
  state: State,
  rowRef: RefObject<HTMLSpanElement | null>,
  rulerRef: RefObject<HTMLSpanElement | null>,
) {
  const widthsRef = useRef<Partial<Record<State, number[]>> | null>(null)
  /* The latest state, readable from the font-ready and resize callbacks
     without re-subscribing them on every hover. Written in the effect
     below, never during render. */
  const stateRef = useRef<State>(state)

  const apply = useCallback(() => {
    const row = rowRef.current
    const w = widthsRef.current?.[stateRef.current]
    if (!row || !w) return
    row.querySelectorAll<HTMLSpanElement>('.hero-flip__cell').forEach((cell, i) => {
      cell.style.width = `${w[i] ?? 0}px`
    })
  }, [rowRef])

  useLayoutEffect(() => {
    const ruler = rulerRef.current
    if (!ruler) return
    const measure = () => {
      const next: Partial<Record<State, number[]>> = {}
      ruler.querySelectorAll<HTMLSpanElement>('[data-tail]').forEach((run) => {
        next[run.dataset.tail as State] = Array.from(run.children, (c) => c.getBoundingClientRect().width)
      })
      widthsRef.current = next
      apply()
    }
    measure()
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [rulerRef, apply])

  useLayoutEffect(() => {
    stateRef.current = state
    apply()
  }, [state, apply])
}

const ROLL = { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const }

function FlipTail({ state, still }: { state: State; still: boolean }) {
  const rowRef = useRef<HTMLSpanElement>(null)
  const rulerRef = useRef<HTMLSpanElement>(null)
  useCellWidths(state, rowRef, rulerRef)
  const text = TAILS[state]

  return (
    <span className="hero-flip" ref={rowRef}>
      {Array.from({ length: CELLS }, (_, i) => {
        const ch = text[i]
        return (
          <span key={i} className="hero-flip__cell" style={{ '--i': i } as CSSProperties}>
            {/* The cell's own width, in the resting phrase's letter. The
                letters that show are absolutely positioned, so without
                this the cell measures zero until the ruler has run and
                the whole ending piles up on itself — which is what it
                did in the server HTML, before hydration. The measured
                width, when it arrives, is set inline and wins.

                The letter rides in a data attribute and is drawn by
                `content: attr(data-ch)`, not as a text node. It lays out
                exactly the same, but generated content is not part of
                `textContent`, and this span is inside the <h1>: as real
                text, every cell's sizer letter interleaved with the
                visible one and the heading read
                "pprroodduucctt ddeessiiggnneerr..". Assistive tech was
                always fine (the h1 carries an aria-label), but crawlers
                and link-preview scrapers read the text node. */}
            <span className="hero-flip__sizer" aria-hidden="true" data-ch={TAILS.rest[i] ?? ''} />
            {/* The word gap, as a real space. `.hero-flip__letter` is
                absolutely positioned, so this costs no layout at all —
                but without it the ending ran together as
                "productdesigner." in the heading's text. */}
            {ch === ' ' && (
              <span className="hero-flip__letter" aria-hidden="true">
                {' '}
              </span>
            )}
            <AnimatePresence initial={false}>
              {ch !== undefined && ch !== ' ' && (
                /* Keyed by the letter: a letter that survives the change
                   stays put, only the ones that differ roll. */
                <motion.span
                  key={ch}
                  className="hero-flip__letter"
                  initial={still ? false : { rotateX: -90, y: '40%', opacity: 0 }}
                  animate={{ rotateX: 0, y: 0, opacity: 1 }}
                  exit={still ? { opacity: 0, transition: { duration: 0 } } : { rotateX: 90, y: '-40%', opacity: 0 }}
                  transition={still ? { duration: 0 } : { ...ROLL, delay: i * 0.02 }}
                >
                  {ch}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        )
      })}
      {/* The measuring ruler. Same trick as the sizer, and for the same
          reason: it holds every ending at once, so as real text it put
          three more copies of the phrase inside the <h1>. Each letter is
          drawn by `content: attr(data-ch)`, which still lays out and
          still measures, and contributes nothing to `textContent`. */}
      <span className="hero-flip__ruler" ref={rulerRef} aria-hidden="true">
        {TAIL_KEYS.map((k) => (
          <span key={k} data-tail={k}>
            {Array.from(TAILS[k], (ch, i) => (
              <span key={i} data-ch={ch} />
            ))}
          </span>
        ))}
      </span>
    </span>
  )
}

export default function HeroIntro() {
  const reducedMotion = useReducedMotion()
  /* Which role the ending shows. Starts on `impact`, the resting ending,
     so the first paint is the plain sentence. */
  const [state, setState] = useState<Mode>('impact')
  useEffect(() => {
    if (reducedMotion) return
    const id = setInterval(() => {
      if (document.visibilityState === 'hidden') return
      setState((m) => CYCLE[(CYCLE.indexOf(m) + 1) % CYCLE.length])
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [reducedMotion])

  /*
   * The arrival blur is a CSS animation, not a framer-motion one: a motion
   * `initial` renders as inline opacity:0 in the server HTML, so the
   * sentence stayed invisible until React had hydrated (seconds of blank
   * hero on a cold phone, forever if hydration never landed). CSS runs on
   * first paint whether or not any JavaScript arrives.
   *
   * `--wi` is the word's place in the stagger. It is not `--i`, which
   * the split-flap cells inside the ending already use.
   */
  const entrance = (i: number) => ({ style: { '--wi': i } as CSSProperties })

  let wordIndex = 0

  return (
    <div className="hero-intro">
      <div className="hero-intro__body">
        <h1 className="hero-line" aria-label={SENTENCE}>
          {LINES.map((line, l) => (
            /* `.hero-l` is display:block so the space never renders; it is
               there so the heading's text doesn't read "is acurious". */
            <Fragment key={l}>
              {l > 0 && ' '}
              <span className={`hero-l${l === LINES.length - 1 ? ' hero-l--tail' : ''}`}>
                {line.map((word, i) => {
                  const n = wordIndex++
                  /* The space lives between the spans, not inside them:
                     leading whitespace inside an inline-block collapses. */
                  return (
                    <Fragment key={word.text}>
                      {i > 0 && ' '}
                      <span className={`hero-word${word.dim ? ' hero-word--dim' : ''}`} {...entrance(n)}>
                        {word.tail ? <FlipTail state={state} still={reducedMotion} /> : word.text}
                        {word.after}
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
