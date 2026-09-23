'use client'

import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { SITE, INTRO } from '@/lib/site'
import { STORY } from '@/lib/about'
import { useReducedMotion } from '@/lib/useReducedMotion'
import HeroPeek from '@/components/HeroPeek'

/*
 * The hero intro (2026-09-21), after the opening of
 * tannerengland.framer.website: one sentence in a serif, with three words
 * you can hover. Each one is a different way of answering "who is this?"
 *
 *   at rest          Luke Woods is a creative & impact-driven product designer.
 *   "Luke Woods"     the name lights up, four photos deal out around the
 *                    sentence, the ending rolls to "designer who codes."
 *   "creative"       outline icons of what the creativity goes into — and
 *                    what refills it — drift in; the ending rolls to
 *                    "problem solver."
 *   "impact-driven"  four stat chips from the case studies tilt in; the
 *                    ending stays put — the numbers are the point.
 *
 * Only those three words are hot. Everything else in the sentence is just
 * type; a hover in the gaps does nothing, which is what makes the hot
 * words feel found rather than announced.
 *
 * Every number on a chip and every sentence in a subline traces to
 * lib/lukeAiFacts.ts (the truth layer) or lib/about.ts — nothing here says
 * more than the case studies do, and the impact subline says where the
 * numbers come from.
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
 * Left alone, the ending turns over on its own every few seconds —
 * product designer → designer who codes → problem solver → … — nothing
 * else moves with it. The rule and the line of description exist only
 * while a word is hovered; at rest the sentence stands alone. A hover pins the ending to
 * that word for as long as it lasts, and the cycle carries on from there
 * afterwards. Under reduced motion nothing turns over on its own.
 *
 * Nothing marks the hot words, so pixel Luke (HeroPeek) leans in from
 * the foot of the screen a few seconds in and says "hover me" — up to
 * three times, and never again once a word has been opened. Touch
 * devices toggle a mode by tapping the word, and he says "tap me"
 * there. Keyboard focus on a word opens its mode too.
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

/* The line under the rule, one per mode. There is no resting line: the
   foot is empty until a word is hovered. */
/* Kept to the same length and cadence so each sets in two lines. The
   name greets and says what Luke is doing now; creative names the outlets;
   impact claims the numbers — and the chips say where each one was measured. */
const SUBLINES: Record<Mode, string> = {
  name: 'Hi, I’m Luke! I’m studying CS and HCI at BYU and building products between classes.',
  creative: 'Design, code, sports, and poetry: four outlets for the same creative instinct.',
  impact: 'These stats are the measurable results of my design work, on real teams in real tests.',
}

type Word = { text: string; dim?: boolean; hot?: Mode; tail?: true }

/*
 * Three lines, fixed. The ending changes width when it rolls, and if it
 * shared a line with anything else the sentence would rewrap under the
 * pointer — the hovered word slides away, the mode closes, the ending
 * rolls back, the word slides back: a flicker loop. So the ending owns
 * its line, and the two lines above it never change.
 */
const LINES: readonly (readonly Word[])[] = [
  [{ text: SITE.name, hot: 'name' }, { text: 'is a', dim: true }],
  [
    { text: INTRO.adjectives[0], hot: 'creative' },
    { text: '&', dim: true },
    { text: INTRO.adjectives[1], hot: 'impact' },
  ],
  [{ text: TAILS.rest, tail: true }],
]
const WORD_COUNT = LINES.flat().length

/* What assistive tech reads: the resting sentence, once. */
const SENTENCE = `${SITE.name} is a creative & impact-driven ${TAILS.rest}`
export const TIP_SEEN_KEY = 'hero-tip-seen'

/*
 * Where a decoration sits. `y` is a percentage of a box drawn around the
 * headline block (.hero-deco — the block plus a band above it), and `r` a
 * tilt. Horizontally there are two kinds:
 *  - in the band above the sentence, `x` is a percentage of the headline's
 *    width, anchored at the item's centre;
 *  - on the flanks, `edge` names a side of the headline and `x` is how
 *    many px the item reaches INWARD past that edge (negative = a gap).
 *    Anchoring to the edge is what keeps a fixed-width chip off the text
 *    at every viewport — a percentage position let the chips cover the
 *    name once the headline was narrower than about 600px.
 * The first line is short, so flanks at its height can reach in; the
 * second line is nearly the full width, so flanks there stay outside.
 * `m` is the phone position (below 48em, both as percentages); a
 * decoration without one is hidden there (the box is narrow, and the
 * bottom is where the subline and links live).
 */
type Spot = { x: number; y: number; r: number; edge?: 'left' | 'right'; m?: { x: number; y: number } }

/* ── Mode: name — the photos from the about page, dealt out around the name ── */

const PHOTOS = STORY.filter((c): c is Extract<typeof c, { kind: 'photo' }> & { src: string } =>
  c.kind === 'photo' && c.src !== null,
)

const PHOTO_SPOTS: readonly Spot[] = [
  { edge: 'left', x: 44, y: 29, r: -10, m: { x: 20, y: 16 } },
  { x: 19, y: 15, r: 8 },
  { edge: 'right', x: 44, y: 29, r: 9, m: { x: 80, y: 16 } },
  { x: 81, y: 15, r: -7 },
]

/* ── Mode: creative — what the creativity goes into, and what refills it.
   24px Lucide outlines (the basketball is drawn to Lucide's geometry;
   the library has no ball of its own). ── */

type IconSpot = Spot & { id: string; d: string }

const ICONS: readonly IconSpot[] = [
  /* a row above the sentence: AI, code, the pen tool, shipping */
  { id: 'sparkles', x: 26, y: 8, r: 0, m: { x: 17, y: 16 }, d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3' },
  { id: 'code', x: 42, y: 5, r: 0, m: { x: 39, y: 13 }, d: 'M16 18l6-6-6-6 M8 6l-6 6 6 6' },
  { id: 'pen', x: 58, y: 5, r: 0, m: { x: 61, y: 13 }, d: 'M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z M18 13l-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18 M2.3 2.3l7.286 7.286 M11 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
  { id: 'rocket', x: 74, y: 8, r: 0, m: { x: 83, y: 16 }, d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5' },
  /* the left flank: conversation, the puzzle, the terminal */
  { id: 'chat', edge: 'left', x: 10, y: 30, r: 0, m: { x: 6, y: 36 }, d: 'M7.9 20A9 9 0 1 0 4 16.1L2 22z' },
  { id: 'puzzle', edge: 'left', x: -14, y: 47, r: 0, d: 'M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z' },
  { id: 'terminal', edge: 'left', x: 16, y: 64, r: 0, d: 'M4 17l6-6-6-6 M12 19h8' },
  /* the right flank: people, basketball, the gym */
  { id: 'users', edge: 'right', x: 10, y: 30, r: 0, m: { x: 94, y: 36 }, d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75' },
  { id: 'basketball', edge: 'right', x: -14, y: 47, r: 0, d: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2v20 M4.93 4.93a10 10 0 0 1 0 14.14 M19.07 4.93a10 10 0 0 0 0 14.14' },
  { id: 'dumbbell', edge: 'right', x: 16, y: 64, r: 0, d: 'M14.4 14.4l-4.8-4.8 M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z M21.5 21.5l-1.4-1.4 M3.9 3.9L2.5 2.5 M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z' },
]

/* ── Mode: impact — the numbers, with the study each comes from ── */

type Chip = Spot & {
  id: string
  n: string
  /* Direction the arrow points; none for a count. */
  dir?: 'up' | 'down'
  label: string
  from: string
  /* Icon path, 24px Lucide geometry. */
  d: string
}

const CHIPS: readonly Chip[] = [
  {
    id: 'login',
    edge: 'left',
    x: 48,
    y: 30,
    r: -6,
    m: { x: 27, y: 15 },
    n: '25%',
    dir: 'up',
    label: 'faster login',
    from: 'Awardco · usability testing',
    d: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
  },
  {
    id: 'decide',
    x: 24,
    y: 11,
    r: 4,
    n: '78%',
    dir: 'down',
    label: 'faster sign-in decision',
    from: 'Awardco · 27s → 5.9s',
    d: 'M9 9l5 12 1.8-5.2L21 14 9 9z M7.2 2.2 8 5.1 M5.1 8 2.2 7.2 M14 4.1 12 6 M6 12l-1.9 2',
  },
  {
    id: 'ga',
    edge: 'right',
    x: 48,
    y: 30,
    r: 5,
    m: { x: 73, y: 15 },
    n: '12 wk',
    label: 'blank page to GA',
    from: 'Lucid AI · every tier',
    d: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
  },
  {
    id: 'interviews',
    x: 76,
    y: 11,
    r: -4,
    n: '50+',
    label: 'discovery interviews',
    from: 'Pattern · weekly, ten months',
    d: 'M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5z M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1',
  },
]

/* Fixed clip geometry so the ruler and the cells always agree. */
const TAIL_KEYS = Object.keys(TAILS) as State[]
const MODES = Object.keys(SUBLINES) as Mode[]
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

/* A decoration's place on the box, as inline style. */
function spot(s: Spot, i: number): CSSProperties {
  const vars: Record<string, string | number> = {
    '--y': `${s.y}%`,
    '--r': `${s.r}deg`,
    '--i': i,
  }
  if (s.edge) vars['--in'] = `${s.x}px`
  else vars['--x'] = `${s.x}%`
  if (s.m) {
    vars['--mx'] = `${s.m.x}%`
    vars['--my'] = `${s.m.y}%`
  }
  return vars as CSSProperties
}

const edgeClass = (s: Spot) => (s.edge ? ` is-${s.edge}` : '')

export default function HeroIntro() {
  const reducedMotion = useReducedMotion()
  const [mode, setMode] = useState<Mode | null>(null)
  /* Which role the ending shows while nothing is hovered. Starts on
     `impact` — the resting ending — so the first paint is the plain
     sentence. */
  const [auto, setAuto] = useState<Mode>('impact')
  const state: State = mode ?? auto
  /* Whether the hot words have been found this session. The ref is the
     one the pointer handlers read; the state is what silences the peek,
     and it only ever flips inside an event, never in an effect. */
  const seenRef = useRef(false)
  const [seen, setSeen] = useState(false)

  /* The cycle: paused while a word is hovered, and restarted from that
     word's role when the hover ends, so the ending never rolls away the
     instant the pointer leaves. */
  useEffect(() => {
    if (reducedMotion || mode) return
    const id = setInterval(() => {
      if (document.visibilityState === 'hidden') return
      setAuto((m) => CYCLE[(CYCLE.indexOf(m) + 1) % CYCLE.length])
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [reducedMotion, mode])

  /*
   * The mode that is showing: the word under the pointer, the word that
   * was tapped, or nothing.
   *
   * For a few hours on 2026-09-22 a hoverless screen opened its own
   * modes on the cycle, on the reasoning that a phone otherwise never
   * finds the words. Luke's call on seeing it: the clean sentence is
   * better and the decorations stay behind the tap. Pixel Luke is the
   * one who says they are there — that is his whole job — so the
   * sentence rests at every width, as designed.
   */
  const shown: Mode | null = mode

  const open = (m: Mode) => {
    setMode(m)
    setAuto(m)
    setSeen(true)
    if (!seenRef.current) {
      seenRef.current = true
      try {
        sessionStorage.setItem(TIP_SEEN_KEY, '1')
      } catch {}
    }
  }

  /*
   * Pointer events carry the pointer type, which is the honest way to tell
   * a hover from a tap: a mouse opens a mode on enter and closes it on
   * leave, a finger toggles it on each tap. (A touch also synthesises
   * mouse events, so keying on pointerType keeps the two from fighting.)
   */
  const onPointerEnter = (m: Mode) => (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse') open(m)
  }
  const onPointerLeave = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse') setMode(null)
  }
  const onPointerDown = (m: Mode) => (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') setMode((v) => (v === m ? null : m))
  }
  /* Focus opens a mode only when it's visible focus (a Tab, not the focus
     a tap or click also hands the button), and blur only closes what
     focus opened: on a phone, tapping the second word blurs the first,
     and that blur must not cancel the tap. */
  const byKeyboardRef = useRef(false)
  const onFocus = (m: Mode) => (e: ReactFocusEvent<HTMLElement>) => {
    if (!e.target.matches(':focus-visible')) return
    byKeyboardRef.current = true
    open(m)
  }
  const onBlur = () => {
    if (!byKeyboardRef.current) return
    byKeyboardRef.current = false
    setMode(null)
  }

  /*
   * The arrival blur is a CSS animation, not a framer-motion one, and
   * that is the whole point: a motion `initial` renders as inline
   * opacity:0 in the server HTML, so the sentence stayed invisible
   * until React had hydrated. On a phone with a cold cache that is
   * seconds of blank hero, and if hydration never lands — slow network,
   * low memory, a tab restored in the background — it never appears at
   * all. Luke saw exactly that, most often in a private tab. CSS runs on
   * first paint whether or not any JavaScript arrives, so the sentence
   * now shows up on its own and the script only adds the hovers.
   *
   * `--wi` is the word's place in the stagger. It is not `--i`, which
   * the split-flap cells inside the ending already use.
   */
  const entrance = (i: number) => ({ style: { '--wi': i } as CSSProperties })

  const on = (m: Mode) => (shown === m ? ' is-on' : '')

  let wordIndex = 0

  return (
    <div
      className={`hero-intro${shown ? ` is-open is-${shown}` : ''}`}
    >
      <div className="hero-intro__body">
      {/* ── The decorations, one group per mode, all mounted so a mode
          opens with a transition instead of a mount. They're inside the
          body so their positions follow the headline, not the column. ── */}
      <div className={`hero-deco hero-deco--photos${on('name')}`} aria-hidden="true">
        {PHOTOS.slice(0, PHOTO_SPOTS.length).map((p, i) => (
          <span key={p.src} className={`hero-photo${edgeClass(PHOTO_SPOTS[i])}`} style={spot(PHOTO_SPOTS[i], i)}>
            <span className="hero-photo__frame">
              <Image src={p.src} alt="" fill sizes="80px" />
            </span>
          </span>
        ))}
      </div>

      <div className={`hero-deco hero-deco--icons${on('creative')}`} aria-hidden="true">
        {ICONS.map((icon, i) => (
          <span key={icon.id} className={`hero-icon${edgeClass(icon)}`} style={spot(icon, i)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d={icon.d} />
            </svg>
          </span>
        ))}
      </div>

      <div className={`hero-deco hero-deco--chips${on('impact')}`} aria-hidden="true">
        {CHIPS.map((chip, i) => (
          <span key={chip.id} className={`hero-chip${edgeClass(chip)}`} style={spot(chip, i)}>
            <span className="hero-chip__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d={chip.d} />
              </svg>
            </span>
            <span className="hero-chip__n">{chip.n}</span>
            <span className="hero-chip__text">
              <span className="hero-chip__label">
                {chip.dir && (
                  <svg className={`hero-chip__arrow hero-chip__arrow--${chip.dir}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 17l6-6 4 4 8-8 M15 7h6v6" />
                  </svg>
                )}
                {chip.label}
              </span>
              <span className="hero-chip__from">{chip.from}</span>
            </span>
          </span>
        ))}
      </div>

        <h1 className="hero-line" aria-label={SENTENCE}>
          {LINES.map((line, l) => (
            /* `.hero-l` is display:block so the space never renders; it is
               there so the heading's text doesn't read "is acreative". */
            <Fragment key={l}>
              {l > 0 && ' '}
            <span className={`hero-l${l === LINES.length - 1 ? ' hero-l--tail' : ''}`}>
              {line.map((word, i) => {
            const n = wordIndex++
            /* The space lives between the spans, not inside them: leading
               whitespace inside an inline-block is collapsed away. */
            return (
              <Fragment key={word.text}>
                {i > 0 && ' '}
                <span
                  className={`hero-word${word.dim ? ' hero-word--dim' : ''}`}
                  {...entrance(n)}
                >
                  {word.tail ? (
                    <FlipTail state={state} still={reducedMotion} />
                  ) : word.hot ? (
                    <button
                      type="button"
                      className={`hero-hot${shown === word.hot ? ' is-lit' : ''}`}
                      onPointerEnter={onPointerEnter(word.hot)}
                      onPointerLeave={onPointerLeave}
                      onPointerDown={onPointerDown(word.hot)}
                      onFocus={onFocus(word.hot)}
                      onBlur={onBlur}
                    >
                      {word.text}
                    </button>
                  ) : (
                    word.text
                  )}
                </span>
              </Fragment>
            )
              })}
            </span>
            </Fragment>
          ))}
        </h1>

        <div className="hero-intro__foot" {...entrance(WORD_COUNT + 1)}>
          {/* The rule and the description exist only while a word is
              hovered (.is-open). Every subline stays in the flow, stacked in
              one grid cell, so the foot never changes height. */}
          <span className="hero-rule" aria-hidden="true" />
          <div className="hero-subs">
            {MODES.map((k) => (
              <p key={k} className={`hero-sub${shown === k ? ' is-on' : ''}`} aria-hidden={shown !== k}>
                {SUBLINES[k]}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Pixel Luke only asks you to find the words where finding them
          is the point. On a phone the sentence is already showing what
          they do, so `shown` silences him without a rule of his own. */}
      <HeroPeek silenced={seen || shown !== null} />
    </div>
  )
}
