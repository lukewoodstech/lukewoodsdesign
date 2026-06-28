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
    "hi. i'm an ai trained on luke's work and background. ask me anything about his experience, projects, or process.",
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
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

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
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

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
          <span className="chat-pg__title">
            <span className="chat-pg__dot" />
            luke ai.
          </span>
          <button className="btn chat-pg__close" onClick={() => router.back()} aria-label="Close">
            ✕
          </button>
        </header>

        <main className="chat-pg__messages">
          <div className="chat-pg__inner">
            {messages.map((msg, i) => (
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
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </main>

        <footer className="chat-pg__footer">
          <div className="chat-pg__float-wrap">
            <div className="chat-pg__float-box">
              <input
                ref={inputRef}
                className="chat-pg__input"
                type="text"
                placeholder="ask me anything about luke…"
                value={input}
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
          </div>
        </footer>
      </div>
    </div>
  )
}
