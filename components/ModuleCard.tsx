import Link from 'next/link'
import ProgressBar from './ProgressBar'
import type { Module } from '@/types'

interface ModuleCardProps {
  module: Module
  percent: number
  unlocked: boolean
  lessonCount: number
}

export default function ModuleCard({ module, percent, unlocked, lessonCount }: ModuleCardProps) {
  const completedCount = Math.round((percent / 100) * lessonCount)

  if (!unlocked) {
    return (
      <div className="bg-white rounded-xl p-4 border-2 border-gray-100 opacity-60 select-none">
        <div className="text-3xl text-center mb-2">{module.emoji}</div>
        <h3 className="font-bold text-xs text-center text-gray-500">{module.kannadaTitle}</h3>
        <div className="text-center text-xs text-gray-400 mt-2">🔒 Locked</div>
        <ProgressBar percent={0} className="mt-2" />
      </div>
    )
  }

  return (
    <Link href={`/module/${module.slug}`}>
      <div
        className="bg-white rounded-xl p-4 border-2 hover:shadow-md transition-all cursor-pointer"
        style={{ borderColor: module.color }}
      >
        <div className="text-3xl text-center mb-2">{module.emoji}</div>
        <h3 className="font-bold text-xs text-center text-[#1E293B]">{module.kannadaTitle}</h3>
        <ProgressBar percent={percent} className="mt-3" color={module.color} />
        <div className="text-center text-xs text-gray-400 mt-1">
          {completedCount}/{lessonCount} done
        </div>
      </div>
    </Link>
  )
}
