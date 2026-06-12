import type { AppProgress } from '@/types'

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function yesterdayISO(): string {
  return new Date(Date.now() - 86400000).toISOString().slice(0, 10)
}

export function updateStreak(progress: AppProgress): AppProgress {
  const today = todayISO()
  const { lastActiveDate, count } = progress.streak
  if (lastActiveDate === today) return progress
  const newCount = lastActiveDate === yesterdayISO() ? count + 1 : 1
  return { ...progress, streak: { count: newCount, lastActiveDate: today } }
}
