import { _nullish, d_u__d } from '@moodle/lib-types'
import { contentLanguageCode, contentLicenseCode } from '../../content'
import { asset } from '../../storage'
import { eduBloomCognitiveLevel, eduIscedFieldCode, eduIscedLevelCode, eduResourceTypeCode } from './edu-categories'

export type eduResourceMeta = {
  title: string
  description: string
  iscedField: _nullish | eduIscedFieldCode
  iscedLevel: _nullish | eduIscedLevelCode
  bloomLearningOutcomes: bloomLearningOutcome[]
  type: _nullish | eduResourceTypeCode
  language: _nullish | contentLanguageCode
  license: _nullish | contentLicenseCode
  publicationDate: _nullish | { month: number; year: number }
}

export type eduResourceData = eduResourceMeta & {
  asset: d_u__d<asset, 'type', 'external' | 'local'>
  image: asset
}

export type bloomLearningOutcome = {
  level: eduBloomCognitiveLevel
  verb: string
  learningOutcome: string
}

export type eduCollectionMeta = {
  title: string
  description: string
}
export type eduCollectionData = eduCollectionMeta & {
  image: asset
}
