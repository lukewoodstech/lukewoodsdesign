import type { Metadata } from 'next'
import CaseStudyPage, { generateMetadata as caseStudyMetadata } from '../[slug]/page'

/*
 * Static shadow route for the second password-gated study, for the same
 * reason as app/work/hoth: as an unlisted [slug] param the gate's cookies()
 * read tried to render statically and threw in production. As its own
 * route the page is dynamic on its own, and the public studies stay static.
 * Everything renders through the [slug] template; this file only pins the
 * param.
 */
const params = Promise.resolve({ slug: 'pitch' })

export function generateMetadata(): Promise<Metadata> {
  return caseStudyMetadata({ params })
}

export default function PitchPage() {
  return <CaseStudyPage params={params} />
}
