import { valid } from '@moodle/lib-types'
import { eduCollectionSchemaConfigsOverrides, eduResourceSchemaConfigsOverrides } from '../../education.model'

export type eduDraftSchemaOverrides = {
  collection: eduCollectionSchemaConfigsOverrides
  resource: eduResourceSchemaConfigsOverrides
}
export type userHomeSchemas = {
  eduDraftsOverrides: eduDraftSchemaOverrides
  uploadSize: {
    file: valid.i_posMax
    image: valid.i_posMax
  }
}
