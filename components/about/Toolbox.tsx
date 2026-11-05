import Link from 'next/link'
import type { Tool } from '@/lib/about'
import { PROCESS } from '@/lib/process'

/*
 * "My process": Discovery, Design, Build, Test, Ship along one line
 * (2026-11-05). Under each step, the tools Luke uses there and one line
 * on how he used each on a real project, linked to it when there's a
 * case study. Copy lives in lib/process.ts; icons come from TOOLS.
 * Everything is visible at once: no JavaScript.
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
      {PROCESS.map((step, s) => (
        <li key={step.title} className="tb-stage">
          <div className="tb-stage__head">
            <span className="tb-stage__dot" aria-hidden="true" />
            <span className="tb-stage__num">{String(s + 1).padStart(2, '0')}</span>
            <h3 className="tb-stage__title">{step.title}</h3>
          </div>
          <ul className="tb-stage__tools">
            {step.tools.map((pt) => {
              const tool = tools.find((t) => t.name === pt.name)
              return (
                <li key={pt.name} className="tb-tool">
                  {tool && <Icon tool={tool} />}
                  <div className="tb-tool__body">
                    <span className="tb-tool__name">{pt.name}</span>
                    <span className="tb-tool__line">
                      {pt.line}
                      {pt.link && (
                        <>
                          {' '}
                          <Link className="tb-tool__link" href={pt.link.href}>
                            {pt.link.label}
                            <span aria-hidden="true"> &rarr;</span>
                          </Link>
                        </>
                      )}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </li>
      ))}
    </ol>
  )
}
