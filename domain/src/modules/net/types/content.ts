import { _nullish, date_time_string, non_negative_integer, positive_integer } from '@moodle/lib-types'
import { assetTextExtraction } from '../../asset-text-extraction'
import { isced_field_id } from '../../edu'
import {
  edu_resource_collection_id,
  edu_resource_id,
  eduResourceCollectionData,
  eduResourceData,
} from '../../edu/types/edu-content'
import { user_home_id } from '../../user-home'

export type published_content_id = user_contribution_id | user_home_id | isced_field_id
export type publishedContentType = userContributionType | 'user-home' | 'isced-field'
export type userContributionType = 'edu-resource' | 'edu-resource-collection'

export type user_contribution_id = edu_resource_id | edu_resource_collection_id

export type userContributionData = eduResourceData | eduResourceCollectionData

export type publishedEduResource = publishedContent<
  eduResourceData,
  { downloadCount: non_negative_integer; assetTextExtraction: assetTextExtraction }
>

export type publishedEduResourceCollection = publishedContent<eduResourceCollectionData>

export type publishedContent<dataType extends userContributionData, meta = _nullish> = {
  id: user_contribution_id
  data: dataType
  meta: meta
  dataRevision: positive_integer
  created: date_time_string
  lastUpdatedAt: date_time_string
  firstPublished: date_time_string
  lastPublishedAt: date_time_string
  // dataUpdates: { at: date_time_string; diff: jsonDiff }[]
  points: {
    popularity: non_negative_integer
  }
}
