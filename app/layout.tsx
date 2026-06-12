import type { Metadata } from 'next'
import { Noto_Sans_Kannada } from 'next/font/google'
import './globals.css'

const notoKannada = Noto_Sans_Kannada({
  subsets: ['kannada'],
  weight: ['400', '600'],
  variable: '--font-kannada',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LearnKannada — Everyday Edition',
  description: 'Learn everyday spoken Kannada for life in Bangalore. Built for Sree & Radhi.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kn" className={`h-full ${notoKannada.variable}`}>
      <body className="min-h-full bg-[#F8FAFC]">{children}</body>
    </html>
  )
}
