'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ProgressBar from '@/components/ProgressBar'
import { getProgress, getModulePercent } from '@/lib/progress'
import type { Module, AppProgress } from '@/types'

export default function ModuleOverviewClient({ module }: { module: Module }) {
  const [progress, setProgress] = useState<AppProgress | null>(null)

  useEffect(() => { setProgress(getProgress()) }, [])

  if (!progress) return null

  const percent = getModulePercent(progress, module.slug, module.lessons.length)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar streakCount={progress.streak.count} xp={progress.xp} />

      <div
        className="text-white px-4 py-6"
        style={{ background: `linear-gradient(135deg, ${module.color}, #78350F)` }}
      >
        <Link href="/" className="text-sm opacity-80 hover:opacity-100 mb-3 inline-block">← Home</Link>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{module.emoji}</span>
          <div>
            <h1 className="text-xl font-bold">{module.kannadaTitle}</h1>
            <p className="text-sm opacity-80">{module.title}</p>
            <p className="text-xs opacity-70">{module.lessons.length} lessons</p>
          </div>
        </div>
        <ProgressBar percent={percent} color="white" />
        <p className="text-xs opacity-80 mt-1">{percent}% complete</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-3">
        {module.lessons.map((lesson, i) => {
          const isCompleted = progress.modules[module.slug]?.lessons[lesson.id]?.completed ?? false
          const isUnlocked =
            i === 0 || !!(progress.modules[module.slug]?.lessons[module.lessons[i - 1].id]?.completed)

          return (
            <div key={lesson.id}>
              {isUnlocked ? (
                <Link href={`/module/${module.slug}/${lesson.id}`}>
                  <div
                    className="bg-white rounded-xl p-4 border-2 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
                    style={{ borderColor: isCompleted ? module.color : '#FECACA' }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                      style={{ backgroundColor: isCompleted ? module.color : '#B45309' }}
                    >
                      {isCompleted ? '✓' : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#1E293B] text-sm">{lesson.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {lesson.steps.filter((s) => s.type === 'choice').length} questions ·{' '}
                        {isCompleted ? '✅ Completed' : '⏱ ~5 min'}
                      </p>
                    </div>
                    {!isCompleted && (
                      <span className="text-[#B45309] font-bold text-sm">Start →</span>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="bg-white rounded-xl p-4 border-2 border-gray-100 flex items-center gap-4 opacity-50">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 font-bold flex-shrink-0 text-gray-400">
                    🔒
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 text-sm">{lesson.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Complete previous lesson first</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
