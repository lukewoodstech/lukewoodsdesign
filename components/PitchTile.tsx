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
 * Pitch: the app first, the nametag beside it. One phone, large and a
 * little right of centre, rises from the bottom edge showing the rep
 * app's feed as it runs on the simulator today, on the Private look
 * (LUK-119). Behind its left shoulder sits the nametag as a print: the
 * marketing site's render of the assembled plate (public/work/pitch/
 * nametag-plate.png, cropped from frame 1 of the usepitch.app hero
 * sequence), tilted a few degrees. The ground is the app's own pale
 * page wash, so the phone reads as the subject and the copper plate as
 * the supporting piece (Luke, 2026-10-14: "make the mobile app the main
 * character of the tile, and the mic a supporting piece next to it").
 * Nothing is invented: the render is the one the public site shows, and
 * every pixel of UI is a real screen. The phone reuses the Awardco
 * tile's .phone chrome; its size and position are its own (.pitch-phone
 * in globals.css), and the print is .pitch-plate.
 *
 * The study behind the tile is password-gated, like Hoth's: a click asks
 * for the password in place, and once the unlock cookie is set (readable
 * via its hint twin) the tile navigates like any other.
 */

const STAGE_LABEL =
  'A phone showing the Pitch rep app: a feed of doors from yesterday, each with its score, a play button ringed in its score colour, and one line of coaching. Behind it, a print of the Pitch nametag, a brushed copper plate engraved with the word pitch'

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
          <div className="pitch-plate">
            <Image
              src="/work/pitch/nametag-plate.png"
              alt=""
              fill
              sizes="(min-width: 48em) 20vw, 50vw"
            />
          </div>
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
