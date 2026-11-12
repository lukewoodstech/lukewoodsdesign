import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import ReadNext from '@/components/ReadNext'
import FinalHero from '@/components/awardco/FinalHero'
import BigStats from '@/components/cs/BigStats'
import Sections from '@/components/sections/Sections'
import { Band, Block, Col, MetaGrid, Pill, Problem, StoryTitle } from '@/components/cs/Story'
import { SITE } from '@/lib/site'
import { companyAbout } from '@/lib/caseStudies'
import { awardco } from '@/lib/sections/awardco'

/*
 * Custom-built case study: this static route shadows the generic
 * /work/[slug] template. The home-grid tile still reads lib/caseStudies.ts.
 *
 * Visual-first edition (Luke, 2026-11-11): the same section system as
 * Lucid. A hero, the problem banner and the testing numbers, then sections
 * of one text card and its visuals, from lib/sections/awardco.tsx. The copy
 * is Luke's; [bracketed] text is his placeholder.
 *
 * Binding from the 2026-08-24 interview record: 45.9M attempts / 1 year,
 * 7.7M failures (6.7M from password), password 34.6% vs SSO 98%, 9,275
 * support cases / 90 days. 25% faster, +4.5% and 27s to 5.9s are usability
 * test results, never production analytics. The redesign was handed off.
 */

const TITLE = 'Reducing authentication friction at Awardco'
const SUMMARY =
  'Awardco had 7.7 million failed logins in one year. I redesigned SSO, MFA, password reset, and mobile into one guided sign-in, owned it on desktop and mobile, tested it with real users, and got it through architecture and security review before handoff.'
const IMG = '/work/awardco'

export const metadata: Metadata = {
  title: `${TITLE}`,
  description: SUMMARY,
  alternates: { canonical: '/work/awardco-login-flow-redesign' },
  openGraph: {
    type: 'article',
    title: `${TITLE} · ${SITE.name}`,
    description: SUMMARY,
    url: '/work/awardco-login-flow-redesign',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} · ${SITE.name}`,
    description: SUMMARY,
  },
}

export default function AwardcoCaseStudy() {
  return (
    <div
      className="cs acs cs-surface cs-story min-h-screen text-white"
      style={{ '--accent': awardco.accent } as React.CSSProperties}
    >
      <SiteNav next={{ href: '/work/pattern-custom-reports', title: 'Custom Reports in Predict' }} />

      <main id="main" className="sitenav-offset pb-24">
        {/* ══ Hero ══ */}
        <Col>
          <header className="pt-10">
            <StoryTitle dim="at Awardco">Reducing authentication friction</StoryTitle>
            <MetaGrid
              stacked
              summary={<p>{SUMMARY}</p>}
              facts={[
                { label: 'Company', value: companyAbout('awardco-login-flow-redesign'), span: true },
                { label: 'Role', value: 'Product Design Intern' },
                { label: 'Timeline', value: 'October 2025 to April 2026' },
                { label: 'Team', value: '[team]' },
                { label: 'Tools', value: 'Figma, VS Code, GitHub Copilot' },
              ]}
            />
          </header>
        </Col>

        {/* The finished sign-in on mobile and desktop, in drawn devices */}
        <Band tone="accent" className="acs-hero-band">
          <FinalHero
            phone={{
              src: `${IMG}/hero/phone-awardco.png`,
              alt: 'The redesigned Awardco mobile sign-in: the Awardco logo, a Sign in with Google button, one email field, and a Continue button',
            }}
            desktop={{
              src: `${IMG}/hero/desk-awardco.png`,
              alt: 'The redesigned Awardco company login page: a pale blue page behind a white card with the Awardco logo, a Sign in with Google button, one email field, and Continue',
            }}
            caption="The redesigned sign-in, on mobile and desktop"
          />
        </Band>

        {/* ══ The problem ══ */}
        <Band dust flush>
          <Col>
            <Problem iconSrc="/logos/awardco.png" iconAlt="Awardco">
              How might we <em>remove the friction from signing in</em>, so every user can get into
              Awardco, whether they use SSO, sign in on their phone, or can&rsquo;t reach their email
              for a code?
            </Problem>
          </Col>
        </Band>

        {/* ══ From usability testing ══ */}
        <Col wide>
          <Block className="cs-centered">
            <Pill>From usability testing</Pill>
            <BigStats
              small
              stats={[
                { value: 25, suffix: '%', caption: 'faster login' },
                { value: '+4.5%', caption: 'successful sign-ins' },
                { value: '27s to 5.9s', caption: 'choosing a method' },
                { value: 20, suffix: '+', caption: 'in-person sessions, 75 remote testers' },
              ]}
            />
          </Block>
        </Col>

        <Sections sections={awardco.sections} />

        <ReadNext current="awardco" />
      </main>

      <Footer width="article" />
    </div>
  )
}
