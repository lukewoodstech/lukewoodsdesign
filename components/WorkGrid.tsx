'use client'

import BeforeAfterTile from './BeforeAfterTile'
import HothTile from './HothTile'
import LucidTile from './LucidTile'
import PatternTile from './PatternTile'

export default function WorkGrid() {
  return (
    <div className="workgrid">
      {/* Tile 1 — Lucid AI */}
      <LucidTile />

      {/* Tile 2 — Awardco before/after slider */}
      <BeforeAfterTile
        label="Awardco Login Flow Redesign"
        href="/work/awardco-login-flow-redesign"
        beforeSrc="/before.png"
        afterSrc="/after.png"
      />

      {/* Tile 3 — Pattern Custom Reports */}
      <PatternTile />

      {/* Tile 4 — Hoth */}
      <HothTile />
    </div>
  )
}
