import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import BeforeAfterHero from '@/components/BeforeAfterHero'
import CaseStudyGate from '@/components/CaseStudyGate'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import { getCaseStudy, caseStudies, real, shortTeam } from '@/lib/caseStudies'
import { PROTECTED_SLUGS, UNLOCK_COOKIE } from '@/lib/gate'
import { SITE } from '@/lib/site'
import { unlockCaseStudy } from './actions'

// Studies with bespoke pages under app/work/<slug> — the static routes win,
// so don't also generate them from this template.
const BESPOKE_SLUGS = new Set(['lucid-ai', 'awardco-login-flow-redesign'])

export function generateStaticParams() {
  // Protected slugs render dynamically: their page reads the unlock cookie,
  // a request-time API.
  return caseStudies
    .filter((cs) => !BESPOKE_SLUGS.has(cs.slug) && !PROTECTED_SLUGS.has(cs.slug))
    .map((cs) => ({ slug: cs.slug }))
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
  const title = `${cs.title} · ${cs.company}`

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

const SECTION_LABEL = 'text-sm font-semibold uppercase tracking-[0.18em] text-[#008fff]'

const Fig = ({ caption, height = 'h-[420px]', src }: { caption: string; height?: string; src?: string }) => (
  <figure className="my-14">
    {src ? (
      // alt is empty by design — the figcaption below already carries this text,
      // and duplicating it makes screen readers announce the caption twice.
      <Image
        src={src}
        alt=""
        width={1600}
        height={1000}
        sizes="(min-width: 860px) 860px, 100vw"
        className="w-full h-auto rounded-lg"
      />
    ) : (
      <div className={`${height} w-full bg-white/[0.05] rounded-lg`} />
    )}
    <figcaption className="mt-3 text-base text-white">{caption}</figcaption>
  </figure>
)

/*
 * Role / Timeline / Team / Impact, directly under the title. The long-form
 * Outcome section still closes the page, but its numbers now also appear
 * above the fold — previously a reader had to get ~1,100 words in to find
 * out whether the work went anywhere.
 */
function AtAGlance({
  role,
  period,
  team,
  headline,
}: {
  role?: string
  period?: string
  team?: string
  headline?: string[]
}) {
  const facts = [
    { label: 'Role', value: role },
    { label: 'Timeline', value: period },
    { label: 'Team', value: team },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value))

  if (!facts.length && !headline?.length) return null

  return (
    <div className="mt-8 border-y border-white/10 py-6">
      {facts.length > 0 && (
        <dl className="flex flex-wrap gap-x-12 gap-y-5">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className={`${SECTION_LABEL} mb-1.5`}>{f.label}</dt>
              <dd className="text-base text-white">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {headline && headline.length > 0 && (
        <div className={facts.length > 0 ? 'mt-6' : ''}>
          <p className={`${SECTION_LABEL} mb-1.5`}>Impact</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1.5 text-base text-white">
            {headline.map((metric) => (
              <li key={metric} className="flex gap-2.5">
                <span aria-hidden="true" className="text-[#008fff] flex-shrink-0">—</span>
                {metric}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()

  const prev = caseStudies.find((c) => c.nextSlug === cs.slug)
  const next = cs.nextSlug ? getCaseStudy(cs.nextSlug) : undefined

  /*
   * Protected studies ship the gate, not the article, until the unlock
   * cookie is present — the content never reaches the browser. cookies()
   * is only touched on protected slugs so the public studies stay static.
   */
  if (PROTECTED_SLUGS.has(cs.slug)) {
    const store = await cookies()
    if (store.get(UNLOCK_COOKIE)?.value !== '1') {
      return (
        <div className="min-h-screen bg-black text-white font-medium">
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
          <Footer />
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-medium">

      <SiteNav
        width="article"
        contact={false}
        next={next && { href: `/work/${next.slug}`, title: next.title }}
      />

      <div className="max-w-[860px] mx-auto px-8 pb-32 sitenav-offset">

        <header className="pt-10 pb-14">
          <p className={`${SECTION_LABEL} mb-4`}>
            {cs.company}
          </p>
          <h1 className="text-4xl md:text-6xl font-medium leading-tight tracking-tight text-white">
            {cs.title}
          </h1>
          {real(cs.tagline) && (
            <p className="mt-5 text-xl text-white leading-snug">
              {cs.tagline}
            </p>
          )}
          <AtAGlance
            role={real(cs.role)}
            period={real(cs.period)}
            team={shortTeam(cs.team)}
            headline={cs.headline}
          />
        </header>

        {cs.slug === 'awardco-login-flow-redesign' ? (
          /* The home tile's before/after slider, promoted to hero — the first
             thing you see and touch on this study. */
          <BeforeAfterHero
            beforeSrc="/before.png"
            afterSrc="/after.png"
            beforeAlt="Awardco's original login screen, showing every authentication method at once"
            afterAlt="The redesigned Awardco login screen, leading with single sign-on"
            aspect={2016 / 1270}
          />
        ) : cs.heroSrc ? (
          <Image
            src={cs.heroSrc}
            alt=""
            width={1600}
            height={1000}
            priority
            sizes="(min-width: 860px) 860px, 100vw"
            className="w-full h-auto rounded-lg"
          />
        ) : (
          <div className="h-[52vh] w-full bg-white/[0.05] rounded-lg" />
        )}
        <p className="mt-3 text-base text-white">
          {cs.slug === 'awardco-login-flow-redesign'
            ? 'Drag across the frame: the old login on the left, the shipped redesign on the right.'
            : (cs.heroCaption ?? 'Final design overview')}
        </p>

        <p className="mt-14 text-lg text-white leading-[1.8]">
          {cs.overview}
        </p>

        <section className="mt-16">
          <h2 className={`${SECTION_LABEL} mb-5 block`}>
            Problem
          </h2>
          <p className="text-lg text-white leading-[1.8]">
            {cs.problemIntro}
          </p>
          <ul className="mt-5 space-y-2">
            {cs.problemPoints.map((point, i) => (
              <li key={i} className="flex gap-3 text-lg text-white leading-relaxed">
                <span className="text-[#008fff] flex-shrink-0">—</span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        {cs.problemFigure && <Fig {...cs.problemFigure} />}

        <section>
          <h2 className={`${SECTION_LABEL} mb-8 block`}>
            Process
          </h2>
          <div className="space-y-8">
            {cs.process.map((step, i) => (
              <div key={i}>
                <h3 className="text-lg text-white mb-1 block font-medium">
                  <span className="text-[#008fff] mr-3 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  {step.heading}
                </h3>
                <p className="text-lg text-white leading-[1.8] pl-10">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {cs.processFigures?.map((fig, i) => (
          <Fig key={i} {...fig} />
        ))}

        <section>
          <h2 className={`${SECTION_LABEL} mb-5 block`}>
            Outcome
          </h2>
          <ul className="space-y-2">
            {cs.outcomes.map((outcome, i) => (
              <li key={i} className="flex gap-3 text-lg text-white leading-relaxed">
                <span className="text-[#008fff] flex-shrink-0">—</span>
                {outcome}
              </li>
            ))}
          </ul>
        </section>

        {/*
          Prev/next moved down from the top nav — a reader wants the next
          project after finishing this one, not before starting it.
        */}
        <nav className="mt-24 pt-8 border-t border-white/10 flex items-center justify-between gap-4" aria-label="More work">
          {prev ? (
            <Link href={`/work/${prev.slug}`} className="footer-link -ml-4">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/work/${next.slug}`} className="footer-link -mr-4 text-right">
              {next.title} →
            </Link>
          )}
        </nav>

      </div>

      <Footer />

    </div>
  )
}
