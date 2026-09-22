'use client'

import { useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLukeAi } from './LukeAiProvider'
import LukeAiThread from './LukeAiThread'
import LukeAiComposer, { type ComposerHandle } from './LukeAiComposer'
import { useAutoScroll } from './useAutoScroll'
import { TermTitle, IconPlus, IconMaximize, IconMinimize } from './TermChrome'
import { suggestionsFor } from '@/lib/lukeAiSuggestions'

/*
 * The live Luke AI window, rendered inside the site-wide dock (LukeAiDock,
 * bottom-right on every page) and inside the mobile stack: the compact,
 * friendly entry point. A titled window with a welcome, suggested questions,
 * and a message field, plus controls that only appear once they have a job:
 * `+` shows up after a conversation starts and resets to the welcome,
 * maximize opens /chat, and minimize (dock only) puts the panel away.
 *
 * There is no handoff to do on maximize: the conversation lives in
 * LukeAiProvider (mounted in the root layout), so /chat renders the same
 * thread — mid-stream, even — and coming back finds it here again.
 *
 * The suggested questions are the pitch (SUGGESTIONS in lib/lukeAiStorage,
 * chosen by route in lib/lukeAiSuggestions). Each one sends a prompt the
 * system prompt is built to answer well, and each asks for something the
 * page underneath cannot give — the call that didn't make the write-up,
 * what got cut, what he'd change now. The note under them points at the
 * other thing a static page cannot do: paste a job description, get a fit
 * map.
 */

export default function LukeAiCard({ onClose }: { onClose?: () => void } = {}) {
  const router = useRouter()
  /* The dock opens next to whatever the visitor is reading, so the four
     questions in the zero state are the four for that page. */
  const suggestions = suggestionsFor(usePathname())
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
          {/* Only the dock passes this: the card is a panel there, and a
              panel needs a way to go away. The conversation is untouched —
              it lives in LukeAiProvider and is still here on reopen. */}
          {onClose && (
            <button
              type="button"
              className="ai-card__tool"
              onClick={onClose}
              title="Minimize"
              aria-label="Minimize Luke AI"
            >
              <IconMinimize />
            </button>
          )}
        </div>
      </header>

      <div className="ai-card__body" ref={bodyRef}>
        <LukeAiThread surface="card" suggestions={suggestions} />
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
