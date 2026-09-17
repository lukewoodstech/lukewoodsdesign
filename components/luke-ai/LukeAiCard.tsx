'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLukeAi } from './LukeAiProvider'
import LukeAiThread from './LukeAiThread'
import LukeAiComposer, { type ComposerHandle } from './LukeAiComposer'
import { useAutoScroll } from './useAutoScroll'
import { TermTitle, IconPlus, IconMaximize } from './TermChrome'
import { SUGGESTIONS } from '@/lib/lukeAiStorage'

/*
 * The live Luke AI window that is the hero of the homepage (desktop landing
 * and the top of the mobile stack): the compact, friendly entry point. A
 * titled window with a welcome, suggested questions, and a message field,
 * plus two controls, one of them only once it has a job: `+` appears after
 * a conversation starts and resets to the welcome; maximize opens /chat.
 *
 * There is no handoff to do on maximize: the conversation lives in
 * LukeAiProvider (mounted in the root layout), so /chat renders the same
 * thread — mid-stream, even — and coming back finds it here again.
 *
 * The suggested questions are the pitch (SUGGESTIONS in lib/lukeAiStorage,
 * shared with /chat). Each one sends a prompt the system prompt is built
 * to answer well; the note under them points at the thing a static page
 * cannot do — paste a job description, get a fit map.
 */

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
              title="New conversation"
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
