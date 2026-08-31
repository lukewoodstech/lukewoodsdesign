/*
 * Luke AI conversation storage, shared between the full chat page
 * (app/chat/page.tsx) and the mini chat card on the canvas homepage
 * (components/LukeAiCard.tsx). Conversations live only in the visitor's
 * browser — localStorage, nothing server-side.
 *
 * The handoff key lets the mini card expand into the full page with its
 * conversation intact: the card saves the conversation under STORAGE_KEY,
 * stamps its id into sessionStorage under HANDOFF_KEY, and navigates; the
 * chat page opens that conversation instead of a fresh one.
 */

export type Message = {
  role: 'user' | 'assistant'
  content: string
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  updatedAt: number
}

export const STORAGE_KEY = 'luke-ai-conversations'
export const HANDOFF_KEY = 'luke-ai-open'

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export function makeTitle(text: string) {
  return text.length > 38 ? text.slice(0, 38) + '…' : text
}
