'use client'

import Link from 'next/link'

const tiles = [
  { label: 'Lucid AI',                      href: '#' },
  { label: 'Awardco Login Flow Redesign',   href: '#' },
  { label: 'Pattern Custom Reports',        href: '/work/pattern-custom-reports' },
  { label: 'Mention Landing Page',          href: '#' },
]

export default function WorkGrid() {
  return (
    <div className="workgrid">
      {tiles.map((tile, i) => (
        <div key={i} className="workgrid__item">
          <Link href={tile.href}>
            <div className="workgrid__item__content" />
            <div className="workgrid__item__title">
              <span className="workgrid__item__title-name">{tile.label}</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
