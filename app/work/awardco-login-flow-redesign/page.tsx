import type { Metadata } from 'next'
import Image from 'next/image'
import Footer from '@/components/Footer'
import SiteNav from '@/components/SiteNav'
import LucidTile from '@/components/LucidTile'
import PatternTile from '@/components/PatternTile'
import Reveal from '@/components/lucid/Reveal'
import CompareStage from '@/components/lucid/CompareStage'
import ZoomShot from '@/components/lucid/ZoomShot'
import FinalHero from '@/components/awardco/FinalHero'
import FlowStrip, { type FlowStep } from '@/components/awardco/FlowStrip'
import { Iphone, Macbook } from '@/components/awardco/Devices'
import BigStats from '@/components/cs/BigStats'
import Journey from '@/components/cs/Journey'
import Callouts from '@/components/cs/Callouts'
import {
  Act,
  Band,
  Block,
  Checklist,
  Col,
  GhostCard,
  H3,
  KeyQuestion,
  MetaGrid,
  MonoLabel,
  Notes,
  Pair,
  People,
  Pill,
  Problem,
  StoryTitle,
  SuccessCard,
  Two,
} from '@/components/cs/Story'
import { SITE } from '@/lib/site'

/*
 * Custom-built case study — this static route intentionally shadows the
 * generic /work/[slug] template, the same way app/work/lucid-ai does. The
 * home-grid tile still reads from lib/caseStudies.ts; everything below is
 * bespoke to the Awardco story.
 *
 * Story edition (2026-09-21): the five-act structure on the shared
 * `components/cs` primitives, same as Lucid. Copy is Luke's (rewrite of
 * 2026-09-16), re-cut into acts with key phrases bolded; no facts added.
 * Numbers come from the 2026-08-24 interview record, which is kept out
 * of this repo (see .gitignore) and is the single source of truth:
 * - Canonical metrics only: 45.9M attempts / 1 year, 7.7M failures (6.7M
 *   from password), password 34.6% vs SSO 98%, 9,275 support cases / 90 days.
 * - 25% faster login, +4.5% sign-ins, and 27s → 5.9s are BEFORE/AFTER
 *   USABILITY TESTING results, never production analytics — the impact
 *   strip says so in its own caption.
 * - Implementation happened after the internship — the page says "handed
 *   off", not "live".
 * - Deliberately not rendered (assets stay in the repo): company-login-authed,
 *   iteration and final-unified-auth slides, sms-web, new-reset-mobile,
 *   team quotes.
 * - The "what people ran into" note cards restate three situations from
 *   Luke's own paragraphs; they are not quotes and are labelled as such.
 *
 * Visuals edition (2026-09-23): the hero and the flow comparison now run on
 * frames pulled straight from the design file (Cleaner Login Flow, file key
 * j2WD4MhXQlW7l7t2cNyC9y) instead of exported deck slides.
 * - The hero is FinalHero: the finished mobile and desktop side by side,
 *   static, Awardco branding only (phone 1102:32286, desktop 1102:37132).
 *   It replaces the before/after slider, which opened the study on the old
 *   design rather than the new one. Devices are drawn in CSS by
 *   components/awardco/Devices, not composited into the PNGs, so the same
 *   capture can appear framed here and bare in the brand row.
 * - Act 03 carries the brand-colour constraint: Awardco 1102:37132,
 *   Cinemark 1102:37155, Accenture 1102:37182. Desktop only, because the
 *   customer's tint covers the whole page and the file has no Accenture
 *   mobile with an Okta button to pair honestly against its desktop. The
 *   mobile brand row varies colour only (all three say Google); the
 *   provider variants are a separate, all-Cinemark row (1135:17177 Okta,
 *   1135:17219 Microsoft, 1135:17264 Generic).
 * - All of the above live on the file's SECOND page, "🎨 Company Login
 *   Page" (1102:28152) — get_metadata with no nodeId only lists the first
 *   page, "🛑 READY FOR DEV 🛑", so the high-fidelity work is easy to miss.
 *   The earlier 924:21185 "ACO CLP" is a different, older frame with no
 *   background fill, which is why its export looked washed out.
 * - Act 03's before/after toggle is replaced by two FlowStrips built from
 *   the design file's own "Current Flow - Problem" (1063:11643) and
 *   "Proposed Flow" (1063:11666 / 1063:11746) sections. Both strips share
 *   four screen files; the after flow is the before flow minus two screens.
 * - NEW CLAIMS, from reading those sections rather than from the interview
 *   record — verify before publishing: the old flow is six screens with two
 *   code entries and two trips to the inbox (the deck slide said four steps),
 *   and the universal-login half is unchanged by the redesign.
 * - public/before.png and public/after.png are no longer used here; the
 *   generic /work/[slug] template still reads them.
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
const FLOW = `${IMG}/flow`

/*
 * The two flows, screen by screen, exported from the design file's own
 * "Current Flow" and "Proposed Flow" sections. The first three screens and
 * the last are byte-identical between them: the redesign changes what
 * happens after domain selection, not the universal login, so both strips
 * point at the same four files and the difference is the two screens the
 * after flow no longer needs.
 */
const SHOT = { width: 1440, height: 1024 }

const BEFORE_FLOW: FlowStep[] = [
  {
    ...SHOT,
    src: `${FLOW}/universal.png`,
    alt: 'The universal login page: an Awardco logo, one Work Email field, and Continue With Email',
    title: 'Universal login',
    note: 'One field, asking for the work email.',
  },
  {
    ...SHOT,
    src: `${FLOW}/code.png`,
    alt: 'The identification code screen: six digit boxes filled with 345900, and a note that a code was emailed',
    title: 'Identification code',
    note: 'Leave the product, open the inbox, come back with six digits.',
    flag: 'Code 1',
  },
  {
    ...SHOT,
    src: `${FLOW}/domain.png`,
    alt: 'Domain selection: Welcome Back, with a list of the workspaces that email belongs to',
    title: 'Domain selection',
    note: 'Pick the workspace. So far, so reasonable.',
  },
  {
    ...SHOT,
    src: `${FLOW}/before-company.png`,
    alt: "The company login page: the tenant's logo, a Sign in with SSO button, and an empty email field",
    title: 'Company login page',
    note: 'The company page does not know who you are. It asks for the email again.',
    flag: 'Asks again',
  },
  {
    ...SHOT,
    src: `${FLOW}/before-code-again.png`,
    alt: 'Check your email: a second six-box code entry on the company login page, filled with C125DA',
    title: 'A second code',
    note: 'Back to the inbox for a different six digits.',
    flag: 'Code 2',
  },
  {
    ...SHOT,
    src: `${FLOW}/app.png`,
    alt: 'The Awardco home page after signing in, with recognition programs and a points balance',
    title: 'In the app',
    note: 'Two codes and two trips to the inbox after the first field.',
  },
]

const AFTER_FLOW: FlowStep[] = [
  {
    ...SHOT,
    src: `${FLOW}/universal.png`,
    alt: 'The same universal login page, unchanged by the redesign',
    title: 'Universal login',
    note: 'Unchanged. The same single field.',
  },
  {
    ...SHOT,
    src: `${FLOW}/code.png`,
    alt: 'The same identification code screen, now the only code the user enters',
    title: 'Identification code',
    note: 'The same six digits, entered once.',
    flag: 'Code 1',
  },
  {
    ...SHOT,
    src: `${FLOW}/domain.png`,
    alt: 'The same domain selection screen, with the authentication now carried forward as a token',
    title: 'Domain selection',
    note: 'Pick the workspace, carrying the authentication along.',
    carry: 'secure token',
  },
  {
    ...SHOT,
    src: `${FLOW}/app.png`,
    alt: 'The same Awardco home page, reached without a second authentication',
    title: 'In the app',
    note: 'The company page has nothing left to ask.',
  },
]

/*
 * The brand-colour constraint, Act 03. Desktop frames only: the customer's
 * tint covers the whole page, which a phone would show less of, and the
 * design file has no Accenture mobile with an Okta button to pair honestly
 * against its desktop.
 *
 * The Cinemark and Accenture notes are Luke's reasoning, written up here:
 * red is genuinely hard to use as a primary action, and Accenture held the
 * tightest brand standards of the customers he worked against. Phrased
 * around the brand system rather than the client, since both are real
 * companies named on a public page.
 */
const BRANDS: { name: string; src: string; alt: string; note: string }[] = [
  {
    name: 'Awardco',
    src: `${IMG}/hero/desk-awardco.png`,
    alt: 'The login page in Awardco branding: a pale blue page, a white card, and a blue Continue button',
    note: 'The easy case. Awardco blue reads as a safe primary action anywhere on the page.',
  },
  {
    name: 'Cinemark',
    src: `${IMG}/hero/desk-cinemark.png`,
    alt: 'The same login page in Cinemark branding: a pale red page, a white card, and a red Continue button',
    note: 'The hard case. A saturated red carries error and destructive meaning in almost every interface, so the layout has to make Continue read as the safe next step on its own.',
  },
  {
    name: 'Accenture',
    src: `${IMG}/hero/desk-accenture.png`,
    alt: 'The same login page in Accenture branding: a pale purple page, a white card, and a purple Continue button',
    note: 'The strict case. Accenture held the tightest brand standards of any customer I designed against, so the page had to be right with no latitude.',
  },
]

export default function AwardcoCaseStudy() {
  return (
    <div className="cs acs cs-surface cs-story min-h-screen text-white">
      <SiteNav
        next={{ href: '/work/pattern-custom-reports', title: 'Custom Reports in Predict' }}
      />

      <main id="main" className="sitenav-offset pb-24">
        {/* ══ Title block ══ */}
        <Col>
          <header className="pt-10">
            <p className="cs-eyebrow mb-5">Awardco · Product Design Internship</p>
            <StoryTitle dim="at Awardco">Reducing authentication friction</StoryTitle>
            <MetaGrid
              summary={
                <>
                  <p>
                    Awardco logged <strong>7.7 million failed login attempts</strong> in one
                    year. I redesigned its fragmented authentication flows into one guided
                    system across SSO, MFA, password recovery, and mobile.
                  </p>
                  <p>
                    I owned the redesign across desktop and mobile, validated it with{' '}
                    <strong>20+ external users and a 75-person internal study</strong>, and
                    took the proposed system through architecture and security review.
                  </p>
                </>
              }
              facts={[
                { label: 'Role', value: 'Product Design Intern', icon: 'user' },
                {
                  label: 'Team',
                  value: 'Product, engineering, security, and customer success',
                  icon: 'users',
                },
                { label: 'Timeline', value: 'October 2025 to April 2026', icon: 'clock' },
                { label: 'Tools', value: 'Figma, VS Code, GitHub Copilot', icon: 'tool' },
                {
                  label: 'Status',
                  value: 'Passed architecture and security review, handed off for implementation',
                  icon: 'flag',
                  span: true,
                },
                {
                  label: 'Skills used',
                  value:
                    'Login telemetry analysis, discovery interviews, heatmap and usability testing, systems mapping, coded prototyping, architecture and security review, handoff',
                  icon: 'sparkle',
                  span: true,
                },
              ]}
            />
          </header>
        </Col>

        {/* ══ Hero band: the finished thing, mobile first, Awardco's own
            branding and nothing else. It used to cycle three customer brands,
            which buried the point; the brand-colour range now has its own
            section in Act 03. Frames are bare captures in CSS-drawn devices
            (components/awardco/Devices), so the hardware is real-looking
            without shipping a device mockup PNG. ══ */}
        <Band className="acs-hero-band">
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
        <Band dust>
          <Col>
            <Problem iconSrc="/logos/awardco.png" iconAlt="Awardco">
              How might we get people signed in when{' '}
              <em>every company authenticates differently</em> and users have to guess
              which method is theirs?
            </Problem>
          </Col>
        </Band>

        {/* ══ The impact ══ */}
        <Col wide>
          <Block className="cs-centered">
            <Pill>The impact</Pill>
            <p className="cs-cap cs-cap--mono">
              Before and after usability testing. Not production analytics.
            </p>
            <BigStats
              small
              stats={[
                { value: 25, suffix: '%', caption: <><strong>faster login</strong></> },
                { value: '+4.5%', caption: <>more <strong>successful sign-ins</strong></> },
                {
                  value: 78,
                  suffix: '%',
                  caption: <>less time choosing a method, <strong>27s to 5.9s</strong></>,
                },
                {
                  value: 20,
                  suffix: '+',
                  caption: <>external users on <strong>working prototypes</strong></>,
                },
              ]}
            />
          </Block>
        </Col>

        {/* ══ The journey ══ */}
        <Col>
          <Block className="cs-centered">
            <Pill>The journey</Pill>
            <Journey stops={['Discover', 'Test', 'Design', 'Prototype', 'Handoff']} />
          </Block>
        </Col>

        {/* ══ Act 01 · Discover ══ */}
        <Col>
          <Act
            phase="Discover"
            num="01"
            title="Users were not entering the wrong password. They were choosing the wrong method."
          >
            <div className="cs-prose">
              <p>
                Awardco is an employee-recognition platform where{' '}
                <strong>every customer configures authentication differently</strong>.
                Depending on their company, users might need SSO, a password, MFA, or a
                login code. The existing experience made users figure that out themselves.
              </p>
              <p>
                My PM brought me a known pain point: login generated heavy support volume. I
                worked with our technical lead, account managers, and customer-success team
                to understand <strong>how large the problem really was</strong>.
              </p>
            </div>
          </Act>

          <Notes
            label="Three situations from the research. Restated, not quotes."
            notes={[
              'Entered a code on the universal page, reached the company page, and was asked to authenticate again',
              'Chose password login without realizing the company used Google or Microsoft SSO',
              'Got a login code sent to a work inbox they could not open from their phone',
            ]}
          />
        </Col>

        <Band dust>
          <Col>
            <KeyQuestion>
              How might we <u>route users to the method that works</u>, instead of asking
              them to choose?
            </KeyQuestion>
          </Col>
        </Band>

        <Col>
          <Block>
            <H3 dim="a year of login telemetry">The evidence</H3>
            <div className="cs-prose mt-3">
              <p>
                The problem was not simply that users forgot their credentials. Awardco was
                presenting several authentication methods and expecting users to understand
                which one their company supported.{' '}
                <strong>Password login alone accounted for 6.7 million failures.</strong>
              </p>
            </div>
            <Callouts
              src={`${IMG}/failed-logins-data.png`}
              alt="Charts from a year of login telemetry, annotated: password login shows 6.69 million failures against 3.54 million successes, while login codes, MFA, and SSO succeed 86 to 98 percent of the time"
              width={1433}
              height={806}
              items={[
                {
                  label: '6.7M failures',
                  text: <>Password login failed <strong>nearly two out of three times</strong>.</>,
                  x: 30.5,
                  y: 26,
                  w: 16.5,
                  h: 39,
                },
                {
                  label: '34.6% success',
                  text: <>The method most users reached for was the one <strong>least likely to work</strong>.</>,
                  x: 56.5,
                  y: 50,
                  w: 6.5,
                  h: 15,
                  gy: 44,
                },
                {
                  label: '98% for SSO',
                  text: <>Guided methods succeeded. The fix was <strong>routing</strong>, not a better password field.</>,
                  x: 76.5,
                  y: 26,
                  w: 7,
                  h: 39,
                },
              ]}
            />
          </Block>

          <Block>
            <BigStats
              small
              stats={[
                { value: '45.9M', caption: <>login attempts in <strong>one year</strong></> },
                { value: '7.7M', caption: <>of them <strong>failed</strong></> },
                { value: '9,275', caption: <>login support cases in <strong>90 days</strong></> },
              ]}
            />
          </Block>

          <Block>
            <SuccessCard>
              Success meant <strong>routing each user to the method most likely to
              work</strong>, then proving it in before-and-after testing.
            </SuccessCard>
          </Block>

          <Block>
            <H3 dim="three people the old login failed">Who it was for</H3>
            <People
              items={[
                {
                  icon: 'building',
                  title: 'The SSO-company employee',
                  text: 'Their company uses Google or Microsoft. The login page showed a password field anyway, so they used it.',
                },
                {
                  icon: 'phone',
                  title: 'The deskless worker',
                  text: 'Warehouses and theaters, where the phone is the only screen and the work inbox is out of reach.',
                },
                {
                  icon: 'users',
                  title: 'The company admin',
                  text: 'Fielding the support cases. Login help was the top topic, 9,275 cases in 90 days.',
                },
              ]}
            />
          </Block>

        </Col>

        {/* ══ Act 02 · Test ══ */}
        <Col>
          <Act phase="Test" num="02" title="The faster design reinforced the wrong behavior">
            <div className="cs-prose">
              <p>
                I tested three login directions with <strong>75 people across Awardco</strong>:
                the existing experience, an SSO-first design, and a password-first design.
              </p>
              <p>
                The existing experience took users an average of 27 seconds to decide where
                to begin. The SSO-first design reduced that to 5.9 seconds. Password-first
                was even faster at 4.6 seconds and scored slightly higher on confidence.{' '}
                <strong>I still chose SSO-first.</strong>
              </p>
            </div>
          </Act>

          <Block>
            <Callouts
              src={`${IMG}/heatmap-testing.png`}
              alt="Heatmap testing of three login variants, annotated: the control shows scattered attention, the SSO-first variant shows focus on the SSO button, the password-first variant shows focus on the password field. Decision time fell from 27 seconds to 5.9 with SSO-first"
              width={1433}
              height={806}
              items={[
                {
                  label: 'Control, 27s',
                  text: <>Attention scattered across the page. <strong>Hesitation</strong> before the first tap.</>,
                  x: 7,
                  y: 23,
                  w: 12.5,
                  h: 47,
                },
                {
                  label: 'SSO-first, 5.9s',
                  text: <>Focus lands on the SSO button. <strong>The chosen design.</strong></>,
                  x: 20.5,
                  y: 23,
                  w: 12.5,
                  h: 47,
                  gy: 17,
                },
                {
                  label: 'Password-first, 4.6s',
                  text: <>Fastest in the test, but it reinforced the method that <strong>failed most in the product</strong>.</>,
                  x: 34,
                  y: 23,
                  w: 12.5,
                  h: 47,
                  gy: 11,
                },
              ]}
            />
          </Block>

          <Block>
            <div className="cs-prose">
              <p>
                Password-first performed well because it emphasized the option users already
                recognized. But password login failed nearly two out of three times in the real
                product. Optimizing for the fastest test result would have{' '}
                <strong>reinforced the behavior causing most of Awardco&rsquo;s failures</strong>.
              </p>
              <p>The fastest design was not the one most likely to help users sign in.</p>
            </div>
          </Block>
        </Col>

        {/* ══ Act 03 · Design ══ */}
        <Col>
          <Act phase="Design" num="03" title="The real fix was a token, not another screen">
            <div className="cs-prose">
              <p>
                The universal login page originally identified the user but{' '}
                <strong>did not carry that authentication</strong>{' '}
                into their company&rsquo;s
                login experience. Users could enter a login code and then immediately be asked
                for another code or password.
              </p>
            </div>
          </Act>

          {/* The two flows, screen by screen. Shown one after the other rather
              than behind a toggle: the argument is that the second strip is
              the first with two screens removed, and a toggle hides exactly
              that. */}
          <Block>
            <H3 dim="six screens, two codes, two trips to the inbox">The flow users had</H3>
            <FlowStrip
              tone="problem"
              label="The Awardco login flow before the redesign, screen by screen"
              steps={BEFORE_FLOW}
              tracks={BEFORE_FLOW.length}
            />
          </Block>

          <Block>
            <H3 dim="four screens, one code">The flow I proposed</H3>
            <FlowStrip
              label="The Awardco login flow after the redesign, screen by screen"
              steps={AFTER_FLOW}
              tracks={BEFORE_FLOW.length}
            />
            <p className="cs-cap">
              The same three screens the old flow opened with, and then straight into the
              app. The company login page and the second code are gone, because the first
              authentication now travels with the user.
            </p>
          </Block>

          <Block>
            <div className="cs-prose">
              <p>
                If the company only requires a login code, the user is already authenticated.
                If it also requires a password, <strong>their email is already populated</strong>{' '}
                and they only complete the remaining step.
              </p>
            </div>
            <figure className="acs-branch">
              <ZoomShot
                src={`${FLOW}/after-password-branch.png`}
                alt="The redesigned company login page for a company that also requires a password: the email is already filled in as luke.woods@awardco.com, and only the password field is left"
                width={1440}
                height={1024}
                sizes="(min-width: 60em) 60vw, 100vw"
              />
              <figcaption className="cs-cap">
                The password branch. One field, not a fresh login.
              </figcaption>
            </figure>
            <div className="cs-prose">
              <p>
                I mapped the system as <strong>states and transitions</strong>, then worked
                through the proposal with engineering, architecture, and security. It passed
                review without material changes. Engineering owned the implementation details,
                while I owned the concept and end-to-end experience.
              </p>
            </div>
          </Block>

          <Pair
            level={3}
            num="01"
            task="Deskless workers got codes in inboxes they could not open from their phones"
            solution="SMS verification, and only the methods the company supports"
            visual={
              <div className="cs-phone-pair">
                <figure>
                  <div className="cs-phone">
                    <div className="cs-phone__screen">
                      <Image
                        src={`${IMG}/figma/new-mobile.png`}
                        alt="The redesigned mobile login: Awardco logo, a Sign in with Google button, and a single email field with one Continue button"
                        fill
                        sizes="(min-width: 40em) 300px, 45vw"
                      />
                    </div>
                  </div>
                  <figcaption className="cs-cap">
                    One provider button and one field. The page shows only the methods the
                    user&rsquo;s company supports.
                  </figcaption>
                </figure>
                <figure>
                  <div className="cs-phone">
                    <div className="cs-phone__screen">
                      <Image
                        src={`${IMG}/figma/sms-mobile.png`}
                        alt="The verification chooser on mobile: receive your one-time code by email, secondary email, or text message"
                        fill
                        sizes="(min-width: 40em) 300px, 45vw"
                      />
                    </div>
                  </div>
                  <figcaption className="cs-cap">
                    Users could verify through email, a secondary email, or text without
                    leaving the mobile flow.
                  </figcaption>
                </figure>
              </div>
            }
          >
            <p>
              Many Awardco users work in warehouses, theaters, and other environments where{' '}
              <strong>mobile is their primary access point</strong>. The redesigned mobile
              experience introduced SMS verification and only displayed authentication
              options supported by the user&rsquo;s company. It also replaced the generic
              &ldquo;SSO Login&rdquo; label with <strong>the provider users actually
              recognized</strong>, such as Google, Microsoft, or Okta. Users no longer had to
              know which authentication method their company supported.
            </p>
          </Pair>

          {/* The brand-colour constraint. Desktop frames only: the whole page
              takes the customer's tint, so a phone would show less of the
              thing being compared, and the file has no Accenture mobile with
              an Okta button to pair honestly against its desktop. */}
          <Block>
            <H3 dim="the constraint every screen had to survive">One layout, any brand</H3>
            <div className="cs-prose mt-3">
              <p>
                Awardco&rsquo;s login pages are white-labelled. Every customer&rsquo;s page
                carries their logo, their button colour, and their link colour, so{' '}
                <strong>one layout had to hold up in all of them</strong>. I designed against
                the two hardest cases I could find rather than against Awardco&rsquo;s own
                comfortable blue.
              </p>
            </div>
            <ol className="acs-brands">
              {BRANDS.map((b) => (
                <li className="acs-brands__item" key={b.src}>
                  <h4 className="acs-brands__name">{b.name}</h4>
                  <ZoomShot
                    src={b.src}
                    alt={b.alt}
                    width={2880}
                    height={1600}
                    sizes="(min-width: 60em) 30vw, 80vw"
                  />
                  <p className="acs-brands__note">{b.note}</p>
                </li>
              ))}
            </ol>
          </Block>
        </Col>

        {/* ══ Act 04 · Prototype ══ */}
        <Col>
          <Act phase="Prototype" num="04" title="Coded prototypes exposed the forgotten flow">
            <div className="cs-prose">
              <p>
                A Figma prototype could show navigation, but it could not reveal where users
                struggled to type, validate a password, or enter a verification code. I built{' '}
                <strong>working prototypes with real inputs, validation, and code entry</strong>.
                Testing them with more than 20 admins and end users exposed friction around
                email entry, verification codes, and especially password recovery.
              </p>
            </div>
          </Act>

          <Pair
            level={3}
            num="02"
            task="Reset was a disconnected page with a blind password field and no visible requirements"
            solution="Inline validation, live password matching, show-password, and the same visual system"
            visual={
              <CompareStage
                ariaLabel="Before and after: the old password reset page versus the redesigned reset flow with inline validation"
                layers={[
                  {
                    src: `${IMG}/figma/old-reset.png`,
                    alt: 'The old reset page: a lone Reset Your Password card with one masked input and no feedback',
                    label: 'Before',
                    caption: 'One blind field, no requirements shown, and no way to see what you typed.',
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
            }
          >
            <p>
              Working in code made the edge cases visible earlier and gave engineering
              something closer to the final interaction model. I later contributed the
              workflow to <strong>Awardco&rsquo;s AI-prototyping guide</strong> and helped
              introduce it across the design team.
            </p>
          </Pair>
        </Col>

        {/* ══ Final designs band ══ */}
        <Band tone="accent" className="cs-final">
          <p className="cs-final__word" aria-hidden="true">
            Final designs
          </p>
          {/* The same Macbook and Iphone the hero opens on, not the plain
              rectangles the other studies use: the band closes the page on
              the hardware it started with. */}
          <div className="cs-final__stage" style={{ paddingInline: 'var(--cs-pad)' }}>
            <Macbook
              ratio={2880 / 2048}
              style={{ '--r': '-5deg', '--y': '6%' } as React.CSSProperties}
            >
              <Image
                src={`${IMG}/figma/new-reset-web.png`}
                alt="The redesigned password reset page with inline validation"
                fill
                sizes="(min-width: 40em) 50vw, 100vw"
              />
            </Macbook>
            <div className="cs-phones" style={{ '--r': '4deg', '--y': '-4%' } as React.CSSProperties}>
              <Iphone>
                <Image
                  src={`${IMG}/figma/new-mobile.png`}
                  alt="The redesigned mobile sign-in"
                  fill
                  sizes="(min-width: 40em) 20vw, 40vw"
                />
              </Iphone>
              <Iphone>
                <Image
                  src={`${IMG}/figma/sms-mobile.png`}
                  alt="The mobile verification chooser"
                  fill
                  sizes="(min-width: 40em) 20vw, 40vw"
                />
              </Iphone>
            </div>
          </div>
        </Band>

        {/* ══ Act 05 · Handoff ══ */}
        <Col>
          <Act phase="Handoff" num="05" title="Validated, approved, and handed off">
            <div className="cs-prose">
              <p>
                In before-and-after usability testing, the redesigned system produced{' '}
                <strong>25% faster login</strong>, 4.5% more successful sign-ins, a 78%
                reduction in login-method decision time, higher confidence, and lower reported
                difficulty. One guided experience now spans mobile and desktop.
              </p>
              <p>
                The token-based flow <strong>passed architecture and security review</strong>,
                and the completed designs were handed off for implementation after my
                internship.
              </p>
            </div>
          </Act>

          <Block tight>
            <MonoLabel icon="flag">What I handed off</MonoLabel>
            <Checklist
              items={[
                'The token-based flow, mapped as states and transitions',
                'SSO-first login for desktop and mobile',
                'SMS verification and provider-named sign-in for mobile',
                'The redesigned password reset with inline validation',
                'Coded prototypes with real inputs and code entry',
                "The workflow behind Awardco's AI-prototyping guide",
              ]}
            />
          </Block>

          <Block>
            <Two
              items={[
                {
                  label: 'Learnings',
                  icon: 'bulb',
                  body: (
                    <>
                      <p>
                        I learned <strong>not to follow a metric without asking what it was
                        actually rewarding</strong>. The password-first design won the task
                        test, but it worked against the larger product evidence. Choosing the
                        slightly slower direction produced the better system.
                      </p>
                      <p>
                        The biggest improvement was not a cleaner login page. It was changing{' '}
                        <strong>how authentication state moved</strong> between two parts of
                        the product.
                      </p>
                    </>
                  ),
                },
                {
                  label: 'Reflections',
                  icon: 'pen',
                  body: (
                    <p>
                      One limitation remains. Some deskless workers cannot carry phones during
                      their shifts and access Awardco through <strong>shared kiosks</strong>.
                      SMS does not solve authentication for them. If I continued the project,
                      kiosk research would be the next place I looked.
                    </p>
                  ),
                },
              ]}
            />
          </Block>

          <Reveal>
            <GhostCard
              word="What next?"
              title="What would come next?"
              items={[
                <>
                  <strong>Kiosk research</strong> for deskless workers who cannot carry a
                  phone on shift
                </>,
                <>
                  Watching the <strong>production numbers</strong> once the handed-off system
                  ships, against the 34.6% and 98% baselines
                </>,
                <>
                  Carrying the <strong>coded-prototype workflow</strong> into the next flows
                  the team tests
                </>,
              ]}
            />
          </Reveal>
        </Col>

        {/* ══ Read next ══ */}
        <Col>
          <Block>
            <span className="cs-eyebrow">More work</span>
            <h2 className="cs-headline">Read next</h2>
            <div className="cs-next">
              <LucidTile />
              <PatternTile />
            </div>
          </Block>
        </Col>
      </main>

      <Footer width="article" />
    </div>
  )
}
