import GrammarTip from './GrammarTip'
import KannadaToggle from '@/components/KannadaToggle'
import type { Reaction, VocabWord } from '@/types'

interface FeedbackCorrectProps {
  type: 'correct'
  reaction: Reaction
  vocab: VocabWord[]
  xpEarned: number
  grammarTip?: string
  onNext: () => void
}

interface FeedbackWrongProps {
  type: 'wrong'
  reaction: Reaction
  correctChoice: { kannada: string; script: string; pronunciation: string; english: string }
  livesLeft: number
  onRetry: () => void
}

interface FeedbackOutOfLivesProps {
  type: 'out-of-lives'
  onLeave: () => void
}

type FeedbackPanelProps = FeedbackCorrectProps | FeedbackWrongProps | FeedbackOutOfLivesProps

export default function FeedbackPanel(props: FeedbackPanelProps) {
  if (props.type === 'correct') {
    const { reaction, vocab, xpEarned, grammarTip, onNext } = props
    return (
      <div className="mt-4 rounded-2xl overflow-hidden border-2 border-green-400">
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-3 text-center">
          <div className="text-2xl mb-1">🎉</div>
          <p className="font-bold text-green-800 text-lg">Chennagide! 👏</p>
          <p className="text-xs text-green-700">Excellent! Well done!</p>
        </div>
        <div className="bg-white px-4 py-3">
          <div className="flex items-start gap-2 mb-3">
            <span className="text-xl">{reaction.speakerEmoji}</span>
            <div className="bg-red-50 rounded-xl rounded-tl-sm px-3 py-2 flex-1">
              <p className="font-semibold text-[#1E293B] text-sm">{reaction.kannada}</p>
              <p className="text-xs text-gray-500 italic">{reaction.pronunciation}</p>
              <p className="text-xs text-gray-600 mt-0.5">{reaction.english}</p>
              <KannadaToggle script={reaction.script} />
            </div>
          </div>

          {grammarTip && <GrammarTip tip={grammarTip} />}

          {vocab.length > 0 && (
            <div className="bg-red-50 rounded-xl p-3 mb-3">
              <div className="text-xs font-bold text-[#B45309] uppercase tracking-wide mb-2">
                📖 Words you just used
              </div>
              <div className="space-y-1.5">
                {vocab.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 flex-wrap">
                    <span className="bg-[#B45309] text-white text-xs px-2 py-0.5 rounded font-semibold">
                      {w.kannada}
                    </span>
                    <span className="text-xs text-gray-500 italic">{w.pronunciation}</span>
                    <span className="text-xs text-gray-700">— {w.english}</span>
                    {w.cognate && (
                      <span className="text-xs text-amber-600 font-medium">(≈ {w.cognate})</span>
                    )}
                    <KannadaToggle script={w.script} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-amber-600 font-semibold">⭐ +{xpEarned} XP</span>
          </div>
          <button
            onClick={onNext}
            className="w-full bg-[#B45309] text-white font-bold py-3 rounded-xl hover:bg-[#78350F] transition-colors"
          >
            Next Step →
          </button>
        </div>
      </div>
    )
  }

  if (props.type === 'wrong') {
    const { reaction, correctChoice, livesLeft, onRetry } = props
    const hearts = '❤️'.repeat(livesLeft) + '🖤'.repeat(Math.max(0, 3 - livesLeft))
    return (
      <div className="mt-4 rounded-2xl overflow-hidden border-2 border-red-300">
        <div className="bg-gradient-to-r from-red-50 to-red-100 px-4 py-3 text-center">
          <div className="text-2xl mb-1">😅</div>
          <p className="font-bold text-red-800 text-lg">Hattira ide!</p>
          <p className="text-xs text-red-700">Almost right — try again!</p>
          <p className="text-sm mt-1">{hearts}</p>
        </div>
        <div className="bg-white px-4 py-3">
          <div className="flex items-start gap-2 mb-3">
            <span className="text-xl">{reaction.speakerEmoji}</span>
            <div className="bg-red-50 rounded-xl rounded-tl-sm px-3 py-2 flex-1">
              <p className="font-semibold text-[#1E293B] text-sm">{reaction.kannada}</p>
              <p className="text-xs text-gray-500 italic">{reaction.pronunciation}</p>
              <p className="text-xs text-gray-600 mt-0.5">{reaction.english}</p>
              <KannadaToggle script={reaction.script} />
            </div>
          </div>
          <div className="bg-green-50 border border-green-300 rounded-xl p-3 mb-3">
            <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">
              ✅ Correct answer
            </div>
            <p className="font-semibold text-green-900">{correctChoice.kannada}</p>
            <p className="text-xs text-gray-500 italic">{correctChoice.pronunciation}</p>
            <p className="text-xs text-gray-600 mt-0.5">{correctChoice.english}</p>
            <KannadaToggle script={correctChoice.script} />
          </div>
          <button
            onClick={onRetry}
            className="w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors"
          >
            Try Again 🔄
          </button>
        </div>
      </div>
    )
  }

  const { onLeave } = props
  return (
    <div className="mt-4 rounded-2xl overflow-hidden border-2 border-red-300 bg-white">
      <div className="bg-gradient-to-r from-red-50 to-red-100 px-4 py-6 text-center">
        <div className="text-4xl mb-2">💔</div>
        <p className="font-bold text-red-800 text-lg">Out of lives!</p>
        <p className="text-sm text-red-700 mt-1">
          Take a 30-minute break — lives regenerate automatically.
        </p>
        <p className="text-xs text-gray-400 mt-1">Neevu maaDuttira! (You can do it!) 💪</p>
      </div>
      <div className="px-4 py-4">
        <button
          onClick={onLeave}
          className="w-full bg-[#B45309] text-white font-bold py-3 rounded-xl hover:bg-[#78350F] transition-colors"
        >
          ← Back to Modules
        </button>
      </div>
    </div>
  )
}
