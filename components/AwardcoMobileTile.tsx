'use client'

import { useState } from 'react'
import Image from 'next/image'
import TileFooter from './TileFooter'
import { useEnterToOpen } from '@/lib/useEnterToOpen'

/*
 * The Awardco card's artwork: three real mobile screens from the design
 * file (public/work/awardco/figma), framed as phones rising from the bottom
 * edge of the stage. Sign-in is the primary screen in front; the
 * verification chooser and the expired-password reset stand behind it, a
 * little smaller and lower. The frames are the thinnest bezel that still
 * reads as a phone — the UI is the subject, not the hardware — and the
 * stage's overflow crops the empty lower third of each screenshot so the
 * flows read at card size. Nothing here is invented: every pixel of UI is
 * one of the shipped-design captures the case study itself shows.
 *
 * This replaced the before/after laptop slider, which was too small to read
 * at rest and needed a cursor to work at all.
 *
 * The stage behind them is Awardco blue (#256CFA, their mark's own colour)
 * rather than the neutral grey — see .tile-stage--awardco. The phones
 * already rose from the bottom edge, so the colour was the only change.
 */

const HREF = '/work/awardco-login-flow-redesign'
const IMG = '/work/awardco/figma'

const SCREENS = [
  { key: 'verify', pos: 'left', src: `${IMG}/sms-mobile.png` },
  { key: 'signin', pos: 'center', src: `${IMG}/new-mobile.png` },
  { key: 'reset', pos: 'right', src: `${IMG}/new-reset-mobile.png` },
] as const

/* The composition is one picture, described once. */
const LABEL =
  'Three screens from the redesigned Awardco mobile login: the sign-in page with a Sign in with Google button and a single email field, the verification chooser offering a one-time code by email, secondary email, or text message, and the expired-password reset form'

/* The primary phone is ~16vw on the canvas and ~45vw in the mobile stack. */
const SIZES = '(min-width: 48em) 16vw, 45vw'

export default function AwardcoMobileTile() {
  const [hovered, setHovered] = useState(false)

  useEnterToOpen(hovered, HREF)

  return (
    <div
      className="workgrid__item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="tile-stage tile-stage--awardco">
        {/* Dark overlay — behind the phones, darkens the blue on hover */}
        <div className="tile-scrim" style={{ opacity: hovered ? 1 : 0 }} />

        <div className="phone-trio" role="img" aria-label={LABEL}>
          {SCREENS.map((s) => (
            <div key={s.key} className={`phone phone--${s.pos}`}>
              <div className="phone__screen">
                <Image src={s.src} alt="" fill sizes={SIZES} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <TileFooter
        slug="awardco-login-flow-redesign"
        logoSrc="/logos/awardco.png"
        companyHref="https://www.awardco.com"
        hovered={hovered}
      />
    </div>
  )
}
