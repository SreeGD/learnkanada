import { describe, it, expect, vi } from 'vitest'
import {
  defaultProgress, getSurvivalKitPercent, getModulePercent, getCurrentLives,
  markPhraseGotIt, markPhrasePracticeMore, markLessonComplete, addXP, loseLife,
  MAX_LIVES, LIVES_REGEN_MS, XP_PER_LESSON,
} from '@/lib/progress'

describe('defaultProgress', () => {
  it('returns full lives and zero XP', () => {
    const p = defaultProgress()
    expect(p.lives.count).toBe(MAX_LIVES)
    expect(p.xp).toBe(0)
    expect(p.streak.count).toBe(0)
  })
})

describe('getSurvivalKitPercent', () => {
  it('returns 0 when nothing marked', () => {
    expect(getSurvivalKitPercent(defaultProgress(), 40)).toBe(0)
  })
  it('returns 100 when all marked', () => {
    let p = defaultProgress()
    for (let i = 1; i <= 10; i++) p = markPhraseGotIt(p, `sk-${i}`)
    expect(getSurvivalKitPercent(p, 10)).toBe(100)
  })
  it('returns 0 for totalPhrases=0', () => {
    expect(getSurvivalKitPercent(defaultProgress(), 0)).toBe(0)
  })
})

describe('getModulePercent', () => {
  it('returns 0 for unknown slug', () => {
    expect(getModulePercent(defaultProgress(), '01-maneya-kelasa', 2)).toBe(0)
  })
  it('returns 100 when all lessons complete', () => {
    let p = defaultProgress()
    p = markLessonComplete(p, '01-maneya-kelasa', 'mk-001')
    p = markLessonComplete(p, '01-maneya-kelasa', 'mk-002')
    expect(getModulePercent(p, '01-maneya-kelasa', 2)).toBe(100)
  })
})

describe('getCurrentLives', () => {
  it('returns full lives initially', () => {
    expect(getCurrentLives(defaultProgress())).toBe(MAX_LIVES)
  })
  it('regenerates 1 life after regen period', () => {
    let p = defaultProgress()
    p = loseLife(loseLife(p))
    vi.spyOn(Date, 'now').mockReturnValue(p.lives.lastRegenTime + LIVES_REGEN_MS + 1)
    expect(getCurrentLives(p)).toBe(2)
    vi.restoreAllMocks()
  })
  it('never exceeds MAX_LIVES', () => {
    const p = defaultProgress()
    vi.spyOn(Date, 'now').mockReturnValue(Date.now() + LIVES_REGEN_MS * 10)
    expect(getCurrentLives(p)).toBe(MAX_LIVES)
    vi.restoreAllMocks()
  })
})

describe('markLessonComplete', () => {
  it('marks complete and adds XP', () => {
    const p = markLessonComplete(defaultProgress(), '01-maneya-kelasa', 'mk-001')
    expect(p.modules['01-maneya-kelasa'].lessons['mk-001'].completed).toBe(true)
    expect(p.xp).toBe(XP_PER_LESSON)
  })
  it('accumulates XP across lessons', () => {
    let p = defaultProgress()
    p = markLessonComplete(p, '01-maneya-kelasa', 'mk-001')
    p = markLessonComplete(p, '01-maneya-kelasa', 'mk-002')
    expect(p.xp).toBe(XP_PER_LESSON * 2)
  })
})

describe('addXP', () => {
  it('adds amount to XP', () => {
    expect(addXP(defaultProgress(), 10).xp).toBe(10)
  })
})

describe('markPhraseGotIt', () => {
  it('sets gotIt=true and nextReview ~1 day ahead', () => {
    const before = Date.now()
    const p = markPhraseGotIt(defaultProgress(), 'sk-001')
    expect(p.survivalKit['sk-001'].gotIt).toBe(true)
    expect(p.survivalKit['sk-001'].nextReview).toBeGreaterThan(before + 23 * 3600 * 1000)
  })
})

describe('markPhrasePracticeMore', () => {
  it('sets gotIt=false and nextReview ~10 min ahead', () => {
    const before = Date.now()
    const p = markPhrasePracticeMore(defaultProgress(), 'sk-001')
    expect(p.survivalKit['sk-001'].gotIt).toBe(false)
    expect(p.survivalKit['sk-001'].nextReview).toBeGreaterThan(before + 9 * 60 * 1000)
    expect(p.survivalKit['sk-001'].nextReview).toBeLessThan(before + 11 * 60 * 1000)
  })
})

describe('loseLife', () => {
  it('decrements lives by 1', () => {
    expect(getCurrentLives(loseLife(defaultProgress()))).toBe(MAX_LIVES - 1)
  })
  it('never goes below 0', () => {
    let p = defaultProgress()
    for (let i = 0; i < 10; i++) p = loseLife(p)
    expect(getCurrentLives(p)).toBe(0)
  })
})
