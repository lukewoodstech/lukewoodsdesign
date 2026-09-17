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
import { Section, Prose, Bullets, FactStrip } from '@/components/CaseStudy'
import { getCaseStudy, caseStudies, real, isPlaceholder, shortTeam } from '@/lib/caseStudies'
import type { Figure } from '@/lib/caseStudies'
import { PROTECTED_SLUGS, UNLOCK_COOKIE } from '@/lib/gate'
import { SITE } from '@/lib/site'
import { unlockCaseStudy } from './actions'

// Studies with bespoke pages under app/work/<slug> — the static routes win,
// so don't also generate them from this template.
const BESPOKE_SLUGS = new Set([
  'lucid-ai',
  'awardco-login-flow-redesign',
  'pattern-custom-reports',
])

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

  // Unwritten studies fall back to the site blurb rather than shipping "[One-sentence tagline: …]"
  const description = real(cs.tagline) ?? real(cs.summary) ?? SITE.description
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
            width="article"
            contact={false}
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

  const problemPoints = cs.problemPoints.filter((p) => !isPlaceholder(p))
  const processSteps = cs.process.filter((s) => !isPlaceholder(s.heading))
  const outcomes = cs.outcomes.filter((o) => !isPlaceholder(o))
  const facts = (
    [
      ['Role', real(cs.role)],
      ['Timeline', real(cs.period)],
      ['Team', shortTeam(cs.team)],
    ] as const
  ).filter((f): f is ['Role' | 'Timeline' | 'Team', string] => Boolean(f[1]))

  return (
    <div className="cs min-h-screen bg-black text-white" style={accentStyle}>

      <SiteNav
        width="article"
        contact={false}
        next={next && { href: `/work/${next.slug}`, title: next.title }}
      />

      <div className="max-w-[860px] mx-auto px-8 pb-32 sitenav-offset">

        <header className="pt-10 pb-12">
          <p className="cs-eyebrow mb-4">{cs.company}</p>
          <h1 className="cs-title">
            {cs.title}
          </h1>
          {real(cs.tagline) && (
            <p className="cs-lede">
              {cs.tagline}
            </p>
          )}
          <FactStrip facts={[...facts]} impact={cs.headline} />
        </header>

        {cs.slug === 'awardco-login-flow-redesign' ? (
          /* The home tile's before/after slider, promoted to hero — the first
             thing you see and touch on this study. */
          <>
            <BeforeAfterHero
              beforeSrc="/before.png"
              afterSrc="/after.png"
              beforeAlt="Awardco's original login screen, showing every authentication method at once"
              afterAlt="The redesigned Awardco login screen, leading with single sign-on"
              aspect={2016 / 1270}
            />
            <p className="cs-cap">
              Drag across the frame: the old login on the left, the shipped redesign on the right.
            </p>
          </>
        ) : cs.heroSrc ? (
          <figure className="m-0">
            <Image
              src={cs.heroSrc}
              alt=""
              width={1600}
              height={1000}
              priority
              sizes="(min-width: 860px) 860px, 100vw"
              className="w-full h-auto rounded-lg border border-white/10"
            />
            <figcaption className="cs-cap">{cs.heroCaption ?? 'Final design overview'}</figcaption>
          </figure>
        ) : null}

        {real(cs.overview) && <Prose className="cs-prose--intro mt-14">{cs.overview}</Prose>}

        {(real(cs.problemIntro) || problemPoints.length > 0) && (
          <Section eyebrow="Problem">
            {real(cs.problemIntro) && <Prose>{cs.problemIntro}</Prose>}
            {problemPoints.length > 0 && <Bullets items={problemPoints} />}
          </Section>
        )}

        {cs.problemFigure && <Fig {...cs.problemFigure} />}

        {processSteps.length > 0 && (
          <Section eyebrow="Process">
            <div className="mt-8 space-y-8">
              {processSteps.map((step, i) => (
                <div key={i}>
                  <h3 className="cs-subhead mb-2">
                    <span className="text-[var(--accent)] mr-3 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {step.heading}
                  </h3>
                  <p className="cs-prose pl-10">{step.body}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {cs.processFigures?.map((fig, i) => (
          <Fig key={i} {...fig} />
        ))}

        {outcomes.length > 0 && (
          <Section eyebrow="Outcome">
            <Bullets items={outcomes} />
          </Section>
        )}

        {/*
          Prev/next moved down from the top nav — a reader wants the next
          project after finishing this one, not before starting it.
        */}
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

      </div>

      <Footer width="article" />

    </div>
  )
}
