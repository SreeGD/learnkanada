import { notFound } from 'next/navigation'
import ModuleOverviewClient from './ModuleOverviewClient'
import maidData from '@/data/modules/01-maneya-kelasa.json'
import angadiData from '@/data/modules/02-angadi.json'
import autoData from '@/data/modules/03-auto-prayana.json'
import busData from '@/data/modules/04-bus-railway.json'
import shoppingData from '@/data/modules/05-shopping.json'
import phoneData from '@/data/modules/06-phone-maatu.json'
import templeData from '@/data/modules/07-devasthana.json'
import type { Module } from '@/types'

const moduleMap: Record<string, unknown> = {
  '01-maneya-kelasa': maidData,
  '02-angadi': angadiData,
  '03-auto-prayana': autoData,
  '04-bus-railway': busData,
  '05-shopping': shoppingData,
  '06-phone-maatu': phoneData,
  '07-devasthana': templeData,
}

export function generateStaticParams() {
  return Object.keys(moduleMap).map((slug) => ({ slug }))
}

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = moduleMap[slug]
  if (!data) notFound()
  return <ModuleOverviewClient module={data as unknown as Module} />
}
