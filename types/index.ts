// ─── Content Types ────────────────────────────────────────────────────────────

export type PhraseCategory =
  | 'greetings'
  | 'numbers'
  | 'polite'
  | 'directions'
  | 'money'
  | 'time'

export interface Phrase {
  id: string
  kannada: string
  script: string
  pronunciation: string
  english: string
  category: PhraseCategory
  tip?: string
}

export interface VocabWord {
  kannada: string
  script: string
  pronunciation: string
  english: string
  cognate?: string
}

export interface Choice {
  kannada: string
  script: string
  pronunciation: string
  english: string
  correct: boolean
  hint?: string
}

export interface Reaction {
  speaker: string
  speakerEmoji: string
  kannada: string
  script: string
  pronunciation: string
  english: string
}

export interface DialogueStep {
  type: 'dialogue'
  speaker: string
  speakerEmoji: string
  kannada: string
  script: string
  pronunciation: string
  english: string
}

export interface ChoiceStep {
  type: 'choice'
  prompt: string
  choices: Choice[]
  correctReaction: Reaction
  wrongReaction: Reaction
  vocab: VocabWord[]
  grammarTip?: string
}

export type LessonStep = DialogueStep | ChoiceStep

export interface Lesson {
  id: string
  title: string
  scene: string
  steps: LessonStep[]
}

export interface Module {
  id: string
  slug: string
  title: string
  kannadaTitle: string
  emoji: string
  color: string
  phase: 1 | 2 | 3
  lessons: Lesson[]
}

// ─── Progress Types ───────────────────────────────────────────────────────────

export interface PhraseProgress {
  id: string
  gotIt: boolean
  nextReview: number
}

export interface LessonProgress {
  id: string
  completed: boolean
  xp: number
}

export interface ModuleProgress {
  slug: string
  lessons: Record<string, LessonProgress>
}

export interface AppProgress {
  survivalKit: Record<string, PhraseProgress>
  modules: Record<string, ModuleProgress>
  xp: number
  streak: {
    count: number
    lastActiveDate: string
  }
  lives: {
    count: number
    lastRegenTime: number
  }
}
