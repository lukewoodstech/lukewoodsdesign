'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { INTRO_LINES, INTRO_SENTENCE } from '@/lib/site'
import s from './HeroCompile.module.css'

/*
 * EXPERIMENT (2026-11-17, branch try/hero-compile): the hero gets built
 * in front of you, once, then holds still.
 *
 *   draw    a cursor drags out a frame, design-tool style
 *   type    a caret types the sentence into it, letter by letter
 *   code    the copy blurs away and the source types in (indents land
 *           at once, the way an editor auto-indents)
 *   build   `next build` types under the frame → "Compiled successfully"
 *   live    a render line sweeps, the code gives way to the real
 *           sentence, the chrome falls away
 *
 * Every letter is a span with its own animation delay, worked out here
 * at render (deterministic, so server and client agree), and the whole
 * thing is CSS: no JavaScript is needed for it to play or to end on the
 * finished sentence. Reduced motion shows the finished sentence only.
 * JS only measures the size readout.
 *
 * To remove: swap <HeroCompile /> back to <HeroIntro /> in Home.tsx and
 * delete this file + HeroCompile.module.css.
 */

/* ── Timing (seconds) ── */
const DRAW_AT = 0.55 // cursor presses and starts dragging
const DRAW_FOR = 0.8
const TYPE_AT = 1.65 // first letter of the sentence
const SENT_CH = 0.017 // per letter, before jitter
const CODE_CH = 0.0035
const BUILD_CH = 0.035

const r3 = (n: number) => Math.round(n * 1000) / 1000
/* A little unevenness so it reads as hands, not a ticker. Deterministic. */
const jitter = (i: number) => ((i * 37) % 11) / 11

type Char = { c: string; d: number; g: number; cls?: string }
type Src = { c: string; cls?: string; pause?: number; instant?: boolean }

/** Lay a run of letters out on the clock from `start`. */
function clock(
  chars: Src[],
  start: number,
  per: number,
  jitterAmt: number,
) {
  let t = start
  const out: Char[] = []
  chars.forEach((ch, i) => {
    out.push({ c: ch.c, d: r3(t), g: 0, cls: ch.cls })
    if (!ch.instant) t += per + jitter(i) * jitterAmt
    t += ch.pause ?? 0
  })
  out.forEach((ch, i) => {
    ch.g = r3((out[i + 1]?.d ?? t + 0.6) - ch.d) || 0.001
  })
  return { out, end: t }
}

/* ── The sentence ── */
const sentenceSrc = INTRO_LINES.flatMap((line, l) => {
  const chars: Src[] = [...line].map((c) => ({
    c,
    pause: c === ',' ? 0.09 : 0,
  }))
  if (l < INTRO_LINES.length - 1) chars.push({ c: ' ', pause: 0.1 })
  return chars
})
const SENT = clock(sentenceSrc, TYPE_AT, SENT_CH, 0.014)

const SENT_OUT = SENT.end + 0.55
const CODE_IN = SENT_OUT + 0.3

/* ── The code ── */
type Tok = [string, string?]
const CODE_LINES: Tok[][] = [
  [['export default function', 'kw'], [' '], ['Hero', 'fn'], ['() {']],
  [['  '], ['return', 'kw'], [' (']],
  [['    <'], ['h1', 'tag'], [' '], ['className', 'attr'], ['='], ['"hero-line"', 'str'], ['>']],
  ...INTRO_LINES.map((l): Tok[] => [['      '], [l]]),
  [['    </'], ['h1', 'tag'], ['>']],
  [['  )']],
  [['}']],
]
const codeSrc = CODE_LINES.flatMap((toks, li) => {
  let leading = true
  const chars: Src[] = toks.flatMap(([text, cls]) =>
    [...text].map((c) => {
      const instant = leading && c === ' '
      if (c !== ' ') leading = false
      return { c, cls, instant }
    }),
  )
  if (li < CODE_LINES.length - 1) chars.push({ c: '\n', pause: 0.04 })
  return chars
})
const CODE = clock(codeSrc, CODE_IN + 0.1, CODE_CH, 0.005)

/* ── The build ── */
const BUILD_AT = CODE.end + 0.3
const BUILD = clock([...'next build'].map((c) => ({ c })), BUILD_AT + 0.15, BUILD_CH, 0.04)
const COMPILED_AT = BUILD.end + 0.45
const SCAN_AT = COMPILED_AT + 0.35
const CODE_OUT = SCAN_AT + 0.3
const SENT_IN = SCAN_AT + 0.4
const FRAME_OUT = SCAN_AT + 0.95

const TIMES = {
  '--draw-at': `${DRAW_AT}s`,
  '--draw-for': `${DRAW_FOR}s`,
  '--sent-out': `${r3(SENT_OUT)}s`,
  '--code-in': `${r3(CODE_IN)}s`,
  '--build-at': `${r3(BUILD_AT)}s`,
  '--compiled-at': `${r3(COMPILED_AT)}s`,
  '--scan-at': `${r3(SCAN_AT)}s`,
  '--code-out': `${r3(CODE_OUT)}s`,
  '--sent-in': `${r3(SENT_IN)}s`,
  '--frame-out': `${r3(FRAME_OUT)}s`,
} as CSSProperties

const charStyle = (ch: Char) => ({ '--d': `${ch.d}s`, '--g': `${ch.g}s` }) as CSSProperties

function Letters({ chars, className }: { chars: Char[]; className: string }) {
  return chars.map((ch, i) => (
    <span key={i} className={`${className} ${ch.cls ? s[ch.cls] : ''}`} style={charStyle(ch)}>
      {ch.c}
    </span>
  ))
}

/* The sentence, split back into its lines, each word kept unbroken. */
function sentenceLines(): ReactNode[] {
  let k = 0
  return INTRO_LINES.map((line, l) => {
    const lineChars = SENT.out.slice(k, k + line.length)
    k += line.length
    const space = l < INTRO_LINES.length - 1 ? SENT.out[k++] : null
    const words: ReactNode[] = []
    let word: Char[] = []
    const flush = () => {
      if (word.length)
        words.push(
          <span key={words.length} className={s.word}>
            <Letters chars={word} className={s.ch} />
          </span>,
        )
      word = []
    }
    lineChars.forEach((ch) => {
      if (ch.c === ' ') {
        flush()
        words.push(
          <span key={words.length} className={s.ch} style={charStyle(ch)}>
            {' '}
          </span>,
        )
      } else word.push(ch)
    })
    flush()
    return (
      <span key={l}>
        <span className="hero-l">{words}</span>
        {space && (
          <span className={`${s.ch} ${s.lineGap}`} style={charStyle(space)}>
            {' '}
          </span>
        )}
      </span>
    )
  })
}
const LINES = sentenceLines()

export default function HeroCompile() {
  const [size, setSize] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const body = bodyRef.current
    if (!body) return
    const ro = new ResizeObserver(([e]) => {
      const r = e.contentRect
      setSize(`${Math.round(r.width)} × ${Math.round(r.height)}`)
    })
    ro.observe(body)
    return () => ro.disconnect()
  }, [])

  return (
    <div className={`hero-intro ${s.root}`} style={TIMES}>
      <div ref={bodyRef} className="hero-intro__body">
        <h1 className={`hero-line ${s.sentence}`} aria-label={INTRO_SENTENCE}>
          <span aria-hidden="true">{LINES}</span>
        </h1>

        <pre className={s.code} aria-hidden="true">
          <code>
            <Letters chars={CODE.out} className={s.cch} />
          </code>
        </pre>

        <div className={s.frame} aria-hidden="true">
          <span className={`${s.label} ${s.labelDesign}`}>Hero / Intro</span>
          <span className={`${s.label} ${s.labelCode}`}>HeroIntro.tsx</span>
          <span className={`${s.handle} ${s.tl}`} />
          <span className={`${s.handle} ${s.tr}`} />
          <span className={`${s.handle} ${s.bl}`} />
          <span className={`${s.handle} ${s.br}`} />
          <span className={s.scan} />

          <span className={s.under}>
            {size && <span className={s.size}>{size}</span>}
            <span className={s.build}>
              <span className={s.prompt}>$ </span>
              <Letters chars={BUILD.out} className={s.bch} />
            </span>
            <span className={s.compiled}>✓ Compiled successfully</span>
          </span>

          {/* The pointer rides the frame's growing corner. */}
          <svg className={s.cursor} viewBox="0 0 16 22" width="16" height="22">
            <path
              d="M1 1v17.5l4.6-4.3 3 6.8 3-1.3-3-6.6H15L1 1z"
              fill="#fff"
              stroke="#000"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
