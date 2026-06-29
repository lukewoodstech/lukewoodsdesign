'use client'

import Link from 'next/link'

type Tile = {
  name?: string
  href?: string
  meta?: string
  visual?: React.ReactNode
}

const PatternVisual = () => (
  <img className="tile-img" src="/pattern-2.png" alt="" draggable={false} />
)

const tiles: Tile[] = [
  { name: 'Pattern: Custom Reports', href: '#', visual: <PatternVisual /> },
  { name: 'Lucid',   href: '#' },
  { name: 'Awardco', href: '#' },
  { name: 'Mention', href: '#' },
  {},
  {},
  {},
  {},
]

export default function WorkGrid() {
  return (
    <div className="workgrid">
      {tiles.map((tile, i) => (
        <div key={i} className="workgrid__item">
          {tile.href ? (
            <Link href={tile.href}>
              <div className="workgrid__item__content">
                {tile.visual}
              </div>
              <div className="workgrid__item__title">
                <div className="workgrid__item__title-inner">
                  <span className="workgrid__item__title-name">{tile.name}</span>
                  {tile.meta && <span className="workgrid__item__title-meta">{tile.meta}</span>}
                </div>
              </div>
            </Link>
          ) : (
            <div className="workgrid__item__content" />
          )}
        </div>
      ))}
    </div>
  )
}
