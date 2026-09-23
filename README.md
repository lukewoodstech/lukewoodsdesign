# lukewoodsdesign.com

My portfolio. A product designer's site, built as a product rather than
assembled from a template — [lukewoodsdesign.com](https://lukewoodsdesign.com).

Next.js 16, React 19, TypeScript, Tailwind 4, deployed on Vercel.

## Why the repo is worth opening

Most portfolio sites are a template with someone's work poured into them.
This one is the work. If you are deciding whether I can hold my own
alongside engineers, the useful evidence is here rather than on the site:

- **`git log`.** Every commit says what changed and *why*, including the
  calls that got reversed a day later — a testimonial carousel that became
  a wall and then a panel again, a hero that auto-played on phones until it
  turned out to be worse. The reasoning is the point.
- **The comments.** Files explain their own constraints. `lib/about.ts`
  records which numbers are sales rather than profit and why the
  distinction is regex-guarded; `components/about/Testimonials.tsx` explains
  why a fixed line count is what keeps the arrows from moving.
- **`lib/lukeAiFacts.ts`.** Everything Luke AI is allowed to say about me,
  with the prohibitions next to the claims.

## Luke AI

The chat in the corner answers questions about my work — streamed from
Claude through a Next.js route, with conversations stored only in your own
browser.

It is built to do the jobs the pages cannot, not to restate them: paste a
job description and get an honest fit map, ask what got cut from a project,
ask what I would change now. The suggested questions change with the page
you are reading.

It runs on a truth layer rather than on vibes. `lib/lukeAiFacts.ts` is the
only thing it knows; `lib/lukeAiGuard.ts` holds the patterns it must never
produce — inflated titles, a metric restated as the wrong kind of number,
a claim no case study supports. `npm test` checks the guardrails offline
and `npm run test:live` runs real prompts against the model and asserts on
what comes back.

## Built with Claude Code

I wrote the direction, the copy, and the design calls. Claude Code wrote
most of the lines, under review, in a loop that looks like working with a
fast engineer who never gets bored of being told to try it another way.

`CLAUDE.md` and `AGENTS.md` are the standing instructions for that loop, and
`.claude/` holds the skills I use with it. The commit messages are the
record of how the decisions actually went, reversals included. I think that
workflow is a skill worth showing rather than hiding: a designer who can
specify precisely, review critically, and say *no, that's worse* is the
useful half of the pair.

## Running it

```bash
npm install
cp .env.example .env.local   # fill in what you need; the site runs without keys
npm run dev
```

`.env.example` documents every variable. The site works without any of
them — Luke AI needs `ANTHROPIC_API_KEY` to answer, and the one gated case
study stays shut without `CASE_STUDY_GATE_PASSWORD`, which is the intended
failure direction.

```bash
npm run build      # production build
npm test           # offline tests: truth layer, guardrails, sprite, chat guard
npm run test:live  # real model calls; needs ANTHROPIC_API_KEY
npm run lint
```

## Layout

```
app/                Routes. app/work/<slug> are bespoke pages, not a CMS.
components/         Shared UI; components/cs are the case-study primitives.
components/luke-ai/ The chat: dock, thread, composer, the pixel sprite.
lib/                Content and rules. about.ts, work.ts, lukeAiFacts.ts.
tests/              Offline and live checks for what Luke AI may say.
```

Case-study source material — interview records, rewrite skeletons, deck
exports — is kept out of this repo. It carries raw figures that the
published pages deliberately mask.

---

Luke Woods · product designer · [lukewoodsdesign.com](https://lukewoodsdesign.com)
