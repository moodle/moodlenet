import { time_duration_string } from '@moodle/lib-types'
import { eduCollectionSchemaConfigsOverrides, eduResourceSchemaConfigsOverrides } from '../../education.model'

export type eduDraftSchemaOverrides = {
  collection: eduCollectionSchemaConfigsOverrides
  resource: eduResourceSchemaConfigsOverrides
}
export type userAccountSchemas = {
  eduDraftsOverrides: eduDraftSchemaOverrides
}

export type userAccountConfigs = {
  emailConfirmationTokenExpires: time_duration_string
}
