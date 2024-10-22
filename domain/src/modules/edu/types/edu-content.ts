import { _nullish, d_u, date_time_string, positive_integer } from '@moodle/lib-types'
import { language_id, license_id } from '../../content'
import { asset } from '../../storage'
import { bloom_cognitive_level, ed_resource_type_id, isced_field_id, isced_level_id } from './edu-categories'

export type edu_resource_id = string
export type assetTextExtractionResult = {
  texts: {
    weight: textExtractionWeight
    body: string
  }[]
  extractedAt: string
  extractor: string
  extractionMethod: string
}

export type eduResourceRecord = {
  id: edu_resource_id
  asset: asset
  data: eduResourceData
  assetTextExtraction: d_u<
    {
      extracted: { result: assetTextExtractionResult }
      requested: { at: date_time_string } & d_u<
        { enqueued: unknown; ongoing: { startedAt: date_time_string } },
        'extraction'
      >
    },
    'status'
  >
  aiAgent: {
    suggestions: d_u<
      {
        aborted: unknown
        requested: { at: date_time_string } & d_u<
          { enqueued: unknown; ongoing: { startedAt: date_time_string } },
          'generation'
        >
        result: { data: eduResourceData }
      },
      'status'
    >
  }
}
export type textExtractionWeight = 'title' | 'heading' | 'paragraph'

export type eduResourceData = {
  title: string
  description: string
  image: _nullish | _nullish | asset
  iscedField: _nullish | isced_field_id
  iscedLevel: _nullish | isced_level_id
  bloomLearningOutcomes: bloomLearningOutcome[]
  type: _nullish | ed_resource_type_id
  language: _nullish | language_id
  license: _nullish | license_id
  publicationDate: _nullish | { month: positive_integer; year: positive_integer }
}

export type bloomLearningOutcome = {
  level: bloom_cognitive_level
  verb: string
  learningOutcome: string
}

export type collection_of_edu_resources_id = string
export type collectionOfEduResourcesRecord = {
  data: collectionOfEduResourcesData
  id: collection_of_edu_resources_id
}
export type collectionOfEduResourcesData = {
  title: string
  description: string
  image: _nullish | asset
  resources: { id: edu_resource_id }[]
}
