import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import BeforeAfterHero from '@/components/BeforeAfterHero'
import CaseStudyGate from '@/components/CaseStudyGate'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import ZoomShot from '@/components/lucid/ZoomShot'
import ScreenCarousel from '@/components/ScreenCarousel'
import { Bullets } from '@/components/CaseStudy'
import { Act, Band, Block, Checklist, Col, H3, MetaGrid, StoryTitle, type Fact } from '@/components/cs/Story'
import {
  getCaseStudy,
  caseStudies,
  real,
  isPlaceholder,
  BESPOKE_SLUGS,
} from '@/lib/caseStudies'
import type { Figure } from '@/lib/caseStudies'
import { PROTECTED_SLUGS, UNLOCK_COOKIE } from '@/lib/gate'
import { SITE } from '@/lib/site'
import { unlockCaseStudy } from './actions'

export function generateStaticParams() {
  // Protected slugs render dynamically: their page reads the unlock cookie,
  // a request-time API.
  return caseStudies
    .filter((cs) => !BESPOKE_SLUGS.has(cs.slug) && !PROTECTED_SLUGS.has(cs.slug))
    .map((cs) => ({ slug: cs.slug }))
}

// "Hoth Landing Page · Hoth" doubles the company — skip the suffix when the
// title already names it.
function pageTitle(title: string, company: string) {
  return title.toLowerCase().includes(company.toLowerCase())
    ? title
    : `${title} · ${company}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) return {}

  // Unwritten studies fall back to the site blurb rather than shipping
  // "[One-sentence tagline: …]". Gated studies fall back to it too: the
  // page serves a lock screen, and a link preview that quotes the tagline
  // would be the one place the locked copy leaks (Linear's unfurl of
  // /work/pitch showed exactly that).
  const description = PROTECTED_SLUGS.has(cs.slug)
    ? SITE.description
    : (real(cs.tagline) ?? real(cs.summary) ?? SITE.description)
  const title = pageTitle(cs.title, cs.company)

  return {
    title,
    description,
    alternates: { canonical: `/work/${cs.slug}` },
    openGraph: {
      type: 'article',
      title: `${title} · ${SITE.name}`,
      description,
      url: `/work/${cs.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · ${SITE.name}`,
      description,
    },
  }
}

/*
 * Figures from the data file: expandable screenshot when a real capture
 * exists, nothing at all while the caption is still scaffolding. (The old
 * template rendered grey placeholder boxes with bracketed captions.)
 */
const Fig = ({ caption, src }: Figure) => {
  if (!src || isPlaceholder(caption)) return null
  return (
    <figure className="my-12">
      {/* alt is empty by design — the figcaption below already carries this
          text, and duplicating it makes screen readers announce it twice. */}
      <ZoomShot src={src} alt="" width={1600} height={1000} sizes="(min-width: 860px) 860px, 100vw" />
      <figcaption className="cs-cap">{caption}</figcaption>
    </figure>
  )
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()

  const prev = caseStudies.find((c) => c.nextSlug === cs.slug)
  const next = cs.nextSlug ? getCaseStudy(cs.nextSlug) : undefined
  const accentStyle = { '--accent': cs.accent } as React.CSSProperties

  /*
   * Protected studies ship the gate, not the article, until the unlock
   * cookie is present — the content never reaches the browser. cookies()
   * is only touched on protected slugs so the public studies stay static.
   */
  if (PROTECTED_SLUGS.has(cs.slug)) {
    const store = await cookies()
    if (store.get(UNLOCK_COOKIE)?.value !== '1') {
      return (
        <div className="cs min-h-screen bg-black text-white" style={accentStyle}>
          <SiteNav
            next={next && { href: `/work/${next.slug}`, title: next.title }}
          />
          <div className="max-w-[860px] mx-auto px-8 pb-32 sitenav-offset">
            <CaseStudyGate
              slug={cs.slug}
              company={cs.company}
              title={cs.title}
              action={unlockCaseStudy}
            />
          </div>
          <Footer width="article" />
        </div>
      )
    }
  }

  /*
   * The article runs on the story primitives the three bespoke studies
   * use (components/cs/Story), so a data-driven study reads as the same
   * object as a hand-built one: serif title, summary beside a facts grid,
   * the hero on the accent band, then acts. Before 2026-10-14 this
   * template had its own plainer header (sans title, a fact strip), and
   * Luke asked for the Pitch page to look like the others.
   *
   * The narrative fields are optional: a study with a bespoke page carries
   * none of them, and an unwritten one has none yet. Every section below
   * is conditional on having something to show, so absent and
   * still-placeholder collapse to the same empty list.
   */
  const problemPoints = (cs.problemPoints ?? []).filter((p) => !isPlaceholder(p))
  const processSteps = (cs.process ?? []).filter((s) => !isPlaceholder(s.heading))
  const outcomes = (cs.outcomes ?? []).filter((o) => !isPlaceholder(o))
  const headline = (cs.headline ?? []).filter((h) => !isPlaceholder(h))
  const eyebrows = cs.eyebrows ?? {}

  const facts: Fact[] = []
  if (real(cs.role)) facts.push({ label: 'Role', value: cs.role })
  if (real(cs.team)) facts.push({ label: 'Team', value: cs.team })
  if (!cs.hideTimeline && real(cs.period)) facts.push({ label: 'Timeline', value: cs.period })
  if (real(cs.tools)) facts.push({ label: 'Tools', value: cs.tools })
  if (cs.site) {
    facts.push({
      label: 'Live at',
      value: (
        <a href={cs.site.href} className="cs-meta__link" target="_blank" rel="noopener noreferrer">
          {cs.site.label}
        </a>
      ),
    })
  }
  if (headline.length > 0) {
    facts.push({
      label: eyebrows.impact ?? 'Impact',
      value: (
        <ul className="cs-meta__list">
          {headline.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      ),
      span: true,
    })
  }
  if (real(cs.skills)) facts.push({ label: 'Skills used', value: cs.skills, span: true })

  const summary = [real(cs.tagline), real(cs.overview)].filter(Boolean) as string[]

  /* Acts count from 01 in page order; an absent section does not take a number. */
  let act = 0
  const num = () => String(++act).padStart(2, '0')

  return (
    <div className="cs cs-surface cs-story min-h-screen text-white" style={accentStyle}>

      <SiteNav
        next={next && { href: `/work/${next.slug}`, title: next.title }}
      />

      <main id="main" className="sitenav-offset pb-24">

        {/* ══ Title block ══ */}
        <Col>
          <header className="pt-10">
            <p className="cs-eyebrow mb-5">
              {cs.company}
              {real(cs.role) && <> · {cs.role}</>}
            </p>
            <StoryTitle>{cs.title}</StoryTitle>
            {(summary.length > 0 || facts.length > 0) && (
              <MetaGrid
                summary={summary.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
                facts={facts}
              />
            )}
          </header>
        </Col>

        {/* ══ Hero band: the study's one picture, on its colour ══ */}
        {cs.slug === 'awardco-login-flow-redesign' ? (
          <Band tone="accent">
            <Col wide>
              <BeforeAfterHero
                beforeSrc="/before.png"
                afterSrc="/after.png"
                beforeAlt="Awardco's original login screen, showing every authentication method at once"
                afterAlt="The redesigned Awardco login screen, leading with single sign-on"
                aspect={2016 / 1270}
              />
              <p className="cs-cap cs-cap--mono mt-5 text-center">
                Drag across the frame: the old login on the left, the shipped redesign on the right.
              </p>
            </Col>
          </Band>
        ) : cs.heroSrc ? (
          <Band tone="accent">
            <Col wide>
              <figure className="m-0">
                <Image
                  src={cs.heroSrc}
                  alt=""
                  width={1600}
                  height={1000}
                  priority
                  sizes="(min-width: 1200px) 1100px, 100vw"
                  className="w-full h-auto rounded-xl cs-hero-still"
                />
                <figcaption className="cs-cap cs-cap--mono mt-5 text-center">
                  {cs.heroCaption ?? 'Final design overview'}
                </figcaption>
              </figure>
            </Col>
          </Band>
        ) : null}

        {/* ══ The problem ══ */}
        {(real(cs.problemIntro) || problemPoints.length > 0) && (
          <Col>
            <Act phase="The problem" num={num()} title={eyebrows.problem ?? 'Problem'}>
              {real(cs.problemIntro) && (
                <div className="cs-prose">
                  <p>{cs.problemIntro}</p>
                </div>
              )}
              {problemPoints.length > 0 && <Bullets items={problemPoints} />}
            </Act>
            {cs.problemFigure && <Fig {...cs.problemFigure} />}
          </Col>
        )}

        {/* ══ The work, beat by beat ══ */}
        {processSteps.length > 0 && (
          <Col>
            <Act phase="The work" num={num()} title={eyebrows.process ?? 'Process'} />
            {processSteps.map((step) => (
              <Block key={step.heading}>
                <H3>{step.heading}</H3>
                <div className="cs-prose">
                  <p>{step.body}</p>
                </div>
                {/* A beat that is a thing to look at carries its picture
                    with it, instead of all the figures piling up after
                    the last step. */}
                {step.figure && <Fig {...step.figure} />}
                {step.screens && step.screens.length > 0 && (
                  <ScreenCarousel screens={step.screens} />
                )}
              </Block>
            ))}
            {cs.processFigures?.map((fig, i) => (
              <Fig key={i} {...fig} />
            ))}
          </Col>
        )}

        {/* ══ Where it landed ══ */}
        {outcomes.length > 0 && (
          <Col>
            <Act phase="Today" num={num()} title={eyebrows.outcome ?? 'Outcome'}>
              <Checklist items={outcomes} />
            </Act>
          </Col>
        )}

        {/*
          Prev/next moved down from the top nav — a reader wants the next
          project after finishing this one, not before starting it.
        */}
        {(prev || next) && (
          <Col>
            <nav className="worknav mt-24 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4" aria-label="More work">
              {prev ? (
                <Link href={`/work/${prev.slug}`} className="footer-link -ml-4">
                  ← {prev.title}
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={`/work/${next.slug}`} className="footer-link -mr-4 ml-auto text-right">
                  {next.title} →
                </Link>
              )}
            </nav>
          </Col>
        )}

      </main>

      <Footer width="article" />

    </div>
  )
}
