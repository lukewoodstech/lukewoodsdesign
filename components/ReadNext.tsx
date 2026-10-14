import { Fragment } from 'react'
import { Block, Col } from '@/components/cs/Story'
import { WORK_TILES } from './CanvasBits'

/*
 * The "Read next" cards at the foot of every study: the home canvas's own
 * tiles, in canvas order (Pitch first, newest first), minus the study you
 * just read. Hidden studies never show, so a public page never links to a
 * locked door. Three cards in a two-column grid: the first spans the row
 * (.cs-next in globals.css).
 */
export default function ReadNext({ current }: { current: string }) {
  const tiles = WORK_TILES.filter((w) => w.slug !== current)
  if (tiles.length === 0) return null

  return (
    <Col>
      <Block>
        <span className="cs-eyebrow">More work</span>
        <h2 className="cs-headline">Read next</h2>
        <div className="cs-next">
          {tiles.map((w) => (
            <Fragment key={w.slug}>{w.tile}</Fragment>
          ))}
        </div>
      </Block>
    </Col>
  )
}
