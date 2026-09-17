import type { Metadata } from 'next'
import Image from 'next/image'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import BeforeAfterHero from '@/components/BeforeAfterHero'
import LucidTile from '@/components/LucidTile'
import PatternTile from '@/components/PatternTile'
import Reveal from '@/components/lucid/Reveal'
import ZoomShot from '@/components/lucid/ZoomShot'
import CompareStage from '@/components/lucid/CompareStage'
import ImpactStats from '@/components/lucid/ImpactStats'
import { Section, Prose, Bullets, FactStrip } from '@/components/CaseStudy'
import { SITE } from '@/lib/site'

/*
 * Custom-built case study — this static route intentionally shadows the
 * generic /work/[slug] template, the same way app/work/lucid-ai does. The
 * home-grid tile still reads from lib/caseStudies.ts; everything below is
 * bespoke to the Awardco story.
 *
 * Copy is Luke's (rewrite of 2026-09-16, ~900 words, recruiter-first).
 * Numbers come from the 2026-08-24 interview record in case-studies/awardco/
 * (notes.md is the single source of truth):
 * - Canonical metrics only: 45.9M attempts / 1 year, 7.7M failures (6.7M
 *   from password), password 34.6% vs SSO 98%, 9,275 support cases / 90 days.
 * - 25% faster login, +4.5% sign-ins, and 27s → 5.9s are BEFORE/AFTER
 *   USABILITY TESTING results, never production analytics.
 * - Implementation happened after the internship — the page says "handed
 *   off", not "live".
 * - Deliberately not rendered (assets stay in the repo): the dynamic-branding
 *   trio, old-login/old-mobile screens, company-login-authed, iteration and
 *   final-unified-auth slides, team quotes, the Luke AI prompts.
 * - flow-before / flow-after are deck slides (case-studies/awardco/assets/
 *   deck 05 + 06) copied into public/work/awardco for the token section.
 */

const TITLE = 'Reducing Authentication Friction'
const DESCRIPTION =
  'Awardco logged 7.7 million failed login attempts in one year. I redesigned its fragmented authentication flows into one guided system across SSO, MFA, password recovery, and mobile.'

export const metadata: Metadata = {
  title: `${TITLE} · Awardco`,
  description: DESCRIPTION,
  alternates: { canonical: '/work/awardco-login-flow-redesign' },
  openGraph: {
    type: 'article',
    title: `${TITLE} · ${SITE.name}`,
    description: DESCRIPTION,
    url: '/work/awardco-login-flow-redesign',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} · ${SITE.name}`,
    description: DESCRIPTION,
  },
}

const IMG = '/work/awardco'

export default function AwardcoCaseStudy() {
  return (
    <div className="cs acs min-h-screen bg-black text-white">
      <SiteNav
        width="article"
        contact={false}
        next={{ href: '/work/pattern-custom-reports', title: 'Custom Reports in Predict' }}
      />

      <div className="max-w-[860px] mx-auto px-8 pb-32 sitenav-offset">
        {/* ── Hero ── */}
        <header className="pt-10 pb-12">
          <p className="cs-eyebrow mb-4">Awardco · Product Design Internship</p>
          <h1 className="cs-title">
            {TITLE}
          </h1>
          <p className="cs-lede">
            Awardco logged 7.7 million failed login attempts in one year. I redesigned
            its fragmented authentication flows into one guided system across SSO,
            MFA, password recovery, and mobile.
          </p>

          <FactStrip
            facts={[
              ['Role', 'Product Design Intern'],
              ['Timeline', 'Oct 2025 – Apr 2026'],
              ['Team', 'Product, engineering, security, and customer success'],
            ]}
          />

          {/* Test results, not production analytics — the eyebrow says so. */}
          <ImpactStats
            eyebrow="Before/after usability testing"
            stats={[
              { value: 25, suffix: '%', label: 'faster login' },
              { value: '+4.5%', label: 'successful sign-ins' },
              { value: '27s → 5.9s', label: 'to choose a login method' },
            ]}
          />
        </header>

        <BeforeAfterHero
          beforeSrc="/before.png"
          afterSrc="/after.png"
          beforeAlt="Awardco's original login screen, showing every authentication method at once"
          afterAlt="The redesigned Awardco login screen, leading with single sign-on"
          aspect={2016 / 1270}
        />
        <p className="cs-cap">
          Drag across the frame: the old login on the left, the redesign on the right.
        </p>

        {/* ── Opening ── */}
        <Reveal className="mt-12">
          <Prose>
            <p>
              Awardco is an employee-recognition platform where every customer
              configures authentication differently. Depending on their company, users
              might need SSO, a password, MFA, or a login code.
            </p>
            <p>
              The existing experience made users figure that out themselves. Some
              entered a code on Awardco&rsquo;s universal login page, reached their
              company&rsquo;s page, and were asked to authenticate again. Others chose
              password login without realizing their company used Google or Microsoft
              SSO.
            </p>
            <p>
              I owned the redesign across desktop and mobile, validated it with 20+
              external users and a 75-person internal study, and took the proposed
              system through architecture and security review.
            </p>
          </Prose>
        </Reveal>

        {/* ── Evidence ── */}
        <Section headline="Users weren’t entering the wrong password. They were choosing the wrong method.">
          <Prose>
            <p>
              My PM brought me a known pain point: login generated heavy support
              volume. I worked with our technical lead, account managers, and
              customer-success team to understand how large the problem really was.
            </p>
            <p>A year of login telemetry showed:</p>
          </Prose>
          <Bullets
            items={[
              '45.9 million total login attempts',
              '7.7 million failed attempts',
              '34.6% success for password login',
              '98% success for SSO',
              '9,275 login-related support cases in 90 days',
            ]}
          />
          <Prose className="mt-6">
            <p>Password login alone accounted for 6.7 million failures.</p>
            <p>
              The problem was not simply that users forgot their credentials. Awardco
              was presenting several authentication methods and expecting users to
              understand which one their company supported.
            </p>
            <p>
              That changed the strategy. Instead of improving every option equally, the
              new system would identify users by email and route them to the method
              most likely to work.
            </p>
          </Prose>
          <figure className="my-12">
            <ZoomShot
              src={`${IMG}/failed-logins-data.png`}
              alt="Charts from a year of login telemetry: password login shows 6.69 million failures against 3.54 million successes, while login codes, MFA, and SSO succeed 86 to 98 percent of the time"
              width={1433}
              height={806}
              sizes="(min-width: 860px) 860px, 100vw"
            />
            <figcaption className="cs-cap">
              Password login drove most failures, while guided authentication methods
              succeeded far more consistently.
            </figcaption>
          </figure>
        </Section>

        {/* ── The deciding test ── */}
        <Section headline="The faster design reinforced the wrong behavior.">
          <Prose>
            <p>I tested three login directions with 75 people across Awardco:</p>
          </Prose>
          <Bullets
            items={['The existing experience', 'An SSO-first design', 'A password-first design']}
          />
          <Prose className="mt-6">
            <p>
              The existing experience took users an average of 27 seconds to decide
              where to begin. The SSO-first design reduced that to 5.9 seconds.
              Password-first was even faster at 4.6 seconds and scored slightly higher
              on confidence.
            </p>
            <p>I still chose SSO-first.</p>
            <p>
              Password-first performed well because it emphasized the option users
              already recognized. But password login failed nearly two out of three
              times in the real product. Optimizing for the fastest test result would
              have reinforced the behavior causing most of Awardco&rsquo;s failures.
            </p>
            <p>The fastest design was not the one most likely to help users sign in.</p>
          </Prose>
          <figure className="my-12">
            <ZoomShot
              src={`${IMG}/heatmap-testing.png`}
              alt="Heatmap testing of three login variants: the control shows scattered attention, the SSO-first variant shows focus on the SSO button, the password-first variant shows focus on the password field. Decision time fell from 27 seconds to 5.9 with SSO-first"
              width={1433}
              height={806}
              sizes="(min-width: 860px) 860px, 100vw"
            />
            <figcaption className="cs-cap">
              Password-first won the task test, but SSO-first routed users toward the
              method that succeeded 98% of the time.
            </figcaption>
          </figure>
        </Section>

        {/* ── The token ── */}
        <Section headline="The real fix was a token, not another screen.">
          <Prose>
            <p>
              The universal login page originally identified the user but did not carry
              that authentication into their company&rsquo;s login experience. Users
              could enter a login code and then immediately be asked for another code
              or password.
            </p>
            <p>
              I proposed that the first login code create a secure token that persists
              when users reach their company&rsquo;s page.
            </p>
            <p>
              If the company only requires a login code, the user is already
              authenticated. If it also requires a password, their email is already
              populated and they only complete the remaining step.
            </p>
            <p>
              I mapped the system as states and transitions, then worked through the
              proposal with engineering, architecture, and security. It passed review
              without material changes. Engineering owned the implementation details,
              while I owned the concept and end-to-end experience.
            </p>
          </Prose>
          <div className="mt-8">
            <CompareStage
              ariaLabel="Before and after: the old double-authentication flow versus the new token-based flow"
              layers={[
                {
                  src: `${IMG}/flow-before.png`,
                  alt: 'The old four-step flow: a universal login code, domain selection, the company login page, then a second login code',
                  label: 'Before',
                  caption:
                    'Four steps, two codes. Universal login only identified the user, so the company page asked them to authenticate all over again.',
                  width: 1448,
                  height: 814,
                },
                {
                  src: `${IMG}/flow-after.png`,
                  alt: 'The new three-step flow: a universal login code, domain selection, then straight into the app, with the code persisting as a secure token',
                  label: 'After',
                  caption:
                    'The first authentication now carries into the company login flow, eliminating the second code entry.',
                  width: 1448,
                  height: 814,
                },
              ]}
            />
          </div>
        </Section>

        {/* ── Mobile and deskless workers ── */}
        <Section headline="Designing for deskless workers changed the system.">
          <Prose>
            <p>
              Many Awardco users work in warehouses, theaters, and other environments
              where mobile is their primary access point. Some had login codes sent to
              work inboxes they could not access from their phones.
            </p>
            <p>
              The redesigned mobile experience introduced SMS verification and only
              displayed authentication options supported by the user&rsquo;s company.
            </p>
            <p>
              It also replaced the generic &ldquo;SSO Login&rdquo; label with the
              provider users actually recognized, such as Google, Microsoft, or Okta.
            </p>
            <p>
              Users no longer had to know which authentication method their company
              supported.
            </p>
          </Prose>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 justify-items-center">
            {/* Phone frames render near their natural size, so the zoom
                lightbox would expand to the same size or smaller — plain
                images, no expand affordance. */}
            <figure className="m-0 max-w-[300px]">
              <Image
                src={`${IMG}/figma/new-mobile.png`}
                alt="The redesigned mobile login: Awardco logo, a Sign in with Google button, and a single email field with one Continue button"
                width={786}
                height={1704}
                sizes="300px"
                className="w-full h-auto rounded-lg border border-white/10"
              />
              <figcaption className="cs-cap">
                One provider button and one field. The page shows only the methods
                the user&rsquo;s company supports.
              </figcaption>
            </figure>
            <figure className="m-0 max-w-[300px]">
              <Image
                src={`${IMG}/figma/sms-mobile.png`}
                alt="The verification chooser on mobile: receive your one-time code by email, secondary email, or text message"
                width={786}
                height={1704}
                sizes="300px"
                className="w-full h-auto rounded-lg border border-white/10"
              />
              <figcaption className="cs-cap">
                Users could verify through email, a secondary email, or text without
                leaving the mobile flow.
              </figcaption>
            </figure>
          </div>
        </Section>

        {/* ── Coded prototypes and reset ── */}
        <Section headline="Coded prototypes exposed the forgotten flow.">
          <Prose>
            <p>
              A Figma prototype could show navigation, but it could not reveal where
              users struggled to type, validate a password, or enter a verification
              code.
            </p>
            <p>
              I built working prototypes with real inputs, validation, and code entry.
              Testing them with more than 20 admins and end users exposed friction
              around email entry, verification codes, and especially password
              recovery.
            </p>
            <p>
              The existing reset experience was a disconnected page with a blind
              password field and no visible requirements. I redesigned it with inline
              validation, live password matching, a show-password option, and the same
              visual system as the rest of authentication.
            </p>
            <p>
              Working in code made the edge cases visible earlier and gave engineering
              something closer to the final interaction model. I later contributed the
              workflow to Awardco&rsquo;s AI-prototyping guide and helped introduce it
              across the design team.
            </p>
          </Prose>
          <div className="mt-8">
            <CompareStage
              ariaLabel="Before and after: the old password reset page versus the redesigned reset flow with inline validation"
              layers={[
                {
                  src: `${IMG}/figma/old-reset.png`,
                  alt: 'The old reset page: a lone Reset Your Password card with one masked input and no feedback',
                  label: 'Before',
                  caption:
                    'One blind field, no requirements shown, and no way to see what you typed.',
                  width: 2880,
                  height: 2048,
                },
                {
                  src: `${IMG}/figma/new-reset-web.png`,
                  alt: 'The redesigned reset page: password requirements stated up front, live inline validation, a confirm field with match checking, and show-password toggles',
                  label: 'After',
                  caption:
                    'Real inputs and validation exposed problems that could not be tested accurately in Figma.',
                  width: 2880,
                  height: 2048,
                },
              ]}
            />
          </div>
        </Section>

        {/* ── Outcome ── */}
        <Section headline="Validated, approved, and handed off.">
          <Prose>
            <p>In before-and-after usability testing, the redesigned system produced:</p>
          </Prose>
          <Bullets
            items={[
              '25% faster login',
              '4.5% more successful sign-ins',
              'A 78% reduction in login-method decision time',
              'Higher confidence and lower reported difficulty',
              'One guided experience across mobile and desktop',
            ]}
          />
          <Prose className="mt-6">
            <p>
              The token-based flow passed architecture and security review, and the
              completed designs were handed off for implementation after my
              internship.
            </p>
          </Prose>
        </Section>

        {/* ── Reflection ── */}
        <Section headline="The best authentication systems route users instead of asking them to choose.">
          <Prose>
            <p>
              I learned not to follow a metric without asking what it was actually
              rewarding. The password-first design won the task test, but it worked
              against the larger product evidence. Choosing the slightly slower
              direction produced the better system.
            </p>
            <p>
              The biggest improvement was not a cleaner login page. It was changing how
              authentication state moved between two parts of the product.
            </p>
            <p>
              One limitation remains. Some deskless workers cannot carry phones during
              their shifts and access Awardco through shared kiosks. SMS does not solve
              authentication for them. If I continued the project, kiosk research would
              be the next place I looked.
            </p>
          </Prose>
        </Section>

        {/* ── Read next ── */}
        <Section eyebrow="More work" headline="Read next">
          <div className="cs-next">
            <LucidTile />
            <PatternTile />
          </div>
        </Section>
      </div>

      <Footer width="article" />
    </div>
  )
}
