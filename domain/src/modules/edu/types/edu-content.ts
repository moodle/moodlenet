import { _nullish, positive_integer } from '@moodle/lib-types'
import { contentLanguageCode, contentLicenseCode } from '../../content'
import { asset } from '../../storage'
import { eduBloomCognitiveLevel, eduIscedFieldCode, eduIscedLevelCode, eduResourceTypeCode } from './edu-categories'

export type eduResourceData = {
  asset: asset
  title: string
  description: string
  iscedField: _nullish | eduIscedFieldCode
  iscedLevel: _nullish | eduIscedLevelCode
  bloomLearningOutcomes: bloomLearningOutcome[]
  type: _nullish | eduResourceTypeCode
  language: _nullish | contentLanguageCode
  license: _nullish | contentLicenseCode
  publicationDate: _nullish | { month: positive_integer; year: positive_integer }
  image: _nullish | asset
}

export type bloomLearningOutcome = {
  level: eduBloomCognitiveLevel
  verb: string
  learningOutcome: string
}

export type eduResourceCollectionData = {
  title: string
  description: string
  image: _nullish | asset
}
