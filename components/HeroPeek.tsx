'use client'

import { useEffect, useState } from 'react'
import LukeSprite from '@/components/luke-ai/LukeSprite'
import { TIP_SEEN_KEY } from '@/components/HeroIntro'

/*
 * The hint on the hero: pixel Luke leans in from the bottom of the first
 * screen, says "hover me", and ducks back out.
 *
 * The three hot words in the headline are the only hover targets on the
 * page and nothing marks them, which is the point — but a visitor who
 * never moves the pointer over them never learns they exist. So he shows
 * up as the sentence lands, twice more if the words still haven't been
 * found,
 * and then leaves it alone. Once a word has been opened — hovered,
 * tapped, or focused with a keyboard — he stays gone for the session:
 * a hint that keeps arriving after you've understood it is nagging.
 *
 * He is scenery, not a control: `pointer-events: none`, aria-hidden, and
 * nothing happens if you click him. The thing to act on is the word.
 */

/*
 * In: as soon as the sentence has landed. It used to be five seconds,
 * which meant the one thing on the page that explains the page arrived
 * after most people had already started scrolling. 900ms is the last
 * word of the headline finishing its blur-up — soon enough to read as
 * part of the arrival, late enough not to be one more thing moving
 * while the sentence is still assembling itself.
 *
 * Out: long enough to read twice.
 */
const FIRST_MS = 900
const SHOW_MS = 5200
const GAP_MS = 16000
const TIMES = 3

export default function HeroPeek({ silenced }: { silenced: boolean }) {
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (silenced) return
    try {
      if (sessionStorage.getItem(TIP_SEEN_KEY) === '1') return
    } catch {}
    const timers: number[] = []
    for (let i = 0; i < TIMES; i++) {
      const at = FIRST_MS + i * (SHOW_MS + GAP_MS)
      timers.push(window.setTimeout(() => setOn(true), at))
      timers.push(window.setTimeout(() => setOn(false), at + SHOW_MS))
    }
    return () => timers.forEach(window.clearTimeout)
  }, [silenced])

  /* Found the words? Then he's done, mid-peek or not. */
  const show = on && !silenced

  return (
    <div className={`hero-peek${show ? ' is-on' : ''}`} aria-hidden="true">
      <p className="hero-peek__say">
        <span className="hero-peek__say-hover">hover me</span>
        <span className="hero-peek__say-tap">tap me</span>
        <span className="hero-peek__up">↑</span>
      </p>
      <LukeSprite variant="peek" act="wave" className="hero-peek__face" />
    </div>
  )
}
