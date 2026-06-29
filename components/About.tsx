'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const DESCRIPTORS = [
  'product designer.',
  'systems thinker.',
  'problem solver.',
  'code + strategy.',
  'customer first.',
]

function useTypewriter(words: string[], typeSpeed = 85, deleteSpeed = 42, pauseMs = 2800) {
  const [displayed, setDisplayed] = useState(words[0])
  const [wordIndex, setWordIndex] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('pausing')

  useEffect(() => {
    const word = words[wordIndex]
    if (phase === 'pausing') {
      const t = setTimeout(() => setPhase('deleting'), pauseMs)
      return () => clearTimeout(t)
    }
    if (phase === 'deleting') {
      if (displayed.length === 0) { setWordIndex(i => (i + 1) % words.length); setPhase('typing'); return }
      const t = setTimeout(() => setDisplayed(d => d.slice(0, -1)), deleteSpeed)
      return () => clearTimeout(t)
    }
    if (phase === 'typing') {
      if (displayed.length === word.length) { setPhase('pausing'); return }
      const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), typeSpeed)
      return () => clearTimeout(t)
    }
  }, [displayed, phase, wordIndex, words, typeSpeed, deleteSpeed, pauseMs])

  return { displayed, isDeleting: phase === 'deleting' }
}

export default function About() {
  const { displayed, isDeleting } = useTypewriter(DESCRIPTORS)
  const router = useRouter()

  return (
    <>
      <section className="section about" id="about">
        <h1 className="about__title">
          <span>i&apos;m luke</span>.
          <br />
          <span className="greeting">
            {displayed}
            <span className={`typing-cursor${isDeleting ? ' typing-cursor--deleting' : ''}`} />
          </span>
        </h1>

        <p className="about__intro-text">
          I&apos;m a product designer crafting thoughtful digital experiences
          at the intersection of design, technology, and human behaviour.
        </p>

        <div className="about__buttons">
          <button className="btn btn--hero" onClick={() => router.push('/chat', { transitionTypes: ['page-enter'] })}>
            <span className="btn__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </span>
            <span className="btn__text">
              <span className="btn__text__main">chat with luke ai</span>
            </span>
          </button>
        </div>
      </section>

      <div className="home-wrapper" />
    </>
  )
}
