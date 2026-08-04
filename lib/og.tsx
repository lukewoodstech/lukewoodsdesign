import { SITE } from './site'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

/*
 * The shared link-preview card. Satori (which renders these) only supports
 * flexbox and a subset of CSS — no grid, and every element with more than one
 * child needs an explicit `display: flex`.
 */
export function OgCard({ eyebrow, title }: { eyebrow?: string; title: string }) {
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
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {eyebrow && (
          <div
            style={{
              fontSize: 28,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#008fff',
              marginBottom: 24,
            }}
          >
            {eyebrow}
          </div>
        )}
        <div
          style={{
            fontSize: title.length > 40 ? 68 : 86,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}
        >
          {title}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ width: 120, height: 5, background: '#008fff', marginBottom: 28 }} />
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
