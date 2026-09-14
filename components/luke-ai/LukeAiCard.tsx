'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLukeAi } from './LukeAiProvider'
import LukeAiThread, { type Suggestion } from './LukeAiThread'
import LukeAiComposer, { type ComposerHandle } from './LukeAiComposer'
import { useAutoScroll } from './useAutoScroll'
import { TermTitle, IconPlus, IconMaximize } from './TermChrome'

/*
 * The live Luke AI window that is the hero of the homepage (desktop landing
 * and the top of the mobile stack): the compact, playful entry point. It is
 * drawn as the VS Code terminal panel — a title, the zsh prompt — with two
 * controls, and one of them only once it has a job: `+` appears after a
 * conversation starts and resets to the zero state; maximize opens /chat.
 *
 * There is no handoff to do on maximize: the conversation lives in
 * LukeAiProvider (mounted in the root layout), so /chat renders the same
 * thread — mid-stream, even — and coming back finds it here again.
 *
 * The chips are the pitch. Each one sends a prompt the system prompt is
 * built to answer well: the short version, the design + code + business
 * story, and the fit map (paste a job description, get requirement →
 * evidence, one line each) — the thing a static page cannot do.
 */

const SUGGESTIONS: ReadonlyArray<Suggestion> = [
  {
    label: 'give me the 30-second version',
    message: 'give me the 30-second version',
  },
  {
    label: 'where did code or business change a design call?',
    message:
      'Give me one concrete decision per project where knowing the code or the business changed what Luke designed.',
  },
  {
    label: 'map him to a job description',
    message: "I'm hiring. I'd like to paste a job description and get a fit map.",
  },
]

export default function LukeAiCard() {
  const router = useRouter()
  const { messages, phase, busy, send, startNew } = useLukeAi()
  const [input, setInput] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<ComposerHandle>(null)

  const userTurns = messages.filter((m) => m.role === 'user').length
  useAutoScroll(bodyRef, messages, userTurns)

  const submit = (text: string) => {
    if (!text.trim() || busy) return
    send(text, 'card')
    setInput('')
    setTimeout(() => composerRef.current?.focus(), 30)
  }

  const zeroState = messages.length === 0

  return (
    <div className="ai-card">
      <header className="ai-card__bar">
        <TermTitle />
        <div className="ai-card__tools">
          {!zeroState && (
            <button
              type="button"
              className="ai-card__tool"
              onClick={() => {
                startNew()
                setInput('')
                setTimeout(() => composerRef.current?.focus(), 30)
              }}
              title="New session"
              aria-label="Start a new conversation"
            >
              <IconPlus />
            </button>
          )}
          <button
            type="button"
            className="ai-card__tool ai-card__expand"
            onClick={() => router.push('/chat')}
            title="Maximize"
            aria-label="Open this conversation full screen"
          >
            <IconMaximize />
          </button>
        </div>
      </header>

      <div className="ai-card__body" ref={bodyRef}>
        <LukeAiThread surface="card" suggestions={SUGGESTIONS} />
      </div>

      <div className="ai-card__foot">
        <LukeAiComposer
          ref={composerRef}
          size="card"
          value={input}
          onChange={setInput}
          onSubmit={() => submit(input)}
          canSend={phase === 'idle'}
        />
      </div>
    </div>
  )
}
