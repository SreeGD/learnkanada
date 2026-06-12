interface ProgressBarProps {
  percent: number
  className?: string
  color?: string
}

export default function ProgressBar({ percent, className = '', color = '#B45309' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div className={`w-full bg-amber-100 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  )
}
