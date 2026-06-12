'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Flashcard from '@/components/survival-kit/Flashcard'
import ProgressBar from '@/components/ProgressBar'
import {
  getProgress, saveProgress, markPhraseGotIt, markPhrasePracticeMore, getSurvivalKitPercent,
} from '@/lib/progress'
import survivalKitData from '@/data/survival-kit.json'
import type { Phrase, AppProgress } from '@/types'

const ALL_PHRASES = survivalKitData.phrases as Phrase[]
const TOTAL = ALL_PHRASES.length

function getQueue(progress: AppProgress): Phrase[] {
  const now = Date.now()
  return [...ALL_PHRASES]
    .sort((a, b) => {
      const ar = progress.survivalKit[a.id]?.nextReview ?? 0
      const br = progress.survivalKit[b.id]?.nextReview ?? 0
      return ar - br
    })
    .filter((p) => {
      const entry = progress.survivalKit[p.id]
      return !entry || !entry.gotIt || entry.nextReview <= now
    })
}

export default function SurvivalKitPage() {
  const [progress, setProgress] = useState<AppProgress | null>(null)
  const [queue, setQueue] = useState<Phrase[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sessionDone, setSessionDone] = useState(false)

  useEffect(() => {
    const p = getProgress()
    setProgress(p)
    setQueue(getQueue(p))
  }, [])

  const advance = useCallback((updatedProgress: AppProgress) => {
    saveProgress(updatedProgress)
    setProgress(updatedProgress)
    const newQueue = getQueue(updatedProgress)
    setQueue(newQueue)
    if (currentIndex + 1 >= newQueue.length) setSessionDone(true)
    else setCurrentIndex((i) => i + 1)
  }, [currentIndex])

  const handleGotIt = useCallback(() => {
    if (!progress || !queue[currentIndex]) return
    advance(markPhraseGotIt(progress, queue[currentIndex].id))
  }, [progress, queue, currentIndex, advance])

  const handlePracticeMore = useCallback(() => {
    if (!progress || !queue[currentIndex]) return
    advance(markPhrasePracticeMore(progress, queue[currentIndex].id))
  }, [progress, queue, currentIndex, advance])

  if (!progress) return null

  const percent = getSurvivalKitPercent(progress, TOTAL)
  const gotItCount = Object.values(progress.survivalKit).filter((p) => p.gotIt).length

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar streakCount={progress.streak.count} xp={progress.xp} />
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-[#B45309] font-semibold text-sm hover:underline">← Home</Link>
          <div className="flex-1">
            <h1 className="font-bold text-[#1E293B] text-lg">⚡ Survival Kit</h1>
            <div className="flex items-center gap-2 mt-1">
              <ProgressBar percent={percent} className="flex-1" />
              <span className="text-xs text-gray-500 whitespace-nowrap">{gotItCount}/{TOTAL}</span>
            </div>
          </div>
        </div>

        {sessionDone || queue.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-bold text-[#1E293B] mb-2">
              {percent === 100 ? 'Ella phrases kalitiri! 🎉' : 'Olleya session!'}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {percent === 100
                ? 'All 40 survival phrases mastered. Come back tomorrow!'
                : `${gotItCount} of ${TOTAL} phrases mastered. Keep going!`}
            </p>
            <Link
              href="/"
              className="bg-[#B45309] text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-[#78350F] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center text-xs text-gray-400 mb-4">
              Card {Math.min(currentIndex + 1, queue.length)} of {queue.length} due
            </div>
            <Flashcard
              phrase={queue[currentIndex]}
              onGotIt={handleGotIt}
              onPracticeMore={handlePracticeMore}
            />
          </>
        )}
      </div>
    </div>
  )
}
