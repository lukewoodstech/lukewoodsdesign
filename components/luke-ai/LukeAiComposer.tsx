'use client'

import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react'
import { Ps1, IconArrowUp } from './TermChrome'

/*
 * The prompt line, shared by both surfaces: a fixed `guest@portfolio ~ %`
 * that looks like part of the field but is not part of its value, a real
 * textarea the cursor lands in right after the prompt, and the send
 * control. Enter sends; Shift+Enter breaks a line; the field grows to a
 * few lines and then scrolls. `size` only changes scale — the card is
 * compact, the page gives it room as the main control.
 */

export type ComposerHandle = { focus: () => void }

type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  canSend: boolean
  size: 'card' | 'page'
  placeholder?: string
  autoFocus?: boolean
  before?: React.ReactNode
}

const LukeAiComposer = forwardRef<ComposerHandle, Props>(function LukeAiComposer(
  { value, onChange, onSubmit, canSend, size, placeholder, autoFocus, before },
  ref,
) {
  const taRef = useRef<HTMLTextAreaElement>(null)
  const hintId = useId()

  useImperativeHandle(ref, () => ({ focus: () => taRef.current?.focus() }), [])

  useEffect(() => {
    const ta = taRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, size === 'page' ? 200 : 120) + 'px'
  }, [value, size])

  useEffect(() => {
    if (autoFocus) taRef.current?.focus()
  }, [autoFocus])

  const submit = () => {
    if (!canSend || !value.trim()) return
    onSubmit()
  }

  return (
    <form
      className={`lai-composer lai-composer--${size}`}
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      {before}
      <div className="lai-composer__field">
        <Ps1 />
        <textarea
          ref={taRef}
          className="lai-composer__input"
          value={value}
          rows={1}
          placeholder={placeholder ?? 'ask about luke’s work…'}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              submit()
            }
          }}
          aria-label="Ask Luke AI"
          aria-describedby={hintId}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="send"
        />
        <span id={hintId} className="sr-only">
          Enter sends. Shift plus Enter starts a new line.
        </span>
        <button
          type="submit"
          className="lai-composer__send"
          disabled={!canSend || !value.trim()}
          aria-label="Send"
        >
          <IconArrowUp />
        </button>
      </div>
    </form>
  )
})

export default LukeAiComposer
