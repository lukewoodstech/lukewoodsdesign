'use client'

import Link from 'next/link'
import BeforeAfterTile from './BeforeAfterTile'

const otherTiles = [
  { label: 'Lucid AI',               href: '#' },
  { label: 'Pattern Custom Reports', href: '/work/pattern-custom-reports' },
  { label: 'Mention Landing Page',   href: '#' },
]

export default function WorkGrid() {
  return (
    <div className="workgrid">
      {/* Tile 1 — Lucid AI */}
      <div className="workgrid__item">
        <Link href="#">
          <div className="workgrid__item__content" />
          <div className="workgrid__item__title">
            <span className="workgrid__item__title-name">Lucid AI</span>
          </div>
        </Link>
      </div>

      {/* Tile 2 — Awardco before/after slider */}
      <BeforeAfterTile
        label="Awardco Login Flow Redesign"
        href="/work/awardco-login-flow-redesign"
        beforeSrc="/before.png"
        afterSrc="/after.png"
      />

      {/* Tile 3 — Pattern Custom Reports */}
      <div className="workgrid__item">
        <Link href="/work/pattern-custom-reports">
          <div className="workgrid__item__content" />
          <div className="workgrid__item__title">
            <span className="workgrid__item__title-name">Pattern Custom Reports</span>
          </div>
        </Link>
      </div>

      {/* Tile 4 — Mention Landing Page */}
      <div className="workgrid__item">
        <Link href="#">
          <div className="workgrid__item__content" />
          <div className="workgrid__item__title">
            <span className="workgrid__item__title-name">Mention Landing Page</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
