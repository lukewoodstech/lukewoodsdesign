'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'

/*
 * Live rebuild of the Find docs experience from the team's design file
 * ("search results", node 40000022:14688): summary line, then compact
 * 24px result rows — bullet, grey doc chip, inline description — over
 * the focused AI chat input. Colors, radii, spacing and copy come from
 * the node's design context; icons are the file's exported vectors.
 * Graphik LC App renders through a metric-close fallback stack since
 * the licensed font can't ship here.
 *
 * Loop: cursor blinks → query types → bubble posts → thinking dots →
 * summary and result rows resolve → hold → fade → restart.
 * Reduced motion renders the resolved state, static.
 */

const MOCK = '/case-studies/lucid/mock'
const QUERY = 'Find product roadmaps'

const FONT =
  "'Graphik LC App', 'Helvetica Neue', 'Segoe UI', Arial, sans-serif"
const INK = '#282c33'

// Descriptions verbatim from the design file; titles varied so the list
// reads as five distinct documents (the file repeats one placeholder title,
// and its sixth row is a literal "[Document summary.]" template slot).
const ROWS = [
  { title: 'Q3 FY27 Roadmap Planning',  desc: '- Kickoff board for the Q3 roadmap — themes, prioritized bets, and sticky-notes.' },
  { title: 'Q3 Initiatives Brainstorm', desc: '- Cross-team brainstorm mapping Q3 initiatives and their dependencies.' },
  { title: 'Q3 Planning Workshop',      desc: '- Workshop canvas with the quarter timeline and an effort vs. impact matrix.' },
  { title: 'Weekly Roadmap Sync',       desc: '- Notes from the weekly roadmap sync where Q3 scope/owners were decided.' },
  { title: 'FY27 Strategy Map',         desc: '- Strategy canvas linking annual goals to the Q3 roadmap initiatives.' },
] as const

// Timeline (ms)
const TYPE_START = 900
const CHAR_MS = 75
const TYPE_END = TYPE_START + QUERY.length * CHAR_MS // 2475
const SEND = TYPE_END + 350
const DOTS_START = SEND + 150
const DOTS_END = SEND + 1100
const RESP = DOTS_END + 80
const ROW_STAGGER = 200
const CLOSING_AT = RESP + (ROWS.length + 1) * ROW_STAGGER + 150
const HOLD_END = CLOSING_AT + 5200
const LOOP_END = HOLD_END
/*
 * Where the loop *starts*: the fully resolved answer, not the empty panel.
 * The blank input + typing phase reads as unloaded content when it's the
 * first thing a visitor sees, so the resting/first frame is the finished
 * story and the typing pass plays as a transition inside the loop.
 */
const START_AT = CLOSING_AT + 300

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n
}

export default function SearchMock({
  height = 836,
  width = 400,
  compact = false,
  scale = 1,
  startResolved = false,
}: {
  height?: number | '100%'
  /** 400 = the side panel; '100%' = full-page style filling the container,
      with the design file's 800px centered content column */
  width?: number | '100%'
  /** Tile mode: tighter chrome, truncated descriptions, no closing line */
  compact?: boolean
  /** Zoom the whole panel out to fit small stages (e.g. 0.72 on the tile) */
  scale?: number
  /** First frame = resolved answer (the tile's resting state); the case
      study demo keeps the default and plays the sequence from the top */
  startResolved?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const [t, setT] = useState(0)
  const [isInView, setIsInView] = useState(false)
  // A full exchange exists on screen — lets the next typing pass keep the
  // previous answer visible instead of clearing to an empty white panel.
  const [prevAvailable, setPrevAvailable] = useState(startResolved)
  const rootRef = useRef<HTMLDivElement>(null)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef(0)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        } else {
          setIsInView(false)
          setT(0)
          setPrevAvailable(startResolved)
          startRef.current = null
        }
      },
      { threshold: 0.25 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [startResolved])

  useEffect(() => {
    if (!isInView || reducedMotion) return
    const frame = (ts: number) => {
      // Backdate the clock so the first painted frame is the resolved state.
      if (!startRef.current) startRef.current = ts - (startResolved ? START_AT : 0)
      const total = ts - startRef.current
      if (total >= LOOP_END) setPrevAvailable(true)
      setT(total % LOOP_END)
      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isInView, reducedMotion, startResolved])

  // Reduced motion renders the resolved frame as data, not via setState.
  const tv = reducedMotion ? HOLD_END : t

  const typedCount = Math.min(
    QUERY.length,
    Math.max(0, Math.floor((tv - TYPE_START) / CHAR_MS)),
  )
  const typed = QUERY.slice(0, typedCount)
  const sent = tv >= SEND
  const thinking = tv >= DOTS_START && tv < DOTS_END
  const respIn = clamp01((tv - RESP) / 300)
  const closingIn = clamp01((tv - CLOSING_AT) / 300)
  /*
   * The previous cycle's answer stays up while the next query types, fading
   * only as the new one sends — the messages area is never an empty panel.
   * (It's the same query looping, so "prev" and "next" render identically.)
   */
  const showPrev = prevAvailable && tv < DOTS_START
  const prevOpacity = tv < SEND ? 1 : clamp01(1 - (tv - SEND) / (DOTS_START - SEND))
  const showResponse = tv >= RESP || showPrev

  const scaled = scale !== 1
  const fillWidth = width === '100%'

  return (
    <div ref={rootRef} className="flex h-full items-center justify-center overflow-hidden">
      {/* ── The panel; 400 native, or full-page style filling the stage ── */}
      <div
        className={`lcs-searchmock flex flex-col overflow-hidden rounded-[8px] border border-white/10 bg-white text-left ${fillWidth || scaled ? '' : 'max-w-full'}`}
        style={{
          width: fillWidth ? (scaled ? `${100 / scale}%` : '100%') : width,
          height: scaled && height === '100%' ? `${100 / scale}%` : height,
          fontFamily: FONT,
          color: INK,
          ...(scaled
            ? {
                transform: `scale(${scale})`,
                transformOrigin: height === '100%' ? 'top center' : 'center',
                flexShrink: 0,
              }
            : {}),
        }}
        aria-label="Animated rebuild of the Lucid AI Find docs panel showing a search and its document results"
      >
        {/* Header — bordered, per the design file */}
        <div
          className={`flex shrink-0 items-center justify-between border-b border-[#ced4db] px-[16px] py-[4px] ${compact ? 'h-[48px]' : 'h-[56px]'}`}
        >
          <div className="flex items-center gap-[8px]">
            <span className="text-[18px] font-semibold leading-[24px]">Lucid AI</span>
            <span className="flex min-w-[24px] items-center justify-center rounded-[4px] px-[4px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${MOCK}/info-16.svg`} alt="" className="size-[16px]" />
            </span>
          </div>
          <div className="flex items-center gap-[8px]">
            <span className="flex size-[32px] items-center justify-center rounded-[4px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${MOCK}/shrink-24.svg`} alt="" className="size-[24px]" />
            </span>
            <span className="flex size-[32px] items-center justify-center rounded-[4px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${MOCK}/close-24.svg`} alt="" className="size-[24px]" />
            </span>
          </div>
        </div>

        {/* Messages */}
        <div
          className={`flex min-h-0 flex-1 flex-col overflow-hidden ${compact ? 'px-[12px] pt-[10px]' : 'px-[16px] pt-[16px]'}`}
        >
          <div className="mx-auto flex w-full max-w-[800px] flex-col gap-[4px]">
          {/* User message */}
          {sent && (
            <div className="flex w-full justify-end pb-[4px] pl-[72px]">
              <div className="max-w-[248px] rounded-[8px] bg-[rgba(40,44,51,0.08)] px-[16px] py-[8px]">
                <p className="text-[14px] leading-[20px]">{QUERY}</p>
              </div>
            </div>
          )}

          {/* Loading state — status label + Progress circle, per the design file */}
          {thinking && (
            <div className="flex w-full items-start justify-between pt-[8px]" aria-hidden="true">
              <p className="whitespace-nowrap text-[14px] leading-[20px]">
                Searching documents...
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${MOCK}/progress-circle-24.svg`}
                alt=""
                className="size-[24px] shrink-0 animate-spin"
                style={{ animationDuration: '0.9s' }}
              />
            </div>
          )}

          {/* AI response — summary line + compact result rows */}
          {showResponse && (
            <div
              className="flex flex-col gap-[8px] pt-[8px]"
              style={{ opacity: tv >= RESP ? respIn : prevOpacity }}
            >
              <p className="text-[14px] leading-[20px]">
                The Q3 roadmap discussion was most likely on &ldquo;Q3 FY27 Roadmap
                Planning.&rdquo; Related boards below.
              </p>
              {ROWS.map((r, i) => {
                // Rows shown as the previous answer are already fully revealed.
                const p = tv >= RESP ? clamp01((tv - (RESP + (i + 1) * ROW_STAGGER)) / 280) : 1
                return (
                  <div
                    key={r.title}
                    className="flex w-full items-center gap-[8px]"
                    style={{ opacity: p, transform: `translateY(${(1 - p) * 5}px)` }}
                  >
                    <span className="flex size-[24px] shrink-0 items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${MOCK}/dot-24.svg`} alt="" className="size-[24px]" />
                    </span>
                    <span className="flex h-[24px] shrink-0 items-center bg-[rgba(131,138,147,0.1)] px-[4px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`${MOCK}/lucidchart-doc.svg`} alt="" className="h-[16px] w-[13.7px] shrink-0" />
                      <span className="whitespace-nowrap px-[4px] text-[14px] font-medium leading-[20px]">
                        {r.title}
                      </span>
                    </span>
                    <p className="min-w-0 flex-1 truncate text-[14px] leading-[20px]">
                      {r.desc}
                    </p>
                  </div>
                )
              })}
              {!compact && (
                <p
                  className="text-[14px] leading-[20px]"
                  style={{ opacity: tv >= RESP ? closingIn : 1 }}
                >
                  If you want, I can show a few more roadmap docs.
                </p>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Input */}
        <div className={`shrink-0 ${compact ? 'px-[12px] pb-[12px] pt-[6px]' : 'px-[16px] pb-[16px] pt-[8px]'}`}>
          <div
            className="mx-auto flex w-full max-w-[800px] flex-col rounded-[8px] border border-[#7c78ff] bg-white"
            style={{ height: compact ? 76 : 104 }}
          >
            <div className={`relative min-h-0 flex-1 ${compact ? 'pb-[4px] pl-[12px] pr-[8px] pt-[10px]' : 'pb-[8px] pl-[16px] pr-[8px] pt-[16px]'}`}>
              {!sent && typedCount === 0 ? (
                <p className="text-[14px] leading-[20px] text-[rgba(40,44,51,0.7)]">
                  Find or summarize a document...
                  <span
                    className={`absolute h-[16px] w-px bg-[#282c33] ${compact ? 'left-[12px] top-[12px]' : 'left-[16px] top-[18px]'}`}
                    style={{ animation: 'cursorBlink 1s step-end infinite' }}
                  />
                </p>
              ) : (
                <p className="text-[14px] leading-[20px]">
                  {sent ? (
                    <span className="text-[rgba(40,44,51,0.7)]">Find or summarize a document...</span>
                  ) : (
                    <>
                      {typed}
                      <span className="ml-[1px] inline-block h-[16px] w-px translate-y-[3px] bg-[#282c33]" />
                    </>
                  )}
                </p>
              )}
            </div>
            <div className={`flex items-center justify-end ${compact ? 'px-[6px] pb-[4px]' : 'px-[8px] pb-[8px]'}`}>
              <span
                className="flex items-center justify-center rounded-[4px] p-[4px]"
                style={{ opacity: !sent && typedCount > 0 ? 1 : 0.45, transition: 'opacity 0.2s ease' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${MOCK}/send-arrow.svg`} alt="" className="size-[24px]" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
