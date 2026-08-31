import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { SITE } from './site'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

/** The site accent — case studies pass their own via `accent`. */
export const OG_ACCENT = '#008fff'

/*
 * Satori renders in a generic sans unless handed real font data — and the
 * site is IBM Plex Mono end to end, so the link preview must be too.
 * TTFs live in lib/og-fonts (OFL-licensed); process.cwd() is the project root.
 */
export async function ogFonts() {
  const [regular, medium] = await Promise.all([
    readFile(join(process.cwd(), 'lib/og-fonts/IBMPlexMono-Regular.ttf')),
    readFile(join(process.cwd(), 'lib/og-fonts/IBMPlexMono-Medium.ttf')),
  ])
  return [
    { name: 'IBM Plex Mono', data: regular, style: 'normal' as const, weight: 400 as const },
    { name: 'IBM Plex Mono', data: medium, style: 'normal' as const, weight: 500 as const },
  ]
}

/*
 * The shared link-preview card. Satori (which renders these) only supports
 * flexbox and a subset of CSS — no grid, and every element with more than one
 * child needs an explicit `display: flex`.
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
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#000000',
        padding: '80px',
        fontFamily: '"IBM Plex Mono", monospace',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {eyebrow && (
          <div
            style={{
              fontSize: 28,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: accent,
              marginBottom: 24,
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            fontSize: title.length > 40 ? 68 : 86,
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}
        >
          {title}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: 120, height: 5, background: accent, marginBottom: 28 }} />
        <div style={{ display: 'flex', fontSize: 30, color: '#ffffff' }}>
          <span>{SITE.name}</span>
          <span style={{ color: 'rgba(255,255,255,0.45)', marginLeft: 16 }}>
            {SITE.role}
          </span>
        </div>
      </div>
    </div>
  )
}
