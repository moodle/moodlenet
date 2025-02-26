import { eduCollectionSchemaConfigsOverrides, eduResourceSchemaConfigsOverrides } from '../../education.model'

export type eduDraftsPublishSchemaOverrides = {
  collection: eduCollectionSchemaConfigsOverrides
  resource: eduResourceSchemaConfigsOverrides
}
export type userAccountConfigs = {
  schema: {
    eduDraftsOverrides: eduDraftsPublishSchemaOverrides
  }
}
