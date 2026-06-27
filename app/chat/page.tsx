'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Message = { role: 'ai' | 'user'; text: string }

const FIRST_MESSAGE: Message = {
  role: 'ai',
  text: "hi. i'm an ai trained on luke's work and background. ask me anything about his experience, projects, or process.",
}

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([FIRST_MESSAGE])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isTyping) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text }])
    setIsTyping(true)
    await new Promise(r => setTimeout(r, 1300))
    setIsTyping(false)
    setMessages(prev => [
      ...prev,
      {
        role: 'ai',
        text: "that's a great question. i'll be able to answer that properly once the backend is wired up — check back soon.",
      },
    ])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <div className="chat-pg">

      <header className="chat-pg__header">
        <button className="btn chat-pg__back" onClick={() => router.back()}>
          <span className="btn__icon">←</span>
          <span className="btn__text"><span className="btn__text__main">back</span></span>
        </button>
        <span className="chat-pg__title">
          <span className="chat-pg__dot" />
          luke ai.
        </span>
        <span className="chat-pg__header-fill" />
      </header>

      <main className="chat-pg__messages">
        <div className="chat-pg__inner">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-pg__msg chat-pg__msg--${msg.role}`}>
              <span className="chat-pg__from">
                {msg.role === 'ai' ? 'luke ai' : 'you'}
              </span>
              <p className="chat-pg__text">{msg.text}</p>
            </div>
          ))}

          {isTyping && (
            <div className="chat-pg__msg chat-pg__msg--ai">
              <span className="chat-pg__from">luke ai</span>
              <p className="chat-pg__text chat-pg__typing">
                <span /><span /><span />
              </p>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      <footer className="chat-pg__footer">
        <div className="chat-pg__input-row">
          <input
            ref={inputRef}
            className="chat-pg__input"
            type="text"
            placeholder="ask me anything about luke…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="chat-pg__send"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            →
          </button>
        </div>
      </footer>

    </div>
  )
}
