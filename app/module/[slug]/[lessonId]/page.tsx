import { notFound } from 'next/navigation'
import LessonPlayer from '@/components/lesson/LessonPlayer'
import maidData from '@/data/modules/01-maneya-kelasa.json'
import angadiData from '@/data/modules/02-angadi.json'
import autoData from '@/data/modules/03-auto-prayana.json'
import busData from '@/data/modules/04-bus-railway.json'
import shoppingData from '@/data/modules/05-shopping.json'
import phoneData from '@/data/modules/06-phone-maatu.json'
import templeData from '@/data/modules/07-devasthana.json'
import kidsData from '@/data/modules/08-makkalu.json'
import gitaData from '@/data/modules/09-bhagavadgita.json'
import type { Module } from '@/types'

const moduleMap: Record<string, unknown> = {
  '01-maneya-kelasa': maidData,
  '02-angadi': angadiData,
  '03-auto-prayana': autoData,
  '04-bus-railway': busData,
  '05-shopping': shoppingData,
  '06-phone-maatu': phoneData,
  '07-devasthana': templeData,
  '08-makkalu': kidsData,
  '09-bhagavadgita': gitaData,
}

export function generateStaticParams() {
  return Object.entries(moduleMap).flatMap(([slug, data]) =>
    (data as unknown as Module).lessons.map((lesson) => ({ slug, lessonId: lesson.id })),
  )
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { slug, lessonId } = await params
  const data = moduleMap[slug]
  if (!data) notFound()
  const mod = data as unknown as Module
  const lesson = mod.lessons.find((l) => l.id === lessonId)
  if (!lesson) notFound()
  return <LessonPlayer lesson={lesson} moduleSlug={slug} />
}
