'use client'

import { useState } from 'react'
import Image from 'next/image'
import TileFooter from './TileFooter'
import { useEnterToOpen } from '@/lib/useEnterToOpen'

/*
 * Pitch: the app, alone. One phone, large and centred, rises from the
 * bottom edge showing the rep app's feed as it runs on the simulator, on
 * the redesigned Private look (LUK-119). The ground is the app's own pale
 * page wash. Until 2026-11-03 a print of the nametag sat behind the
 * phone; it left with the nametag (LUK-194) when the study became the
 * app work Luke did on contract (LUK-195). Every pixel of UI is a real
 * screen. The phone reuses the Awardco tile's .phone chrome; its size and
 * position are its own (.pitch-phone in globals.css).
 *
 * The card is a plain link, the title's stretched link in TileFooter.
 */

const STAGE_LABEL =
  'A phone showing the Pitch rep app: a feed of doors from yesterday, each with its score, a play button ringed in its score colour, and one line of coaching.'

export default function PitchTile() {
  const [hovered, setHovered] = useState(false)

  useEnterToOpen(hovered, '/work/pitch')

  return (
    <div
      className="workgrid__item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="tile-stage tile-stage--pitch">
        {/* Dark overlay — behind the phone, dims the render on hover */}
        <div className="tile-scrim" style={{ opacity: hovered ? 1 : 0 }} />

        <div className="phone-trio" role="img" aria-label={STAGE_LABEL}>
          <div className="phone pitch-phone">
            <div className="phone__screen">
              <Image
                src="/work/pitch/screen-feed.png"
                alt=""
                fill
                sizes="(min-width: 48em) 16vw, 40vw"
              />
            </div>
          </div>
        </div>
      </div>

      <TileFooter
        slug="pitch"
        logoSrc="/logos/pitch.png"
        companyHref="https://usepitch.app"
        hovered={hovered}
      />

    </div>
  )
}
