import Image from 'next/image'
import { Iphone, Macbook } from '@/components/awardco/Devices'

/*
 * The Awardco hero: the finished sign-in, mobile first.
 *
 * A phone stands to the left of the laptop rather than inside it, because
 * the mobile redesign is half the story (SMS verification, provider-named
 * sign-in) and a phone tucked into a corner reads as decoration.
 *
 * Static, and Awardco's own branding only. It cycled three customer brands
 * for a while, which buried the point: the hero's job is to show the
 * finished thing clearly. The brand-colour range is its own argument and
 * now has its own section further down the study.
 */

export type HeroShot = { src: string; alt: string }

export default function FinalHero({
  phone,
  desktop,
  ratio,
  caption,
}: {
  phone: HeroShot
  desktop: HeroShot
  /** Desktop screen aspect ratio, width / height. Defaults to a real 16:10. */
  ratio?: number
  caption: string
}) {
  return (
    <figure className="acs-hero">
      <div className="acs-hero__stage">
        <div className="acs-hero__phone">
          <Iphone>
            <Image
              src={phone.src}
              alt={phone.alt}
              fill
              priority
              sizes="(min-width: 60em) 260px, 38vw"
            />
          </Iphone>
        </div>

        <div className="acs-hero__desk">
          <Macbook ratio={ratio}>
            <Image
              src={desktop.src}
              alt={desktop.alt}
              fill
              priority
              sizes="(min-width: 60em) 62vw, 100vw"
            />
          </Macbook>
        </div>
      </div>

      <figcaption className="cs-cap cs-cap--mono acs-hero__cap">{caption}</figcaption>
    </figure>
  )
}
