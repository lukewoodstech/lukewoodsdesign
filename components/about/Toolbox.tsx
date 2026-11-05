import Link from 'next/link'
import type { Tool } from '@/lib/about'
import { PROCESS } from '@/lib/process'

/*
 * "My process": five steps along one line (2026-11-05). Each step reads
 * top to bottom as the design fundamental, where AI comes in (only when
 * a fact says so), one piece of proof linked to its case study, and the
 * tools that support it as small chips. Test it carries a note that it
 * loops back to the start, so the line doesn't read as a waterfall.
 *
 * Copy lives in lib/process.ts, tools in lib/about.ts. Everything is
 * visible at once: no JavaScript.
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
      {PROCESS.map((step, s) => {
        const here = tools.filter((t) => t.stage === step.id)
        return (
          <li key={step.id} className="tb-stage">
            <div className="tb-stage__head">
              <span className="tb-stage__dot" aria-hidden="true" />
              <span className="tb-stage__num">{String(s + 1).padStart(2, '0')}</span>
              <h3 className="tb-stage__title">{step.title}</h3>
              <p className="tb-stage__practice">{step.practice}</p>
            </div>

            {step.ai && (
              <p className="tb-stage__ai">
                <span className="tb-stage__tag">With AI</span>
                {step.ai}
              </p>
            )}

            <p className="tb-stage__proof">
              <span className="tb-stage__tag">Proof</span>
              {step.proof.line}{' '}
              <Link className="tb-stage__link" href={step.proof.href}>
                {step.proof.label}
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </p>

            {step.loop && (
              <p className="tb-stage__loop">
                <span aria-hidden="true">&#8634; </span>
                {step.loop}
              </p>
            )}

            {here.length > 0 && (
              <ul className="tb-stage__named" aria-label={`Tools for ${step.title.toLowerCase()}`}>
                {here.map((t) => (
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
