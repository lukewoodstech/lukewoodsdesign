'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import GateModal from './GateModal'
import TileFooter from './TileFooter'
import { unlockCaseStudy } from '@/app/work/[slug]/actions'
import { UNLOCK_HINT_COOKIE } from '@/lib/gate'
import { getCaseStudy } from '@/lib/caseStudies'
import { useEnterToOpen } from '@/lib/useEnterToOpen'

/*
 * Pitch: the nametag and the app, together. The stage is the marketing
 * site's own render of the assembled nametag (public/work/pitch/
 * nametag-front.webp, frame 1 of the usepitch.app hero sequence), pulled
 * left so the copper plate reads whole, and one phone rises from the
 * bottom right showing the rep app's feed as it runs on the simulator
 * today, on the Private look (LUK-119). Nothing is invented: the render
 * is the one the public site shows, and every pixel of UI is a real
 * screen. The phone reuses the Awardco tile's .phone chrome; only its
 * size and position are its own (.pitch-phone in globals.css).
 *
 * The study behind the tile is password-gated, like Hoth's: a click asks
 * for the password in place, and once the unlock cookie is set (readable
 * via its hint twin) the tile navigates like any other.
 */

const STAGE_LABEL =
  'The Pitch nametag, a brushed copper plate engraved with the word pitch, with a phone in front of it showing the rep app: a feed of doors from yesterday, each with its score, a play button ringed in its score colour, and one line of coaching'

export default function PitchTile() {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)

  const openStudy = () => {
    if (document.cookie.split('; ').some((c) => c.startsWith(`${UNLOCK_HINT_COOKIE}=1`))) {
      router.push('/work/pitch')
    } else {
      setGateOpen(true)
    }
  }

  useEnterToOpen(hovered && !gateOpen, openStudy)

  return (
    <div
      className="workgrid__item"
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={openStudy}
    >
      <div className="tile-stage tile-stage--pitch">
        {/* Dark overlay — behind the phone, dims the render on hover */}
        <div className="tile-scrim" style={{ opacity: hovered ? 1 : 0 }} />

        <div className="phone-trio" role="img" aria-label={STAGE_LABEL}>
          <div className="phone pitch-phone">
            <div className="phone__screen">
              <Image
                src="/work/pitch/feed-tile.png"
                alt=""
                fill
                sizes="(min-width: 48em) 14vw, 38vw"
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

      <GateModal
        open={gateOpen}
        onClose={() => setGateOpen(false)}
        slug="pitch"
        company={getCaseStudy('pitch')?.company ?? 'Pitch'}
        title={getCaseStudy('pitch')?.title ?? 'Pitch'}
        action={unlockCaseStudy}
      />
    </div>
  )
}
