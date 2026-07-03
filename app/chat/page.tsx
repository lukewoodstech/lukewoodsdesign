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

const PROMPTS = [
  { category: 'ai product',    label: "Lucid AI",                        message: "tell me about the Lucid AI project" },
  { category: 'ux redesign',   label: "Awardco Login Flow Redesign",     message: "tell me about the Awardco login flow redesign" },
  { category: 'feature design', label: "Pattern Custom Reports",         message: "tell me about the Pattern custom reports feature" },
  { category: 'web design',    label: "Mention Landing Page",            message: "tell me about the Mention landing page" },
]

const STORAGE_KEY = 'luke-ai-conversations'

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function makeTitle(text: string) {
  return text.length > 38 ? text.slice(0, 38) + '…' : text
}

const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const IconArrowUp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
)

export default function ChatPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentId, setCurrentId] = useState('')
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [hasError, setHasError] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ta = inputRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px'
  }, [input])

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
    setHasError(false)
    setSidebarOpen(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const selectConversation = useCallback(
    (id: string) => {
      const conv = conversations.find((c) => c.id === id)
      if (!conv) return
      setCurrentId(id)
      setMessages([GREETING, ...conv.messages])
      setHasError(false)
      setSidebarOpen(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    },
    [conversations],
  )

  const deleteConversation = useCallback(
    (id: string) => {
      const updated = conversations.filter((c) => c.id !== id)
      persist(updated)
      if (currentId === id) {
        setCurrentId('')
        setMessages([GREETING])
        setHasError(false)
      }
    },
    [conversations, currentId, persist],
  )

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text || isStreaming) return

      setInput('')
      if (inputRef.current) inputRef.current.style.height = 'auto'
      setHasError(false)

      const userMsg: Message = { role: 'user', content: text }
      const withUser = [...messages, userMsg]
      setMessages(withUser)

      const history = withUser.filter((m) => m !== GREETING)
      const apiMessages = history.map(({ role, content }) => ({ role, content }))

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

        const finalHistory = [...history, { role: 'assistant' as const, content: fullResponse }]
        persist(updatedConvs.map((c) => (c.id === convId ? { ...c, messages: finalHistory } : c)))
      } catch {
        setMessages((prev) => prev.slice(0, -1))
        setHasError(true)
      } finally {
        setIsStreaming(false)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
    },
    [messages, isStreaming, currentId, conversations, persist],
  )

  const handleRetry = useCallback(async () => {
    setHasError(false)

    const history = messages.filter((m) => m !== GREETING)
    const apiMessages = history.map(({ role, content }) => ({ role, content }))

    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])
    setIsStreaming(true)
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

      const finalHistory = [...history, { role: 'assistant' as const, content: fullResponse }]
      persist(conversations.map((c) => (c.id === currentId ? { ...c, messages: finalHistory } : c)))
    } catch {
      setMessages((prev) => prev.slice(0, -1))
      setHasError(true)
    } finally {
      setIsStreaming(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [messages, conversations, currentId, persist])

  const handleSend = () => sendMessage(input.trim())

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const isZeroState = messages.length === 1 && messages[0] === GREETING

  const floatInput = (
    <div className="chat-pg__float-box" onClick={() => inputRef.current?.focus()}>
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
        <IconArrowUp />
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
        onDelete={deleteConversation}
      />

      <div className="chat-pg__main">
        <header className="chat-pg__header">
          <button
            className="chat-pg__menu"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Toggle sidebar"
          >
            <IconMenu />
          </button>
          <button className="btn chat-pg__close" onClick={() => router.push('/')} aria-label="Back to portfolio">
            <IconClose />
          </button>
        </header>

        {isZeroState ? (
          <div className="chat-pg__zero">
            <p className="chat-pg__zero-heading">ask me anything about luke's work.</p>
            <div className="chat-pg__float-wrap chat-pg__float-wrap--zero">
              {floatInput}
              <div className="grid grid-cols-2 gap-2 mt-14">
                {PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    className="group flex flex-col items-start gap-[0.4rem] rounded-[10px] border border-white/[0.08] bg-white/[0.03] p-4 text-left transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.06]"
                    onClick={() => sendMessage(p.message)}
                  >
                    <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[#008fff]">
                      {p.category}
                    </span>
                    <span className="block text-[0.82rem] leading-snug text-white/60 transition-colors duration-200 group-hover:text-white/90">
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <main className="chat-pg__messages">
              <div className="chat-pg__inner">
                {messages.filter((msg) => msg !== GREETING).map((msg, i) => (
                  <div key={i} className={`chat-pg__msg chat-pg__msg--${msg.role}`}>
                    {msg.role === 'user' ? (
                      <div className="chat-pg__bubble">{msg.content}</div>
                    ) : (
                      <>
                        <span className="chat-pg__ai-label">luke ai</span>
                        {msg.content === '' && isStreaming ? (
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
                      </>
                    )}
                  </div>
                ))}

                {hasError && (
                  <div className="chat-pg__error">
                    <span>something went wrong.</span>
                    <button className="chat-pg__retry" onClick={handleRetry}>
                      try again
                    </button>
                  </div>
                )}

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
