interface GrammarTipProps {
  tip: string
}

export default function GrammarTip({ tip }: GrammarTipProps) {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl p-3 mb-3">
      <div className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">
        📚 Grammar Tip
      </div>
      <p className="text-sm text-amber-900">{tip}</p>
    </div>
  )
}
