import { time_duration_string, valid } from '@moodle/lib-types'
import { eduCollectionSchemaConfigsOverrides, eduResourceSchemaConfigsOverrides } from '../../education.model'

export type eduDraftSchemaOverrides = {
  collection: eduCollectionSchemaConfigsOverrides
  resource: eduResourceSchemaConfigsOverrides
}
export type userAccountSchemas = {
  eduDraftsOverrides: eduDraftSchemaOverrides
  uploadSize: {
    file: valid.i_posMax
    image: valid.i_posMax
  }
}

export type userAccountConfigs = {
  emailConfirmationTokenExpires: time_duration_string
}
