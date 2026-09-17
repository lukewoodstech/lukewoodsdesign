'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'

const CURSOR_SIZE = 12

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -9999, y: 0 })
  const isLockedRef = useRef(false)
  const lockedElRef = useRef<Element | null>(null)
  const isTouchLockedRef = useRef(false)
  const pathname = usePathname()

  const resetCursor = useCallback(() => {
    const cursor = cursorRef.current
    if (!cursor) return
    isLockedRef.current = false
    lockedElRef.current = null
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
      cursor.classList.remove('is-away')
      if (!isLockedRef.current && !isTouchLockedRef.current) {
        cursor.style.top = y + 'px'
        cursor.style.left = x + 'px'
      }
    }

    // The pointer left the window: hide the dot rather than leave it
    // parked at its last position (a stray white dot in screenshots).
    const onLeaveWindow = () => {
      cursor.classList.add('is-away')
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
        lockedElRef.current = el
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

    const BTN_SEL =
      '.btn, .footer-link, .term-pg__plus, .ai-card__expand, .ai-card__tool, ' +
      '.lai__chip, .lai__action, .lai-composer__send, .term-hist__new, .term-hist__item, ' +
      '.term-nav__item, .canvas-outro__cta, .pub-card__publish, .resume-doc__dl, ' +
      '.lcs-seg__btn, .lcs-lightbox__close'
    const TEXT_SEL = 'p, h1, h2, h3, blockquote'

    const bindEl = (el: Element) => {
      if (el.nodeType !== Node.ELEMENT_NODE) return
      if (el.matches(BTN_SEL) && !el.hasAttribute('data-cursor-bound')) {
        el.setAttribute('data-cursor-bound', '1')
        bindBtnNode(el)
      }
      if (el.matches(TEXT_SEL) && !el.hasAttribute('data-cursor-bound')) {
        el.setAttribute('data-cursor-bound', '1')
        bindTextNode(el)
      }
      el.querySelectorAll<Element>(`${BTN_SEL}:not([data-cursor-bound])`).forEach(child => {
        child.setAttribute('data-cursor-bound', '1')
        bindBtnNode(child)
      })
      el.querySelectorAll<Element>(`${TEXT_SEL}:not([data-cursor-bound])`).forEach(child => {
        child.setAttribute('data-cursor-bound', '1')
        bindTextNode(child)
      })
    }

    // Initial bind
    document.querySelectorAll<Element>(BTN_SEL).forEach(el => { el.setAttribute('data-cursor-bound', '1'); bindBtnNode(el) })
    document.querySelectorAll<Element>(TEXT_SEL).forEach(el => { el.setAttribute('data-cursor-bound', '1'); bindTextNode(el) })

    // Only process newly added nodes, not the whole document on every change
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) bindEl(node as Element)
        })
        // A button the cursor is locked to can leave the DOM without a
        // mouseleave (a suggested question, once clicked, is replaced by
        // the transcript). Let the cursor go, or it stays a ghost box.
        mutation.removedNodes.forEach(node => {
          const locked = lockedElRef.current
          if (locked && node.nodeType === Node.ELEMENT_NODE && (node === locked || node.contains(locked))) {
            resetCursor()
          }
        })
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchstart', onTouchStart)
    document.documentElement.addEventListener('mouseleave', onLeaveWindow)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchstart', onTouchStart)
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow)
      observer.disconnect()
    }
  }, [pathname, resetCursor])

  return <div id="cursor" ref={cursorRef} />
}
