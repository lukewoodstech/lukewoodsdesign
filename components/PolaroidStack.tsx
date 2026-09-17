'use client'

import { useState } from 'react'
import Image from 'next/image'
import { animate, motion, useMotionValue } from 'framer-motion'
import { ABOUT_PHOTOS } from './CanvasBits'
import { useReducedMotion } from '@/lib/useReducedMotion'

/*
 * The about photos on mobile: one pile of polaroids you swipe through,
 * instead of four frames stacked down the page. The desktop canvas lays the
 * same photos out around the README; here there's only one column, so the
 * pile behaves like a pile — flick the top frame aside and the next one is
 * under it.
 *
 * Every way in is real: drag with a finger or a mouse, or use the dots,
 * which are ordinary buttons (so keyboard and screen-reader users get the
 * same set of photos, not a swipe-only dead end).
 */

/* Deal angles for the three frames you can see, front to back. */
const TILT = [-2.4, 2.6, -1.6]
/* How far a drag has to travel (or how fast it has to flick) to count. */
const SWIPE_DISTANCE = 64
const SWIPE_VELOCITY = 420

export default function PolaroidStack() {
  const [front, setFront] = useState(0)
  const reducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const count = ABOUT_PHOTOS.length

  /* Send the top frame to the back. It flies out first, then the reorder
     lands while it's behind the pile (the back frame is transparent), so
     resetting x never shows a frame snapping back to centre. */
  function advance(direction: 1 | -1) {
    const next = () => {
      setFront((f) => (f + 1) % count)
      x.set(0)
    }
    if (reducedMotion) {
      next()
      return
    }
    animate(x, direction * 340, { duration: 0.22, ease: 'easeIn' }).then(next)
  }

  return (
    <div className="pstack">
      <div
        className="pstack__pile"
        role="group"
        aria-roledescription="carousel"
        aria-label="Photos of Luke"
      >
        {ABOUT_PHOTOS.map((photo, i) => {
          /* Where this frame sits in the pile right now: 0 is on top. */
          const pos = (i - front + count) % count
          const isFront = pos === 0
          return (
            <motion.figure
              key={photo.src}
              className="polaroid pstack__card"
              /* Only the visible three carry a tilt; the back one is
                 transparent, doing nothing but waiting its turn. */
              animate={{
                y: pos * 10,
                scale: 1 - pos * 0.045,
                rotate: TILT[pos] ?? 0,
                opacity: pos > 2 ? 0 : 1,
              }}
              transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 32 }}
              style={{ zIndex: count - pos, x: isFront ? x : 0 }}
              drag={isFront ? 'x' : false}
              dragSnapToOrigin
              dragElastic={0.55}
              onDragEnd={(_, info) => {
                const far = Math.abs(info.offset.x) > SWIPE_DISTANCE
                const fast = Math.abs(info.velocity.x) > SWIPE_VELOCITY
                if (far || fast) advance(info.offset.x < 0 ? -1 : 1)
              }}
              /* The frames underneath are the same photos the dots reach, so
                 they'd be read twice over; only the top one is exposed. */
              aria-hidden={!isFront}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.w}
                height={photo.h}
                sizes="(max-width: 48em) 82vw, 20rem"
                draggable={false}
                priority={i === 0}
              />
              <figcaption>{photo.caption}</figcaption>
            </motion.figure>
          )
        })}
      </div>

      <div className="pstack__dots">
        {ABOUT_PHOTOS.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            className={`pstack__dot${i === front ? ' is-current' : ''}`}
            aria-label={`Show photo ${i + 1} of ${count}: ${photo.caption}`}
            aria-current={i === front}
            onClick={() => {
              x.set(0)
              setFront(i)
            }}
          />
        ))}
      </div>
      <p className="pstack__hint">swipe, or tap a dot</p>
    </div>
  )
}
