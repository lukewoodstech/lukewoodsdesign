import type { CaseStudySections } from '@/lib/sections'
import Image from 'next/image'
import ScreenCarousel from '@/components/ScreenCarousel'
import VideoPlayer from '@/components/cs/VideoPlayer'
import { MonoLabel } from '@/components/cs/Story'
import { getCaseStudy, type Screen } from '@/lib/caseStudies'

/*
 * The Pitch case study's sections, copy as Luke wrote it (2026-11-11).
 * Every image, alt text and the site recording are the ones the earlier
 * stage layout used. The stack list still reads from lib/caseStudies.ts,
 * so it stays the one source for what Pitch is built on.
 */

const IMG = '/work/pitch'

/* A row of phones in the thin bezel, each named under its screen. */
function Phones({ screens }: { screens: Screen[] }) {
  return <ScreenCarousel screens={screens} />
}

/* Before over after, each row named. */
function BeforeAfter({ before, after }: { before: Screen[]; after: Screen[] }) {
  return (
    <>
      <p className="cs-row-label">Before</p>
      <ScreenCarousel screens={before} />
      <p className="cs-row-label">After</p>
      <ScreenCarousel screens={after} />
    </>
  )
}

type GalleryItem = { src: string; label: string; alt: string; width: number; height: number }

/* Images of any shape in one row at one height, each named under it. */
function Gallery({ items }: { items: GalleryItem[] }) {
  return (
    <div className={`cs-gallery${items.length > 3 ? ' cs-gallery--many' : ''}`}>
      <div className="cs-gallery__row">
        {items.map((g) => (
          <div key={g.src} className="cs-gallery__item" style={{ flex: `${g.width / g.height} 1 0` }}>
            <Image
              src={g.src}
              alt={g.alt}
              width={g.width}
              height={g.height}
              sizes="(min-width: 65em) 520px, 90vw"
              className="cs-gallery__img"
            />
            <span className="cs-screens__name">{g.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Wide shots stacked in the split column, each named under it. */
function Stacked({ items }: { items: GalleryItem[] }) {
  return (
    <div className="vs-stacked">
      {items.map((g) => (
        <div key={g.src}>
          <div className="vs-visual__frame">
            <Image src={g.src} alt={g.alt} width={g.width} height={g.height} sizes="(min-width: 65em) 560px, 100vw" />
          </div>
          <span className="cs-screens__name">{g.label}</span>
        </div>
      ))}
    </div>
  )
}

function SiteTour() {
  return (
    <>
      <VideoPlayer
        src={`${IMG}/site-tour.mp4`}
        poster={`${IMG}/site-tour-poster.jpg`}
        label="usepitch.app, top to bottom: the hero, how it works, the dashboard and the features"
      />
      <p className="vs-link">
        <a href="https://usepitch.app" className="cs-cap__link" target="_blank" rel="noopener noreferrer">
          Open usepitch.app ↗
        </a>
      </p>
    </>
  )
}

function Stack() {
  const stack = getCaseStudy('pitch')?.stack ?? []
  return (
    <div className="vs-panel">
      <div className="cs-stack cs-stack--compact">
        {stack.map((group) => (
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
    </div>
  )
}

export const pitch: CaseStudySections = {
  // Cornflower, the brand accent (LUK-119), the same value as the app tokens.
  accent: '#4c7be8',
  sections: [
    {
      step: 'Audit',
      subtitle: 'The main feature was hidden',
      body: 'When I joined, the app worked but it was hard to use. Every screen was dark, the brand was a big orange PITCH, and scores were shouted in red and green on every card. Worst of all, recording, the one thing the app exists to do, was hidden behind a speaker icon in the tab bar.',
      layout: 'split',
      visuals: [
        {
          alt: 'The old sign-in and feed screens',
          title: 'What I walked into',
          element: (
            <Phones
              screens={[
                {
                  src: `${IMG}/before-signin.png`,
                  label: 'Sign in',
                  alt: 'The old sign-in: a blurred photo, a heavy PITCH wordmark, and outlined fields',
                },
                {
                  src: `${IMG}/before-feed.png`,
                  label: 'Feed',
                  alt: 'The old Pitch Feed: dark cards titled Pitch 005 and Pitch 004, red and green scores, and an End recording bar over the tab bar',
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      step: 'Principles',
      subtitle: 'Built for the few seconds between doors',
      body: "Before touching any screens, I wrote down what the app actually had to do. Reps check it between doors, often outside in the sun. It records them all day, so it has to feel trustworthy, not like it's watching them. And every score needs to read as coaching, not a grade. The old look was built like a loud sports app, and it didn't fit any of that.",
      visuals: [],
    },
    {
      step: 'Exploration',
      subtitle: 'Four directions, and calm won',
      body: 'I redrew the feed, the screen reps open after every door, four ways: a dense list, calm cards, a view that leads with the number, and one built around the logo. We picked calm because it answered the trust problem best. Coaching read like advice instead of a report card, and wrapping the score around the play button made listening back feel natural.',
      visuals: [
        {
          alt: 'The feed drawn five ways',
          title: 'The same afternoon of doors, drawn five ways. We chose B.',
          element: (
            <Gallery
              items={[
                { src: `${IMG}/dir-today.png`, label: 'Today', alt: 'The feed as it shipped: dark charcoal cards, capitals and outlined chips', width: 560, height: 1181 },
                { src: `${IMG}/dir-market.png`, label: 'A · Market', alt: 'Direction A: one dense list of rows with score tiles and a stacked bar for the day', width: 560, height: 1181 },
                { src: `${IMG}/dir-private.png`, label: 'B · Private', alt: 'Direction B: white rounded cards on a pale page, serif titles and scores, a score ring around each play button', width: 560, height: 1181 },
                { src: `${IMG}/dir-exchange.png`, label: 'C · Exchange', alt: 'Direction C: today’s average as a big number, then rows with each door against the average', width: 560, height: 1181 },
                { src: `${IMG}/dir-pitch.png`, label: 'D · Pitch', alt: 'Direction D: scores ending in a coloured period, coaching pinned to the waveform', width: 560, height: 1181 },
              ]}
            />
          ),
        },
      ],
    },
    {
      step: 'Color',
      subtitle: 'A brand blue that never reads as a grade',
      body: "Scores already use green, amber, and red, so the brand color couldn't look like a score. I tested eight blues and picked Cornflower because it stays clearly apart from the score colors, with a darker version for text that passes contrast on white. Blue only shows up on things you tap or should look at.",
      visuals: [
        {
          src: `${IMG}/dir-accents.png`,
          width: 1800,
          height: 674,
          alt: 'Eight accent swatches, from Iris to Dusk, each shown as a Request a demo button with its contrast as text; Cornflower is outlined',
          title: 'Eight blues, one pick',
        },
      ],
    },
    {
      step: 'System',
      subtitle: 'A quieter brand so the numbers stand out',
      body: "Scores and the day's heading use a serif so the numbers that matter pop at a glance. Everything you read uses Hanken Grotesk, which stays clear at small sizes. Cards went white with a soft shadow instead of a black outline, and the logo became a lowercase pitch with a blue period so the brand stays quieter than the work.",
      visuals: [
        {
          alt: 'The app icon, before and after',
          title: 'The app icon, before and after',
          element: (
            <div className="vs-icons">
              <Gallery
                items={[
                  { src: `${IMG}/brand-icon-before.png`, label: 'Before', alt: 'The old app icon: an extruded blue PITCH. on a coral ground', width: 600, height: 600 },
                  { src: `${IMG}/brand-icon-after.png`, label: 'After', alt: 'The new app icon: the lowercase wordmark pitch in near-black with a cornflower period, on white', width: 600, height: 600 },
                ]}
              />
            </div>
          ),
        },
        {
          src: `${IMG}/brand-share.jpg`,
          width: 1200,
          height: 630,
          alt: 'The site’s share card: the wordmark, a serif headline with a cornflower period, and one line on a pale ground',
          title: 'Share card',
        },
        {
          src: `${IMG}/design-system.png`,
          width: 3200,
          height: 1720,
          alt: 'The Pitch design system sheet: the serif and Hanken Grotesk type scales, the cornflower and score colors, a feed card, the score bands and the floating tab bar, with a card rebuilt from the old theme',
          title: "The system, drawn from the app's own tokens",
        },
      ],
    },
    {
      step: 'Recording',
      subtitle: 'One button to record a shift',
      body: 'Starting used to take a speaker icon, a floating toast, and a full screen sheet to stop. Now recording is the big blue button in the middle of the tab bar. A rep taps it once at the start of a shift, Pitch listens the whole time, and it splits the day into doors on its own. One small sheet shows the mic and ends the shift.',
      layout: 'split',
      visuals: [
        {
          alt: 'Recording, before and after',
          title: 'Recording, before and after',
          element: (
            <BeforeAfter
              before={[
                {
                  src: `${IMG}/before-recording.png`,
                  label: 'Recording',
                  alt: 'The old recording state: a green End recording toast with a timer floating over the feed, and a speaker icon in the tab bar',
                },
                {
                  src: `${IMG}/before-stop.png`,
                  label: 'Stopping',
                  alt: 'The old stop: a full-screen End recording? sheet with a black button and a Keep recording link',
                },
              ]}
              after={[
                {
                  src: `${IMG}/record-ready.png`,
                  label: 'Ready',
                  alt: 'The feed with the floating tab bar: Feed, Stats, the blue record button in the centre, Coach and Team',
                },
                {
                  src: `${IMG}/record-listening.png`,
                  label: 'Listening',
                  alt: 'The listening sheet over the dimmed feed: Listening, just started. Auto-records when a conversation starts. The phone mic with a Change link, then Done and End recording.',
                },
                {
                  src: `${IMG}/record-mic.png`,
                  label: 'Mic',
                  alt: 'Connect your mic: the built-in microphone, connected and recording now, with links to search again or forget the mic',
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      step: 'Rollout',
      subtitle: 'Every screen, one system',
      body: 'I moved every screen a rep sees onto the new system, plus the onboarding emails, the manager console, and the website. The feed shows each day with its doors underneath, a calendar lets reps jump back to any day, and an account page explains exactly what gets recorded and why.',
      layout: 'split',
      visuals: [
        {
          alt: 'The new feed, calendar and account screens',
          title: 'The new feed',
          element: (
            <Phones
              screens={[
                {
                  src: `${IMG}/feed-now.png`,
                  label: 'Feed',
                  alt: 'The new feed: the day as a serif heading with its average, doors as white cards with a score, a clip and one line of coaching, and the floating tab bar',
                },
                {
                  src: `${IMG}/calendar.png`,
                  label: 'Go to a day',
                  alt: 'The calendar picker: a sheet over the feed to jump to any day, with days that have doors marked',
                },
                {
                  src: `${IMG}/account.png`,
                  label: 'Account',
                  alt: 'Account: the rep, their device and sync status, a reconnect-mic row, support, and what is recorded and why',
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      step: 'Coaching',
      subtitle: 'Lost doors become practice',
      body: "Stats tracks pace against the week's goal instead of just showing totals. Coach takes a door the rep lost and turns it into practice: what they said, a better answer, and a quick roleplay.",
      layout: 'split',
      visuals: [
        {
          alt: 'The Stats and Coach screens',
          title: 'Stats and Coach',
          element: (
            <Phones
              screens={[
                {
                  src: `${IMG}/screen-stats-now.png`,
                  label: 'Stats',
                  alt: 'Stats: sales this week against the goal with a pace line, today’s conversations, pitches and close attempts against targets, and the floating tab bar',
                },
                {
                  src: `${IMG}/screen-coach-now.png`,
                  label: 'Coach',
                  alt: 'Coach: an objection the rep lost a door on, quoted from the transcript with what the rep said, a button to show a good response, and a two-minute roleplay',
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      step: 'Onboarding',
      subtitle: 'One email to get started',
      body: 'New reps get one invite email, claim their account, and download the app. Managers sign in to the console. The brand looks the same from the inbox to the app.',
      layout: 'split',
      visuals: [
        {
          alt: 'The invite email and the console sign-in',
          title: 'Invite and console',
          element: (
            <Stacked
              items={[
                { src: `${IMG}/onboard-invite.png`, label: 'The invite', alt: 'The invite email: a serif Pitch wordmark, You’re invited to join Pitch, one line on what happens next, and a cornflower Join the team button', width: 1440, height: 880 },
                { src: `${IMG}/onboard-signin.png`, label: 'Console sign-in', alt: 'The manager console sign-in: Welcome back in serif over a white card with email and password and a cornflower Sign in button', width: 2880, height: 1800 },
              ]}
            />
          ),
        },
      ],
    },
    {
      step: 'Website',
      subtitle: 'I designed and built the site too',
      body: 'I also designed and built usepitch.app in Next.js, with scroll-pinned story sections that walk through how Pitch works, the dashboard, and the features.',
      visuals: [
        {
          alt: 'A screen recording of usepitch.app',
          title: 'usepitch.app, top to bottom',
          element: <SiteTour />,
        },
      ],
    },
    {
      step: 'Impact',
      subtitle: 'Live with a pilot team',
      body: 'Pitch is live with a pilot team. Reps record a full shift with one tap and get coaching on every door. I designed in Figma and paired with Claude Code on the code, from on-device speech detection that splits a shift into doors to the website, with every change tracked in Linear and GitHub.',
      visuals: [
        {
          alt: 'What Pitch is built on',
          title: "What it's built on",
          element: <Stack />,
        },
      ],
    },
  ],
}
