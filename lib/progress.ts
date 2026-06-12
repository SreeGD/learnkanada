import type { AppProgress } from '@/types'

const STORAGE_KEY = 'learnkannada_progress'
export const MAX_LIVES = 3
export const LIVES_REGEN_MS = 30 * 60 * 1000
export const XP_PER_CORRECT = 10
export const XP_PER_LESSON = 50

export function defaultProgress(): AppProgress {
  return {
    survivalKit: {},
    modules: {},
    xp: 0,
    streak: { count: 0, lastActiveDate: '' },
    lives: { count: MAX_LIVES, lastRegenTime: Date.now() },
  }
}

export function getProgress(): AppProgress {
  if (typeof window === 'undefined') return defaultProgress()
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultProgress()
  try {
    return JSON.parse(raw) as AppProgress
  } catch {
    return defaultProgress()
  }
}

export function saveProgress(progress: AppProgress): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function getSurvivalKitPercent(progress: AppProgress, totalPhrases: number): number {
  if (totalPhrases === 0) return 0
  const gotItCount = Object.values(progress.survivalKit).filter((p) => p.gotIt).length
  return Math.round((gotItCount / totalPhrases) * 100)
}

export function getModulePercent(
  progress: AppProgress,
  slug: string,
  totalLessons: number,
): number {
  if (totalLessons === 0) return 0
  const mod = progress.modules[slug]
  if (!mod) return 0
  const completedCount = Object.values(mod.lessons).filter((l) => l.completed).length
  return Math.round((completedCount / totalLessons) * 100)
}

export function getCurrentLives(progress: AppProgress): number {
  const now = Date.now()
  const elapsed = now - progress.lives.lastRegenTime
  const livesRegened = Math.floor(elapsed / LIVES_REGEN_MS)
  return Math.min(MAX_LIVES, progress.lives.count + livesRegened)
}

export function markPhraseGotIt(progress: AppProgress, phraseId: string): AppProgress {
  return {
    ...progress,
    survivalKit: {
      ...progress.survivalKit,
      [phraseId]: { id: phraseId, gotIt: true, nextReview: Date.now() + 24 * 60 * 60 * 1000 },
    },
  }
}

export function markPhrasePracticeMore(progress: AppProgress, phraseId: string): AppProgress {
  return {
    ...progress,
    survivalKit: {
      ...progress.survivalKit,
      [phraseId]: { id: phraseId, gotIt: false, nextReview: Date.now() + 10 * 60 * 1000 },
    },
  }
}

export function markLessonComplete(
  progress: AppProgress,
  slug: string,
  lessonId: string,
): AppProgress {
  const mod = progress.modules[slug] ?? { slug, lessons: {} }
  return {
    ...progress,
    xp: progress.xp + XP_PER_LESSON,
    modules: {
      ...progress.modules,
      [slug]: {
        ...mod,
        lessons: {
          ...mod.lessons,
          [lessonId]: { id: lessonId, completed: true, xp: XP_PER_LESSON },
        },
      },
    },
  }
}

export function addXP(progress: AppProgress, amount: number): AppProgress {
  return { ...progress, xp: progress.xp + amount }
}

export function loseLife(progress: AppProgress): AppProgress {
  const currentLives = getCurrentLives(progress)
  const newCount = Math.max(0, currentLives - 1)
  return {
    ...progress,
    lives: {
      count: newCount,
      lastRegenTime: newCount < MAX_LIVES ? Date.now() : progress.lives.lastRegenTime,
    },
  }
}
