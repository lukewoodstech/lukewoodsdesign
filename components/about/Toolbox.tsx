import Link from 'next/link'
import type { Tool } from '@/lib/about'
import { PROCESS, type MethodIcon, type ProcessEntry } from '@/lib/process'

/*
 * "My process": Discovery, Design, Build, Test, Ship along one line
 * (2026-11-05). Under each step, the methods Luke uses first, then the
 * tools, each with one line from a real project, linked to the case
 * study when there is one. Methods and tools share one row shape; a
 * method's icon is a white line drawing on a neutral tile, a tool's is
 * its glyph on its brand colour. Copy lives in lib/process.ts.
 * Everything is visible at once: no JavaScript.
 */

/* Line icons in Lucide's style (24 grid, 2px stroke), inlined because
   the repo has no icon package and six paths don't justify one. */
const METHOD_PATHS: Record<MethodIcon, React.ReactNode> = {
  interviews: (
    <>
      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
    </>
  ),
  people: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  diverge: (
    <>
      <circle cx="12" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
      <path d="M12 12v3" />
    </>
  ),
  map: (
    <>
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="15" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <path d="M9 6h6" />
      <path d="M18 9v6" />
    </>
  ),
  compare: (
    <>
      <rect x="3" y="3" width="7" height="18" rx="1" />
      <rect x="14" y="3" width="7" height="18" rx="1" />
    </>
  ),
  code: (
    <>
      <path d="m18 16 4-4-4-4" />
      <path d="m6 8-4 4 4 4" />
      <path d="m14.5 4-5 16" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  review: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  handoff: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
}

function EntryIcon({ entry, tool }: { entry: ProcessEntry; tool?: Tool }) {
  if (entry.kind === 'method') {
    return (
      <span className="tb-ico tb-ico--method" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {METHOD_PATHS[entry.icon]}
        </svg>
      </span>
    )
  }
  if (!tool) return null
  return (
    <span className="tb-ico" style={{ background: tool.color }} aria-hidden="true">
      {tool.wordmark || !tool.icon ? (
        <span className="tb-ico__word">{tool.name.slice(0, 1)}</span>
      ) : (
        <span
          className="tb__glyph"
          style={{ maskImage: `url(${tool.icon})`, WebkitMaskImage: `url(${tool.icon})` }}
        />
      )}
    </span>
  )
}

export default function Toolbox({ tools }: { tools: ReadonlyArray<Tool> }) {
  return (
    <ol className="tb-rail">
      {PROCESS.map((step, s) => (
        <li key={step.title} className="tb-stage">
          <div className="tb-stage__head">
            <span className="tb-stage__dot" aria-hidden="true" />
            <span className="tb-stage__num">{String(s + 1).padStart(2, '0')}</span>
            <h3 className="tb-stage__title">{step.title}</h3>
          </div>
          <ul className="tb-stage__tools">
            {step.entries.map((e) => (
              <li key={`${e.kind}-${e.name}`} className="tb-tool">
                <EntryIcon
                  entry={e}
                  tool={e.kind === 'tool' ? tools.find((t) => t.name === e.name) : undefined}
                />
                <div className="tb-tool__body">
                  <span className="tb-tool__name">{e.name}</span>
                  <span className="tb-tool__line">
                    {e.line}
                    {e.link && (
                      <>
                        {' '}
                        <Link className="tb-tool__link" href={e.link.href}>
                          {e.link.label}
                          <span aria-hidden="true"> &rarr;</span>
                        </Link>
                      </>
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}
