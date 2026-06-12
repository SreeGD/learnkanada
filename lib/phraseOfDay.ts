import type { Phrase } from '@/types'

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / 86400000)
}

export function getPhraseOfDay(phrases: Phrase[], date: Date = new Date()): Phrase {
  if (phrases.length === 0) throw new Error('phrases array must not be empty')
  const index = getDayOfYear(date) % phrases.length
  return phrases[index]
}
