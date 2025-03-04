import { time_duration_string } from '@moodle/lib-types'
import { eduCollectionSchemaConfigsOverrides, eduResourceSchemaConfigsOverrides } from '../../education.model'

export type eduDraftsPublishSchemaOverrides = {
  collection: eduCollectionSchemaConfigsOverrides
  resource: eduResourceSchemaConfigsOverrides
}
export type userAccountConfigs = {
  schema: {
    eduDraftsOverrides: eduDraftsPublishSchemaOverrides
  }
  emailConfirmationTokenExpires: time_duration_string
}
