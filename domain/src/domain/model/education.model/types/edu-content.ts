import { languageCode, licenseCode } from '../../content.model'
import { bloomCognitiveLevel, iscedFieldCode, iscedLevelCode, resourceTypeCode } from './edu-categories'

export type eduResourceData = {
  title: string
  description: string
  iscedField: null | iscedFieldCode
  iscedLevel: null | iscedLevelCode
  bloomLearningOutcomes: bloomLearningOutcome[]
  type: null | resourceTypeCode
  language: null | languageCode
  license: null | licenseCode
  publicationDate: null | { month: number | null; year: number }
}

export type eduResourceAssets = {
  asset: moo.content.asset
  image: moo.content.asset.maybe
}

export type bloomLearningOutcome = {
  level: bloomCognitiveLevel
  verb: string
  sentence: string
}

export type eduCollectionData = {
  title: string
  description: string
}

export type eduCollectionAssets = {
  image: moo.content.asset.maybe
}
