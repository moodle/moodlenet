import { positive_integer } from '@moodle/lib-types'
import { languageId, licenseId } from '../../content'
import { asset } from '../../storage'
import { bloomCognitive, iscedField, iscedLevel } from './edu-categories'

export type eduResourceId = string
export type eduResourceRecord = eduResource & {
  id: eduResourceId
}

export type eduResource = {
  asset: asset
  title: string
  description: string
  image: asset
  iscedField: iscedField
  iscedLevel: iscedLevel
  bloomCognitive: bloomCognitive[]
  type: edResourceTypeCode
  language: languageId
  license: licenseId
  publicationDate: { month: positive_integer; year: positive_integer }
}

export type edResourceTypeCode = string
export type edResourceType = { desc: string; code: edResourceTypeCode }

export type eduResourceCollectionId = string
export type eduResourceCollectionRecord = eduResourceCollection & {
  id: eduResourceCollectionId
}

export type eduResourceCollection = {
  title: string
  description: string
  image: asset
  resources: { id: eduResourceCollectionId[] }
}
