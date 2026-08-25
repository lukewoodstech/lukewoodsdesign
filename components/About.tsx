'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useReducedMotion } from '@/lib/useReducedMotion'

const DESCRIPTORS = [
  'product designer.',
  'systems thinker.',
  'problem solver.',
  'code + strategy.',
  'customer first.',
]

const ROTATE_MS = 3400

/*
 * Whole words crossfade in and out — the old character-by-character
 * typewriter spent much of its cycle mid-word, so a first glance could
 * land on "product desig|". The h1's real text is static ("product
 * designer.") for crawlers and screen readers; the rotation is a purely
 * visual aria-hidden layer. Reduced motion pins the first word.
 */
function useWordRotation(count: number) {
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)

  useEffect(() => {
    if (reducedMotion) return
    const t = setInterval(() => {
      setActive((i) => {
        setPrev(i)
        return (i + 1) % count
      })
    }, ROTATE_MS)
    return () => clearInterval(t)
  }, [count, reducedMotion])

  return { active, prev }
}

export default function About() {
  const { active, prev } = useWordRotation(DESCRIPTORS.length)
  const router = useRouter()

  return (
    <>
      <section className="section about" id="about">
        <h1 className="about__title">
          <span>i&apos;m luke</span>.
          <br />
          {/* The animation never exposes a partial word, but crawlers and
              screen readers still get the plain title. */}
          <span className="visually-hidden">product designer.</span>
          <span className="greeting" aria-hidden="true">
            {DESCRIPTORS.map((word, i) => (
              <span
                key={word}
                className={`greeting__word${i === active ? ' is-active' : ''}${
                  i === prev ? ' is-prev' : ''
                }`}
              >
                {word}
                <span className="typing-cursor" />
              </span>
            ))}
          </span>
        </h1>

        <p className="about__intro-text">
          I&apos;m a product designer who uses research, systems thinking, and technical fluency to turn complex product problems into clear, intuitive experiences.
        </p>

        <div className="about__buttons">
          <a href="#work" className="btn btn--hero">
            <span className="btn__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v16m0 0l-6-6m6 6l6-6" />
              </svg>
            </span>
            <span className="btn__text">
              <span className="btn__text__main">see work</span>
            </span>
          </a>
          <button className="btn btn--hero" onClick={() => router.push('/chat', { transitionTypes: ['page-enter'] })}>
            <span className="btn__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
