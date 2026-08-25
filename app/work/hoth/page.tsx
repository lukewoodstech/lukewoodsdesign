import type { Metadata } from 'next'
import CaseStudyPage, { generateMetadata as caseStudyMetadata } from '../[slug]/page'

/*
 * Static shadow route for the password-gated study (same pattern as
 * app/work/lucid-ai). As an unlisted [slug] param, an on-demand visit
 * tried to render *statically* and the gate's cookies() read threw
 * DYNAMIC_SERVER_USAGE — a 500 in production. As its own route the
 * cookies() call just opts this one page into dynamic rendering, while
 * the other studies stay fully static. Everything renders through the
 * [slug] template; this file only pins the param.
 */
const params = Promise.resolve({ slug: 'hoth' })

export function generateMetadata(): Promise<Metadata> {
  return caseStudyMetadata({ params })
}

export default function HothPage() {
  return <CaseStudyPage params={params} />
}
