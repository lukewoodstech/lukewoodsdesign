'use client'

import Link from 'next/link'
import { Ps1, AiTag } from './TermChrome'
import LukeAiMarkdown from './LukeAiMarkdown'
import { useLukeAi } from './LukeAiProvider'
import {
  GREETING,
  splitAnswer,
  balanceMarkdown,
  routeActions,
  fallbackFollowups,
  type Surface,
} from '@/lib/lukeAiStorage'

/*
 * The transcript, identical on the homepage card and /chat: the boot line
 * and greeting, the zero-state suggestions, then commands and answers.
 * Commands stay monospace (`guest@portfolio ~ % …`); answers are prose in
 * the site's sans under a `✦ LUKE_AI` tag. Density — type scale, measure,
 * turn spacing — comes from the `lai--card` / `lai--page` modifier in
 * globals.css, not from separate markup.
 */

export type Suggestion = { label: string; message: string }

type Props = {
  surface: Surface
  suggestions: ReadonlyArray<Suggestion>
}

export default function LukeAiThread({ surface, suggestions }: Props) {
  const { messages, phase, status, hasError, send, retry } = useLukeAi()
  const zero = messages.length === 0
  const lastIndex = messages.length - 1
  const streaming = phase === 'streaming'

  return (
    <div className={`lai lai--${surface}`}>
      <p className="lai__boot" aria-hidden="true">
        <Ps1 />
        luke-ai
      </p>
      <p className="lai__greeting">
        <span className="lai__star" aria-hidden="true">
          ✱
        </span>{' '}
        {GREETING}
      </p>

      {zero ? (
        <ul className="lai__chips" aria-label="Suggested questions">
          {suggestions.map((s) => (
            <li key={s.label}>
              <button
                type="button"
                className="lai__chip"
                onClick={() => send(s.message, surface)}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ol className="lai__turns">
          {messages.map((m, i) => {
            if (m.role === 'user') {
              return (
                <li key={i} className="lai__cmd">
                  <span className="sr-only">You asked: </span>
                  <span className="lai__cmd-ps1">
                    <Ps1 />
                  </span>
                  <span className="lai__cmd-text">{m.content}</span>
                </li>
              )
            }
            const isLast = i === lastIndex
            const live = isLast && phase !== 'idle'
            if (live && phase === 'processing') {
              return (
                <li key={i} className="lai__ai">
                  <p className="lai__status" aria-hidden="true">
                    {status}
                    <span className="lai__cursor" />
                  </p>
                </li>
              )
            }
            const { body, followups } = splitAnswer(m.content, live)
            /* Follow-ups first, then routes to fill: four lines on the
               card, five on the page, so an answer that names every
               project doesn't end in a wall of actions. */
            const showActions = isLast && !live && !hasError && body
            const cap = surface === 'card' ? 4 : 5
            const ups = showActions
              ? (followups.length ? followups : fallbackFollowups(body)).slice(0, 3)
              : []
            /* Routes come from the answer and the question that got it —
               "what would he do differently at Pattern?" earns the Pattern
               link even when the answer never repeats the name. */
            const asked = i > 0 ? messages[i - 1].content : ''
            const routes = showActions
              ? routeActions(body + '\n' + asked).slice(0, Math.max(1, cap - ups.length))
              : []
            return (
              <li key={i} className="lai__ai">
                <AiTag />
                <div className={`lai__prose${live && streaming ? ' is-streaming' : ''}`}>
                  <LukeAiMarkdown>{live ? balanceMarkdown(body) : body}</LukeAiMarkdown>
                </div>
                {showActions && (ups.length > 0 || routes.length > 0) && (
                  <ul className="lai__actions" aria-label="Follow-ups">
                    {ups.map((u) => (
                      <li key={u}>
                        <button
                          type="button"
                          className="lai__action"
                          onClick={() => send(u, surface)}
                        >
                          <span className="lai__arrow" aria-hidden="true">
                            ↳
                          </span>
                          {u}
                        </button>
                      </li>
                    ))}
                    {routes.map((r) => (
                      <li key={r.href}>
                        <Link href={r.href} className="lai__action lai__action--route">
                          <span className="lai__arrow" aria-hidden="true">
                            ↳
                          </span>
                          {r.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ol>
      )}

      {hasError && (
        <p className="lai__error" role="alert">
          something broke mid-thought.{' '}
          <button type="button" onClick={() => retry(surface)}>
            try again
          </button>
        </p>
      )}
    </div>
  )
}
