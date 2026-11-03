import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import BeforeAfterHero from '@/components/BeforeAfterHero'
import CaseStudyGate from '@/components/CaseStudyGate'
import Footer from '@/components/Footer'
import ReadNext from '@/components/ReadNext'
import SiteNav from '@/components/SiteNav'
import ZoomShot from '@/components/lucid/ZoomShot'
import ScreenCarousel from '@/components/ScreenCarousel'
import StageRail from '@/components/cs/StageRail'
import VideoPlayer from '@/components/cs/VideoPlayer'
import { Bullets } from '@/components/CaseStudy'
import BigStats from '@/components/cs/BigStats'
import { Act, Band, Block, Checklist, Col, H3, MetaGrid, MonoLabel, Pill, StoryTitle, type Fact } from '@/components/cs/Story'
import {
  getCaseStudy,
  caseStudies,
  real,
  isPlaceholder,
  BESPOKE_SLUGS,
} from '@/lib/caseStudies'
import type { Figure, ProcessStep } from '@/lib/caseStudies'
import { PROTECTED_SLUGS, UNLOCK_COOKIE, unlockCookieFor } from '@/lib/gate'
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
const Fig = ({ caption, src, href, video }: Figure) => {
  if (!src || isPlaceholder(caption)) return null
  /* A recording plays muted on a loop, like a still that moves; the still
     is its poster, so the frame never sits empty while it loads. */
  if (video) {
    /* A recording you can drive: play, pause, scrub, full screen
       (VideoPlayer). Clicks belong to the player, so the outbound link
       moves into the caption. */
    return (
      <figure className="my-12">
        <VideoPlayer src={video} poster={src} label={caption} />
        <figcaption className="cs-cap">
          {caption}
          {href && (
            <>
              {' · '}
              <a href={href} className="cs-cap__link" target="_blank" rel="noopener noreferrer">
                Open {href.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
              </a>
            </>
          )}
        </figcaption>
      </figure>
    )
  }
  return (
    <figure className="my-12">
      {/* alt is empty by design — the figcaption below already carries this
          text, and duplicating it makes screen readers announce it twice. */}
      {href ? (
        /* A door, not a picture: the same frame and hover hint as the
           lightbox trigger, but the click goes to the live thing. */
        <a className="lcs-zoom" href={href} target="_blank" rel="noopener noreferrer">
          <Image src={src} alt="" width={1600} height={1000} sizes="(min-width: 860px) 860px, 100vw" className="lcs-shot" />
          <span className="lcs-zoom__hint" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M3 1h8v8M11 1 1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Open {href.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </span>
        </a>
      ) : (
        <ZoomShot src={src} alt="" width={1600} height={1000} sizes="(min-width: 860px) 860px, 100vw" />
      )}
      <figcaption className="cs-cap">{caption}</figcaption>
    </figure>
  )
}

/*
 * Everything a beat shows under its text, in reading order: Before over
 * After, a side-by-side pair, a row of phones, a flat gallery, a figure.
 * Shared by the process beats and the stage layout (LUK-203).
 */
function StepMedia({ step }: { step: ProcessStep }) {
  return (
    <>
      {/* A beat that is a thing to look at carries its picture
          with it, instead of all the figures piling up after
          the last step. */}
      {/* Old and new, side by side (Luke, 2026-11-03: no drag
          split). Each half keeps its own label under it. */}
      {/* Before, then after: the old flow's phones over the new
          ones, each row named (LUK-202). */}
      {step.before && step.before.length > 0 && (
        <>
          <p className="cs-row-label">Before</p>
          <ScreenCarousel screens={step.before} />
          {step.screens && step.screens.length > 0 && <p className="cs-row-label">After</p>}
        </>
      )}
      {step.compare && (
        <figure className={`cs-pair my-12${step.compare.phone ? ' cs-pair--phone' : ''}`}>
          <div className="cs-pair__row">
            {[
              { src: step.compare.beforeSrc, alt: step.compare.beforeAlt, label: 'Before' },
              { src: step.compare.afterSrc, alt: step.compare.afterAlt, label: 'After' },
            ].map((half) => (
              <div key={half.label} className="cs-pair__item">
                <div className={step.compare!.phone ? 'cs-screens__phone' : 'cs-pair__frame'}>
                  <Image
                    src={half.src}
                    alt={half.alt}
                    width={1000}
                    height={Math.round(1000 / step.compare!.aspect)}
                    sizes="(min-width: 860px) 420px, 50vw"
                  />
                </div>
                <span className="cs-screens__name">{half.label}</span>
              </div>
            ))}
          </div>
          <figcaption className="cs-cap">{step.compare.caption}</figcaption>
        </figure>
      )}
      {step.screens && step.screens.length > 0 && (
        <ScreenCarousel screens={step.screens} />
      )}
      {step.gallery && step.gallery.items.length > 0 && (
        <figure className="cs-gallery my-10">
          <div className="cs-gallery__row">
            {step.gallery.items.map((g) => (
              <div
                key={g.src}
                className="cs-gallery__item"
                style={{ flex: `${g.width / g.height} 1 0` }}
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  width={g.width}
                  height={g.height}
                  sizes="(min-width: 860px) 560px, 90vw"
                  className="cs-gallery__img"
                />
                <span className="cs-screens__name">{g.label}</span>
              </div>
            ))}
          </div>
          {step.gallery.caption && <figcaption className="cs-cap">{step.gallery.caption}</figcaption>}
        </figure>
      )}
      {step.figure && <Fig {...step.figure} />}
    </>
  )
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()

  const next = cs.nextSlug ? getCaseStudy(cs.nextSlug) : undefined
  const accentStyle = { '--accent': cs.accent } as React.CSSProperties

  /*
   * Protected studies ship the gate, not the article, until the unlock
   * cookie is present — the content never reaches the browser. cookies()
   * is only touched on protected slugs so the public studies stay static.
   */
  if (PROTECTED_SLUGS.has(cs.slug)) {
    const store = await cookies()
    const unlocked =
      store.get(unlockCookieFor(cs.slug))?.value === '1' ||
      // Hoth's visitors from before the per-study split (LUK-200).
      (cs.slug === 'hoth' && store.get(UNLOCK_COOKIE)?.value === '1')
    if (!unlocked) {
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
                stacked={cs.metaStacked}
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
          <Band
            tone="accent"
            className={cs.heroGround ? 'cs-band--ground' : undefined}
            style={cs.heroGround ? { background: cs.heroGround } : undefined}
          >
            <Col wide>
              <figure className="m-0">
                <Image
                  src={cs.heroSrc}
                  alt=""
                  width={cs.heroSize?.width ?? 1600}
                  height={cs.heroSize?.height ?? 1000}
                  priority
                  sizes="(min-width: 1200px) 1100px, 100vw"
                  className={cs.heroGround ? 'w-full h-auto cs-hero-melt' : 'w-full h-auto rounded-xl cs-hero-still'}
                />
                <figcaption className="cs-cap cs-cap--mono mt-5 text-center">
                  {cs.heroCaption ?? 'Final design overview'}
                </figcaption>
              </figure>
            </Col>
          </Band>
        ) : null}

        {/* ══ At a glance ══ */}
        {cs.glance && cs.glance.length > 0 && (
          <Col wide>
            <Block className="cs-centered">
              <Pill>The project at a glance</Pill>
              <BigStats
                small
                stats={cs.glance.map((g) => ({
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
        )}

        {cs.stages && cs.stages.length > 0 ? (
          <>
            <StageRail stages={cs.stages.map((st) => ({ id: st.id, label: st.label }))} />
            {cs.stages.map((st) => (
              <Col key={st.id}>
                <section id={st.id} className="cs-stage" aria-labelledby={`${st.id}-title`}>
                  {/* Heading and body, nothing else (Luke, 2026-11-03). */}
                  <h2 id={`${st.id}-title`} className="cs-stage__title">{st.title}</h2>
                  {st.body && (
                    <div className="cs-prose">
                      {st.body.split('\n\n').map((para) => (
                        <p key={para.slice(0, 24)}>{para}</p>
                      ))}
                    </div>
                  )}
                  {st.points && st.points.length > 0 && <Bullets items={st.points} />}
                  {(st.steps ?? []).map((step, i) => (
                    <Block key={step.heading ?? `${st.id}-${i}`}>
                      {step.heading && <H3>{step.heading}</H3>}
                      {step.body && (
                        <div className="cs-prose">
                          <p>{step.body}</p>
                        </div>
                      )}
                      <StepMedia step={step} />
                    </Block>
                  ))}
                  {st.showOutcomes && outcomes.length > 0 && <Checklist items={outcomes} />}
                  {st.showStack && cs.stack && cs.stack.length > 0 && (
                    <div className="cs-stack cs-stack--compact">
                      {cs.stack.map((group) => (
                        <section key={group.label} className="cs-stack__group" aria-label={group.label}>
                          <MonoLabel>{group.label}</MonoLabel>
                          <dl className="cs-stack__list">
                            {group.items.map((it) => (
                              <div key={it.name}>
                                <dt>{it.name}</dt>
                                <dd>{it.use}</dd>
                              </div>
                            ))}
                          </dl>
                        </section>
                      ))}
                    </div>
                  )}
                </section>
              </Col>
            ))}
          </>
        ) : (
          <>
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
                <StepMedia step={step} />
              </Block>
            ))}
            {cs.processFigures?.map((fig, i) => (
              <Fig key={i} {...fig} />
            ))}
          </Col>
        )}

        {/* ══ The stack: what it was built on, layer by layer ══ */}
        {cs.stack && cs.stack.length > 0 && (
          <Col>
            <Act phase="The stack" num={num()} title={eyebrows.stack ?? 'Built with'}>
              <div className="cs-stack">
                {cs.stack.map((group) => (
                  <section key={group.label} className="cs-stack__group" aria-label={group.label}>
                    <MonoLabel>{group.label}</MonoLabel>
                    <dl className="cs-stack__list">
                      {group.items.map((it) => (
                        <div key={it.name}>
                          <dt>{it.name}</dt>
                          <dd>{it.use}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                ))}
              </div>
            </Act>
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

          </>
        )}

        <ReadNext current={cs.slug} />

      </main>

      <Footer width="article" />

    </div>
  )
}
