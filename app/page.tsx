import HomeClient from './HomeClient'
import { getPhraseOfDay } from '@/lib/phraseOfDay'
import survivalKitData from '@/data/survival-kit.json'
import maidData from '@/data/modules/01-maneya-kelasa.json'
import angadiData from '@/data/modules/02-angadi.json'
import autoData from '@/data/modules/03-auto-prayana.json'
import busData from '@/data/modules/04-bus-railway.json'
import shoppingData from '@/data/modules/05-shopping.json'
import phoneData from '@/data/modules/06-phone-maatu.json'
import templeData from '@/data/modules/07-devasthana.json'
import kidsData from '@/data/modules/08-makkalu.json'
import gitaData from '@/data/modules/09-bhagavadgita.json'
import type { Module, Phrase } from '@/types'

const modules = [
  maidData,
  angadiData,
  autoData,
  busData,
  shoppingData,
  phoneData,
  templeData,
  kidsData,
  gitaData,
] as unknown as Module[]

const phrases = survivalKitData.phrases as Phrase[]

export default function HomePage() {
  return <HomeClient modules={modules} phrases={phrases} phraseOfDay={getPhraseOfDay(phrases)} />
}
