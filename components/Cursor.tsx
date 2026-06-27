'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'

const CURSOR_SIZE = 12

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -9999, y: 0 })
  const isLockedRef = useRef(false)
  const isTouchLockedRef = useRef(false)
  const pathname = usePathname()

  const resetCursor = useCallback(() => {
    const cursor = cursorRef.current
    if (!cursor) return
    isLockedRef.current = false
    cursor.classList.remove('is-locked', 'cursor--text')
    cursor.style.width = CURSOR_SIZE + 'px'
    cursor.style.height = CURSOR_SIZE + 'px'
    cursor.style.borderRadius = '100%'
    cursor.style.transform = ''
    cursor.style.top = posRef.current.y + 'px'
    cursor.style.left = posRef.current.x + 'px'
  }, [])

  // Reset whenever the page changes
  useEffect(() => {
    resetCursor()
  }, [pathname, resetCursor])

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    const onMouseMove = ({ clientX: x, clientY: y }: MouseEvent) => {
      posRef.current = { x, y }
      if (!isLockedRef.current && !isTouchLockedRef.current) {
        cursor.style.top = y + 'px'
        cursor.style.left = x + 'px'
      }
    }

    const onTouchStart = () => {
      cursor.style.display = 'none'
      isTouchLockedRef.current = true
    }

    const bindTextNode = (el: Element) => {
      const fontSize = parseInt(window.getComputedStyle(el).fontSize)
      el.addEventListener('mouseover', () => {
        if (isTouchLockedRef.current) return
        cursor.style.height = fontSize * 1.4 + 'px'
        cursor.classList.add('cursor--text')
      })
      el.addEventListener('mouseout', () => {
        if (isTouchLockedRef.current) return
        cursor.style.height = ''
        cursor.classList.remove('cursor--text')
      })
    }

    const bindBtnNode = (el: Element) => {
      let rect: DOMRect | null = null

      el.addEventListener('mouseenter', () => {
        if (isTouchLockedRef.current) return
        isLockedRef.current = true
        rect = el.getBoundingClientRect()
        const borderRadius = window.getComputedStyle(el).borderRadius
        cursor.classList.add('is-locked')
        cursor.style.width = rect.width + 'px'
        cursor.style.height = rect.height + 'px'
        cursor.style.borderRadius = borderRadius
        cursor.style.left = rect.x + rect.width / 2 + 'px'
        cursor.style.top = rect.y + rect.height / 2 + 'px'
      })

      el.addEventListener('mousemove', (event: Event) => {
        if (isTouchLockedRef.current || !rect) return
        const e = event as MouseEvent
        const halfH = rect.height / 2
        const topOffset = (e.clientY - rect.top - halfH) / halfH
        const halfW = rect.width / 2
        const leftOffset = (e.clientX - rect.left - halfW) / halfW
        cursor.style.transform = `translate(calc(-50% + ${leftOffset}px), calc(-50% + ${topOffset}px))`
        ;(el as HTMLElement).style.transform = `translate(${leftOffset * 6}px, ${topOffset * 6}px)`
      })

      el.addEventListener('mouseleave', () => {
        if (isTouchLockedRef.current) return
        resetCursor()
        rect = null
        ;(el as HTMLElement).style.transform = ''
      })
    }

    // Re-query elements on every navigation so new page elements get bound
    const textNodes = document.querySelectorAll('p, h1, h2, h3, blockquote')
    const btnNodes = document.querySelectorAll('.btn, .footer-link, .chat-pg__send')

    textNodes.forEach(bindTextNode)
    btnNodes.forEach(bindBtnNode)

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchstart', onTouchStart)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchstart', onTouchStart)
    }
  }, [pathname, resetCursor])

  return <div id="cursor" ref={cursorRef} />
}
