import ZoomShot from '@/components/lucid/ZoomShot'

/*
 * How Awardco login is put together: two separate login pages and then the
 * app. Most readers have never seen a product with a "universal" login in
 * front of a per-company one, and the token idea only makes sense once you
 * see they are two different pages that didn't share what they knew.
 *
 * The connector between the first two layers carries the token label, the
 * same device FlowStrip uses, so the two figures read as one idea.
 */

type Layer = {
  kicker: string
  title: string
  asks: string
  body: string
  src: string
  alt: string
  width: number
  height: number
  carry?: string
}

export default function LoginLayers({ layers }: { layers: Layer[] }) {
  return (
    <ol className="acs-layers" aria-label="How Awardco sign-in fits together">
      {layers.map((l, i) => (
        <li className="acs-layers__item" key={l.title}>
          <p className="acs-layers__kicker">
            <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span> {l.kicker}
          </p>
          <h4 className="acs-layers__title">{l.title}</h4>
          <p className="acs-layers__asks">{l.asks}</p>
          <div className="acs-layers__shot">
            <ZoomShot
              src={l.src}
              alt={l.alt}
              width={l.width}
              height={l.height}
              sizes="(min-width: 60em) 26vw, 90vw"
            />
          </div>
          <p className="acs-layers__body">{l.body}</p>
          {i < layers.length - 1 && (
            <span
              className={`acs-layers__link${l.carry ? ' acs-layers__link--carry' : ''}`}
              aria-hidden="true"
            >
              {l.carry && <span className="acs-layers__carry">{l.carry}</span>}
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}
