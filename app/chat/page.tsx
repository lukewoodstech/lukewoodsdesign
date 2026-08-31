'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Sidebar from '@/components/Sidebar'
import { SITE, MAILTO } from '@/lib/site'
import {
  STORAGE_KEY,
  HANDOFF_KEY,
  genId,
  makeTitle,
  type Message,
  type Conversation,
} from '@/lib/lukeAiStorage'

const GREETING: Message = {
  role: 'assistant',
  content:
    "hi. i'm luke ai. the case studies tell you what luke shipped — i'm for everything else: map his experience to your role, compare how he works across teams, or get the 30-second version.",
}

// Reads from lib/site.ts like the nav and footer do — the résumé is
// self-hosted now, and this page used to be the last Drive-link holdout.
const PLUS_ITEMS = [
  { label: 'résumé',   description: 'open in a new tab',   href: SITE.resume },
  { label: 'linkedin', description: 'connect with luke',   href: SITE.linkedin },
  { label: 'email',    description: 'send luke a message', href: MAILTO },
]

/*
 * Zero-state suggestions do what the case-study pages can't: map Luke to a
 * specific role, compress everything for a skim, synthesize across teams,
 * and answer the interview-style questions. Summaries of individual
 * studies live one click away on the grid — no reason to duplicate them.
 */
const IconTarget = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" opacity="0.6" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
  </svg>
)
const IconBolt = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M13 2 4.5 13.5h5L11 22l8.5-11.5h-5L13 2Z" />
  </svg>
)
const IconCode = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8.5 7 4 12l4.5 5" />
    <path d="M15.5 7 20 12l-4.5 5" />
    <path d="M13.2 4.5 10.8 19.5" opacity="0.6" />
  </svg>
)
const IconRedo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 8v5h5" />
    <path d="M4.5 13a8 8 0 1 0 2-7.5L4 8" />
  </svg>
)

const PROMPTS = [
  {
    key: 'fit',
    icon: <IconTarget />,
    color: 'var(--mono-blue)',
    header: 'Is Luke your fit?',
    desc: "Paste a job description — I'll map his experience to it.",
    message:
      "I'm evaluating Luke for a role. If I paste the job description, can you map his experience against it — honestly, including gaps?",
  },
  {
    key: 'pitch',
    icon: <IconBolt />,
    color: 'var(--mono-yellow)',
    header: 'The 30-second version',
    desc: 'Four internships, distilled for the skim read.',
    message: 'Give me the 30-second version of Luke: who he is, proof, and why it matters.',
  },
  {
    key: 'worksample',
    icon: <IconCode />,
    color: 'var(--mono-green)',
    header: "You're inside a work sample",
    desc: 'Ask how any piece of this site was built.',
    message:
      'How was this site built? Walk me through what is actually running on the home page tiles.',
  },
  {
    key: 'hard',
    icon: <IconRedo />,
    color: 'var(--mono-pink)',
    header: 'Ask the hard question',
    desc: "Trade-offs, limits, what he'd redo.",
    message:
      "What would Luke do differently across his projects, and what are the honest limitations of his work so far?",
  },
]

const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
  const [plusOpen, setPlusOpen] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ta = inputRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px'
  }, [input])

  useEffect(() => {
    if (!plusOpen) return
    const handler = (e: MouseEvent) => {
      if (floatRef.current && !floatRef.current.contains(e.target as Node)) {
        setPlusOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [plusOpen])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const convs: Conversation[] = raw ? JSON.parse(raw) : []
      if (raw) setConversations(convs)
      /* Arriving from the homepage mini chat: open its conversation
         instead of a fresh one. */
      const handoffId = sessionStorage.getItem(HANDOFF_KEY)
      if (handoffId) {
        sessionStorage.removeItem(HANDOFF_KEY)
        const conv = convs.find((c) => c.id === handoffId)
        if (conv) {
          setCurrentId(conv.id)
          setMessages([GREETING, ...conv.messages])
        }
      }
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

  const floatInput = (below: boolean) => (
    <div ref={floatRef} className="chat-pg__float-wrap-inner" style={{ position: 'relative' }}>
      {plusOpen && (
        <div className={below ? 'chat-pg__plus-menu chat-pg__plus-menu--below' : 'chat-pg__plus-menu'}>
          {PLUS_ITEMS.map((item) => (
            <a
              key={item.label}
              className="chat-pg__plus-item"
              href={item.href}
              target={item.href.startsWith('mailto') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onClick={() => setPlusOpen(false)}
            >
              <span className="chat-pg__plus-item-label">{item.label}</span>
              <span className="chat-pg__plus-item-desc">{item.description}</span>
            </a>
          ))}
        </div>
      )}
      <div className="chat-pg__float-box" onClick={() => inputRef.current?.focus()}>
        <button
          className="chat-pg__plus-btn"
          onClick={(e) => { e.stopPropagation(); setPlusOpen((v) => !v) }}
          aria-label="Open menu"
        >
          <svg
            width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{ transform: plusOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
          >
            <line x1="7" y1="1" x2="7" y2="13" />
            <line x1="1" y1="7" x2="13" y2="7" />
          </svg>
        </button>
        <textarea
          ref={inputRef}
          className="chat-pg__input"
          placeholder="ask luke ai"
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
            <p className="chat-pg__zero-heading">ask me anything about luke’s work.</p>
            <div className="chat-pg__float-wrap chat-pg__float-wrap--zero">
              {floatInput(true)}
              <div className="grid grid-cols-2 gap-2.5 mt-14">
                {PROMPTS.map((p) => (
                  <button
                    key={p.key}
                    className="group flex items-start gap-3.5 rounded-[12px] border border-white/[0.08] bg-white/[0.03] p-4 text-left transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.06]"
                    onClick={() => sendMessage(p.message)}
                  >
                    <span
                      className="flex size-10 shrink-0 items-center justify-center rounded-[9px] border border-white/[0.08] bg-white/[0.04]"
                      style={{ color: p.color }}
                      aria-hidden="true"
                    >
                      {p.icon}
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-base font-semibold leading-snug text-white/90 transition-colors duration-200 group-hover:text-white">
                        {p.header}
                      </span>
                      <span className="text-sm leading-snug text-white/45 transition-colors duration-200 group-hover:text-white/65">
                        {p.desc}
                      </span>
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
                {floatInput(false)}
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}
