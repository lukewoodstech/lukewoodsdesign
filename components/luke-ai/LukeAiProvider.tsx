'use client'

import { useSyncExternalStore } from 'react'
import * as store from '@/lib/lukeAiStore'

/*
 * React's window onto the Luke AI store (lib/lukeAiStore.ts). The hook
 * subscribes a surface to the one shared session; the provider, mounted
 * once in the root layout, owns the polite live region both surfaces
 * announce through — the status once, then the finished answer once,
 * never every streamed chunk.
 */

export function useLukeAi() {
  const s = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
  return {
    hydrated: s.hydrated,
    conversations: s.conversations,
    currentId: s.currentId,
    messages: s.messages,
    phase: s.phase,
    busy: s.phase !== 'idle',
    status: s.status,
    hasError: s.hasError,
    errorKind: s.errorKind,
    historyOpen: s.historyOpen,
    send: store.send,
    retry: store.retry,
    startNew: store.startNew,
    select: store.select,
    remove: store.remove,
    setHistoryOpen: store.setHistoryOpen,
    toggleHistory: store.toggleHistory,
  }
}

export function LukeAiProvider({ children }: { children: React.ReactNode }) {
  const s = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
  return (
    <>
      {children}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {s.announce}
      </div>
    </>
  )
}
