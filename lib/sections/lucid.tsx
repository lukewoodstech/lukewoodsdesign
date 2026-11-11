import type { CaseStudySections } from '@/lib/sections'
import { Notes } from '@/components/cs/Story'
import Callouts from '@/components/cs/Callouts'
import LayoutContest from '@/components/lucid/LayoutContest'
import CompareStage from '@/components/lucid/CompareStage'
import ZoomShot from '@/components/lucid/ZoomShot'
import BoardGenClip from '@/components/lucid/BoardGenClip'
import MentionFlow from '@/components/lucid/MentionFlow'
import ShipTimeline from '@/components/lucid/ShipTimeline'

/*
 * The Lucid case study's sections, copy as Luke wrote it (2026-11-11).
 * His bracketed placeholders were filled from facts already on the page
 * (2026-11-11), so nothing here claims more than he has said: no AI
 * research claim, and "why four words" uses the earlier page's line. Interactive visuals that already existed on the page are
 * reused as elements; visuals with no asset yet are labelled placeholders.
 */

const IMG = '/case-studies/lucid'

const ZERO_STATES = [
  {
    src: 'skill-find.png',
    alt: 'The Find docs skill in the panel: it explains it can search by collaborators, timeframe, canvas content, and connected project views, with three quick-view chips under the text',
  },
  {
    src: 'skill-summarize.png',
    alt: 'The Summarize skill in the panel, explaining project syncs, catch-up reports, thematic reviews, and single file deep dives, with three cross-file prompt chips',
  },
  {
    src: 'skill-diagram-zero.png',
    alt: 'The Build a diagram skill in the panel, asking what kind of diagram you want, with Flowchart, Mind map, ERD, AWS, and More chips',
  },
]

export const lucid: CaseStudySections = {
  accent: '#FF7A21',
  sections: [
    {
      step: 'Discovery',
      subtitle: 'People remember content, not titles',
      body: 'Lucid search only matched document titles, so if you forgot the name you were stuck scrolling recents or fighting advanced filters. Earlier research from my PM showed heavy enterprise users found the right doc in the top five results less than half the time. I ran sessions with 12 users across the UK, Chile, the US, New Zealand, and India, and they kept describing docs by what was in them, who made them, or when.',
      visuals: [
        {
          alt: 'Example user quotes',
          caption: 'Illustrative examples of how users described the doc they were looking for.',
          element: (
            <Notes
              quotes
              label=""
              notes={[
                'the pricing one with the big comparison table, finance made it I think',
                'our onboarding flowchart, the one with all the red decision diamonds',
                'the offsite retro from spring, three columns of sticky notes',
              ]}
            />
          ),
        },
        {
          alt: 'Home page, before, with callouts',
          caption: 'Title only search, no AI entry point, and scrolling recents as the fallback.',
          element: (
            <Callouts
              src={`${IMG}/home-before.png`}
              alt="The old Lucid homepage, annotated: a search bar that only matches keywords in titles, four open spots where an AI entry point could go (beside search, the left nav, the links at the bottom of it, and the top right), and a long grid of recent documents"
              width={2880}
              height={1800}
              sizes="(min-width: 65em) 1040px, 100vw"
              items={[
                {
                  label: 'Title keywords only',
                  text: <>Search matched keywords in <strong>document titles</strong> and nothing else.</>,
                  x: 16.8,
                  y: 1.4,
                  w: 33.8,
                  h: 4.4,
                },
                {
                  label: 'Room for AI',
                  text: <>Lucid AI lived <strong>only in the editor</strong>. Four open spots could take it.</>,
                  x: 50.9,
                  y: 1.4,
                  w: 5,
                  h: 4.4,
                  more: [
                    { x: 1.6, y: 22.1, w: 13.3, h: 11.6 },
                    { x: 1.4, y: 67.1, w: 13.8, h: 30.5 },
                    { x: 79.1, y: 1.5, w: 4.5, h: 4.4 },
                  ],
                },
                {
                  label: 'Scroll to find',
                  text: <>Without the title, the fallback was <strong>recent documents</strong>, which run for pages.</>,
                  x: 20.3,
                  y: 61.5,
                  w: 76.3,
                  h: 38,
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      step: 'Placement',
      subtitle: 'One new button, nothing to relearn',
      body: 'We tested a few places for AI to live: the search bar, the left nav, the bottom links, and the top right icons. Users went straight to the spot next to search, it matched how other tools place AI, and the space was already empty. One button, no layout changes.',
      visuals: [
        {
          src: `${IMG}/home-entry.png`,
          width: 2880,
          height: 1800,
          alt: 'The Lucid homepage with one addition: a Lucid AI sparkle button in the empty space beside the search bar',
          caption: 'The sparkle button sits in the empty space beside search.',
        },
      ],
    },
    {
      step: 'Exploration',
      subtitle: 'The side panel won, then power users asked for more room',
      body: 'I coded four layouts to test with real users: a side panel, a modal, a floating corner panel, and an inline bar. The side panel won because people could keep working while they asked. Testing also showed power users wanted more space for longer conversations, so I added a full page view you can toggle into. Building them in code with Claude Code meant each layout was a working version people could actually use, not a click-through.',
      visuals: [
        {
          alt: '4 coded harness prototypes',
          caption: 'Four layouts, coded and tested with users.',
          element: <LayoutContest />,
        },
        {
          alt: 'Final side panel and full page',
          caption: 'Docked to keep working, full page for longer conversations.',
          element: (
            <CompareStage
              ariaLabel="The shipped expand interaction: side panel versus full page"
              layers={[
                {
                  src: `${IMG}/panel-side.png`,
                  alt: 'Lucid AI docked as a side panel beside the homepage document list, offering its skills',
                  label: 'Side panel',
                  caption: '',
                  width: 2880,
                  height: 1800,
                },
                {
                  src: `${IMG}/panel-full.png`,
                  alt: 'Lucid AI expanded to a full page over the homepage',
                  label: 'Full page',
                  caption: '',
                  width: 2880,
                  height: 1800,
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      step: 'Scope',
      subtitle: '20+ ideas down to 3 skills',
      body: 'Search was only part of the problem. Managers wanted to catch up on their teams and leaders wanted summaries across projects. We prototyped over 20 capabilities and cut to the ones people needed most. Each skill opens with an example response, so users learn what it can do before they try it.',
      layout: 'split',
      visuals: [
        {
          src: `${IMG}/skills-ideation.png`,
          width: 1680,
          height: 1956,
          orientation: 'tall',
          alt: 'An ideation grid of twenty candidate capabilities for the homepage assistant, including Find docs, Summarize, Catch up, Build a diagram, dormant files, and project status',
          caption: 'Candidate capabilities from the design file, before the cut.',
        },
        {
          orientation: 'wide',
          alt: 'Zero state responses for Find docs, Summarize, Build a diagram',
          caption: 'Each skill teaches itself first. Catch up is next on the list.',
          element: (
            <div className="vs-trio">
              {ZERO_STATES.map((z) => (
                <div key={z.src} className="vs-visual__frame">
                  <ZoomShot
                    src={`${IMG}/${z.src}`}
                    alt={z.alt}
                    width={1760}
                    height={1312}
                    sizes="(min-width: 65em) 340px, 100vw"
                  />
                </div>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      step: 'Results',
      subtitle: 'More results needed a smaller row',
      body: "We started with three results and a 24px button. Testing showed people needed more options, so the AI now returns up to seven, ranked by confidence. Seven of those buttons was way too heavy for a side panel, so I designed a new 16px results component that's now part of Lucid's AI design system.",
      visuals: [
        {
          src: `${IMG}/results-final-16px.png`,
          width: 2400,
          height: 1312,
          alt: 'The shipped document results: seven compact document chips, each followed by a one-line AI-generated summary, ranked strongest match first, ending with an offer to narrow or open',
          caption: 'Compact rows, a one line AI summary, and a next step.',
        },
      ],
    },
    {
      step: 'Loading',
      subtitle: 'Never leave someone waiting in silence',
      body: 'Build a diagram is the only skill that leaves the panel. It asks what kind of diagram first, takes a prompt, then builds it in a new tab. The status line names every step so the wait never feels dead. I reused the loading pattern from Lucid AI in the editor instead of making a new one.',
      visuals: [
        {
          alt: 'Build a diagram full flow',
          caption: 'Diagram type first, then the prompt, with every step named.',
          element: (
            <div className="vs-stack">
              <div className="vs-visual__frame">
                <ZoomShot
                  src={`${IMG}/skill-diagram.png`}
                  alt="Build a diagram in progress: the homepage on the left, and in the panel a diagram-type chooser, a chosen flowchart, an example prompt, and a generating diagram status under a scanned canvas step"
                  width={2880}
                  height={1800}
                  sizes="(min-width: 65em) 1040px, 100vw"
                />
              </div>
              <div className="vs-visual__frame">
                <BoardGenClip />
              </div>
            </div>
          ),
        },
      ],
    },
    {
      step: 'Mentions',
      subtitle: "Let people pick, don't make the AI guess",
      body: 'In testing, Find docs kept guessing the wrong person when someone typed a name. Instead of trying to make the guess smarter, I added @mention so users pick the exact teammate or team. It shipped in the AI panel and the regular search bar.',
      visuals: [
        {
          alt: 'Mention / collaborator tool',
          caption: 'Type @, pick a person or team, and it becomes a chip the search can use.',
          element: (
            <div className="vs-visual__frame">
              <MentionFlow />
            </div>
          ),
        },
      ],
    },
    {
      step: 'Search',
      subtitle: 'Long questions get an AI answer',
      body: 'Regular search still works by keyword, but once a query passes four words it also shows an AI answer above the results. A sentence gets an answer, a keyword still gets a list. My manager owned this design. I contributed to the ideation and designed the mention tool, the doc results, and the path into the full chat.',
      visuals: [
        {
          src: `${IMG}/search-ai-answer.png`,
          width: 2880,
          height: 1800,
          alt: 'The search results page: a resolved mention chip inside the keyword query, an AI answer listing documents with one-line summaries above the results table, and a chat input under the answer that continues into Lucid AI',
          caption: 'Keyword results stay, with an AI answer on top for longer questions.',
        },
      ],
    },
    {
      step: 'Failure states',
      subtitle: 'Designing for when the AI gets it wrong',
      body: "AI fails, so the experience has to fail well. When a request isn't supported, it says so and offers two things it can do instead. When results are wrong, it asks for a better clue and offers ways to narrow the search. Every response gets a thumbs up or down so the team can learn what's missing.",
      visuals: [],
    },
    {
      step: 'Impact',
      subtitle: 'Shipped to every tier in 12 weeks',
      body: 'We went from a blank page to an internal release on July 20 and general release on August 5, on every Lucid tier from free to enterprise. Three skills shipped: Find docs, Summarize, and Build a diagram, with Catch up next on the list. I left before there was real adoption data, so I set up an A/B test comparing the side panel and full page as the default, which also tracks which skills get used most.',
      visuals: [
        {
          alt: 'Ship timeline',
          caption: 'Research to general release in about three months.',
          element: <ShipTimeline />,
        },
      ],
    },
    {
      step: 'Reflection',
      subtitle: "What I'd do differently, and what's next",
      body: 'The biggest lesson was that AI design is constant tradeoffs between speed, cost, and usability, and keeping something this open ended simple is the hardest part. We moved fast because the feedback never stopped: users saw every round, and engineers saw designs within days. If I did it again, I would set up the A/B test earlier, so there would be real usage data before my internship ended. Next is giving the homepage AI and the editor AI one shared brain, with memory and chat history designs already handed off.',
      visuals: [],
    },
  ],
}
