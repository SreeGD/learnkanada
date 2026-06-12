import type { AppProgress } from '@/types'
import { getSurvivalKitPercent, getModulePercent } from './progress'

// Unlock order is the intended learning sequence (not the file-number order).
// Kids (08-makkalu) is a Phase 1 topic, so it unlocks right after the shop.
export const MODULE_SLUGS = [
  '01-maneya-kelasa',
  '02-angadi',
  '08-makkalu',
  '03-auto-prayana',
  '04-bus-railway',
  '05-shopping',
  '06-phone-maatu',
  '07-devasthana',
  '09-bhagavadgita',
] as const

export const SURVIVAL_KIT_UNLOCK_THRESHOLD = 50
export const MODULE_UNLOCK_THRESHOLD = 60
export const TOTAL_SURVIVAL_KIT_PHRASES = 40

export function isModuleUnlocked(
  slug: string,
  progress: AppProgress,
  moduleLessonCounts: Record<string, number>,
): boolean {
  const index = MODULE_SLUGS.indexOf(slug as (typeof MODULE_SLUGS)[number])
  if (index === -1) return false

  if (index === 0) {
    return (
      getSurvivalKitPercent(progress, TOTAL_SURVIVAL_KIT_PHRASES) >= SURVIVAL_KIT_UNLOCK_THRESHOLD
    )
  }

  const prevSlug = MODULE_SLUGS[index - 1]
  const prevLessonCount = moduleLessonCounts[prevSlug] ?? 0
  return getModulePercent(progress, prevSlug, prevLessonCount) >= MODULE_UNLOCK_THRESHOLD
}
