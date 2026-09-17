'use client'

import { useEffect, useRef, type RefObject } from 'react'

/*
 * Keep a transcript pinned to its newest line while it grows — but only
 * if the reader was already at the bottom. Scroll up to re-read an
 * earlier answer and the stream stops yanking the view back down; send a
 * new command (`force` changes) and it snaps to the bottom again.
 */
export function useAutoScroll(
  ref: RefObject<HTMLElement | null>,
  watch: unknown,
  force: unknown,
) {
  const stuck = useRef(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      stuck.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [ref])

  useEffect(() => {
    stuck.current = true
  }, [force])

  useEffect(() => {
    const el = ref.current
    if (!el || !stuck.current) return
    /* An empty transcript is the welcome: it should open at the top, not
       jump to the last suggested question on a short phone card. */
    if (Array.isArray(watch) && watch.length === 0) return
    el.scrollTop = el.scrollHeight
  }, [ref, watch, force])
}
