'use client'

import { useState } from 'react'
import type { Phrase } from '@/types'
import KannadaToggle from '@/components/KannadaToggle'

interface FlashcardProps {
  phrase: Phrase
  onGotIt: () => void
  onPracticeMore: () => void
}

export default function Flashcard({ phrase, onGotIt, onPracticeMore }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false)

  const categoryColors: Record<string, string> = {
    greetings: '#059669',
    numbers: '#2563EB',
    polite: '#7C3AED',
    directions: '#DC2626',
    money: '#B45309',
    time: '#0891B2',
  }
  const categoryLabels: Record<string, string> = {
    greetings: 'Greetings',
    numbers: 'Numbers',
    polite: 'Polite Phrases',
    directions: 'Directions',
    money: 'Money',
    time: 'Time',
  }
  const color = categoryColors[phrase.category] ?? '#B45309'

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg border-2 min-h-48 flex flex-col items-center justify-center p-8 cursor-pointer transition-all hover:shadow-xl active:scale-95"
        style={{ borderColor: flipped ? color : '#FECACA' }}
      >
        {!flipped ? (
          <div className="text-center">
            <div className="text-sm font-semibold mb-3" style={{ color }}>
              {categoryLabels[phrase.category]}
            </div>
            <div className="text-xl font-bold text-gray-800 mb-2">{phrase.english}</div>
            <div className="text-xs text-gray-400 mt-4">👆 Tap to see Kannada</div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-sm font-semibold mb-3" style={{ color }}>
              {categoryLabels[phrase.category]}
            </div>
            <div className="text-2xl font-bold text-[#1E293B] mb-1">{phrase.kannada}</div>
            <div className="text-sm text-gray-500 italic">{phrase.pronunciation}</div>
            <div className="text-sm text-gray-700 mt-2 font-medium">{phrase.english}</div>
            <KannadaToggle script={phrase.script} />
            {phrase.tip && (
              <div className="text-xs text-red-600 bg-red-50 rounded px-2 py-1 mt-2">
                💡 {phrase.tip}
              </div>
            )}
          </div>
        )}
      </button>

      {flipped && (
        <div className="flex gap-4 w-full max-w-sm">
          <button
            onClick={() => { setFlipped(false); onPracticeMore() }}
            className="flex-1 bg-red-100 text-red-800 font-bold py-3 rounded-xl text-sm hover:bg-red-200 transition-colors"
          >
            ↩ Practice More
          </button>
          <button
            onClick={() => { setFlipped(false); onGotIt() }}
            className="flex-1 bg-green-100 text-green-800 font-bold py-3 rounded-xl text-sm hover:bg-green-200 transition-colors"
          >
            ✓ Got it!
          </button>
        </div>
      )}
    </div>
  )
}
