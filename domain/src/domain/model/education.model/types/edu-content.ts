import { languageCode, licenseCode } from '../../content.model'
import { bloomCognitiveLevel, iscedFieldCode, iscedLevelCode, resourceTypeCode } from './edu-categories'

export type eduResource = {
  title: string
  description: string
  iscedField: null | iscedFieldCode
  iscedLevel: null | iscedLevelCode
  bloomLearningOutcomes: bloomLearningOutcome[]
  type: null | resourceTypeCode
  language: null | languageCode
  license: null | licenseCode
  publicationDate: null | { month: number | null; year: number }
  asset: moo.def.content.asset
  image: moo.def.content.asset.optional
}

export type bloomLearningOutcome = {
  level: bloomCognitiveLevel
  verb: string
  sentence: string
}

export type eduCollection = {
  title: string
  description: string
  image: moo.def.content.asset.optional
}

