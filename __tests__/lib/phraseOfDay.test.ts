import { describe, it, expect } from 'vitest'
import { getPhraseOfDay } from '@/lib/phraseOfDay'
import type { Phrase } from '@/types'

const phrases: Phrase[] = [
  { id: 'sk-001', kannada: 'namaskara', script: 'ನಮಸ್ಕಾರ', pronunciation: 'na-mas-KAA-ra', english: 'Hello / Greetings', category: 'greetings' },
  { id: 'sk-006', kannada: 'dhanyavada', script: 'ಧನ್ಯವಾದ', pronunciation: 'DHAN-ya-vaa-da', english: 'Thank you', category: 'polite' },
  { id: 'sk-007', kannada: 'dayavittu', script: 'ದಯವಿಟ್ಟು', pronunciation: 'da-ya-VIT-tu', english: 'Please', category: 'polite' },
]

describe('getPhraseOfDay', () => {
  it('returns a phrase from the array', () => {
    expect(phrases).toContain(getPhraseOfDay(phrases))
  })
  it('returns same phrase for same date', () => {
    const d = new Date('2026-01-15')
    expect(getPhraseOfDay(phrases, d)).toBe(getPhraseOfDay(phrases, d))
  })
  it('throws for empty array', () => {
    expect(() => getPhraseOfDay([])).toThrow()
  })
})
