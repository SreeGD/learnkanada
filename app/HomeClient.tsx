'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ModuleCard from '@/components/ModuleCard'
import PhraseOfTheDay from '@/components/PhraseOfTheDay'
import ProgressBar from '@/components/ProgressBar'
import { getProgress, saveProgress, getSurvivalKitPercent, getModulePercent } from '@/lib/progress'
import { isModuleUnlocked } from '@/lib/unlock'
import { updateStreak } from '@/lib/streak'
import type { Module, Phrase, AppProgress } from '@/types'

const TOTAL_PHRASES = 40

interface HomeClientProps {
  modules: Module[]
  phrases: Phrase[]
  phraseOfDay: Phrase
}

export default function HomeClient({ modules, phraseOfDay }: HomeClientProps) {
  const [progress, setProgress] = useState<AppProgress | null>(null)

  useEffect(() => {
    const p = updateStreak(getProgress())
    saveProgress(p)
    setProgress(p)
  }, [])

  if (!progress) return null

  const survivalPercent = getSurvivalKitPercent(progress, TOTAL_PHRASES)
  const survivalDone = Math.round((survivalPercent / 100) * TOTAL_PHRASES)
  const moduleLessonCounts = Object.fromEntries(modules.map((m) => [m.slug, m.lessons.length]))
  const overallPercent = Math.round(
    (survivalPercent + modules.reduce((acc, m) => acc + getModulePercent(progress, m.slug, m.lessons.length), 0)) /
    (modules.length + 1),
  )

  const phase1 = modules.filter((m) => m.phase === 1)
  const phase2 = modules.filter((m) => m.phase === 2)
  const phase3 = modules.filter((m) => m.phase === 3)

  const renderModules = (mods: Module[]) => (
    <div className="grid grid-cols-2 gap-3">
      {mods.map((module) => (
        <ModuleCard
          key={module.slug}
          module={module}
          percent={getModulePercent(progress, module.slug, module.lessons.length)}
          unlocked={isModuleUnlocked(module.slug, progress, moduleLessonCounts)}
          lessonCount={module.lessons.length}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar streakCount={progress.streak.count} xp={progress.xp} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#B45309] to-[#78350F] px-4 py-8 text-center text-white">
        <div className="text-4xl mb-2">🪷</div>
        <h1 className="text-2xl font-bold">Namaskara, S &amp; R!</h1>
        <p className="text-amber-100 text-sm mt-1 mb-1">Bengaluru jeevana — banni, kannada kaliyona!</p>
        <p className="text-amber-200 text-xs mb-4 italic">Bangalore life — come, let&apos;s learn Kannada!</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            href="/survival-kit"
            className="bg-[#F59E0B] text-[#78350F] font-bold px-6 py-2.5 rounded-full text-sm hover:bg-[#D97706] transition-colors shadow"
          >
            🚀 Start Learning
          </Link>
          <Link
            href="/survival-kit"
            className="bg-white/20 text-white font-semibold px-6 py-2.5 rounded-full text-sm border border-white/40 hover:bg-white/30 transition-colors"
          >
            ⚡ Survival Kit
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Overall progress */}
        <div className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-sm font-semibold text-[#1E293B] whitespace-nowrap">Overall</span>
          <ProgressBar percent={overallPercent} className="flex-1" />
          <span className="text-xs text-gray-500 whitespace-nowrap">{overallPercent}%</span>
        </div>

        {/* Survival Kit banner */}
        <div className="bg-[#B45309] rounded-xl p-4 text-white flex items-center justify-between gap-3">
          <div>
            <div className="font-bold text-base">⚡ Survival Kit</div>
            <div className="text-sm opacity-90 mt-0.5">40 everyday phrases · {survivalDone} done</div>
            <ProgressBar percent={survivalPercent} className="mt-2 w-40" color="white" />
          </div>
          <Link
            href="/survival-kit"
            className="bg-white text-[#B45309] font-bold text-sm px-4 py-2 rounded-full whitespace-nowrap hover:bg-red-50 transition-colors"
          >
            Continue →
          </Link>
        </div>

        {/* Phase 1 */}
        <div>
          <h2 className="text-[#1E293B] font-bold text-base mb-1">📗 Phase 1 — Home &amp; Daily</h2>
          <p className="text-xs text-gray-500 mb-3">At home — maid &amp; neighborhood shop</p>
          {renderModules(phase1)}
        </div>

        {/* Phase 2 */}
        <div>
          <h2 className="text-[#1E293B] font-bold text-base mb-1">📘 Phase 2 — Out &amp; About</h2>
          <p className="text-xs text-gray-500 mb-3">Getting around — auto, bus, railway &amp; shopping</p>
          {renderModules(phase2)}
        </div>

        {/* Phase 3 */}
        <div>
          <h2 className="text-[#1E293B] font-bold text-base mb-1">📙 Phase 3 — Social &amp; Cultural</h2>
          <p className="text-xs text-gray-500 mb-3">Phone, temple, little kids &amp; the Bhagavad Gita</p>
          {renderModules(phase3)}
        </div>

        <PhraseOfTheDay phrase={phraseOfDay} />
      </div>
    </div>
  )
}
