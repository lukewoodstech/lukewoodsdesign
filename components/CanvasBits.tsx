import type { ReactNode } from 'react'
import { WORK, type WorkItem } from '@/lib/work'
import LucidTile from './LucidTile'
import AwardcoMobileTile from './AwardcoMobileTile'
import PatternTile from './PatternTile'
import HothTile from './HothTile'

/*
 * The ordered list of work tiles with their layer labels, for the homepage.
 *
 * This file also held AboutReadme (a rendered-README card carrying Luke's
 * bio) and SelectionHandles (Figma-style corner handles). Both were left
 * behind by the 2026-09-20 redesign: nothing imported either one. The
 * README's copy is all on /about now — the UX Design Association and the
 * Figma campus role and Sandbox are in ONGOING, and "I start by listening"
 * is what the hero lede says at more length — so it was removed rather
 * than rehomed on 2026-09-22.
 */

/*
 * The work tiles: the shared metadata from lib/work plus each study's
 * artwork. The data lives there so the fixed nav bar can name the studies
 * without importing every tile component and its images.
 */
const TILE_ART: Record<string, ReactNode> = {
  'lucid-ai': <LucidTile />,
  awardco: <AwardcoMobileTile />,
  pattern: <PatternTile />,
  hoth: <HothTile />,
}

export const WORK_TILES: ReadonlyArray<WorkItem & { tile: ReactNode }> = WORK.map((item) => ({
  ...item,
  tile: TILE_ART[item.slug],
}))
