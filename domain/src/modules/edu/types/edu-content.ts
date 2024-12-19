import { contentLanguageCode, contentLicenseCode } from '../../content'
import { asset, maybeAsset } from '../../storage'
import { eduBloomCognitiveLevel, eduIscedFieldCode, eduIscedLevelCode, eduResourceTypeCode } from './edu-categories'

export type eduResourceMeta = {
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

export type eduResourceData = eduResourceMeta & {
  asset: asset
  image: maybeAsset
}

export type bloomLearningOutcome = {
  level: eduBloomCognitiveLevel
  verb: string
  sentence: string
}

export type eduCollectionMeta = {
  title: string
  description: string
}

export type eduCollectionData = eduCollectionMeta & {
  image: maybeAsset
}
