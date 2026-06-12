import type { DialogueStep } from '@/types'
import KannadaToggle from '@/components/KannadaToggle'

interface DialogueBubbleProps {
  step: DialogueStep
  isLearner?: boolean
}

export default function DialogueBubble({ step, isLearner = false }: DialogueBubbleProps) {
  if (isLearner) {
    return (
      <div className="flex items-end gap-2 flex-row-reverse">
        <span className="text-2xl flex-shrink-0">{step.speakerEmoji}</span>
        <div className="bg-[#B45309] text-white rounded-2xl rounded-br-sm px-4 py-3 max-w-[75%]">
          <p className="font-semibold">{step.kannada}</p>
          <p className="text-xs opacity-80 mt-0.5 italic">{step.pronunciation}</p>
          <p className="text-xs opacity-90 mt-1">{step.english}</p>
          <KannadaToggle script={step.script} light />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end gap-2">
      <span className="text-2xl flex-shrink-0">{step.speakerEmoji}</span>
      <div className="bg-white border border-red-200 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[75%] shadow-sm">
        <p className="font-semibold text-[#1E293B]">{step.kannada}</p>
        <p className="text-xs text-gray-400 italic mt-0.5">{step.pronunciation}</p>
        <div className="bg-red-50 rounded-lg px-3 py-1.5 mt-2">
          <p className="text-xs text-red-800">
            <span className="font-semibold">💬 {step.speaker} says:</span> {step.english}
          </p>
        </div>
        <KannadaToggle script={step.script} />
      </div>
    </div>
  )
}
