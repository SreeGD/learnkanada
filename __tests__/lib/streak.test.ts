import { describe, it, expect } from 'vitest'
import { updateStreak, todayISO, yesterdayISO } from '@/lib/streak'
import { defaultProgress } from '@/lib/progress'

describe('updateStreak', () => {
  it('starts streak at 1 on first visit', () => {
    const p = updateStreak(defaultProgress())
    expect(p.streak.count).toBe(1)
    expect(p.streak.lastActiveDate).toBe(todayISO())
  })
  it('does not increment if already updated today', () => {
    const p = updateStreak(updateStreak(defaultProgress()))
    expect(p.streak.count).toBe(1)
  })
  it('increments when last active was yesterday', () => {
    const p = { ...defaultProgress(), streak: { count: 5, lastActiveDate: yesterdayISO() } }
    expect(updateStreak(p).streak.count).toBe(6)
  })
  it('resets to 1 when streak is broken', () => {
    const p = { ...defaultProgress(), streak: { count: 5, lastActiveDate: '2020-01-01' } }
    expect(updateStreak(p).streak.count).toBe(1)
  })
})
