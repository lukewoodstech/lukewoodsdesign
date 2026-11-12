import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Image from 'next/image'
import CaseStudyGate from '@/components/CaseStudyGate'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import ReadNext from '@/components/ReadNext'
import BigStats from '@/components/cs/BigStats'
import Sections from '@/components/sections/Sections'
import { Band, Block, Col, MetaGrid, Pill, StoryTitle } from '@/components/cs/Story'
import { getCaseStudy } from '@/lib/caseStudies'
import { PROTECTED_SLUGS, unlockCookieFor } from '@/lib/gate'
import { pitch } from '@/lib/sections/pitch'
import { generateMetadata as caseStudyMetadata } from '../[slug]/page'
import { unlockCaseStudy } from '../[slug]/actions'

/*
 * The password-gated Pitch study (LUK-200), on the visual-first section
 * system (Luke, 2026-11-11). Reading cookies() here opts just this page
 * into dynamic rendering, as the earlier shadow route did. The gate is the
 * same markup and action as the [slug] template's, so a locked visitor
 * sees exactly what they saw before and the article never reaches them.
 *
 * Hero copy and sections are Luke's; images, alt text, the recording and
 * the stack list are reused from lib/caseStudies.ts. No pilot customer
 * names or pilot figures.
 */

const params = Promise.resolve({ slug: 'pitch' })

export function generateMetadata(): Promise<Metadata> {
  return caseStudyMetadata({ params })
}

const SUMMARY =
  "Pitch is an AI sales coach for reps who sell face to face. A rep taps record at the start of a shift, and Pitch turns the day into scored conversations and coaching on what to say next time. I joined the two founders on contract to design and build it: a new brand, the rep app redesigned screen by screen, and recording rebuilt around one button. It's live with a pilot team."

export default async function PitchPage() {
  const cs = getCaseStudy('pitch')!
  const next = cs.nextSlug ? getCaseStudy(cs.nextSlug) : undefined
  const accentStyle = { '--accent': pitch.accent } as React.CSSProperties

  if (PROTECTED_SLUGS.has(cs.slug)) {
    const store = await cookies()
    const unlocked = store.get(unlockCookieFor(cs.slug))?.value === '1'
    if (!unlocked) {
      return (
        <div className="cs min-h-screen bg-black text-white" style={{ '--accent': cs.accent } as React.CSSProperties}>
          <SiteNav next={next && { href: `/work/${next.slug}`, title: next.title }} />
          <div className="max-w-[860px] mx-auto px-8 pb-32 sitenav-offset">
            <CaseStudyGate slug={cs.slug} company={cs.company} title={cs.title} action={unlockCaseStudy} />
          </div>
          <Footer width="article" />
        </div>
      )
    }
  }

  return (
    <div className="cs cs-surface cs-story min-h-screen text-white" style={accentStyle}>
      <SiteNav next={next && { href: `/work/${next.slug}`, title: next.title }} />

      <main id="main" className="sitenav-offset pb-24">
        {/* ══ Hero ══ */}
        <Col>
          <header className="pt-10">
            <StoryTitle>Building Pitch</StoryTitle>
            <MetaGrid
              stacked
              summary={<p>{SUMMARY}</p>}
              facts={[
                { label: 'Company', value: 'Pitch, an early-stage sales coaching startup', span: true },
                { label: 'Role', value: 'Contract designer and engineer' },
                { label: 'Timeline', value: 'Sep 2026 to present' },
                { label: 'Team', value: 'two founders' },
              ]}
            />
          </header>
        </Col>

        {/* The new feed on the app's own pale cornflower ground */}
        <Band tone="accent" className="cs-band--ground" style={{ background: cs.heroGround }}>
          <Col wide>
            <figure className="m-0">
              <Image
                src="/work/pitch/hero-feed.png"
                alt="The redesigned Pitch feed on a phone: the day as a serif heading with its average, and each door as a white card with a score ring around its play button and one line of coaching"
                width={3840}
                height={1900}
                priority
                sizes="(min-width: 1200px) 1100px, 100vw"
                className="w-full h-auto cs-hero-melt"
              />
              <figcaption className="cs-cap cs-cap--mono mt-5 text-center">
                Every door scored, with its clip and one line of coaching.
              </figcaption>
            </figure>
          </Col>
        </Band>

        {/* ══ At a glance ══ */}
        <Col wide>
          <Block className="cs-centered">
            <Pill>The project at a glance</Pill>
            <BigStats
              small
              stats={(cs.glance ?? []).map((g) => ({
                value: g.value,
                suffix: g.suffix,
                caption: (
                  <>
                    <strong>{g.lead}</strong>
                    {g.rest && <> {g.rest}</>}
                  </>
                ),
              }))}
            />
          </Block>
        </Col>

        <Sections sections={pitch.sections} />

        <ReadNext current="pitch" />
      </main>

      <Footer width="article" />
    </div>
  )
}
