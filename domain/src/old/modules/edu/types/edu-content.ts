import { contentLanguageCode, contentLicenseCode } from '../../content'
import { asset, maybeAsset } from '../../storage'
import { eduBloomCognitiveLevel, eduIscedFieldCode, eduIscedLevelCode, eduResourceTypeCode } from './edu-categories'

export type eduResourceData = {
  title: string
  description: string
  iscedField: null | eduIscedFieldCode
  iscedLevel: null | eduIscedLevelCode
  bloomLearningOutcomes: bloomLearningOutcome[]
  type: null | eduResourceTypeCode
  language: null | contentLanguageCode
  license: null | contentLicenseCode
  publicationDate: null | { month: number | null; year: number }
}

export type eduResourceAssets = {
  asset: asset
  image: maybeAsset
}

export type bloomLearningOutcome = {
  level: eduBloomCognitiveLevel
  verb: string
  sentence: string
}

export type eduCollectionData = {
  title: string
  description: string
}

export type eduCollectionAssets = {
  image: maybeAsset
}
