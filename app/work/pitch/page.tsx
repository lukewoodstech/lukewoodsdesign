import type { Metadata } from 'next'
import CaseStudyPage, { generateMetadata as caseStudyMetadata } from '../[slug]/page'

/*
 * Shadow route for the password-gated Pitch study (LUK-200), the same fix
 * as app/work/hoth: as an unlisted [slug] param the gate's cookies() read
 * threw DYNAMIC_SERVER_USAGE on an on-demand visit. As its own route the
 * read opts just this page into dynamic rendering. Everything renders
 * through the [slug] template; this file only pins the param.
 */
const params = Promise.resolve({ slug: 'pitch' })

export function generateMetadata(): Promise<Metadata> {
  return caseStudyMetadata({ params })
}

export default function PitchPage() {
  return <CaseStudyPage params={params} />
}
