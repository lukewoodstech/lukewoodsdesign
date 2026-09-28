'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'

type Base = { label: string; caption: string }
type ImageLayer = Base & {
  src: string
  alt: string
  width: number
  height: number
}
type NodeLayer = Base & { node: ReactNode }
type Layer = ImageLayer | NodeLayer

/*
 * Layered crossfade with a segmented toggle. Serves the before/after moment
 * (old search vs the shipped panel), the side panel to full page expand
 * state, and the cut concept vs what shipped — the same primitive, different
 * copy. A layer is either a capture (src) or a coded mock (node), so a real
 * screenshot can sit on one side of the toggle and the site's own rebuild of
 * the design on the other. Buttons are real buttons, aria-pressed carries
 * state, and every layer stays in the DOM so the fade is a pure opacity
 * swap with no layout shift (the stage keeps the visible layer's height via
 * that layer being position-static).
 */
export default function CompareStage({
  layers,
  ariaLabel,
}: {
  layers: Layer[]
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
            key={l.label}
            className={`lcs-stage__layer ${active === i ? '' : 'lcs-stage__layer--hidden'}`}
            aria-hidden={active !== i}
          >
            {'node' in l ? (
              <div className="lcs-stage__mock">{l.node}</div>
            ) : (
              <Image
                src={l.src}
                alt={l.alt}
                width={l.width}
                height={l.height}
                sizes="(min-width: 60em) 80vw, 100vw"
                className="lcs-shot"
                /* Feeds the page's figure height ceiling; see `.lcs-shot`. */
                style={
                  {
                    '--shot-ar': String(l.width / l.height),
                  } as React.CSSProperties
                }
              />
            )}
          </div>
        ))}
      </div>

      <p className="cs-cap" aria-live="polite">
        {layers[active].caption}
      </p>
    </div>
  )
}
