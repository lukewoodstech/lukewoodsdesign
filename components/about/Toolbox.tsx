import Link from 'next/link'
import { TOOL_STAGES, type Tool } from '@/lib/about'

/*
 * The toolbox, laid out along how Luke works: find the problem, design
 * it, build it, ship it (2026-11-05). It replaced a Matter.js tray of
 * icons you could toss around, which showed what he uses but not how.
 *
 * Each stage is a stop on one line. Under it, a tool with a sourceable
 * story gets its icon, its name and that one line (and a link when the
 * line points at a case study). A tool without one is a plain name chip:
 * the truth layer has nothing to say about it, so the rail doesn't
 * either. Everything is visible at once, so there is nothing to tap and
 * no JavaScript.
 */

function Icon({ tool }: { tool: Tool }) {
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
      {TOOL_STAGES.map((stage, s) => {
        const here = tools.filter((t) => t.stage === stage.id)
        const told = here.filter((t) => t.provenance)
        const named = here.filter((t) => !t.provenance)
        return (
          <li key={stage.id} className="tb-stage">
            <div className="tb-stage__head">
              <span className="tb-stage__dot" aria-hidden="true" />
              <span className="tb-stage__num">{String(s + 1).padStart(2, '0')}</span>
              <h3 className="tb-stage__title">{stage.title}</h3>
            </div>

            {told.length > 0 && (
              <ul className="tb-stage__told">
                {told.map((t) => (
                  <li key={t.name} className="tb-tool">
                    <Icon tool={t} />
                    <div className="tb-tool__body">
                      <span className="tb-tool__name">{t.name}</span>
                      <span className="tb-tool__line">{t.provenance!.line}</span>
                      {t.provenance!.href && (
                        <Link className="tb-tool__link" href={t.provenance!.href}>
                          {t.provenance!.cta ?? 'See it in the work'}
                          <span aria-hidden="true"> &rarr;</span>
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {named.length > 0 && (
              <ul className="tb-stage__named" aria-label={`Also in ${stage.title.toLowerCase()}`}>
                {named.map((t) => (
                  <li key={t.name} className="tb-chip">
                    <Icon tool={t} />
                    {t.name}
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ol>
  )
}
