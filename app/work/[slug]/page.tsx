import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCaseStudy, caseStudies } from '@/lib/caseStudies'

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }))
}

const Fig = ({ caption, height = 'h-[420px]' }: { caption: string; height?: string }) => (
  <figure className="my-14">
    <div className={`${height} w-full bg-white/[0.05] rounded-lg`} />
    <figcaption className="mt-3 text-sm text-white">{caption}</figcaption>
  </figure>
)

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()

  return (
    <div className="min-h-screen bg-black text-white">

      <nav className="px-8 py-7 flex items-center justify-between">
        <Link href="/" className="text-sm text-white hover:text-[#008fff] transition-colors">
          ← work
        </Link>
        {cs.nextSlug && cs.nextTitle && (
          <Link href={`/work/${cs.nextSlug}`} className="text-sm text-white hover:text-[#008fff] transition-colors">
            {cs.nextTitle} →
          </Link>
        )}
      </nav>

      <div className="max-w-[660px] mx-auto px-8 pb-32">

        <header className="pt-10 pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#008fff] mb-4">
            {cs.company}
          </p>
          <h1 className="text-5xl font-normal leading-tight tracking-tight text-white">
            {cs.title}
          </h1>
          <p className="mt-4 text-base text-white leading-snug">
            {cs.tagline}
          </p>
          <p className="mt-6 text-sm text-white">
            {cs.role} · {cs.period} · {cs.team}
          </p>
        </header>

        <div className="h-[52vh] w-full bg-white/[0.05] rounded-lg" />
        <p className="mt-3 text-sm text-white">Final design overview</p>

        <p className="mt-14 text-base text-white leading-[1.85]">
          {cs.overview}
        </p>

        <section className="mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#008fff] mb-5">
            Problem
          </p>
          <p className="text-base text-white leading-[1.85]">
            {cs.problemIntro}
          </p>
          <ul className="mt-5 space-y-2">
            {cs.problemPoints.map((point, i) => (
              <li key={i} className="flex gap-3 text-base text-white leading-relaxed">
                <span className="text-[#008fff] flex-shrink-0">—</span>
                {point}
              </li>
            ))}
          </ul>
        </section>

        <Fig caption="Discovery — workflow mapping with brand managers" height="h-64" />

        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#008fff] mb-8">
            Process
          </p>
          <div className="space-y-8">
            {cs.process.map((step, i) => (
              <div key={i}>
                <p className="text-base text-white mb-1">
                  <span className="text-[#008fff] mr-3 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  {step.heading}
                </p>
                <p className="text-base text-white leading-[1.85] pl-9">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <Fig caption="Figma prototypes — grouping and metric hierarchy" />
        <Fig caption="Final design — custom report builder" height="h-[500px]" />

        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#008fff] mb-5">
            Outcome
          </p>
          <ul className="space-y-2">
            {cs.outcomes.map((outcome, i) => (
              <li key={i} className="flex gap-3 text-base text-white leading-relaxed">
                <span className="text-[#008fff] flex-shrink-0">—</span>
                {outcome}
              </li>
            ))}
          </ul>
        </section>

      </div>

      {cs.nextSlug && cs.nextTitle && (
        <div className="border-t border-white/[0.08] py-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white mb-4">Next</p>
          <Link
            href={`/work/${cs.nextSlug}`}
            className="text-3xl text-white hover:text-[#008fff] transition-colors duration-200"
          >
            {cs.nextTitle} →
          </Link>
        </div>
      )}

    </div>
  )
}
