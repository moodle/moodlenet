import { eduCollectionSchemaConfigsOverrides, eduResourceSchemaConfigsOverrides } from '../../education.model'

export type eduDraftsSchemaOverrides = {
  collection: eduCollectionSchemaConfigsOverrides
  resource: eduResourceSchemaConfigsOverrides
}
export type userAccountConfigs = {
  schema: {
    eduDraftsOverrides: eduDraftsSchemaOverrides
  }
}
