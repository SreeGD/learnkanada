import { describe, it, expect } from 'vitest'
import { isModuleUnlocked } from '@/lib/unlock'
import { defaultProgress, markPhraseGotIt, markLessonComplete } from '@/lib/progress'

const lessonCounts: Record<string, number> = {
  '01-maneya-kelasa': 2, '02-angadi': 2, '03-auto-prayana': 2,
  '04-bus-railway': 2, '05-shopping': 2, '06-phone-maatu': 2, '07-devasthana': 2,
}

describe('01-maneya-kelasa unlock', () => {
  it('locked when survival kit below 50%', () => {
    let p = defaultProgress()
    for (let i = 1; i <= 19; i++) p = markPhraseGotIt(p, `sk-${String(i).padStart(3, '0')}`)
    expect(isModuleUnlocked('01-maneya-kelasa', p, lessonCounts)).toBe(false)
  })
  it('unlocked when survival kit at 50%', () => {
    let p = defaultProgress()
    for (let i = 1; i <= 20; i++) p = markPhraseGotIt(p, `sk-${String(i).padStart(3, '0')}`)
    expect(isModuleUnlocked('01-maneya-kelasa', p, lessonCounts)).toBe(true)
  })
})

describe('02-angadi unlock', () => {
  it('locked when 01-maneya-kelasa below 60%', () => {
    let p = defaultProgress()
    p = markLessonComplete(p, '01-maneya-kelasa', 'mk-001')
    expect(isModuleUnlocked('02-angadi', p, lessonCounts)).toBe(false)
  })
  it('unlocked when 01-maneya-kelasa at 100%', () => {
    let p = defaultProgress()
    p = markLessonComplete(p, '01-maneya-kelasa', 'mk-001')
    p = markLessonComplete(p, '01-maneya-kelasa', 'mk-002')
    expect(isModuleUnlocked('02-angadi', p, lessonCounts)).toBe(true)
  })
})

describe('unknown slug', () => {
  it('returns false', () => {
    expect(isModuleUnlocked('99-unknown', defaultProgress(), lessonCounts)).toBe(false)
  })
})
