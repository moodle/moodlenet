import { positive_integer } from '@moodle/lib-types'
import { language_id, license_id } from '../../content'
import { asset } from '../../storage'
import { bloomCognitive, isced_field_id, isced_level_id } from './edu-categories'

export type edu_resource_id = string
export type eduResourceRecord = eduResource & { id: edu_resource_id }
export type eduResource = {
  asset: asset
  title: string
  description: string
  image: asset
  iscedField: isced_field_id
  iscedLevel: isced_level_id
  bloomCognitive: bloomCognitive[]
  type: edResource_type_id
  language: language_id
  license: license_id
  publicationDate: { month: positive_integer; year: positive_integer }
}

export type edResource_type_id = string
export type edResourceType = { desc: string; id: edResource_type_id }

export type collection_of_edu_resources_id = string
export type collectionOfEduResourcesRecord = collectionOfEduResources & { id: collection_of_edu_resources_id }

export type collectionOfEduResources = {
  title: string
  description: string
  image: asset
  resources: { id: collection_of_edu_resources_id[] }
}
