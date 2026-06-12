'use client'

import Link from 'next/link'

interface NavbarProps {
  streakCount: number
  xp: number
}

export default function Navbar({ streakCount, xp }: NavbarProps) {
  return (
    <nav className="bg-[#B45309] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-xl">🪷</span>
        <span className="font-bold text-lg">LearnKannada</span>
        <span className="text-xs opacity-70 hidden sm:inline">Everyday Edition</span>
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span>⭐</span>
          <span className="font-semibold">{xp}</span>
          <span className="opacity-70 hidden sm:inline">XP</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🔥</span>
          <span className="font-semibold">{streakCount}</span>
          <span className="opacity-70 hidden sm:inline">day streak</span>
        </div>
        <Link
          href="/survival-kit"
          className="bg-[#F59E0B] text-[#78350F] font-bold text-xs px-3 py-1.5 rounded-full hover:bg-[#D97706] transition-colors"
        >
          ⚡ Survival Kit
        </Link>
      </div>
    </nav>
  )
}
