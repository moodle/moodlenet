import { _nullish, date_time_string, positive_integer } from '@moodle/lib-types'
import { language_id, license_id } from '../../content'
import { asset } from '../../storage'
import { bloom_cognitive_level, edu_resource_type_id, isced_field_id, isced_level_id } from './edu-categories'

export type edu_resource_id = string
export type eduResourceData = {
  id: edu_resource_id
  asset: asset
  image: _nullish | asset
  title: string
  description: string
  iscedField: _nullish | isced_field_id
  iscedLevel: _nullish | isced_level_id
  bloomLearningOutcomes: bloomLearningOutcome[]
  type: _nullish | edu_resource_type_id
  language: _nullish | language_id
  license: _nullish | license_id
  publicationDate: _nullish | { month: positive_integer; year: positive_integer }
}

export type bloomLearningOutcome = {
  level: bloom_cognitive_level
  verb: string
  learningOutcome: string
}

export type edu_resource_collection_id = string
export type eduResourceCollectionData = {
  id: edu_resource_collection_id
  title: string
  description: string
  image: _nullish | asset
  eduResourceList: eduResourceCollectionItem[]
}
export type eduResourceCollectionItem = {
  added: date_time_string
  eduResourceId: edu_resource_id
}
