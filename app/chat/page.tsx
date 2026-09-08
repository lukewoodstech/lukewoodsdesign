"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Sidebar from "@/components/Sidebar";
import { SITE, MAILTO } from "@/lib/site";
import {
  STORAGE_KEY,
  HANDOFF_KEY,
  genId,
  makeTitle,
  type Message,
  type Conversation,
} from "@/lib/lukeAiStorage";

const GREETING: Message = {
  role: "assistant",
  content: "luke-ai v1.0 — the portfolio you can interview.",
};

/*
 * The `+` menu beside the prompt: the three places to reach Luke directly,
 * as terminal commands. Reads from lib/site.ts like the nav and footer do.
 */
const PLUS_ITEMS = [
  {
    cmd: "open resume.pdf",
    description: "opens in a new tab",
    href: SITE.resume,
  },
  {
    cmd: "open linkedin",
    description: "connect with luke",
    href: SITE.linkedin,
  },
  { cmd: "mail luke", description: "copies the address too", href: MAILTO },
];

/*
 * Zero-state suggestions do what the case-study pages can't: map Luke to a
 * specific role, compress everything for a skim, show the design + code +
 * business judgment, and answer the interview-style questions. The first
 * three match the chips on the landing-screen window, so the expanded page
 * reads as the same terminal with more room.
 */
const PROMPTS = [
  {
    key: "pitch",
    label: "give me the 30-second version",
    message:
      "Give me the 30-second version of Luke: who he is, proof, and why it matters.",
  },
  {
    key: "decisions",
    label: "where did code or business change a design call?",
    message:
      "Give me one concrete decision per project where knowing the code or the business changed what Luke designed.",
  },
  {
    key: "fit",
    label: "map him to a job description",
    message:
      "I'm hiring. I'd like to paste a job description and get a fit map.",
  },
  {
    key: "worksample",
    label: "how was this site built?",
    message:
      "How was this site built? Walk me through what is actually running on the home page.",
  },
  {
    key: "hard",
    label: "what would he do differently?",
    message:
      "What would Luke do differently across his projects, and what are the honest limitations of his work so far?",
  },
];

const IconCollapse = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10 4H4v6" />
    <path d="M4 4l7.5 7.5" />
    <path d="M14 20h6v-6" />
    <path d="M20 20l-7.5-7.5" />
  </svg>
);

const IconArrowUp = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 19V5m0 0-6 6m6-6 6 6" />
  </svg>
);

const IconPanel = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16" />
  </svg>
);

export default function ChatPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentId, setCurrentId] = useState("");
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [plusOpen, setPlusOpen] = useState(false);
  /* A question carried in on the URL (/chat?q=…) — the "ask luke-ai" links
     at the end of each case study. Held in state so it's sent on the render
     AFTER stored conversations load; sending from the load effect itself
     would persist over the visitor's history with a stale empty list. */
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ta = inputRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 180) + "px";
  }, [input]);

  useEffect(() => {
    if (!plusOpen) return;
    const handler = (e: MouseEvent) => {
      if (floatRef.current && !floatRef.current.contains(e.target as Node)) {
        setPlusOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [plusOpen]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const convs: Conversation[] = raw ? JSON.parse(raw) : [];
      if (raw) setConversations(convs);
      /* Arriving from the homepage mini chat: open its conversation
         instead of a fresh one. */
      const handoffId = sessionStorage.getItem(HANDOFF_KEY);
      if (handoffId) {
        sessionStorage.removeItem(HANDOFF_KEY);
        const conv = convs.find((c) => c.id === handoffId);
        if (conv) {
          setCurrentId(conv.id);
          setMessages([GREETING, ...conv.messages]);
        }
      }
      const q = new URLSearchParams(window.location.search).get("q")?.trim();
      if (q) {
        window.history.replaceState(null, "", "/chat");
        setPendingQuestion(q);
      }
    } catch {}
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const persist = useCallback((convs: Conversation[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
    setConversations(convs);
  }, []);

  const startNewChat = useCallback(() => {
    setCurrentId("");
    setMessages([GREETING]);
    setInput("");
    setHasError(false);
    setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const selectConversation = useCallback(
    (id: string) => {
      const conv = conversations.find((c) => c.id === id);
      if (!conv) return;
      setCurrentId(id);
      setMessages([GREETING, ...conv.messages]);
      setHasError(false);
      setSidebarOpen(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    },
    [conversations],
  );

  const deleteConversation = useCallback(
    (id: string) => {
      const updated = conversations.filter((c) => c.id !== id);
      persist(updated);
      if (currentId === id) {
        setCurrentId("");
        setMessages([GREETING]);
        setHasError(false);
      }
    },
    [conversations, currentId, persist],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text || isStreaming) return;

      setInput("");
      if (inputRef.current) inputRef.current.style.height = "auto";
      setHasError(false);

      const userMsg: Message = { role: "user", content: text };
      const withUser = [...messages, userMsg];
      setMessages(withUser);

      const history = withUser.filter((m) => m !== GREETING);
      const apiMessages = history.map(({ role, content }) => ({
        role,
        content,
      }));

      let convId = currentId;
      let updatedConvs = [...conversations];

      if (!convId) {
        convId = genId();
        setCurrentId(convId);
        updatedConvs = [
          {
            id: convId,
            title: makeTitle(text),
            messages: history,
            updatedAt: Date.now(),
          },
          ...updatedConvs,
        ];
      } else {
        updatedConvs = updatedConvs.map((c) =>
          c.id === convId
            ? { ...c, messages: history, updatedAt: Date.now() }
            : c,
        );
      }
      persist(updatedConvs);

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      setIsStreaming(true);
      setTimeout(() => inputRef.current?.focus(), 60);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!res.ok || !res.body) throw new Error("stream failed");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullResponse += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            return [
              ...prev.slice(0, -1),
              { ...last, content: last.content + chunk },
            ];
          });
        }

        const finalHistory = [
          ...history,
          { role: "assistant" as const, content: fullResponse },
        ];
        persist(
          updatedConvs.map((c) =>
            c.id === convId ? { ...c, messages: finalHistory } : c,
          ),
        );
      } catch {
        setMessages((prev) => prev.slice(0, -1));
        setHasError(true);
      } finally {
        setIsStreaming(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [messages, isStreaming, currentId, conversations, persist],
  );

  /* Guarded by a ref rather than clearing the state: sendMessage changes
     identity as the thread grows, and this must fire exactly once. */
  const askedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!pendingQuestion || askedRef.current === pendingQuestion) return;
    askedRef.current = pendingQuestion;
    void sendMessage(pendingQuestion);
  }, [pendingQuestion, sendMessage]);

  const handleRetry = useCallback(async () => {
    setHasError(false);

    const history = messages.filter((m) => m !== GREETING);
    const apiMessages = history.map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    setIsStreaming(true);
    setTimeout(() => inputRef.current?.focus(), 60);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok || !res.body) throw new Error("stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return [
            ...prev.slice(0, -1),
            { ...last, content: last.content + chunk },
          ];
        });
      }

      const finalHistory = [
        ...history,
        { role: "assistant" as const, content: fullResponse },
      ];
      persist(
        conversations.map((c) =>
          c.id === currentId ? { ...c, messages: finalHistory } : c,
        ),
      );
    } catch {
      setMessages((prev) => prev.slice(0, -1));
      setHasError(true);
    } finally {
      setIsStreaming(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [messages, conversations, currentId, persist]);

  const handleSend = () => sendMessage(input.trim());

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isZeroState = messages.length === 1 && messages[0] === GREETING;

  /* The prompt row: `➜ ~` + textarea + send, with the `+` command menu. */
  const promptRow = (
    <div className="term-pg__promptbar">
      <form
        className="term-pg__prompt"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <div ref={floatRef} className="term-pg__plus-wrap">
          <button
            type="button"
            className={`term-pg__plus${plusOpen ? " is-open" : ""}`}
            onClick={() => setPlusOpen((v) => !v)}
            aria-label="Contact commands"
            aria-expanded={plusOpen}
          >
            +
          </button>
          {plusOpen && (
            <div className="term-pg__plus-menu" role="menu">
              {PLUS_ITEMS.map((item) => (
                <a
                  key={item.cmd}
                  role="menuitem"
                  className="term-pg__plus-item"
                  href={item.href}
                  target={item.href.startsWith("mailto") ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  onClick={() => setPlusOpen(false)}
                >
                  <span className="term-pg__plus-cmd">
                    <span className="term-nav__arrow">➜</span>
                    <span className="term-nav__dir">~</span> {item.cmd}
                  </span>
                  <span className="term-pg__plus-desc">{item.description}</span>
                </a>
              ))}
            </div>
          )}
        </div>
        <span className="term-nav__arrow" aria-hidden="true">
          ➜
        </span>
        <span className="term-nav__dir" aria-hidden="true">
          ~
        </span>
        <textarea
          ref={inputRef}
          className="term-pg__input"
          placeholder="ask about luke's work…"
          value={input}
          rows={1}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          aria-label="Message Luke AI"
        />
        <button
          type="submit"
          className="term-pg__send"
          disabled={!input.trim() || isStreaming}
          aria-label="Send"
        >
          <IconArrowUp />
        </button>
      </form>
    </div>
  );

  return (
    <div className="term-pg">
      {/* One maximized terminal window — the same object as the landing
          screen's luke-ai card, with a history panel docked on the left. */}
      <div className="term-pg__window ai-card">
        <header className="ai-card__bar term-pg__bar">
          <button
            type="button"
            className="term-pg__panel-btn"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? "Hide history" : "Show history"}
            aria-pressed={sidebarOpen}
          >
            <IconPanel />
          </button>
          <span className="term-nav__tabtitle" aria-hidden="true">
            output
          </span>
          <span className="term-nav__tabtitle is-active">terminal</span>
          <span className="ai-card__shell" aria-hidden="true">
            luke-ai — zsh
          </span>
          <button
            type="button"
            className="ai-card__expand"
            onClick={() => router.push("/")}
            title="Back to the portfolio"
            aria-label="Collapse back to the portfolio"
          >
            <IconCollapse />
            <span>collapse</span>
          </button>
        </header>

        <div className="term-pg__body">
          <Sidebar
            isOpen={sidebarOpen}
            conversations={conversations}
            currentId={currentId}
            onSelect={selectConversation}
            onNew={startNewChat}
            onToggle={() => setSidebarOpen((v) => !v)}
            onDelete={deleteConversation}
          />

          <div className="term-pg__main">
            <main className="term-pg__scroll">
              <div className="term-pg__inner">
                <p className="ai-card__boot" aria-hidden="true">
                  <span className="term-nav__arrow">➜</span>
                  <span className="term-nav__dir">~</span> luke-ai
                </p>
                <p className="ai-card__greeting">
                  <span className="ai-card__bootdot" aria-hidden="true">
                    ●
                  </span>{" "}
                  {GREETING.content}
                </p>

                {isZeroState ? (
                  <div className="ai-card__chips term-pg__chips">
                    {PROMPTS.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        className="ai-card__chip"
                        onClick={() => sendMessage(p.message)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  messages
                    .filter((msg) => msg !== GREETING)
                    .map((msg, i) =>
                      msg.role === "user" ? (
                        <div
                          key={i}
                          className="ai-card__msg ai-card__msg--user"
                        >
                          <span className="term-nav__arrow">➜</span>
                          <span className="term-nav__dir">~</span> {msg.content}
                        </div>
                      ) : (
                        <div key={i} className="ai-card__msg ai-card__msg--ai">
                          {msg.content === "" && isStreaming ? (
                            <span
                              className="ai-card__thinking"
                              aria-label="Luke AI is thinking"
                            >
                              <i />
                              <i />
                              <i />
                            </span>
                          ) : (
                            <ReactMarkdown
                              components={{
                                a: ({ href, children }) => {
                                  const isEmail = href?.startsWith("mailto:");
                                  return (
                                    <a
                                      href={href}
                                      target={isEmail ? "_self" : "_blank"}
                                      rel="noopener noreferrer"
                                    >
                                      {children}
                                    </a>
                                  );
                                },
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          )}
                        </div>
                      ),
                    )
                )}

                {hasError && (
                  <p className="ai-card__error">
                    something broke mid-thought.{" "}
                    <button type="button" onClick={handleRetry}>
                      try again
                    </button>
                  </p>
                )}

                <div ref={bottomRef} />
              </div>
            </main>

            {promptRow}
          </div>
        </div>
      </div>
    </div>
  );
}
