import type { ReactNode } from 'react'

/*
 * The visual-first case study format (Luke, 2026-11-11): each section is a
 * text card and the visuals that back it. Lucid uses it first; Awardco,
 * Pattern and Pitch are meant to move onto it next, each with its own data
 * file beside lib/sections/lucid.tsx.
 */

export type SectionVisual = {
  /** Image under /public. Opens in the click-to-expand lightbox. */
  src?: string
  alt: string
  /** A short name for what the visual shows, set above its caption. */
  title?: string
  caption?: string
  /** Tall visuals take the right column of a split section. */
  orientation?: 'wide' | 'tall'
  /** Pixel size of `src`, for next/image. */
  width?: number
  height?: number
  /** An interactive or composite visual, rendered instead of `src`. */
  element?: ReactNode
  /** No asset yet: a labelled box with this name stands in. */
  placeholder?: string
}

export type CaseSection = {
  /** The process step, one or two words, shown before the subtitle in the accent: "Discovery". */
  step?: string
  subtitle: string
  body: string
  /** stacked (default): card, then visuals below. split: card left, first visual right. */
  layout?: 'stacked' | 'split'
  visuals: SectionVisual[]
}

export type CaseStudySections = {
  /** The study's one accent colour, as hex. Drives the card glow. */
  accent: string
  sections: CaseSection[]
}
