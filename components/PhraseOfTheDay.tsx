import type { Phrase } from '@/types'
import KannadaToggle from '@/components/KannadaToggle'

interface PhraseOfTheDayProps {
  phrase: Phrase
}

export default function PhraseOfTheDay({ phrase }: PhraseOfTheDayProps) {
  return (
    <div className="bg-white rounded-xl p-4 border-l-4 border-[#B45309] shadow-sm">
      <div className="text-xs font-bold text-[#B45309] uppercase tracking-widest mb-2">
        ☀️ Phrase of the Day
      </div>
      <p className="font-bold text-[#1E293B] text-xl">{phrase.kannada}</p>
      <p className="text-sm text-gray-500 italic mt-0.5">{phrase.pronunciation}</p>
      <p className="text-sm text-gray-700 mt-1 font-medium">{phrase.english}</p>
      <KannadaToggle script={phrase.script} />
      {phrase.tip && (
        <p className="text-xs text-red-600 mt-2 bg-red-50 rounded px-2 py-1">💡 {phrase.tip}</p>
      )}
    </div>
  )
}
