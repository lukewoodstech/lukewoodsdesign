'use client'

import { useState } from 'react'
import Image from 'next/image'

type Layer = {
  src: string
  alt: string
  label: string
  caption: string
  width: number
  height: number
}

/*
 * Two-layer crossfade with a segmented toggle. Serves both the before/after
 * moment (old search vs the shipped panel) and the side panel to full page
 * expand state — the same primitive, different copy. Buttons are real buttons,
 * aria-pressed carries state, and both images stay in the DOM so the fade is
 * a pure opacity swap with no layout shift (the stage keeps the taller
 * layer's aspect box via the visible layer being position-static).
 */
export default function CompareStage({
  layers,
  ariaLabel,
}: {
  layers: [Layer, Layer]
  ariaLabel: string
}) {
  const [active, setActive] = useState(0)

  return (
    <div role="group" aria-label={ariaLabel}>
      <div className="lcs-seg" role="tablist" aria-label={ariaLabel}>
        {layers.map((l, i) => (
          <button
            key={l.label}
            type="button"
            className="lcs-seg__btn"
            aria-pressed={active === i}
            onClick={() => setActive(i)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="lcs-stage mt-4">
        {layers.map((l, i) => (
          <div
            key={l.src}
            className={`lcs-stage__layer ${active === i ? '' : 'lcs-stage__layer--hidden'}`}
            aria-hidden={active !== i}
          >
            <Image
              src={l.src}
              alt={l.alt}
              width={l.width}
              height={l.height}
              sizes="(min-width: 60em) 80vw, 100vw"
              className="lcs-shot"
              /* Feeds the page's figure height ceiling; see `.lcs-shot`. */
              style={{ '--shot-ar': String(l.width / l.height) } as React.CSSProperties}
            />
          </div>
        ))}
      </div>

      <p className="cs-cap" aria-live="polite">{layers[active].caption}</p>
    </div>
  )
}
