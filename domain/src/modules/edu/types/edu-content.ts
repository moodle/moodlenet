import { _nullish, date_time_string, positive_integer } from '@moodle/lib-types'
import { contentLanguageId, contentLicenseId } from '../../content'
import { asset } from '../../storage'
import { eduBloomCognitiveLevel, eduResourceTypeId, eduIscedFieldId, eduIscedLevelId } from './edu-categories'

export type eduResourceId = string
export type eduResourceData = {
  id: eduResourceId
  asset: asset
  image: _nullish | asset
  title: string
  description: string
  iscedField: _nullish | eduIscedFieldId
  iscedLevel: _nullish | eduIscedLevelId
  bloomLearningOutcomes: bloomLearningOutcome[]
  type: _nullish | eduResourceTypeId
  language: _nullish | contentLanguageId
  license: _nullish | contentLicenseId
  publicationDate: _nullish | { month: positive_integer; year: positive_integer }
}

export type bloomLearningOutcome = {
  level: eduBloomCognitiveLevel
  verb: string
  learningOutcome: string
}

export type eduResourceCollectionId = string
export type eduResourceCollectionData = {
  id: eduResourceCollectionId
  title: string
  description: string
  image: _nullish | asset
  eduResourceList: eduResourceCollectionItem[]
}
export type eduResourceCollectionItem = {
  added: date_time_string
  eduResourceId: eduResourceId
}
