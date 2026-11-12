import Image from 'next/image'
import type { ReactNode } from 'react'
import ZoomShot from '@/components/lucid/ZoomShot'
import { Iphone, Macbook } from '@/components/cs/Devices'

/*
 * Small building blocks for section visuals that are more than one plain
 * screenshot: rows of shots, a phone at a phone's size, and a laptop with
 * its phones. Styles are the `.vs-` rules in globals.css.
 */

export type Shot = { src: string; alt: string; width: number; height: number }

/** One screenshot in a rounded frame, opening in the lightbox. */
export function Framed({ shot, sizes }: { shot: Shot; sizes?: string }) {
  return (
    <div className="vs-visual__frame">
      <ZoomShot {...shot} sizes={sizes ?? '(min-width: 65em) 1040px, 100vw'} />
    </div>
  )
}

/** Two or three shots side by side; they stack on phones. */
export function ShotRow({ shots }: { shots: Shot[] }) {
  const cls = shots.length === 3 ? 'vs-trio' : 'vs-pair'
  const sizes = shots.length === 3 ? '(min-width: 65em) 340px, 100vw' : '(min-width: 65em) 520px, 100vw'
  return (
    <div className={cls}>
      {shots.map((s) => (
        <Framed key={s.src} shot={s} sizes={sizes} />
      ))}
    </div>
  )
}

/** A phone screen in a drawn iPhone, at a phone's size. */
export function PhoneShot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="vs-phone">
      <Iphone>
        <Image src={src} alt={alt} fill sizes="300px" />
      </Iphone>
    </div>
  )
}

/** A laptop and its phones together, for final designs. */
export function DeviceSet({
  laptop,
  phones = [],
  laptops,
}: {
  laptop?: ReactNode
  phones?: { src: string; alt: string }[]
  /** Two laptops side by side instead of a laptop and phones. */
  laptops?: ReactNode[]
}) {
  if (laptops) {
    return (
      <div className="vs-devices vs-devices--two">
        {laptops.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    )
  }
  return (
    <div className="vs-devices">
      <div>{laptop}</div>
      <div className="vs-phones">
        {phones.map((p) => (
          <Iphone key={p.src}>
            <Image src={p.src} alt={p.alt} fill sizes="(min-width: 65em) 160px, 40vw" />
          </Iphone>
        ))}
      </div>
    </div>
  )
}

export { Macbook }
