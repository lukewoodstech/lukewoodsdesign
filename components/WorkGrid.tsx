'use client'

import Link from 'next/link'

const tiles = [
  { label: 'Box 1', href: '#' },
  { label: 'Box 2', href: '#' },
  { label: 'Box 3', href: '#' },
  { label: 'Box 4', href: '#' },
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
