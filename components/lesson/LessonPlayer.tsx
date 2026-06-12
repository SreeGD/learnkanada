'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SceneSetter from './SceneSetter'
import DialogueBubble from './DialogueBubble'
import AnswerChoices from './AnswerChoices'
import FeedbackPanel from './FeedbackPanel'
import ProgressBar from '@/components/ProgressBar'
import {
  getProgress, saveProgress, addXP, loseLife, markLessonComplete,
  getCurrentLives, XP_PER_CORRECT,
} from '@/lib/progress'
import type { Lesson, LessonStep, ChoiceStep, Choice, AppProgress } from '@/types'

type LessonState = 'playing' | 'feedback-correct' | 'feedback-wrong' | 'out-of-lives' | 'complete'

interface LessonPlayerProps {
  lesson: Lesson
  moduleSlug: string
}

export default function LessonPlayer({ lesson, moduleSlug }: LessonPlayerProps) {
  const router = useRouter()
  const [progress, setProgress] = useState<AppProgress | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [lessonState, setLessonState] = useState<LessonState>('playing')
  const [lastChoice, setLastChoice] = useState<Choice | null>(null)
  const [completedSteps, setCompletedSteps] = useState<LessonStep[]>([])

  useEffect(() => { setProgress(getProgress()) }, [])

  const currentStep = lesson.steps[stepIndex] as LessonStep | undefined
  const totalSteps = lesson.steps.length
  const progressPercent = Math.round((stepIndex / totalSteps) * 100)

  const handleDialogueNext = useCallback(() => {
    if (!progress) return
    const next = stepIndex + 1
    if (next >= totalSteps) {
      const updated = markLessonComplete(progress, moduleSlug, lesson.id)
      saveProgress(updated); setProgress(updated); setLessonState('complete')
    } else {
      setCompletedSteps((prev) => [...prev, lesson.steps[stepIndex]])
      setStepIndex(next)
    }
  }, [progress, stepIndex, totalSteps, moduleSlug, lesson])

  const handleAnswer = useCallback((correct: boolean, choice: Choice) => {
    if (!progress) return
    setLastChoice(choice)
    if (correct) {
      const updated = addXP(progress, XP_PER_CORRECT)
      saveProgress(updated); setProgress(updated); setLessonState('feedback-correct')
    } else {
      const lives = getCurrentLives(progress)
      const updated = loseLife(progress)
      saveProgress(updated); setProgress(updated)
      setLessonState(lives <= 1 ? 'out-of-lives' : 'feedback-wrong')
    }
  }, [progress])

  const handleCorrectNext = useCallback(() => {
    if (!progress) return
    const next = stepIndex + 1
    if (next >= totalSteps) {
      const updated = markLessonComplete(progress, moduleSlug, lesson.id)
      saveProgress(updated); setProgress(updated); setLessonState('complete')
    } else {
      setCompletedSteps((prev) => [...prev, lesson.steps[stepIndex]])
      setStepIndex(next); setLessonState('playing')
    }
  }, [progress, stepIndex, totalSteps, moduleSlug, lesson])

  const handleRetry = useCallback(() => setLessonState('playing'), [])

  if (!progress) return null

  const lives = getCurrentLives(progress)
  const hearts = '❤️'.repeat(lives) + '🖤'.repeat(Math.max(0, 3 - lives))
  const choiceCount = lesson.steps.filter((s) => s.type === 'choice').length

  if (lessonState === 'complete') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Pathya mugitu! 🎉</h2>
          <p className="text-gray-500 text-sm mb-2">{lesson.title}</p>
          <div className="bg-amber-50 rounded-xl p-4 mb-6">
            <p className="text-amber-600 font-bold text-lg">
              ⭐ +{XP_PER_CORRECT * choiceCount + 50} XP
            </p>
            <p className="text-xs text-gray-500 mt-1">Lesson bonus included!</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link
              href={`/module/${moduleSlug}`}
              className="bg-[#B45309] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#78350F] transition-colors"
            >
              Next Lesson →
            </Link>
            <Link
              href="/"
              className="bg-white text-[#B45309] font-semibold px-6 py-3 rounded-full text-sm border-2 border-[#B45309] hover:bg-red-50 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-[#B45309] text-white px-4 py-3 flex items-center justify-between">
        <Link href={`/module/${moduleSlug}`} className="text-sm opacity-80 hover:opacity-100">
          ← Back
        </Link>
        <span className="text-sm font-semibold truncate max-w-[60%]">{lesson.title}</span>
        <span className="text-sm">{hearts}</span>
      </div>

      <div className="bg-red-100 px-4 py-2 flex items-center gap-3">
        <ProgressBar percent={progressPercent} className="flex-1" />
        <span className="text-xs text-red-800 font-semibold whitespace-nowrap">
          Step {stepIndex + 1} of {totalSteps}
        </span>
      </div>

      <SceneSetter scene={lesson.scene} />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {completedSteps.map((step, i) => (
          <div key={i} className="opacity-60">
            {step.type === 'dialogue' && (
              <DialogueBubble step={step} isLearner={step.speaker === 'You'} />
            )}
          </div>
        ))}

        {currentStep && lessonState === 'playing' && (
          <>
            {currentStep.type === 'dialogue' && (
              <>
                <DialogueBubble step={currentStep} isLearner={currentStep.speaker === 'You'} />
                <button
                  onClick={handleDialogueNext}
                  className="w-full bg-[#B45309] text-white font-bold py-3 rounded-xl hover:bg-[#78350F] transition-colors"
                >
                  Continue →
                </button>
              </>
            )}
            {currentStep.type === 'choice' && (
              <AnswerChoices
                prompt={currentStep.prompt}
                choices={currentStep.choices}
                onAnswer={handleAnswer}
              />
            )}
          </>
        )}

        {lessonState === 'feedback-correct' && currentStep?.type === 'choice' && (
          <FeedbackPanel
            type="correct"
            reaction={currentStep.correctReaction}
            vocab={currentStep.vocab}
            xpEarned={XP_PER_CORRECT}
            grammarTip={(currentStep as ChoiceStep).grammarTip}
            onNext={handleCorrectNext}
          />
        )}
        {lessonState === 'feedback-wrong' && currentStep?.type === 'choice' && lastChoice && (
          <FeedbackPanel
            type="wrong"
            reaction={currentStep.wrongReaction}
            correctChoice={currentStep.choices.find((c) => c.correct)!}
            livesLeft={lives}
            onRetry={handleRetry}
          />
        )}
        {lessonState === 'out-of-lives' && (
          <FeedbackPanel
            type="out-of-lives"
            onLeave={() => router.push(`/module/${moduleSlug}`)}
          />
        )}
      </div>
    </div>
  )
}
