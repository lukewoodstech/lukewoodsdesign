import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { SITE } from './site'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

/** The site accent — case studies pass their own via `accent`. */
export const OG_ACCENT = '#008fff'

/*
 * Satori renders in a generic sans unless handed real font data. The card
 * follows the site's type system: Geist Sans for the title and byline,
 * Geist Mono for the terminal chrome around them. Static TTFs (Satori has no
 * variable-font or woff2 support) live in lib/og-fonts (OFL-licensed);
 * process.cwd() is the project root.
 */
const FONT_DIR = 'lib/og-fonts'

export async function ogFonts() {
  const [sansRegular, sansSemiBold, monoRegular, monoMedium] = await Promise.all([
    readFile(join(process.cwd(), FONT_DIR, 'Geist-Regular.ttf')),
    readFile(join(process.cwd(), FONT_DIR, 'Geist-SemiBold.ttf')),
    readFile(join(process.cwd(), FONT_DIR, 'GeistMono-Regular.ttf')),
    readFile(join(process.cwd(), FONT_DIR, 'GeistMono-Medium.ttf')),
  ])
  return [
    { name: 'Geist', data: sansRegular, style: 'normal' as const, weight: 400 as const },
    { name: 'Geist', data: sansSemiBold, style: 'normal' as const, weight: 600 as const },
    { name: 'Geist Mono', data: monoRegular, style: 'normal' as const, weight: 400 as const },
    { name: 'Geist Mono', data: monoMedium, style: 'normal' as const, weight: 500 as const },
  ]
}

const SANS = '"Geist", sans-serif'
const MONO = '"Geist Mono", monospace'

// "Product Designer" → "product-designer": the prompt line cd's somewhere real.
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

/*
 * The shared link-preview card, styled as the site's VS Code terminal panel
 * (same palette as .term-nav in globals.css: robbyrussell green arrow, cyan
 * cwd, panel #1e1e1e). Satori (which renders these) only supports flexbox and
 * a subset of CSS — no grid, and every element with more than one child needs
 * an explicit `display: flex`. The prompt arrow is ASCII `>` because the TTFs
 * we hand Satori have no glyph for ➜ and there is no fallback font.
 */
export function OgCard({
  eyebrow,
  title,
  accent = OG_ACCENT,
}: {
  eyebrow?: string
  title: string
  accent?: string
}) {
  const tab = { fontSize: 21, letterSpacing: '0.09em', textTransform: 'uppercase' as const }
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#000000',
        padding: '44px',
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#1e1e1e',
          border: '2px solid rgba(255,255,255,0.22)',
          borderRadius: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 36,
            padding: '26px 44px 0',
            borderBottom: '2px solid rgba(255,255,255,0.1)',
            fontFamily: MONO,
          }}
        >
          <span style={{ ...tab, color: '#8a8a8a', paddingBottom: 20 }}>problems</span>
          <span style={{ ...tab, color: '#8a8a8a', paddingBottom: 20 }}>output</span>
          <span
            style={{
              ...tab,
              color: '#e7e7e7',
              paddingBottom: 18,
              borderBottom: '2px solid #e7e7e7',
            }}
          >
            terminal
          </span>
          <span style={{ fontSize: 21, color: '#8a8a8a', marginLeft: 'auto', paddingBottom: 20 }}>
            zsh
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '48px 60px 52px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: 30,
                marginBottom: 40,
                fontFamily: MONO,
              }}
            >
              <span style={{ color: '#23d18b', fontWeight: 500 }}>&gt;</span>
              <span style={{ color: '#29b8db', marginLeft: 18 }}>~</span>
              <span style={{ color: '#cccccc', marginLeft: 18 }}>
                cd {slugify(eyebrow ?? 'portfolio')}
              </span>
              <div style={{ width: 15, height: 32, background: accent, marginLeft: 14 }} />
            </div>
            <div
              style={{
                fontSize: title.length > 40 ? 64 : 84,
                fontWeight: 600,
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                color: '#ffffff',
              }}
            >
              {title}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: 120, height: 5, background: accent, marginBottom: 26 }} />
            <div style={{ display: 'flex', fontSize: 28, color: '#ffffff' }}>
              <span>{SITE.name}</span>
              <span style={{ color: 'rgba(255,255,255,0.45)', marginLeft: 16 }}>
                {SITE.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
