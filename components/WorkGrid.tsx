'use client'

import BeforeAfterTile from './BeforeAfterTile'
import HothTile from './HothTile'
import LucidTile from './LucidTile'
import PatternTile from './PatternTile'

export default function WorkGrid() {
  return (
    <section id="work" className="workgrid" aria-labelledby="work-heading">
      {/* The grid is all artwork; this gives the section a real place in the outline. */}
      <h2 id="work-heading" className="visually-hidden">
        Selected work
      </h2>

      {/* Tile 1 — Lucid AI */}
      <LucidTile />

      {/* Tile 2 — Awardco before/after slider */}
      <BeforeAfterTile
        slug="awardco-login-flow-redesign"
        href="/work/awardco-login-flow-redesign"
        beforeSrc="/before.png"
        afterSrc="/after.png"
        beforeAlt="Awardco's original login screen, showing every authentication method at once"
        afterAlt="The redesigned Awardco login screen, leading with single sign-on"
        logoSrc="/logos/awardco.png"
        companyHref="https://www.awardco.com"
      />

      {/* Tile 3 — Pattern Custom Reports */}
      <PatternTile />

      {/* Tile 4 — Hoth */}
      <HothTile />
    </section>
  )
}
