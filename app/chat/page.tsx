'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Sidebar from '@/components/Sidebar'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type Conversation = {
  id: string
  title: string
  messages: Message[]
  updatedAt: number
}

const GREETING: Message = {
  role: 'assistant',
  content:
    "hi. i'm luke ai — a portfolio assistant trained on luke woods's public work, resume, and projects. ask me anything about his experience, skills, or process.",
}

const STORAGE_KEY = 'luke-ai-conversations'

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function makeTitle(text: string) {
  return text.length > 38 ? text.slice(0, 38) + '…' : text
}

export default function ChatPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentId, setCurrentId] = useState('')
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-resize textarea as content grows
  useEffect(() => {
    const ta = inputRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px'
  }, [input])

  // Load saved conversations on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setConversations(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const persist = useCallback((convs: Conversation[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs))
    setConversations(convs)
  }, [])

  const startNewChat = useCallback(() => {
    setCurrentId('')
    setMessages([GREETING])
    setInput('')
    setSidebarOpen(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const selectConversation = useCallback(
    (id: string) => {
      const conv = conversations.find((c) => c.id === id)
      if (!conv) return
      setCurrentId(id)
      setMessages([GREETING, ...conv.messages])
      setSidebarOpen(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    },
    [conversations],
  )

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isStreaming) return

    setInput('')
    if (inputRef.current) inputRef.current.style.height = 'auto'

    const userMsg: Message = { role: 'user', content: text }
    const withUser = [...messages, userMsg]
    setMessages(withUser)

    // History without the synthetic greeting
    const history = withUser.filter((m) => m !== GREETING)
    const apiMessages = history.map(({ role, content }) => ({ role, content }))

    // Create new conversation or update existing one
    let convId = currentId
    let updatedConvs = [...conversations]

    if (!convId) {
      convId = genId()
      setCurrentId(convId)
      updatedConvs = [
        { id: convId, title: makeTitle(text), messages: history, updatedAt: Date.now() },
        ...updatedConvs,
      ]
    } else {
      updatedConvs = updatedConvs.map((c) =>
        c.id === convId ? { ...c, messages: history, updatedAt: Date.now() } : c,
      )
    }
    persist(updatedConvs)

    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])
    setIsStreaming(true)
    // Re-focus after zero→non-zero transition causes textarea remount
    setTimeout(() => inputRef.current?.focus(), 60)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok || !res.body) throw new Error('stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullResponse += chunk
        setMessages((prev) => {
          const last = prev[prev.length - 1]
          return [...prev.slice(0, -1), { ...last, content: last.content + chunk }]
        })
      }

      // Persist final response
      const finalHistory = [...history, { role: 'assistant' as const, content: fullResponse }]
      persist(updatedConvs.map((c) => (c.id === convId ? { ...c, messages: finalHistory } : c)))
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'something went wrong. please try again.' },
      ])
    } finally {
      setIsStreaming(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isZeroState = messages.length === 1 && messages[0] === GREETING

  const floatInput = (
    <div className="chat-pg__float-box">
      <textarea
        ref={inputRef}
        className="chat-pg__input"
        placeholder="ask anything about luke's experience…"
        value={input}
        rows={1}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isStreaming}
      />
      <button
        className="chat-pg__send"
        onClick={handleSend}
        disabled={!input.trim() || isStreaming}
        aria-label="Send"
      >
        ↑
      </button>
    </div>
  )

  return (
    <div className="chat-pg">
      <Sidebar
        isOpen={sidebarOpen}
        conversations={conversations}
        currentId={currentId}
        onSelect={selectConversation}
        onNew={startNewChat}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      <div className="chat-pg__main">
        <header className="chat-pg__header">
          <button
            className="chat-pg__menu"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <button className="btn chat-pg__close" onClick={() => router.back()} aria-label="Close">
            ✕
          </button>
        </header>

        {isZeroState ? (
          <div className="chat-pg__zero">
            <p className="chat-pg__zero-heading">i'm luke ai, a portfolio assistant</p>
            <div className="chat-pg__float-wrap chat-pg__float-wrap--zero">
              {floatInput}
            </div>
          </div>
        ) : (
          <>
            <main className="chat-pg__messages">
              <div className="chat-pg__inner">
                {messages.filter((m) => m !== GREETING).map((msg, i) => (
                  <div key={i} className={`chat-pg__msg chat-pg__msg--${msg.role}`}>
                    {msg.role === 'user' ? (
                      <div className="chat-pg__bubble">{msg.content}</div>
                    ) : msg.content === '' && isStreaming ? (
                      <p className="chat-pg__typing">
                        <span />
                        <span />
                        <span />
                      </p>
                    ) : (
                      <div className="chat-pg__ai-text">
                        <ReactMarkdown
                          components={{
                            a: ({ href, children }) => {
                              const isEmail = href?.startsWith('mailto:')
                              const isLinkedIn = href?.includes('linkedin.com')
                              if (isEmail || isLinkedIn) {
                                return (
                                  <a href={href} target={isEmail ? '_self' : '_blank'} rel="noopener noreferrer" className="chat-pg__contact-btn">
                                    {isEmail ? (
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                      </svg>
                                    ) : (
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                        <rect x="2" y="9" width="4" height="12" />
                                        <circle cx="4" cy="4" r="2" />
                                      </svg>
                                    )}
                                    {children}
                                  </a>
                                )
                              }
                              return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                            },
                          }}
                        >{msg.content}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            </main>

            <footer className="chat-pg__footer">
              <div className="chat-pg__float-wrap">
                {floatInput}
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}
