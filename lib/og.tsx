import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { SITE } from './site'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

/** The site accent — case studies pass their own via `accent`. */
export const OG_ACCENT = '#008fff'

/*
 * Satori renders in a generic sans unless handed real font data. The card
 * follows the site's type system: Instrument Serif for the headline (the same
 * face as the home hero sentence and the /about headers), Geist Sans for the
 * byline, Geist Mono for the one small label. Static TTFs (Satori has no
 * variable-font or woff2 support) live in lib/og-fonts (all OFL-licensed);
 * process.cwd() is the project root.
 */
const FONT_DIR = 'lib/og-fonts'

export async function ogFonts() {
  const read = (file: string) => readFile(join(process.cwd(), FONT_DIR, file))
  const [sansRegular, sansSemiBold, monoMedium, serifRegular] = await Promise.all([
    read('Geist-Regular.ttf'),
    read('Geist-SemiBold.ttf'),
    read('GeistMono-Medium.ttf'),
    read('InstrumentSerif-Regular.ttf'),
  ])
  return [
    { name: 'Geist', data: sansRegular, style: 'normal' as const, weight: 400 as const },
    { name: 'Geist', data: sansSemiBold, style: 'normal' as const, weight: 600 as const },
    { name: 'Geist Mono', data: monoMedium, style: 'normal' as const, weight: 500 as const },
    { name: 'Instrument Serif', data: serifRegular, style: 'normal' as const, weight: 400 as const },
  ]
}

const SANS = '"Geist", sans-serif'
const MONO = '"Geist Mono", monospace'
const SERIF = '"Instrument Serif", serif'

/*
 * The case-study dot grid, as one full-bleed image.
 *
 * On the site this is a repeating radial-gradient (see .cs-canvas in
 * globals.css: 1.5px dots at 11% white on a 30px pitch). Satori supports
 * neither repeating backgrounds nor radial-gradient, but it renders an <img>
 * faithfully — so the grid ships as a data-URI SVG sized to the whole card,
 * with the pitch scaled up to 40px because the card is rendered at roughly
 * twice the size it gets shown at in a feed.
 */
const DOT_GRID = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_SIZE.width}" height="${OG_SIZE.height}">` +
    '<defs><pattern id="d" width="40" height="40" patternUnits="userSpaceOnUse">' +
    '<circle cx="20" cy="20" r="2" fill="#ffffff" fill-opacity="0.11"/>' +
    '</pattern></defs>' +
    '<rect width="100%" height="100%" fill="url(#d)"/>' +
    '</svg>',
).toString('base64')}`

/*
 * The shared link-preview card: the homepage hero, reduced to a still.
 * Black, the dot grid, the sentence (or a case study's title) in the display
 * serif, the accent rule, and the byline. It replaced a rendering of the old
 * VS Code terminal panel — tabs, zsh prompt and all — when the site stopped
 * looking like an editor.
 *
 * Satori only supports flexbox and a subset of CSS: no grid, and every element
 * with more than one child needs an explicit `display: flex`.
 */
export function OgCard({
  eyebrow,
  title,
  accent = OG_ACCENT,
}: {
  /** Small mono label above the title — a case study's company. Home omits it. */
  eyebrow?: string
  /** An array sets one line per item; a string is left to wrap on its own. */
  title: string | readonly string[]
  accent?: string
}) {
  const lines = typeof title === 'string' ? [title] : title
  /*
   * One step down for a long headline. A short case-study title gets the
   * larger size and still sets in two lines.
   */
  const size = lines.join(' ').length > 34 ? 76 : 96

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#000000',
        /* Keeps the card from dissolving into a dark-themed feed behind it. */
        border: '2px solid rgba(255,255,255,0.12)',
        padding: '78px 84px 74px',
        fontFamily: SANS,
      }}
    >
      {/* Satori renders <img>; next/image means nothing to it. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={DOT_GRID}
        alt=""
        width={OG_SIZE.width}
        height={OG_SIZE.height}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {eyebrow ? (
          <div
            style={{
              fontFamily: MONO,
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: accent,
              marginBottom: 34,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontFamily: SERIF,
            fontSize: size,
            lineHeight: 1.12,
            letterSpacing: '-0.005em',
            color: '#ffffff',
            /* The headline is the picture; it shouldn't run the full 1032px. */
            maxWidth: 940,
          }}
        >
          {lines.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: 96, height: 4, background: accent, marginBottom: 26 }} />
        <div style={{ display: 'flex', fontSize: 27 }}>
          <span style={{ fontWeight: 600, color: '#ffffff' }}>{SITE.name}</span>
          <span style={{ color: 'rgba(255,255,255,0.45)', marginLeft: 18 }}>{SITE.role}</span>
        </div>
      </div>
    </div>
  )
}
