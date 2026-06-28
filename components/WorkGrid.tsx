import Link from 'next/link'

type Tile = {
  name?: string
  href?: string
}

const tiles: Tile[] = [
  { name: 'lucid',   href: '#' },
  { name: 'awardco', href: '#' },
  { name: 'pattern', href: '#' },
  { name: 'mention', href: '#' },
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
              <div className="workgrid__item__content" />
              <div className="workgrid__item__title">{tile.name}</div>
            </Link>
          ) : (
            <div className="workgrid__item__content" />
          )}
        </div>
      ))}
    </div>
  )
}
