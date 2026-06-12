'use client'

import { useState } from 'react'
import type { Choice } from '@/types'
import KannadaToggle from '@/components/KannadaToggle'

interface AnswerChoicesProps {
  prompt: string
  choices: Choice[]
  onAnswer: (correct: boolean, choice: Choice) => void
}

export default function AnswerChoices({ prompt, choices, onAnswer }: AnswerChoicesProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const handleSelect = (index: number) => {
    if (selected !== null) return
    setSelected(index)
    onAnswer(choices[index].correct, choices[index])
  }

  return (
    <div>
      <div className="bg-[#B45309] rounded-xl px-4 py-3 mb-4 flex items-center gap-3 text-white">
        <span className="text-xl">👆</span>
        <span className="text-sm font-semibold">{prompt}</span>
      </div>

      <div className="flex flex-col gap-3">
        {choices.map((choice, i) => {
          let borderColor = '#E5E7EB'
          let bgColor = 'white'
          if (selected !== null) {
            if (choice.correct) { borderColor = '#34D399'; bgColor = '#F0FDF4' }
            else if (i === selected && !choice.correct) { borderColor = '#FCA5A5'; bgColor = '#FEF2F2' }
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className="w-full text-left rounded-xl px-4 py-3 border-2 transition-all"
              style={{ borderColor, backgroundColor: bgColor }}
            >
              <p className="font-semibold text-[#1E293B]">{choice.kannada}</p>
              <p className="text-xs text-gray-500 italic mt-0.5">{choice.pronunciation}</p>
              <p className="text-xs text-gray-600 mt-1">{choice.english}</p>
              <KannadaToggle script={choice.script} />
              {selected !== null && i === selected && !choice.correct && choice.hint && (
                <p className="text-xs text-red-700 mt-1 font-medium">💡 {choice.hint}</p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
